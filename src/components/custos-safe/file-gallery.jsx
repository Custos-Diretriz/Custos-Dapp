"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Button from "../Button";
import { uploadFileToPinata, fetchFileFromIPFS } from "@/utils/ipfs";
import { storeBatchCIDs, storeCID } from "@/utils/interaction";
import { getStoredCIDs } from "@/utils/interaction";
import Spinner from "@/app/custos-safe/components/ui/Spinner";

const FileGallery = ({ selectedFiles, setSelectedFiles }) => {
  const [uploading, setUploading] = useState(false);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const groupFilesByMonth = (files) => {
    return files.reduce((acc, file) => {
      const date = new Date(file.timestamp);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      const dayKey = formatDate(file.timestamp);

      if (!acc[monthKey]) acc[monthKey] = {};
      if (!acc[monthKey][dayKey]) acc[monthKey][dayKey] = [];

      acc[monthKey][dayKey].push(file);
      return acc;
    }, {});
  };

  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          () => resolve(null)
        );
      }
    });
  };

  const handleFileUpload = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*,video/*";
      input.multiple = true;
      input.click();

      input.onchange = async () => {
        if (!input.files) return;

        setUploading(true);

        const filesArray = Array.from(input.files);
        const validFiles = filesArray.filter(
          (file) =>
            ["image/", "video/"].some((type) => file.type.startsWith(type)) &&
            file.size <= 50 * 1024 * 1024
        );

        if (validFiles.length === 0) {
          alert("Invalid file type or file size exceeds 50MB.");
          setUploading(false);
          return;
        }

        let cids = [];
        for (let file of validFiles) {
          const cid = await uploadFileToPinata(file);
          if (cid) cids.push(cid);
        }

        if (cids.length === 1) {
          await storeCID(cids[0]);
        } else {
          await storeBatchCIDs(cids);
        }

        const storedCIDs = await getStoredCIDs();
        const filesFromIPFS = storedCIDs.map((cid) => ({
          cid,
          url: fetchFileFromIPFS(cid),
          timestamp: new Date().toISOString(),
        }));

        setSelectedFiles(filesFromIPFS);
      };
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };

  const groupedFiles = useMemo(
    () => groupFilesByMonth(selectedFiles),
    [selectedFiles]
  );

  return (
    <div className="w-full min-h-screen px-8 relative">
      <div className="w-full flex items-center justify-end absolute z-10 right-7">
        <Button
          text={uploading ? "Uploading..." : "Upload File"}
          icon={
            uploading ? (
              <Spinner />
            ) : (
              <Image
                width={24}
                height={19.52}
                src="/cloud-upload.svg"
                alt="upload"
              />
            )
          }
          onClick={handleFileUpload}
          disabled={uploading}
        />
      </div>

      {Object.entries(groupedFiles).map(([month, days]) => (
        <div key={month} className="mb-6">
          <h2 className="text-[20px] font-semibold text-[#EAFBFF]">{month}</h2>

          {Object.entries(days).map(([day, files]) => (
            <div key={day} className="mt-3">
              <h3 className="text-[14px] font-normal text-[#EAFBFF]">{day}</h3>

              <div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 grid-auto-flow-dense"
                style={{ gridAutoRows: "208px" }}
              >
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg"
                    style={{ height: "208px" }}
                  >
                    {file.url.endsWith(".mp4") ? (
                      <video
                        src={file.url}
                        controls
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Image
                        src={file.url}
                        alt="uploaded"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg object-fill"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FileGallery;
