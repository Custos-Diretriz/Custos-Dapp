'use client'
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const SharePageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url");
  const filename = searchParams.get("filename");
  const uri = searchParams.get("uri");
  const timestamp = searchParams.get("timestamp");

  const isImageFile = (fileName: string) => /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName);
  const isVideoFile = (fileName: string) => /\.(mp4|webm|ogg|mov)$/i.test(fileName);

  const handleBack = () => {
    router.push('/crimerecorder');
  };

  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return "Unknown Timestamp";
    const date = new Date(parseInt(timestamp));
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

  if (!url || !filename) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white text-lg">No media file provided</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <button
          onClick={handleBack}
          className="sm:w-fit w-full sm:flex hidden absolute top-[10%] left-[10%] z-20 items-start text-[#EAFBFF] px-4 sm:px-0"
        >
          <div className="sm:w-fit w-full flex justify-start items-center">
            <FaArrowLeft className="mr-2 mt-[3px] text-[#EAFBFF]" />
            <p className="text-[#EAFBFF] font-bold">Back</p>
          </div>
        </button>
        <div className="relative">
          {isImageFile(filename) ? (
            <img
              src={url}
              alt={filename}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          ) : isVideoFile(filename) ? (
            <video
              src={url}
              controls
              autoPlay
              className="w-full h-auto rounded-lg shadow-lg"
            />
          ) : (
            <p className="text-white text-lg">Unsupported file type</p>
          )}
        </div>
        <div className="mt-6 text-white">
          <p className="text-lg text-center font-semibold">{filename}</p>
          <div className="mt-4 space-y-2">
            <p className="text-sm">
              <span className="text-[#EAFBFF]">Timestamp: </span>
              <span className="text-[#19B1D2]">{formatDate(timestamp)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SharePage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><p className="text-white text-lg">Loading...</p></div>}>
      <SharePageContent />
    </Suspense>
  );
};

export default SharePage;