"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { UseReadContractData } from "../../../utils/fetchcontract";
import NoRecordScreen from "./NoRecordScreen";
import { WalletContext } from "../../../components/walletprovider";
import Image from "next/image";
import { ClipboardIcon } from "@heroicons/react/outline";
import { useNotification } from "../../../context/NotificationProvider";
import Link from "next/link";
import { CHAIN_TYPES } from "../../../lib/chains";
import { getEvidence, getAllEvidence } from "../../../utils/evmEvidence";

const ITEMS_PER_PAGE = 20;
const GATEWAY = "https://gateway.pinata.cloud/ipfs";

const Uploads = () => {
  const { address, isGuest, selectedChain } = useContext(WalletContext);
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_IPFS_KEY;

  const { openNotification } = useNotification();
  const { fetchData } = UseReadContractData();

  const isEvm = selectedChain.type === CHAIN_TYPES.EVM;

  /** Pinata metadata lookup so CIDs get real filenames + pin dates. */
  const loadPinataIndex = useCallback(async () => {
    const index = new Map();
    let currentPage = 0;
    let hasMore = true;
    try {
      while (hasMore) {
        const response = await fetch(
          `https://api.pinata.cloud/data/pinList?status=pinned&pageLimit=${ITEMS_PER_PAGE}&pageOffset=${
            currentPage * ITEMS_PER_PAGE
          }`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${NFT_STORAGE_TOKEN}` },
          }
        );
        if (!response.ok) break;
        const metadata = await response.json();
        for (const row of metadata.rows) index.set(row.ipfs_pin_hash, row);
        hasMore = metadata.rows.length === ITEMS_PER_PAGE;
        currentPage++;
      }
    } catch (e) {
      console.warn("Pinata index unavailable, falling back to CIDs:", e?.message);
    }
    return index;
  }, [NFT_STORAGE_TOKEN]);

  const decorate = useCallback((records, pinataIndex) => {
    return records
      .map((r) => {
        const pin = pinataIndex.get(r.fileHash);
        return {
          uri: r.fileHash,
          filename: pin?.metadata?.name || `${r.fileHash.slice(0, 10)}.webm`,
          timestamp: pin?.date_pinned
            ? new Date(pin.date_pinned).getTime()
            : r.timestamp,
          ipfsUrl: `${GATEWAY}/${r.fileHash}`,
          user: r.user,
          isGuest: r.isGuest,
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, []);

  // ---------------- EVM ----------------

  const loadEvm = useCallback(async () => {
    setLoading(true);
    try {
      // guests see the full log (their own guest records + every user's);
      // a connected wallet sees its own
      const records = isGuest
        ? await getAllEvidence({ chain: selectedChain })
        : await getEvidence({ chain: selectedChain, userAddress: address });

      if (!records.length) {
        setFileData([]);
        return;
      }
      const pinataIndex = await loadPinataIndex();
      setFileData(decorate(records, pinataIndex));
    } catch (error) {
      console.error("Error fetching evidence:", error);
      openNotification("error", "", "Error fetching evidence from chain");
      setFileData([]);
    } finally {
      setLoading(false);
    }
  }, [
    isGuest,
    address,
    selectedChain,
    loadPinataIndex,
    decorate,
    openNotification,
  ]);

  // ---------------- Starknet ----------------

  const loadStarknet = useCallback(async () => {
    if (!address) {
      setFileData([]);
      return;
    }
    setLoading(true);
    try {
      const result = await fetchData("crime", "get_all_user_uploads", [address]);
      const ids =
        result && typeof result === "object"
          ? Object.keys(result).map((key) => result[key].toString())
          : [];

      if (!ids.length) {
        setFileData([]);
        return;
      }

      const uris = await Promise.all(
        ids.map((id) => fetchData("crime", "get_token_uri", [id]))
      );

      const pinataIndex = await loadPinataIndex();
      const records = uris.filter(Boolean).map((uri) => ({
        fileHash: uri,
        timestamp: Date.now(),
        user: address,
        isGuest: false,
      }));
      setFileData(decorate(records, pinataIndex));
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      openNotification("error", "", "Error fetching uploaded files");
      setFileData([]);
    } finally {
      setLoading(false);
    }
  }, [address, fetchData, loadPinataIndex, decorate, openNotification]);

  useEffect(() => {
    if (isEvm) loadEvm();
    else loadStarknet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEvm, selectedChain.key, address, isGuest]);

  // ---------------- helpers ----------------

  const isImageFile = (fileName) => /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName);
  const isVideoFile = (fileName) => /\.(mp4|webm|ogg|mov)$/i.test(fileName);

  const saveToDevice = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp) => {
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

  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.ipfsUrl);
      const blob = await response.blob();
      saveToDevice(blob, file.filename);
    } catch (error) {
      openNotification("error", "", "Error downloading the file");
      console.error("Error downloading the file:", error);
    }
  };

  const handleShare = async (file) => {
    const shareUrl = `${window.location.origin}/share?url=${encodeURIComponent(
      file.ipfsUrl
    )}&filename=${encodeURIComponent(file.filename)}&uri=${encodeURIComponent(
      file.uri
    )}&timestamp=${file.timestamp}&chain=${selectedChain.key}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: file.filename,
          text: `Evidence: ${file.filename}`,
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
        openNotification("error", "", "Failed to copy the link");
      }
    }
  };

  const shareHref = (file) =>
    `/share?url=${encodeURIComponent(file.ipfsUrl)}&filename=${encodeURIComponent(
      file.filename
    )}&uri=${encodeURIComponent(file.uri)}&timestamp=${file.timestamp}&chain=${
      selectedChain.key
    }`;

  return (
    <div className="min-h-screen relative">
      {loading ? (
        <div className="fixed inset-0 z-30 bg-gradient-to-r bg-opacity-70 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Image src="/logo.svg" alt="Loading" width={100} height={100} />
            <p className="text-white mt-4 text-lg">
              Loading evidence from {selectedChain.name}, please wait...
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
          <div className="flex items-center gap-2 mb-4 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#1e2f37] text-[#19B1D2]">
              {selectedChain.name}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#1e2f37] text-[#0094FF]">
              {isEvm && isGuest ? "All evidence (guest view)" : "Your evidence"}
            </span>
          </div>

          {!fileData.length ? (
            <NoRecordScreen />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white">
              {fileData.map((file, index) => (
                <div
                  key={`${file.uri}-${index}`}
                  className="relative text-sm whitespace-nowrap mb-2 sm:mb-0 bg-transparent rounded-lg backdrop-blur-lg p-10 shadow-lg"
                >
                  {isImageFile(file.filename) ? (
                    <Link href={shareHref(file)}>
                      <img
                        src={file.ipfsUrl}
                        alt={file.filename}
                        className="w-full h-auto rounded cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </Link>
                  ) : isVideoFile(file.filename) ? (
                    <Link href={shareHref(file)}>
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
                      <p className="text-center text-sm">Please download to view.</p>
                    </div>
                  )}

                  <p className="text-[#0094FF] mt-4 truncate">{file.filename}</p>

                  <p className="text-sm flex mt-4">
                    <span className="text-[#EAFBFF]">Time Stamp: </span>
                    <span className="text-[#19B1D2] ml-1">
                      {formatDate(file.timestamp)}
                    </span>
                  </p>

                  {isEvm && (
                    <p className="text-[11px] mt-2 truncate">
                      <span className="text-[#EAFBFF]">
                        {file.isGuest ? "Guest record" : "Recorded by"}:{" "}
                      </span>
                      <span className="text-[#19B1D2]">
                        {file.user?.slice(0, 6)}…{file.user?.slice(-4)}
                      </span>
                    </p>
                  )}

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