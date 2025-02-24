import React, { useEffect, useRef } from "react";
import Icons from "./Icons";
import Link from "next/link";

export const Record = ({ text, icon1, icon2 }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); 

  return (
    <div className="w-full flex flex-col items-center gap-6 px-4 md:px-0 mt-40">
      <p className="text-white text-center text-lg md:text-xl">{text}</p>
      <div className="w-full md:w-[50%] h-[300px] md:h-[400px] p-[1px] rounded-xl">
        <div className="w-full h-full flex flex-row gap-8 justify-center items-end rounded-xl pb-[5px] relative">
          {/* Video element for live camera feed */}
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
            autoPlay
            muted
          ></video>

          <Link href={`/crimerecorder/video`} className="w-full md:w-auto relative z-10">
            <Icons icon={icon1} text={`Record a Video`} />
          </Link>
          <Link href={`/crimerecorder/photo`} className="w-full md:w-auto relative z-10">
            <Icons icon={icon2} text={`Take a Picture`} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Record;
