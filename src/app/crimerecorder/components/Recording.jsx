"use client";
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WalletContext } from "../../../components/walletprovider";
import { useNotification } from "../../../context/NotificationProvider";
import { GlobalStateContext } from "../../../context/GlobalStateProvider";
import { useModal } from "../../../context/ModalProvider";
import {
  executeCalls,
  fetchAccountCompatibility,
  fetchAccountsRewards,
  fetchGasTokenPrices,
} from "@avnu/gasless-sdk";
import { byteArray, CallData } from "starknet";
import Filename from "./nameModal";
import StatusChips from "../../../components/dapps/StatusChips";
import {
  CaptureCard,
  CaptureViewport,
  CaptureButton,
  SwitchCameraButton,
  RecIndicator,
  LoadingOverlay,
} from "./CaptureFrame";
import { CHAIN_TYPES, txUrl } from "../../../lib/chains";
import { saveEvidence, saveEvidenceBatch } from "../../../utils/evmEvidence";
import {
  useEmergencySave,
  getPendingRecordings,
  removePendingRecording,
} from "../../../hooks/useEmergencySave";

const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_IPFS_KEY;
const PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export const Recording = ({ text, icon1, imgText, category }) => {
  const [uri, setUri] = useState("");
  const { openModal, closeModal } = useModal();
  const options = { baseUrl: "https://starknet.api.avnu.fi" };

  const { openNotification } = useNotification();
  const {
    connection: account,
    address,
    isGuest,
    selectedChain,
  } = useContext(WalletContext);
  const { showModal, setShowModal } = useContext(GlobalStateContext);

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const recorderRef = useRef(null);
  const isRecordingRef = useRef(false);

  const [recordedChunks, setRecordedChunks] = useState([]);
  const [currentFacingMode, setCurrentFacingMode] = useState("environment");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(
    "sending your file onchain, please wait..."
  );
  const [paymasterRewards, setPaymasterRewards] = useState([]);
  const [gasTokenPrices, setGasTokenPrices] = useState([]);
  const [gasTokenPrice, setGasTokenPrice] = useState();
  const [gaslessCompatibility, setGaslessCompatibility] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const callRef = useRef(null);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const route = useRouter();

  const isEvm = selectedChain.type === CHAIN_TYPES.EVM;

  // ------------------------------------------------------------------
  // IPFS
  // ------------------------------------------------------------------

  const pinToIPFS = useCallback(async (blob, name, keepalive = false) => {
    const formData = new FormData();
    formData.append("file", blob, name);
    const response = await fetch(PINATA_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${NFT_STORAGE_TOKEN}` },
      body: formData,
      keepalive,
    });
    if (!response.ok) {
      throw new Error(
        `Failed to upload to IPFS: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.IpfsHash;
  }, []);

  // ------------------------------------------------------------------
  // Onchain save — routed by selected chain
  // ------------------------------------------------------------------

  const saveHashOnChain = useCallback(
    async (ipfsHash) => {
      if (isEvm) {
        const result = await saveEvidence({
          chain: selectedChain,
          fileHash: ipfsHash,
          userAddress: isGuest ? null : address,
        });
        const link = txUrl(selectedChain, result.txHash);
        openNotification(
          "success",
          "Evidence anchored",
          result.isGuest
            ? `Saved as guest on ${selectedChain.name}${link ? ` — ${link}` : ""}`
            : `Saved to your wallet on ${selectedChain.name}${link ? ` — ${link}` : ""}`
        );
        return result;
      }
      // Starknet — hand off to the existing AVNU gasless effect
      setUri(ipfsHash);
      return { starknet: true };
    },
    [isEvm, selectedChain, isGuest, address, openNotification]
  );

  // ------------------------------------------------------------------
  // Starknet gasless path (unchanged behaviour)
  // ------------------------------------------------------------------

  useEffect(() => {
    if (isEvm || uri === "") return;

    const calls = [
      {
        entrypoint: "crime_record",
        contractAddress: selectedChain.contractAddress,
        calldata: CallData.compile([
          byteArray?.byteArrayFromString(String(uri)),
          0,
        ]),
      },
    ];
    callRef.current = JSON.stringify(calls, null, 2);

    const triggerWallet = async () => {
      if (!account) {
        openNotification(
          "error",
          "Wallet required",
          "Connect a Starknet wallet, or switch to an EVM chain to record as guest."
        );
        openModal("error");
        return;
      }
      setLoading(true);
      try {
        const transactionResponse = await executeCalls(
          account,
          JSON.parse(callRef.current),
          {},
          { ...options, apiKey: process.env.NEXT_PUBLIC_AVNU_KEY }
        );
        console.log("success", transactionResponse);
        openNotification("success", "Transaction successful", "");
        setLoading(false);
        openModal("success");
      } catch (error) {
        console.error("Transaction failed:", error);
        openNotification("error", "Transaction failed", `${error}`);
        setLoading(false);
        openModal("error");
      }
    };
    triggerWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, isEvm]);

  useEffect(() => {
    if (isEvm || !account) return;
    fetchAccountCompatibility(account.address, options).then(setGaslessCompatibility);
    fetchAccountsRewards(account.address, {
      ...options,
      protocol: "gasless-sdk",
    }).then(setPaymasterRewards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, isEvm]);

  useEffect(() => {
    if (isEvm) return;
    fetchGasTokenPrices(options).then(setGasTokenPrices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEvm]);

  // ------------------------------------------------------------------
  // Camera
  // ------------------------------------------------------------------

  const checkPermissions = async () => {
    try {
      const permissions = await navigator.permissions.query({ name: "camera" });
      if (permissions.state === "denied") {
        openNotification(
          "error",
          "Camera blocked",
          "Allow camera access in your browser settings to record evidence."
        );
      }
    } catch (error) {
      console.warn("Permissions API not supported:", error.message);
    }
  };

  /** Returns the stream so callers don't race React state. */
  const startCamera = useCallback(async (facingMode = currentFacingMode) => {
    await checkPermissions();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true,
      });
      streamRef.current = stream;
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.style.display = "block";
      }
      return stream;
    } catch (error) {
      console.error("Error accessing the camera", error);
      openNotification("error", "Camera error", error.message);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFacingMode]);

  const stopCamera = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      if (videoRef.current) videoRef.current.srcObject = null;
      streamRef.current = null;
      setMediaStream(null);
    }
  }, []);

  // ------------------------------------------------------------------
  // Recording
  // ------------------------------------------------------------------

  const startRecording = useCallback(async () => {
    const stream = streamRef.current || (await startCamera());
    if (!stream) {
      console.error("Media stream not available");
      return;
    }

    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      if (!isRecordingRef.current) return; // emergency handler already took it
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      isRecordingRef.current = false;
      setRecordedChunks(blob);
      stopCamera();
      setUploadModalOpen(true);
    };

    // 3s timeslice: chunks exist continuously, so an interrupted
    // recording is still recoverable
    recorder.start(3000);
    recorderRef.current = recorder;
    isRecordingRef.current = true;
    setMediaRecorder(recorder);
    setIsRecording(true);

    // if the camera track dies (device unplugged, OS revokes), treat as emergency
    stream.getVideoTracks()[0]?.addEventListener("ended", () => {
      triggerEmergencySave("track-ended");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startCamera, stopCamera]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const takePicture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const dataURL = canvasRef.current.toDataURL("image/png");
    const blob = await fetch(dataURL).then((res) => res.blob());
    setRecordedChunks(blob);
    setUploadModalOpen(true);
  }, []);

  const switchCamera = useCallback(async () => {
    setIsClicked((prev) => !prev);
    const next = currentFacingMode === "user" ? "environment" : "user";
    setCurrentFacingMode(next);

    const wasRecording = isRecordingRef.current;
    if (wasRecording && recorderRef.current?.state === "recording") {
      recorderRef.current.pause();
    }
    stopCamera();
    await startCamera(next);
    if (wasRecording && recorderRef.current?.state === "paused") {
      recorderRef.current.resume();
    }
  }, [currentFacingMode, startCamera, stopCamera]);

  // ------------------------------------------------------------------
  // Emergency save + recovery
  // ------------------------------------------------------------------

  const { triggerEmergencySave } = useEmergencySave({
    isRecordingRef,
    recorderRef,
    chunksRef,
    enabled: category === "video",
    meta: { chainKey: selectedChain.key, address: address || null, isGuest },
    onEmergency: async (blob, reason) => {
      const name = `custos-emergency-${Date.now()}.webm`;
      const ipfsHash = await pinToIPFS(blob, name, true);
      await saveHashOnChain(ipfsHash);
      openNotification(
        "success",
        "Emergency save",
        `Recording secured onchain (${reason}).`
      );
    },
  });

  // flush anything a previous session couldn't finish
  useEffect(() => {
    let cancelled = false;

    const recover = async () => {
      let pending = [];
      try {
        pending = await getPendingRecordings();
      } catch (e) {
        return;
      }
      if (!pending.length || cancelled) return;

      setLoading(true);
      setLoadingText("recovering an interrupted recording...");

      const hashes = [];
      const doneIds = [];

      for (const rec of pending) {
        try {
          const hash = await pinToIPFS(rec.blob, `custos-recovered-${rec.id}.webm`);
          hashes.push(hash);
          doneIds.push(rec.id);
        } catch (e) {
          console.warn("Recovery upload failed for", rec.id, e);
        }
      }

      if (hashes.length) {
        try {
          if (isEvm) {
            await saveEvidenceBatch({
              chain: selectedChain,
              fileHashes: hashes,
              userAddress: isGuest ? null : address,
            });
          } else {
            for (const h of hashes) await saveHashOnChain(h);
          }
          for (const id of doneIds) await removePendingRecording(id);
          openNotification(
            "success",
            "Recovered",
            `${hashes.length} interrupted recording(s) saved onchain.`
          );
        } catch (e) {
          console.error("Recovery onchain save failed:", e);
        }
      }

      if (!cancelled) {
        setLoading(false);
        setLoadingText("sending your file onchain, please wait...");
      }
    };

    recover();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChain.key, address, isGuest]);

  // ------------------------------------------------------------------
  // Upload flow
  // ------------------------------------------------------------------

  const closeUploadModal = () => setUploadModalOpen(false);

  const handleFileNameSubmit = (inputFileName) => {
    if (!inputFileName) {
      openNotification("error", "Filename required", "Give the evidence a name.");
      return;
    }
    const fileExtension = category === "video" ? ".webm" : ".png";
    const fullFileName = inputFileName + fileExtension;
    setFileName(fullFileName);
    setUploadModalOpen(false);
    uploadToIPFS(recordedChunks, fullFileName);
  };

  async function uploadToIPFS(fileBlob, name) {
    if (!fileBlob) return;
    setLoading(true);
    setLoadingText("sending your file onchain, please wait...");
    try {
      const ipfsHash = await pinToIPFS(fileBlob, name);
      await saveHashOnChain(ipfsHash);
      if (isEvm) openModal("success");
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage(error.message || "Error uploading file");
      openNotification("error", "Save failed", error.message || "Error uploading file");
      openModal("error");
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------------------------------------
  // Controls
  // ------------------------------------------------------------------

  const handleStopMedia = async () => {
    if (category === "video") {
      if (isRecordingRef.current) stopRecording();
      else await startRecording();
    } else if (category === "image") {
      await takePicture();
    }
  };

  useEffect(() => {
    if (category === "video") startRecording();
    else if (category === "image") startCamera();

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <Filename
        open={isUploadModalOpen}
        onClose={closeUploadModal}
        onSubmit={handleFileNameSubmit}
      />

      <p className="text-center text-base text-white sm:text-lg">{text}</p>

      <StatusChips />

      <CaptureCard>
        <div id="vid-recorder">
          <CaptureViewport>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              id="web-cam-container"
              className="h-full w-full object-cover"
            >
              Your browser doesn&apos;t support the video tag
            </video>
            {isRecording && <RecIndicator />}
          </CaptureViewport>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex items-center justify-center gap-6 sm:gap-8">
          <SwitchCameraButton onClick={switchCamera} flipped={isClicked} />
          <CaptureButton
            onClick={handleStopMedia}
            recording={isRecording}
            mode={category}
            label={isRecording ? "Stop Recording" : imgText}
          />
          {/* keeps the capture button optically centred */}
          <span aria-hidden className="h-12 w-12 shrink-0" />
        </div>

        {isRecording && (
          <p className="rounded-xl border border-[#19B1D2]/20 bg-[#19B1D2]/10 px-3 py-2 text-center text-[11px] leading-relaxed text-[#19B1D2]">
            Auto-save armed — if this page closes or is interrupted, your
            recording is secured onchain automatically.
          </p>
        )}
      </CaptureCard>

      {loading && <LoadingOverlay text={loadingText} />}
    </div>
  );
};

export default Recording;