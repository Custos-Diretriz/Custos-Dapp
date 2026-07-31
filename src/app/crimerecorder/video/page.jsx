"use client";
import React, { useState } from "react";
import icon4 from "../../../../public/pause.png";
import { Recording } from "../components/Recording";
import PageHeader from "../../../components/dapps/PageHeader";

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => setIsRecording((prev) => !prev);

  return (
    <div className="flex flex-col gap-6" id="stop-vid-recording">
      <PageHeader
        title="Record a video"
        subtitle="Recording starts automatically. Auto-save keeps your footage even if the page closes mid-record."
      />
      <Recording
        text={
          isRecording
            ? "Stop recording"
            : "Record a video to keep on the blockchain"
        }
        icon1={icon4}
        imgText={isRecording ? "Stop Recording" : "Start Recording"}
        category="video"
        isRecording={isRecording}
        toggleRecording={toggleRecording}
      />
    </div>
  );
};

export default VideoRecorder;
