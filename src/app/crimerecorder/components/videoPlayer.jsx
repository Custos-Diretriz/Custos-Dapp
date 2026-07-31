"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import StatusChips from "../../../components/dapps/StatusChips";
import {
  CaptureCard,
  CaptureViewport,
  CaptureButton,
  SwitchCameraButton,
  RecIndicator,
  LoadingOverlay,
} from "./CaptureFrame";
import { WalletContext } from "../../../components/walletprovider";
import { useNotification } from "../../../context/NotificationProvider";
import { CHAIN_TYPES, txUrl } from "../../../lib/chains";
import { saveEvidence } from "../../../utils/evmEvidence";
import { useModal } from "../../../context/ModalProvider";
const PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_IPFS_KEY;
const AUTO_UPLOAD_SECONDS = 10;

/** Readable default, so an unnamed file is still findable later. */
const autoName = () =>
  `custos-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}`;

const extOf = (name) => {
  const m = /\.[a-z0-9]+$/i.exec(name || "");
  return m ? m[0] : ".webm";
};

const sanitize = (name) =>
  (name || "")
    .replace(/[\/\\?%*:|"<>]/g, "-")
    .trim()
    .slice(0, 80);

export default function VideoUploader({
  text = "Record what's happening — it's secured automatically.",
  imgText = "Click to Start Recording",
}) {
  const { selectedChain, address, isGuest } = useContext(WalletContext);
  const { openNotification } = useNotification();

  const [videoFile, setVideoFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_UPLOAD_SECONDS);
  const [fileName, setFileName] = useState("");
  const [currentFacingMode, setCurrentFacingMode] = useState("environment");
  const [isClicked, setIsClicked] = useState(false);

  const liveVideoRef = useRef(null);
  const fileInputRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const previewUrlRef = useRef(null);
  const videoFileRef = useRef(null);
  const fileNameRef = useRef("");
  const uploadingRef = useRef(false);
  const interruptedRef = useRef(false);

  // handlers registered inside startRecording would otherwise close over
  // whatever chain/address was selected at that moment
  const ctxRef = useRef({ selectedChain, address, isGuest });
  ctxRef.current = { selectedChain, address, isGuest };

  const isEvm = selectedChain?.type === CHAIN_TYPES.EVM;

  // keep refs alongside state so the countdown doesn't read stale values
  const stashFile = (file, name) => {
    videoFileRef.current = file;
    setVideoFile(file);
    fileNameRef.current = name;
    setFileName(name);
  };

  const updateName = (name) => {
    fileNameRef.current = name;
    setFileName(name);
  };

  const setPreview = (blobOrFile) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(blobOrFile);
    previewUrlRef.current = url;
    setPreviewUrl(url);
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ------------------------------------------------------------------
  // Upload
  // ------------------------------------------------------------------

  const uploadNow = async (silent = false) => {
    const file = videoFileRef.current;
    if (!file || uploadingRef.current) return;

    const { selectedChain: chain, address: addr, isGuest: guest } =
      ctxRef.current;

    if (chain?.type !== CHAIN_TYPES.EVM) {
      openNotification(
        "error",
        "Switch chain",
        "Uploading from here needs an EVM chain — switch to Celo Sepolia."
      );
      return;
    }

    // whatever the user typed, or the auto name if they never touched it
    const ext = extOf(file.name);
    const base = sanitize(fileNameRef.current) || autoName();
    const finalName = base.toLowerCase().endsWith(ext.toLowerCase())
      ? base
      : base + ext;

    uploadingRef.current = true;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file, finalName);
      form.append(
        "pinataMetadata",
        JSON.stringify({
          name: finalName,
          keyvalues: { chain: chain.key, recordedAt: String(Date.now()) },
        })
      );

      const res = await fetch(PINATA_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${NFT_STORAGE_TOKEN}` },
        body: form,
      });
      if (!res.ok) {
        throw new Error(`IPFS upload failed: ${res.status} ${res.statusText}`);
      }
      const { IpfsHash } = await res.json();

      const result = await saveEvidence({
        chain,
        fileHash: IpfsHash,
        userAddress: guest ? null : addr,
      });

      if (result.queued) {
        openNotification(
          "success",
          "Recording secured",
          `"${finalName}" stored. Anchoring is pending and will retry automatically.`
        );
      } else {
        const link = txUrl(chain, result.txHash);
        openNotification(
          "success",
          silent ? "Auto-saved" : "Evidence anchored",
          `"${finalName}" saved on ${chain.name}${link ? ` — ${link}` : ""}`
        );
        if (!silent) openModal("success");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      openNotification("error", "Upload failed", err.message);
      if (!silent) openModal("error");
    } finally {
      uploadingRef.current = false;
      setUploading(false);
    }
  };

  // auto-upload if the confirm goes unanswered
  useEffect(() => {
    if (!confirmOpen) return;
    if (countdown <= 0) {
      setConfirmOpen(false);
      uploadNow();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmOpen, countdown]);

  // ------------------------------------------------------------------
  // Interruption — screen lock, app switch, tab close, network drop
  // ------------------------------------------------------------------

  useEffect(() => {
    const interrupt = () => {
      if (recorderRef.current?.state !== "recording") return;
      interruptedRef.current = true;
      recorderRef.current.stop(); // onstop uploads
      setRecording(false);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") interrupt();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", interrupt);
    window.addEventListener("offline", interrupt);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", interrupt);
      window.removeEventListener("offline", interrupt);
    };
  }, []);

  // ------------------------------------------------------------------
  // Camera
  // ------------------------------------------------------------------

  const startCamera = async (facingMode = currentFacingMode) => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
      audio: true,
    });
    streamRef.current = mediaStream;

    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = mediaStream;
      liveVideoRef.current.muted = true;
      await liveVideoRef.current.play().catch(() => {});
    }
    return mediaStream;
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (liveVideoRef.current) liveVideoRef.current.srcObject = null;
  };

  /** Only between recordings — MediaRecorder is bound to the stream it
   *  started with, so swapping mid-recording loses the feed. */
  const switchCamera = async () => {
    if (recording) {
      openNotification(
        "error",
        "Stop recording first",
        "The camera can't be switched while a recording is in progress."
      );
      return;
    }
    setIsClicked((prev) => !prev);
    const next = currentFacingMode === "user" ? "environment" : "user";
    setCurrentFacingMode(next);
    stopCamera();
    try {
      await startCamera(next);
    } catch (err) {
      openNotification("error", "Camera error", err.message);
    }
  };

  // ------------------------------------------------------------------
  // Recording
  // ------------------------------------------------------------------

  const startRecording = async () => {
    try {
      // drop any previous preview so the live element renders again
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setPreviewUrl(null);
      setConfirmOpen(false);
      interruptedRef.current = false;

      const mediaStream = await startCamera();

      chunksRef.current = [];
      const recorder = new MediaRecorder(mediaStream);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        // stop the camera here, not in stopRecording — stopping the tracks
        // before the recorder flushes truncates the tail
        stopCamera();

        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const name = autoName();
        const file = new File([blob], `${name}.webm`, { type: "video/webm" });
        setPreview(blob);
        stashFile(file, name);

        if (interruptedRef.current) {
          interruptedRef.current = false;
          uploadNow(true); // no prompt — the user may not be able to answer
          return;
        }

        setCountdown(AUTO_UPLOAD_SECONDS);
        setConfirmOpen(true);
      };

      // camera revoked, device unplugged, OS took it — same as an interruption
      mediaStream.getVideoTracks()[0]?.addEventListener("ended", () => {
        if (recorderRef.current?.state === "recording") {
          interruptedRef.current = true;
          recorderRef.current.stop();
          setRecording(false);
        }
      });

      recorder.start(1000);
      recorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      openNotification("error", "Camera error", err.message);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    setRecording(false);
  };

  const handleStopMedia = async () => {
    if (recording) stopRecording();
    else await startRecording();
  };

  // ------------------------------------------------------------------
  // File picker / drop
  // ------------------------------------------------------------------

  const acceptFile = (file) => {
    if (!file || file.size > 4 * 1024 * 1024 * 1024) {
      openNotification("error", "Invalid file", "Please choose a video under 4GB.");
      return;
    }
    setPreview(file);
    // seed the input with the original name, extension stripped
    stashFile(file, file.name.replace(/\.[a-z0-9]+$/i, ""));
    setCountdown(AUTO_UPLOAD_SECONDS);
    setConfirmOpen(true);
  };

  const handleFileChange = (e) => acceptFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && !file.type.startsWith("video/")) {
      openNotification("error", "Invalid file", "That doesn't look like a video.");
      return;
    }
    acceptFile(file);
  };

  // ------------------------------------------------------------------

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <p className="text-center text-base text-white sm:text-lg">{text}</p>

      <StatusChips />

      <CaptureCard>
        <div id="vid-recorder">
          <CaptureViewport>
            {/* distinct keys force a fresh element — otherwise React reuses
                the live one and its srcObject overrides src */}
            {previewUrl ? (
              <video
                key="preview"
                src={previewUrl}
                controls
                playsInline
                className="h-full w-full object-contain"
              />
            ) : (
              <video
                key="live"
                ref={liveVideoRef}
                autoPlay
                muted
                playsInline
                id="web-cam-container"
                className="h-full w-full object-cover"
              >
                Your browser doesn&apos;t support the video tag
              </video>
            )}
            {recording && <RecIndicator />}
          </CaptureViewport>
        </div>

        <div className="flex items-center justify-center gap-6 sm:gap-8">
          <SwitchCameraButton
            onClick={switchCamera}
            flipped={isClicked}
            disabled={uploading}
          />
          <CaptureButton
            onClick={handleStopMedia}
            recording={recording}
            disabled={uploading}
            mode="video"
            label={recording ? "Stop Recording" : imgText}
          />
          {/* keeps the capture button optically centred */}
          <span aria-hidden className="h-12 w-12 shrink-0" />
        </div>

        {recording && (
          <p className="rounded-xl border border-[#19B1D2]/20 bg-[#19B1D2]/10 px-3 py-2 text-center text-[11px] leading-relaxed text-[#19B1D2]">
            Auto-save armed — if this page closes or your screen locks, your
            recording is secured automatically.
          </p>
        )}

        <div className="flex items-center gap-3" role="separator">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] uppercase tracking-wider text-[#8E9A9A]">
            or
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#19B1D2]/40 px-4 py-5 text-center transition-colors hover:border-[#19B1D2] hover:bg-[#19B1D2]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70"
        >
          <span className="text-sm text-[#EAFBFF]">
            <span className="underline">Choose a video file</span>
            <span className="hidden sm:inline"> or drag &amp; drop</span>
          </span>
          <span className="text-[11px] text-[#8E9A9A]">
            Maximum file size: 4GB
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {videoFile && (
          <p className="break-all text-center text-xs text-[#19B1D2]">
            {videoFile.name} · {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        )}

        {confirmOpen && (
          <div className="rounded-xl border border-[#19B1D2]/40 bg-[#04080C] p-4">
            <label
              htmlFor="evidence-name"
              className="mb-1.5 block text-xs text-[#EAFBFF]"
            >
              Name this evidence
            </label>
            <input
              id="evidence-name"
              type="text"
              value={fileName}
              autoFocus
              maxLength={80}
              onChange={(e) => {
                updateName(e.target.value);
                setCountdown(AUTO_UPLOAD_SECONDS); // typing means they're here
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setConfirmOpen(false);
                  uploadNow();
                }
              }}
              placeholder={autoName()}
              className="mb-3 h-11 w-full rounded-lg border border-[#2a2a2a] bg-[#1e2f37] px-3 text-sm text-white placeholder:text-[#5a6b73] focus:border-[#0094FF] focus:outline-none"
            />

            <p className="mb-3 text-xs text-[#19B1D2]">
              Saving automatically in {countdown}s
            </p>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="h-11 rounded-full px-5 text-sm text-[#19B1D2] transition-colors hover:bg-white/5 hover:text-white sm:order-none"
              >
                Not yet
              </button>
              <div className="rounded-full bg-gradient-to-r from-[#19B1D2] to-[#A02294] p-[2px] sm:ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmOpen(false);
                    uploadNow();
                  }}
                  className="h-[42px] w-full rounded-full bg-[#209af1] px-6 text-sm font-medium text-white transition-colors hover:bg-[#1789da] sm:w-auto"
                >
                  Save now
                </button>
              </div>
            </div>
          </div>
        )}
      </CaptureCard>

      {uploading && (
        <LoadingOverlay
          text={`Securing your recording on ${selectedChain?.name}, please wait…`}
        />
      )}
    </div>
  );
}