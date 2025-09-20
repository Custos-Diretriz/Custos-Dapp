'use client'
import React, { useContext, useEffect, useState, useCallback } from "react";
import { UseReadContractData } from "../../../utils/fetchcontract";
import NoRecordScreen from "./NoRecordScreen";
import { WalletContext } from "../../../components/walletprovider";
import Image from "next/image";
import { ClipboardIcon } from "@heroicons/react/outline";
import { useNotification } from "../../../context/NotificationProvider";
import Link from "next/link";

const Uploads = () => {
  const walletContext = useContext(WalletContext);
  const address = walletContext?.address;
  const wallet = walletContext?.wallet;
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [fileData, setFileData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_IPFS_KEY;

  const { openNotification } = useNotification();
  const { fetchData } = UseReadContractData();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const Retrieve = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      console.log("Fetching uploads for account:", address);

      const result = await fetchData("crime", "get_all_user_uploads", [address]);
      console.log("Fetched uploads:", result);

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
  }, [address, fetchData, openNotification]);

  useEffect(() => {
    console.log("Wallet Address:", address);
    if (address) Retrieve();
  }, [address, Retrieve]);

  useEffect(() => {
    const userUploads = async () => {
      setLoading(true);
      try {
        console.log("Uploaded Files:", uploadedFiles);

        const blockchainUris = await Promise.all(
          uploadedFiles.map(async (file) => {
            const uploadUri = await fetchData("crime", "get_token_uri", [
              file.id,
            ]);
            console.log(`Retrieved URI for file ${file.id}:`, uploadUri);
            return uploadUri;
          })
        );

        let allPinataFiles: any[] = [];
        let currentPage = 0;
        let hasMore = true;

        while (hasMore) {
          const response = await fetch(
            `https://api.pinata.cloud/data/pinList?status=pinned&pageLimit=${ITEMS_PER_PAGE}&pageOffset=${currentPage * ITEMS_PER_PAGE}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${NFT_STORAGE_TOKEN}` },
            }
          );

          if (!response.ok) {
            throw new Error("Error fetching metadata from Pinata");
          }

          const metadata = await response.json();
          console.log(`Pinata Metadata Page ${currentPage}:`, metadata);

          allPinataFiles = [...allPinataFiles, ...metadata.rows];
          hasMore = metadata.rows.length === ITEMS_PER_PAGE;
          currentPage++;
        }

        const matchedFiles = blockchainUris
          .map((uri) => {
            const matchedFile = allPinataFiles.find(
              (file) => file.ipfs_pin_hash === uri
            );
            if (matchedFile) {
              return {
                uri,
                filename: matchedFile.metadata.name || "Unknown Filename",
                timestamp: new Date(matchedFile.date_pinned).getTime(),
                ipfsUrl: `https://gateway.pinata.cloud/ipfs/${uri}`
              };
            }
            return null;
          })
          .filter(Boolean)
          .sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));

        console.log("Matched Files:", matchedFiles);
        setFileData(matchedFiles);
      } catch (error) {
        console.error("Error retrieving URIs or metadata:", error);
        openNotification("error", "", "Error retrieving file metadata");
      } finally {
        setLoading(false);
      }
    };

    if (uploadedFiles.length) userUploads();
  }, [uploadedFiles, NFT_STORAGE_TOKEN, fetchData, openNotification]);

  const isImageFile = (fileName: string) => /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName);
  const isVideoFile = (fileName: string) => /\.(mp4|webm|ogg|mov)$/i.test(fileName);

  const saveToDevice = (blob: Blob, fileName: string) => {
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );
  };

  const handleDownload = async (file: any) => {
    try {
      const response = await fetch(file.ipfsUrl);
      const blob = await response.blob();
      saveToDevice(blob, file.filename);
    } catch (error) {
      openNotification("error", "", "Error downloading the file");
      console.error("Error downloading the file:", error);
    }
  };

  const handleShare = async (file: any) => {
    // Construct the SharePage URL with all file details
    const shareUrl = `${window.location.origin}/share?url=${encodeURIComponent(file.ipfsUrl)}&filename=${encodeURIComponent(file.filename)}&uri=${encodeURIComponent(file.uri)}&timestamp=${file.timestamp}`;
  
    if (navigator.share) {
      try {
        await navigator.share({
          title: file.filename,
          text: `Check out this file: ${file.filename}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing the file:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        openNotification("success", "", "Share page link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy the link:", error);
        openNotification("error", "", "Failed to copy the link");
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      {loading ? (
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
      ) : (
        <div className="p-2">
          {!fileData.length ? (
            <NoRecordScreen />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white">
              {fileData.map((file, index) => (
                <div
                  key={index}
                  className="relative text-sm whitespace-nowrap mb-2 sm:mb-0 bg-transparent rounded-lg backdrop-blur-lg p-10 shadow-lg"
                >
                  {isImageFile(file.filename) ? (
                    <Link href={`/share?url=${encodeURIComponent(file.ipfsUrl)}&filename=${encodeURIComponent(file.filename)}&uri=${encodeURIComponent(file.uri)}&timestamp=${file.timestamp}`}>
                      <img
                        src={file.ipfsUrl}
                        alt={file.filename}
                        className="w-full h-auto rounded cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </Link>
                  ) : isVideoFile(file.filename) ? (
                    <Link href={`/share?url=${encodeURIComponent(file.ipfsUrl)}&filename=${encodeURIComponent(file.filename)}&uri=${encodeURIComponent(file.uri)}&timestamp=${file.timestamp}`}>
                      <video
                        src={file.ipfsUrl}
                        className="w-full h-auto rounded cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </Link>
                  ) : (
                    <div className="p-4 bg-gray-800 rounded">
                      <p className="text-center text-lg">Unsupported File</p>
                      <p className="text-center text-sm">
                        {file.filename} is not supported for preview.
                      </p>
                      <p className="text-center text-sm">
                        Please download to view.
                      </p>
                    </div>
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
                        {isVideoFile(file.filename)
                          ? "Download Video"
                          : "Download Image"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Uploads;