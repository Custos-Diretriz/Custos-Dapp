"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { UseReadContractData } from "../../../utils/fetchcontract";
import NoRecordScreen from "./NoRecordScreen";
import { WalletContext } from "../../../components/walletprovider";
import Link from "next/link";
import {
  ClipboardIcon,
  DownloadIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import PageHeader from "../../../components/dapps/PageHeader";
import StatusChips from "../../../components/dapps/StatusChips";
import { LoadingOverlay } from "./CaptureFrame";
import { useNotification } from "../../../context/NotificationProvider";
import { CHAIN_TYPES } from "../../../lib/chains";
import { getEvidence, getAllEvidence } from "../../../utils/evmEvidence";

const ITEMS_PER_PAGE = 20;
const GATEWAY = "https://gateway.pinata.cloud/ipfs";

const Uploads = () => {
  const { address, isGuest, selectedChain } = useContext(WalletContext);
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState({}); // cid -> bool, download only
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
    setBusy((b) => ({ ...b, [file.uri]: true }));
    try {
      const response = await fetch(file.ipfsUrl);
      if (!response.ok) throw new Error(`Gateway returned ${response.status}`);
      const blob = await response.blob();
      saveToDevice(blob, file.filename);
    } catch (error) {
      console.error("Error downloading the file:", error);
      openNotification("error", "", "Error downloading the file");
    } finally {
      setBusy((b) => ({ ...b, [file.uri]: false }));
    }
  };

  const shareHref = (file) =>
    `/share?url=${encodeURIComponent(file.ipfsUrl)}&filename=${encodeURIComponent(
      file.filename
    )}&uri=${encodeURIComponent(file.uri)}&timestamp=${file.timestamp}&chain=${
      selectedChain.key
    }`;

  const handleShare = async (file) => {
    const shareUrl = `${window.location.origin}${shareHref(file)}`;

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

  if (loading) {
    return (
      <LoadingOverlay
        text={`Loading evidence from ${selectedChain.name}, please wait…`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        showBack={false}
        title="Your evidence"
        subtitle="Everything you have anchored onchain, newest first. Share a verifiable link or download the original file."
        actions={
          <Link
            href="/crimerecorder/record"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0094FF] px-5 text-sm font-medium text-white transition-colors hover:bg-[#0b84dc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70"
          >
            <PlusIcon className="h-4 w-4" aria-hidden />
            New recording
          </Link>
        }
      >
        <StatusChips
          sessionLabel={
            isEvm && isGuest ? "All evidence (guest view)" : "Your evidence"
          }
        />
      </PageHeader>

      {!fileData.length ? (
        <NoRecordScreen />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {fileData.map((file, index) => {
            const isImage = isImageFile(file.filename);
            const isVideo = isVideoFile(file.filename);

            return (
              <li
                key={`${file.uri}-${index}`}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] text-white shadow-lg backdrop-blur-lg transition-colors hover:border-white/[0.14]"
              >
                <Link
                  href={shareHref(file)}
                  className="group relative block aspect-video w-full overflow-hidden bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0094FF]"
                >
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.ipfsUrl}
                      alt={file.filename}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : isVideo ? (
                    <video
                      src={file.ipfsUrl}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 bg-[#101A20] px-4 text-center">
                      <p className="text-sm font-medium">Preview unavailable</p>
                      <p className="text-xs text-[#8E9A9A]">
                        Download the file to view it.
                      </p>
                    </div>
                  )}
                  {(isImage || isVideo) && (
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide backdrop-blur-sm">
                      {isVideo ? "Video" : "Image"}
                    </span>
                  )}
                </Link>

                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p
                    className="truncate text-sm font-medium text-[#0094FF]"
                    title={file.filename}
                  >
                    {file.filename}
                  </p>

                  <p className="text-xs leading-relaxed text-[#8E9A9A]">
                    <span className="text-[#EAFBFF]">Timestamp: </span>
                    <span className="text-[#19B1D2]">
                      {formatDate(file.timestamp)}
                    </span>
                  </p>

                  {isEvm && (
                    <p className="truncate text-[11px]">
                      <span className="text-[#EAFBFF]">
                        {file.isGuest ? "Guest record" : "Recorded by"}:{" "}
                      </span>
                      <span className="text-[#19B1D2]">
                        {file.user?.slice(0, 6)}…{file.user?.slice(-4)}
                      </span>
                    </p>
                  )}

                  <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleShare(file)}
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-sm transition-colors hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70"
                    >
                      <ClipboardIcon className="h-4 w-4 shrink-0" aria-hidden />
                      Share
                    </button>

                    <button
                      type="button"
                      disabled={busy[file.uri]}
                      onClick={() => handleDownload(file)}
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#209af1] px-4 text-sm font-medium transition-colors hover:bg-[#1789da] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70 disabled:opacity-60"
                    >
                      <DownloadIcon className="h-4 w-4 shrink-0" aria-hidden />
                      {busy[file.uri] ? "Preparing…" : "Download"}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Uploads;