"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiVideoCamera } from "react-icons/hi2";
import Image from "next/image";
import StarIcon from "../../../../public/star.png";

const UploadOrReload = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleRecording = () => {
    setIsRecording(!isRecording);
    console.log(isRecording ? "Stopped recording" : "Started recording");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log("File selected:", file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    console.log("File dropped:", file);
  };

  return (
    <div className="flex flex-col bg-inherit items-center justify-center h-full">
      <div className="w-full max-w-md p-6 bg-[#2749620F]">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-Outfit mb-4">Record or upload crime video</h2>
          <Image src={StarIcon} alt="Star Icon" width={16} height={16} className="mb-4" />
        </div>
        <div
          className="border border-dashed border-[#19B1D2] max-w-full sm:w-[492px] w-[90%] h-auto rounded-[12px] p-6 text-center mx-auto"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Link href="/crimerecorder/record">
            <button
              className="flex items-center justify-center sm:w-[248px] w-[70%] h-[64px] py-[20px] px-[24px] hover:border-[3px] rounded-[104px] border-[2px] border-[#0094FF] gap-[8px] text-white font-semibold mx-auto mb-4"
              onClick={handleRecording}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
              <HiVideoCamera className="w-5 h-5 mr-2" />
            </button>
          </Link>

          <input
            type="file"
            accept="video/*"
            className="hidden"
            id="file-upload"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-sm text-gray-400 hover:underline"
          >
            <span className="underline">Choose video file</span> or Drag and drop
          </label>
          {selectedFile && (
            <p className="text-xs text-gray-500 mt-2">Selected file: {selectedFile.name}</p>
          )}
          <p className="text-xs text-gray-500">Maximum file size: 500MB</p>
        </div>
        <p className="mt-6 text-center text-sm text-gray-400">
          You have not saved any video or image on the blockchain yet. Launch your camera to record
          your evidence.
        </p>
      </div>
    </div>
  );
};

export default UploadOrReload;
