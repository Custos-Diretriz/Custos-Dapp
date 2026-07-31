import React from "react";
import VideoUploader from "./videoPlayer";
import PageHeader from "../../../components/dapps/PageHeader";

export const Record = ({ text, initialMode = "video" }) => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Capture evidence"
        subtitle={
          text ||
          "Switch between video and photo, or drop in a file you already have — either way it is anchored onchain."
        }
      />
      <VideoUploader
        initialMode={initialMode}
        text="Record a video or snap a photo — it's secured automatically."
      />
    </div>
  );
};

export default Record;
