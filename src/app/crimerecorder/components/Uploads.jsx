"use client";
import React, { useContext, useEffect, useState } from "react";
import { UseReadContractData } from "@/utils/fetchcontract";
import NoRecordScreen from "./NoRecordScreen";
import { WalletContext } from "@/components/walletprovider";
import Image from "next/image";
import { ClipboardIcon } from "@heroicons/react/outline"; // Optional: Icon for Share button
import { useNotification } from "@/context/NotificationProvider";
import { useAccount } from "@starknet-react/core";

const Uploads = () => {
  const {connectorData} = useContext(WalletContext);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_IPFS_KEY;

  const { openNotification } = useNotification();
  const { fetchData } = UseReadContractData();

  const Retrieve = async () => {
    setLoading(true);
    try {
      const result = await fetchData("crime", "get_all_user_uploads", [connectorData?.account]);

      const files =
        result && typeof result === "object"
          ? Object.keys(result).map((key) => ({
              id: result[key].toString(),
              timestamp: Date.now(),
            }))
          : [];

      setUploadedFiles(files);
    } catch (error) {
      openNotification("error", "", "Error fetching uploaded files");
      console.error("Error fetching uploaded files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connectorData?.account) Retrieve();
  }, [connectorData?.account]);

  useEffect(() => {
    const userUploads = async () => {
      setLoading(true);
      try {
        const blockchainUris = await Promise.all(
          uploadedFiles.map(async (file) => {
            const uploadUri = await fetchData("crime", "get_token_uri", [
              file.id,
            ]);
            return uploadUri;
          })
        );

        const response = await fetch(`https://api.pinata.cloud/data/pinList`, {
          method: "GET",
          headers: { Authorization: `Bearer ${NFT_STORAGE_TOKEN}` },
        });

        if (!response.ok)
          throw new Error("Error fetching metadata from Pinata");

        const metadata = await response.json();
        const pinataFiles = metadata.rows;

        const matchedFiles = blockchainUris
          .map((uri) => {
            const matchedFile = pinataFiles.find(
              (file) => file.ipfs_pin_hash === uri
            );
            if (matchedFile) {
              return {
                uri,
                filename: matchedFile.metadata.name || "Unknown Filename",
                timestamp: new Date(matchedFile.date_pinned).getTime(),
              };
            }
            return null;
          })
          .filter(Boolean);

        setFileData(matchedFiles);
      } catch (error) {
        console.error("Error retrieving URIs or metadata:", error);
      } finally {
        setLoading(false);
      }
    };

    if (uploadedFiles.length) userUploads();
  }, [uploadedFiles]);

  const isImageFile = (fileName) => /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName);
  const isVideoFile = (fileName) => /\.(mp4|webm|ogg|mov)$/i.test(fileName);

  const saveToDevice = (blob, fileName) => {
    const uniqueFileName = `${fileName}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = uniqueFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "long", // Day of the week
      year: "numeric", // Year
      month: "long",   // Month name
      day: "numeric",  // Day of the month
    }) + 
    ", " + 
    date.toLocaleTimeString("en-US", {
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true // Display time in 12-hour format
    });
  };
  
  const handleDownload = async (file) => {
    try {
      const response = await fetch(
        `https://gateway.pinata.cloud/ipfs/${file.uri}`
      );
      const blob = await response.blob();
      saveToDevice(blob, file.filename);
    } catch (error) {
      openNotification("error", "", "Error downloading the file");
      console.error("Error downloading the file:", error);
    }
  };

  const handleShare = async (file) => {
    const fileLink = `https://gateway.pinata.cloud/ipfs/${file.uri}`;

    // Use Web Share API if supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: file.filename,
          text: `Check out this file: ${file.filename}`,
          url: fileLink,
        });
      } catch (error) {
        console.error("Error sharing the file:", error);
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(fileLink);
        openNotification("success", "", "Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy the link:", error);
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      {loading && (
        <div className="fixed inset-0 z-30 bg-gradient-to-r bg-opacity-70 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Image src="/logo.svg" alt="Loading" width={100} height={100} />
            <p className="text-white mt-4 text-lg">
              Loading your files, please wait...
            </p>
          </div>
          <style jsx>{`
            div {
              backdrop-filter: blur(10px);
            }
          `}</style>
        </div>
      )}

      <div className="p-2">
        {!fileData.length ? (
          <NoRecordScreen />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white">
            {fileData.map((file, index) => (
              <div
                key={index}
                className="relative text-sm whitespace-nowrap mb-2 sm:mb-0 bg-transparent rounded-lg backdrop-blur-lg p-10 shadow-lg">
                {isImageFile(file.filename) ? (
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${file.uri}`}
                    alt={file.filename}
                    className="w-full h-auto rounded"
                  />
                ) : isVideoFile(file.filename) ? (
                  <video
                    src={`https://gateway.pinata.cloud/ipfs/${file.uri}`}
                    className="w-full h-auto rounded"
                  />
                ) : (
                  <p className="text-red-500">Unsupported file type</p>
                )}

                <p className="text-[#0094FF] mt-4">{file.filename}</p>
                <p className="text-sm flex mt-4">
                  <span className="text-[#EAFBFF]">Time Stamp: </span>
                  <span className="text-[#19B1D2] ml-1">
                    {formatDate(file.timestamp)}
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row justify-between items-center w-full mt-5 gap-4">
 
  <div className="p-[2px] rounded-[100px] bg-gradient-to-r from-[#19B1D2] to-[#A02294]">
    <button
      className="flex items-center justify-center w-[200px] h-[48px] bg-[#030303] text-white text-sm py-3 px-6 rounded-[100px] transition-colors duration-300 ease-in-out"
      onClick={() => handleShare(file)}
    >
      <ClipboardIcon className="w-4 h-4 mr-2" />
      <span>Share</span>
    </button>
  </div>

  
  <div className="p-[2px] rounded-[100px] bg-gradient-to-r from-[#19B1D2] to-[#A02294]">
    <button
      className="flex items-center justify-center w-[200px] h-[48px] bg-[#209af1] text-white text-sm py-3 px-6 rounded-[100px] transition-colors duration-300 ease-in-out"
      onClick={() => handleDownload(file)}
    >
      {isVideoFile(file.filename) ? "Download Video" : "Download Image"}
    </button>
  </div>
</div>



              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Uploads;
  