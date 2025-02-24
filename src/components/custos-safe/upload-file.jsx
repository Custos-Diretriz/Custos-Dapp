"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const UploadFile = ({ setSelectedFiles }) => {
  const [error, setError] = useState(null);

  const getLocation = async () => {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser.");
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
        () => reject(new Error("Unable to retrieve your location."))
      );
    });
  };

  const processFiles = async (acceptedFiles) => {
    setError(null);
    try {
      const location = await getLocation().catch(() => null);
      const timestamp = new Date().toISOString();

      const validFiles = acceptedFiles.filter(
        (file) => ["image/", "video/"].some((type) => file.type.startsWith(type)) && file.size <= 50 * 1024 * 1024
      );

      if (validFiles.length === 0) {
        setError("Invalid file type or file size exceeds 50MB.");
        return;
      }

      const filesWithMetadata = validFiles.map((file) => ({ file, title: "", description: "", location, timestamp }));
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithMetadata]);
    } catch (err) {
      setError(err.message || "An error occurred while uploading.");
      console.error("Error uploading files:", err);
    }
  };

  const onDrop = useCallback(processFiles, [setSelectedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
    multiple: true,
  });

  return (
    <div className="w-[516px] top-[236px] relative">
      <div className="w-full bg-gradient-to-r from-[#04080C] to-[#09131A] p-[12px] rounded-[12px]">
        <div className="w-full flex items-center justify-between">
          <p className="text-[20px] font-semibold text-[#EAFBFF]">Upload your assets here</p>
          <Image width={22} height={22} src="/blue-star.svg" alt="star" />
        </div>

        <div
          {...getRootProps()}
          className={`w-full py-[20px] border-[2px] border-dashed rounded-[12px] flex flex-col items-center justify-center mt-[12px] cursor-pointer transition ${isDragActive ? "border-[#00D1FF] bg-[#09131A]" : "border-[#19B1D2]"}`}
        >
          <input {...getInputProps()} />

          <button className="relative w-[248px] rounded-full py-[20px] px-[24px] flex items-center justify-center gap-[8px] bg-[#04080C] text-[#19B1D2]">
            <span className="absolute inset-0 rounded-full h-[64px] p-[3px] bg-gradient-to-r from-[#0094FF] to-[#A02294]">
              <span className="flex h-full w-full items-center justify-center rounded-full gap-[8px] bg-[#04080C]">
                <p className="font-medium text-[16px] text-[#19B1D2]">Upload File</p>
                <Image width={24} height={19.52} src="/cloud-upload.svg" alt="upload" />
              </span>
            </span>
          </button>

          <div className="w-full mt-[50px] text-center">
            <p className="text-[14px] font-normal text-[#EAFBFF]">
              {isDragActive ? (
                <span className="text-[#00D1FF]">Drop files here...</span>
              ) : (
                <>
                  <span className="underline">Choose a file</span> or Drag and drop
                </>
              )}
            </p>
            <p className="text-[12px] text-[#BEBDBD] font-normal mt-[8px]">Maximum file size - 50MB</p>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
      <div className="w-full mt-[20px]">
        <p className="text-[20px] font-normal text-[#EAFBFF] text-center">You have not saved any file yet. Upload or drag and drop your assets here.</p>
      </div>
    </div>
  );
};

export default UploadFile;
