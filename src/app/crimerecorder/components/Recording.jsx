"use client";
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import bg from "../../../../public/Rectangle.png";
import icon3 from "../../../../public/rotate.png";
import Icons from "./Icons";
import { useRouter } from "next/navigation";
import { WalletContext } from "../../../components/walletprovider";
import { useNotification } from "../../../context/NotificationProvider";
import { GlobalStateContext } from "../../../context/GlobalStateProvider";
import stopIcon from "../../../../public/record.png";
import icon2 from "../../../../public/picture.png";
import Modal from "react-modal";
import { useModal } from "../../../context/ModalProvider";
import {
  executeCalls,
  fetchAccountCompatibility,
  fetchAccountsRewards,
  fetchGasTokenPrices,
  // SEPOLIA_BASE_URL,
} from "@avnu/gasless-sdk";
import { FaRegCirclePlay } from "react-icons/fa6";
import { BsStopCircle } from "react-icons/bs";
import { Account, byteArray, CallData, RpcProvider, Signer } from "starknet";
import SuccessScreen from "./Success";
import ErrorScreen from "./error";
import Filename from "./nameModal";
import Image from "next/image";
import { publicProvider, useAccount } from "@starknet-react/core";
import { accessListify, Typed } from "ethers";
// import { fetchDataFromAPI } from "./avnucall";

const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_IPFS_KEY;

export const Recording = ({ text, icon1, imgText, category }) => {
  const [uri, setUri] = useState("");
  const { openModal, closeModal } = useModal();
  const options = { baseUrl: "https://starknet.api.avnu.fi" };
  const calls = [
    {
      entrypoint: "crime_record",
      contractAddress:
        "0x020bd5ec01c672e69e3ca74df376620a6be8a2b104ab70a9f0885be00dd38fb9",
      calldata: CallData.compile([
        byteArray?.byteArrayFromString(String(uri)),
        0,
      ]),
    },
  ];

  const { openNotification } = useNotification();
  const { connection: account, connectorData } = useContext(WalletContext);
  const { showModal, setShowModal } = useContext(GlobalStateContext);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [currentFacingMode, setCurrentFacingMode] = useState("environment");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymasterRewards, setPaymasterRewards] = useState([]);
  const [gasTokenPrices, setGasTokenPrices] = useState([]);
  const [gasTokenPrice, setGasTokenPrice] = useState();
  const [gaslessCompatibility, setGaslessCompatibility] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const callRef = useRef(null);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false); // For the file name input modal
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false); // For the success confirmation modal
  const [isErrorModalOpen, setErrorModalOpen] = useState(false); // For the success confirmation modal
  const [fileName, setFileName] = useState("");
  const recordedVideoRef = useRef(null);
  const photoRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false);

  const route = useRouter();

  useEffect(() => {
    if (uri !== "") {
      const calls = [
        {
          entrypoint: "crime_record",
          contractAddress:
            "0x020bd5ec01c672e69e3ca74df376620a6be8a2b104ab70a9f0885be00dd38fb9",
          calldata: CallData.compile([
            byteArray?.byteArrayFromString(String(uri)),
            0,
          ]),
        },
      ];
      callRef.current = JSON.stringify(calls, null, 2);
    }

    // Execute the transaction with gasless option
    const triggerWallet = async () => {
      if (uri !== "") {
        setLoading(true);
        try {
          console.log("call ref is :", callRef.current);
          console.log("account is :", account);

          const transactionResponse = await executeCalls(
            account,
            JSON.parse(callRef.current),
            {},
            { ...options, apiKey: process.env.NEXT_PUBLIC_AVNU_KEY }
          );

          // @faytey - The code below is for routing the gasless txn through the server
          //    But this method has a bug in that it only works for argent and the signature generated
          //    is always rejected by avnu signature verification. seems to be an error from argent though
          //   I will leave it here for reference

          //             // 1. Prepare transaction through API
          //             const prepareResponse = await fetch("/api/execute", {
          //               method: "POST",
          //               headers: { "Content-Type": "application/json" },
          //               body: JSON.stringify({
          //                 userAddress: account.address,
          //                 calls: JSON.parse(callRef.current),
          //                 gasTokenAddress: undefined,
          //                 maxGasTokenAmount: undefined, // Use default values
          //               }),

          //             });

          //             if (!prepareResponse.ok) throw new Error("Preparation failed");
          //             console.log("first response...", prepareResponse)

          //             const {typedData}  = await prepareResponse.json();

          //             console.log("restored typed data...",typedData)
          //             // const safeTypedData = normalizeTypedData(typedData);

          //             const signature = await account.signer.signMessage(
          //               typedData,
          //               account.address
          //             );
          // const serializedSignature = {
          //   ...signature,
          //   r: signature.r.toString(),
          //   s: signature.s.toString(),
          // };

          //             const executeResponse = await fetch("/api/execute-signed", {
          //               method: "POST",
          //               headers: { "Content-Type": "application/json" },
          //               body: JSON.stringify({
          //                 userAddress: account.address,
          //                 typedData,
          //                 signature: serializedSignature,
          //                 deploymentData: undefined,
          //               }),
          //             });

          //             if (!executeResponse.ok) throw new Error("Execution failed");
          //             const { transactionHash } = await executeResponse.json();
          //             console.log("success...",transactionHash)

          console.log("success", transactionResponse);

          openNotification("success", "Transaction successful", "");
          setLoading(false);
          openModal("success");
          // setSuccessModalOpen(true);
        } catch (error) {
          console.error("Transaction failed:", error);
          openNotification("error", "Transaction failed", `${error}`);
          setLoading(false);
          openModal("error");
          // setErrorModalOpen(true);
        }
      }
    };
    if (uri !== "") triggerWallet();
  }, [uri]);

  useEffect(() => {
    if (!account) return;
    fetchAccountCompatibility(account.address, options).then(
      setGaslessCompatibility
    );
    fetchAccountsRewards(account.address, {
      ...options,
      protocol: "gasless-sdk",
    }).then(setPaymasterRewards);
  }, [account]);

  useEffect(() => {
    console.log(options);

    fetchGasTokenPrices(options).then(setGasTokenPrices);
  }, []);

  useEffect(() => {
    if (!account || !gasTokenPrice || !gaslessCompatibility) return;
    setErrorMessage(undefined);
  }, [account, gasTokenPrice, gaslessCompatibility]);

  const otherRecorder = (selectedMedia) => {
    return selectedMedia === "vid" ? "aud" : "vid";
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
  };
  const closeSuccessModal = () => {
    // setSuccessModalOpen(false);
    closeModal();
    route.push("/crimerecorders");
  };
  const closeErrorModal = () => {
    openModal("error");
    // setErrorModalOpen(false);
  };

  const handleFileNameSubmit = (inputFileName) => {
    console.log("Filename received:", inputFileName); // Debugging log
    if (!inputFileName) {
      console.error("Filename is required!");
      return;
    }

    // Append the correct file extension based on the media type (e.g., .webm for video, .png for image)
    let fileExtension = category === "video" ? ".webm" : ".png";
    const fullFileName = inputFileName + fileExtension;

    console.log("Full filename with extension:", fullFileName); // Debugging log

    setFileName(fullFileName); // Store the filename with extension
    setUploadModalOpen(false); // Close the modal after filename submission
    uploadToIPFS(recordedChunks, fullFileName); // Proceed with the IPFS upload
  };
  const checkPermissions = async () => {
    try {
      const permissions = await navigator.permissions.query({ name: "camera" });
      console.log("Camera permission status:", permissions.state);
      if (permissions.state === "denied") {
        alert(
          "Camera permissions are denied. Please allow access in your browser settings."
        );
      }
    } catch (error) {
      openModal("error");
      console.warn(
        "Permissions API not supported in this browser:",
        error.message
      );
    }
  };

  const startCamera = async () => {
    checkPermissions();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true, // Simpler configuration
        audio: true, // Disable audio if not needed
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Mute to avoid feedback
        videoRef.current.style.display = "block"; // Show the video feed when camera starts
      }
    } catch (error) {
      console.error("Error accessing the camera", error);
      alert("Error accessing the camera: " + error.message);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop(); // Stop individual tracks
        track.enabled = false; // Disable track (extra precaution)
      });
      videoRef.current.srcObject = null; // Clear the video element
      setMediaStream(null);
      console.log("Camera stopped successfully.");
    }
  };

  const startRecording = async () => {
    await startCamera();
    if (!mediaStream) {
      console.error("Media stream not available");
      return;
    }

    const chunks = [];
    const recorder = new MediaRecorder(mediaStream);
    recorder.ondataavailable = (event) => chunks.push(event.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setRecordedChunks(blob); // Set recorded video for upload
      stopCamera();
      setUploadModalOpen(true); // Open modal for filename input after recording stops
    };

    recorder.start();
    setIsRecording(true);
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setUploadModalOpen(true);
    }
    stopCamera();
  };

  const takePicture = async () => {
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
    setRecordedChunks(blob); // Set picture for upload
    setUploadModalOpen(true); // Open modal for filename input after picture is taken
  };

  const switchCamera = async () => {
    setIsClicked((prev) => {
      return !prev;
    });
    setCurrentFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    if (isRecording) {
      mediaRecorder.pause();
    }
    stopCamera();
    await startCamera();
    if (isRecording) {
      mediaRecorder.resume();
    }
  };

  async function uploadToIPFS(fileBlob, fileName) {
    const formData = new FormData();
    formData.append("file", fileBlob, fileName);
    setLoading(true);
    try {
      console.log("account is ", account, typeof account);

      // Check if the wallet is connected
      if (!account) {
        console.error(
          "Wallet not connected. Cannot associate file with account."
        );
        setLoading(false);
        setErrorMessage("Transaction failed: Wallet not connected");
        openModal("error");
        // setErrorModalOpen(true);
        return;
      }
      console.log("Uploading file:", fileName); // Log the file name

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${NFT_STORAGE_TOKEN}`,
          },
          body: formData,
        }
      );

      // Handle response
      if (!response.ok) {
        throw new Error(
          `Failed to upload file to IPFS: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const ipfsHash = data.IpfsHash;

      console.log("IPFS Hash:", ipfsHash);
      setUri(ipfsHash);

      console.log("File uploaded successfully and data saved!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
      setErrorMessage("Error uploading file");
      openModal("error");
      // setErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const handleStopMedia = async () => {
    if (category === "video") {
      if (isRecording) {
        stopRecording(); // Stop the recording if it's ongoing
        setIsRecording(false);
      } else {
        startRecording(); // Start recording if it hasn't started yet
        setIsRecording(true);
      }
    } else if (category === "image") {
      takePicture();
    }

    // Check if the account is available
    if (!account) {
      console.error("Account not connected");
      return;
    }
  };

  useEffect(() => {
    if (category === "video") {
      startRecording();
    } else if (category === "image") {
      startCamera();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator?.mediaDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((device) => {
          console.log(
            device.kind + ": " + device.label + " id = " + device.deviceId
          );
        });
      });
    }
  }, []);

  return (
    <>
      <div className="w-full flex flex-col mt-10 items-center gap-6">
        {/* <SuccessScreen open={isSuccessModalOpen} onClose={closeSuccessModal} className="flex items-center justify-center fixed inset-0 backdrop-blur-sm"/>
        <ErrorScreen open={isErrorModalOpen} onClose={closeErrorModal} message={errorMessage} className="flex items-center justify-center fixed inset-0 backdrop-blur-sm"/> */}

        <Filename
          open={isUploadModalOpen}
          onClose={closeUploadModal}
          onSubmit={handleFileNameSubmit}
        />
        <p className="text-white text-lg sm:text-xl">{text}</p>
        <div className="w-full max-w-lg rounded-xl md:mb-5">
          <div
            className="w-full h-full flex flex-col justify-center items-center rounded-xl p-6 sm:p-10"
            style={{
              backgroundColor: "#1e2f37",
              backgroundImage: `url(${bg.src})`,
              backgroundSize: "contain",
            }}
          >
            <div id="vid-recorder" className="w-full">
              <video
                ref={videoRef}
                autoPlay
                muted
                id="web-cam-container"
                className="rounded-xl mb-6 w-full"
              >
                Your browser doesn&apos;t support the video tag
              </video>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className={
                  isClicked
                    ? "switch-camera-button clicked"
                    : "switch-camera-button"
                }
                onClick={switchCamera}
              >
                <Icons
                  icon={icon3}
                  text={`Switch Camera`}
                  isFlipped={isClicked}
                />
              </button>

              <button onClick={handleStopMedia}>
                {isRecording ? (
                  <Icons
                    icon={stopIcon}
                    text={isRecording ? "Stop Recording" : imgText}
                  />
                ) : (
                  <>
                  {imgText === "Click to Take a Picture"?  <div className="flex flex-col justify-center items-center gap-2 mb-6">
                    <BsStopCircle
                      size={24}
                      className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16"
                      color="#0094ff"
                    />
                    <span className="text-white text-xs md:text-sm lg:text-base">
                      {imgText}
                    </span>
                  </div> : <div className="flex flex-col justify-center items-center gap-2 mb-6">
                    <FaRegCirclePlay
                      size={24}
                      className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16"
                      color="#0094ff"
                    />
                    <span className="text-white text-xs md:text-sm lg:text-base">
                      {imgText}
                    </span>
                  </div>}
                  </>
                )}
              </button>
            </div>
            {loading && ( // Display overlay when loading
              <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Image
                    src="/logo.svg"
                    alt="Loading"
                    width={100}
                    height={100}
                  />
                  <p className="text-white mt-4 text-lg">
                    sending your file onchain, please wait...
                  </p>
                </div>
                <style jsx>{`
                  div {
                    backdrop-filter: blur(10px); /* Blur background */
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};