"use client";
import React, { useState } from "react";
import icon4 from "../../../../public/pause.png";
import { Recording } from "../components/Recording";
import { Header } from "../components/Header";

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  const text = {
    text3: isRecording
      ? `Stop recording`
      : `Record a video to keep on the blockchain`,
  };

  return (
    <div className="h-screen w-full md:px-4 px-10">
      <div
        className="flex justify-center md:mt-5 mt-10"
        id="stop-vid-recording"
      >
        <Recording
          text={text.text3}
          icon1={icon4}
          imgText={isRecording ? `Stop Recording` : `Start Recording`}
          category={`video`}
        />
      </div>
    </div>
  );
};

export default VideoRecorder;
