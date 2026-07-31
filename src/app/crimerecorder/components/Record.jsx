import React from "react";
import VideoUploader from "./videoPlayer";
import PageHeader from "../../../components/dapps/PageHeader";

export const Record = ({ text }) => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Capture evidence"
        subtitle={text || "Record, drag and drop, or select a video to anchor onchain."}
      />
      <VideoUploader />
    </div>
  );
};

export default Record;
