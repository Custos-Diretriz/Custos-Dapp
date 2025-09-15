"use client";
import React, { useRef, useState } from "react";

export default function VideoUploader() {
  const [videoFile, setVideoFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start recording
  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      const recorder = new MediaRecorder(mediaStream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setVideoFile(
          new File([blob], "recording.webm", { type: "video/webm" })
        );
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
  };

  // File upload handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 4 * 1024 * 1024 * 1024) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("File is too large. Max size is 4GB.");
    }
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (
      file &&
      file.type.startsWith("video/") &&
      file.size <= 4 * 1024 * 1024 * 1024
    ) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid video file (Max 4GB).");
    }
  };

  return (
    <div className="flex flex-col  w-full max-w-xl mx-auto p-6 rounded-xl bg-[#04080C] text-white ">
      <h2 className="text-lg font-semibold mb-4">Record or upload video</h2>
      <div className="bg-[#2749623d] rounded-xl p-6 border-2 border-dashed border-sky-500 flex flex-col items-center justify-center w-full max-w-xl mx-auto">
        {/* Video Preview */}
        {previewUrl ? (
          <video src={previewUrl} controls className="w-full rounded-lg mb-4" />
        ) : (
          <video ref={videoRef} className="w-full rounded-lg mb-4" />
        )}

        {/* Recording Buttons */}
        <div className="flex gap-3 mb-4">
          {!recording ? (
            <button
              onClick={startRecording}
              className="px-6 py-2 bg-sky-500 rounded-full font-medium hover:bg-sky-600 transition"
            >
              Start Recording 🎥
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-2 bg-red-500 rounded-full font-medium hover:bg-red-600 transition"
            >
              Stop Recording ⏹
            </button>
          )}
        </div>

        {/* Upload Options */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full flex flex-col items-center justify-center p-6 borde-2 border-dashe border-gray-40 rounded-xl cursor-pointer hover:border-sky-40 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-sm text-gray-300 mb-2">
            <span className="underline">Choose video file</span> or Drag & Drop
          </p>
          <p className="text-xs text-gray-400">Maximum file size: 4GB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Selected File Info */}
        {videoFile && (
          <p className="mt-3 text-sm text-green-400">
            Selected: {videoFile.name} (
            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}
      </div>
    </div>
  );
}
