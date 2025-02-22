"use client";
import FileGallery from "@/components/custos-safe/file-gallery";
import UploadFile from "@/components/custos-safe/upload-file";
import { useState } from "react";

const CustosSafe = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  console.log("files", selectedFiles);
  return (
    <>
      <div className="w-full min-h-screen">
        <div className=" w-full h-full flex items-start justify-center">
          {selectedFiles?.length > 0 ? (
            <FileGallery
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
            />
          ) : (
            <UploadFile
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CustosSafe;
