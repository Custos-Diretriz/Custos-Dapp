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
import { WalletContext } from "@/components/walletprovider";
import { useNotification } from "@/context/NotificationProvider";
import { GlobalStateContext } from "@/context/GlobalStateProvider";
import stopIcon from "../../../../public/record.png";
import icon2 from "../../../../public/picture.png";
import Modal from "react-modal";
import { useModal } from "@/context/ModalProvider";
import {
  executeCalls,
  fetchAccountCompatibility,
  fetchAccountsRewards,
  fetchGasTokenPrices,
  // SEPOLIA_BASE_URL,
} from "@avnu/gasless-sdk";
import { Account, byteArray, CallData, RpcProvider, Signer } from "starknet";
import SuccessScreen from "./Success";
import ErrorScreen from "./error";
import Filename from "./nameModal";
import Image from "next/image";
import { publicProvider, useAccount } from "@starknet-react/core";
import { accessListify } from "ethers";

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
  const [facingMode, setFacingMode] = useState("environment");
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
    if (uri) {
      const calls = [
        {
          entrypoint: "crime_record",
          contractAddress:
            "0x020bd5ec01c672e69e3ca74df376620a6be8a2b104ab70a9f0885be00dd38fb9",
          calldata: CallData.compile([byteArray?.byteArrayFromString(String(uri)), 0]),
        },
      ];
      callRef.current = calls;

      const triggerTransaction = async () => {
        setLoading(true);
        try {
          const response = await fetch("/api/avnuhandler", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ account, calls }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Transaction failed");
          }

          console.log("Transaction successful:", result.transactionResponse);
          openNotification("success", "Transaction successful", "");
          openModal("success");
        } catch (error) {
          console.error("Transaction failed:", error);
          openNotification("error", "Transaction failed", error.message);
          openModal("error");
        } finally {
          setLoading(false);
        }
      };

      triggerTransaction();
    }
  }, [uri]);

  // const triggerTransaction = async () => {
  //   try {
  //     if (uri) {
  //       await sendUriToBackend(uri); // Send data to the backend
  //       openNotification(
  //         "info",
  //         "Wallet not connected",
  //         "Data sent to backend for processing"
  //       );
  //     }
  //   } catch (error) {
  //     openNotification("error", "Transaction failed", `${error}`);
  //   }
  // };

  // if (uri) {
  //   if (account && account.address) {
  //     triggerWallet();
  //   } else {
  //     // triggerTransaction();

  //       openNotification("error", "Transaction failed", `${error}`);
  //       setLoading(false);
  //       openModal("error");

  //   }
  // }

  // Function to send data to the backend
  // async function sendUriToBackend(uri) {
  //   const data = "place holder";
  //   setLoading(true);
  //   try {
  //     const response = await fetch("https://custosbackend.onrender.com/agreement/crime_recorder/push/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ uri , data}),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to send data to backend: ${response.statusText}`);
  //     }

  //     const result = await response.json();
  //     setLoading(false)
  //     console.log("Backend response:", result);
  //   } catch (error)
  //    {
  //     setLoading(false)
  //     console.error("Error sending data to backend:", error);
  //   }
  // }

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
    const canvas = document.createElement("canvas");
    canvas.width = 700; 
    canvas.height = 896; 
    const ctx = canvas.getContext("2d");
  
    // creating watermarks
    const watermarkImg = document.createElement("img");
    const watermarkImg2 = document.createElement("img");
    watermarkImg.src = "/custos-with-logo.png";
    watermarkImg2.src = "/light-custos-with-logo.png";
   
    let time;
    let watermarkX = 10;
    let watermarkY = 10;
  
    const drawFrame = () => {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
      // add watermark
      if (watermarkImg.complete) {
    ctx.globalAlpha = 0.4;
    if (!time || Date.now() - time > 2500) {
      watermarkX = Math.random() * (canvas.width - watermarkImg.width);
      watermarkY = Math.random() * (canvas.height - watermarkImg.height);
      time = Date.now();
    }
    ctx.drawImage(
      watermarkImg,
      watermarkX,
      watermarkY,
      watermarkImg.width,
      watermarkImg.height
    );
    ctx.globalAlpha = 1.0;
  }
  
       // add timestamp
       const timestamp = new Date().toLocaleString();
       ctx.font = "20px Arial";
       const gradient = ctx.createLinearGradient(0, 0, canvasRef.current.width, 0);
       gradient.addColorStop(0, "#19B1D2");
       gradient.addColorStop(1, "#0094FF");
       ctx.fillStyle = gradient;
       ctx.textAlign = "center"; 
       ctx.textBaseline = "top"; 
       ctx.fillText(
         timestamp,
         canvas.width / 2, 
         20 
       );
  
      requestAnimationFrame(drawFrame);
    };
  
    Promise.all([new Promise((resolve) => (watermarkImg.onload = resolve)), 
                  new Promise((resolve) => (watermarkImg2.onload = resolve))]).then(() => {
      drawFrame();
    });
  
    // Add the canvas stream to the MediaRecorder
    const stream = canvas.captureStream();
    const newMediaStream = new MediaStream();
    stream.getTracks().forEach((track) => {
      newMediaStream.addTrack(track);
    });
  
    const recorder = new MediaRecorder(newMediaStream);
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
  
    // creating watermarks
    const watermarkImg = document.createElement("img");
    const watermarkImg2 = document.createElement("img");
    watermarkImg.src = "/custos-with-logo.png";
    watermarkImg2.src = "/light-custos-with-logo.png";
  
    Promise.all([new Promise((resolve) => (watermarkImg.onload = resolve)), 
                  new Promise((resolve) => (watermarkImg2.onload = resolve))]).then(() => {
  
      // Top-left watermark
      const topLeftWatermarkX = 20;
      const topLeftWatermarkY = 25;
      context.drawImage(
        watermarkImg,
        topLeftWatermarkX,
        topLeftWatermarkY,
        watermarkImg.width,
        watermarkImg.height
      );
  
      // Bottom-right watermark
      const bottomRightWatermarkX =
        canvasRef.current.width - watermarkImg2.width - 20;
      const bottomRightWatermarkY =
        canvasRef.current.height - watermarkImg2.height - 25;
      context.drawImage(
        watermarkImg2,
        bottomRightWatermarkX,
        bottomRightWatermarkY,
        watermarkImg2.width,
        watermarkImg2.height
      );
  
      // add timestamp
      const timestamp = new Date().toLocaleString();
      context.font = "20px Arial";
      const gradient = context.createLinearGradient(0, 0, canvasRef.current.width, 0);
      gradient.addColorStop(0, "#19B1D2");
      gradient.addColorStop(1, "#0094FF");
      context.fillStyle = gradient;
      context.textAlign = "center"; 
      context.textBaseline = "top"; 
      context.fillText(
        timestamp,
        canvasRef.current.width / 2, 
        20 
      );
  
      canvasRef.current.toBlob((blob) => {
        console.log("Blob created:", blob);
        setRecordedChunks(blob);
        setUploadModalOpen(true);
      }, "image/png");
    }).catch((error) => {
      console.error("Error taking picture:", error);
    });
  };

  const checkCameraSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera access is not supported in your browser. Please update to a modern browser.");
      return false;
    }
    return true;
  };
   // Switch camera facing mode
  const switchCamera = async () => {
  if (!checkCameraSupport()) return;

  try {
    const newMode = facingMode === "user" ? "environment" : "user";
    console.log("Switching to:", newMode);

    // Stop the current video tracks if available but don't stop the recorder
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach((track) => track.stop());
    }

    // Get a new stream with the desired facing mode
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: newMode },
    });

    // Set the new stream to the video element and update the facing mode
    setMediaStream(newStream);
    setFacingMode(newMode);
    if (videoRef.current) {
      videoRef.current.srcObject = newStream;
    }

    // Reattach the new stream to the recorder without stopping it
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stream = newStream;
    }

    console.log("Switched to:", newMode);
  } catch (error) {
    console.error("Error switching camera:", error.message);
    alert(`Error switching camera: ${error.message}`);
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
      const ipfsHash = data.IpfsHash; // Access the IPFS hash from the response

      console.log("IPFS Hash:", ipfsHash);

      // Store the IPFS hash locally
      localStorage.setItem("uri", ipfsHash);
      setUri(ipfsHash);

      console.log("File uploaded successfully and data saved!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
      setErrorMessage("Error uploading file");
      openModal("error");
      // setErrorModalOpen(true);
    } finally {
      setLoading(false); // Ensure loading state is reset
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
        <div className="bg-gradient-to-r from-[#0094ff] to-[#A02294] w-full max-w-lg rounded-xl md:mb-5">
          <div
            className=" w-full h-full flex flex-col justify-center items-center rounded-xl p-6 sm:p-10"
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
                <Icons
                  icon={isRecording ? stopIcon : icon1}
                  text={isRecording ? "Stop Recording" : imgText}
                />
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