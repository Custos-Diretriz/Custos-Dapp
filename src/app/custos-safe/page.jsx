"use client";
import FileGallery from "@/components/custos-safe/file-gallery";
import UploadFile from "@/components/custos-safe/upload-file";
import { useState, useEffect, useCallback } from "react";
import { getStoredCIDs } from "@/utils/interaction";
import { fetchFileFromIPFS } from "@/utils/ipfs";

const CustosSafe = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const updateSelectedFiles = useCallback((newFiles) => {
    setSelectedFiles(newFiles);
  }, []);

  useEffect(() => {
    const loadStoredFiles = async () => {
      const cids = await getStoredCIDs();
      const filesFromIPFS = cids.map((cid) => ({
        cid,
        url: fetchFileFromIPFS(cid),
        timestamp: new Date().toISOString(),
      }));
      setSelectedFiles(filesFromIPFS);
    };

    loadStoredFiles();
  }, [selectedFiles]);

  console.log("files", selectedFiles);
  return (
    <>
      <div className="w-full min-h-screen">
        <div className=" w-full h-full flex items-start justify-center">
          {selectedFiles?.length > 0 ? (
            <FileGallery
              selectedFiles={selectedFiles}
              setSelectedFiles={updateSelectedFiles}
            />
          ) : (
            <UploadFile
              selectedFiles={selectedFiles}
              setSelectedFiles={updateSelectedFiles}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CustosSafe;
