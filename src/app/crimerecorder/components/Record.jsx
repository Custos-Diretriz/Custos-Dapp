import React, { useEffect, useRef } from "react";
import Icons from "./Icons";
import Link from "next/link";
import VideoUploader from "./videoPlayer";

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
    <>
      <div className="p-8 flex items-center justify-center flex-col gap-4 mt-20">
        <div className="text-center flex flex-col ">
          <h1 className="text-[28px] text-[#8E9A9A] font-bold">Got it!</h1>
          <p>You can drag and drop, select or record your videos.</p>
        </div>
        <VideoUploader />
        {/* <div className="rounded-2xl box border-gradien w-full p-6">
              <div className="sh"></div>
    
              <div className="flex flex-col gap-8">
                <div>
                  <label htmlFor="name">Enter agreement title</label>
                  <input type="text" />
                  <Input name="name" />
                </div>
    
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Image
                      src="/AI-stars.svg"
                      alt="Crime Recorder Image"
                      width={400}
                      height={100}
                      className="w-[2em] h-[2em] fade-in-image"
                    />
                    <p className=" font-bold text-[20px]">Suggestions</p>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2">
                    {suggestions.map((suggestion, index) => (
                      <p
                        key={index}
                        className="rounded-full  px-[1em] py-2 bg-[rgba(45,72,92,0.5)] backdrop-blur border border-[#2D485C] text-[#EAFBFF] w-fit shadow-md"
                      >
                        {suggestion}
                      </p>
                    ))}
                  </div>
                </div>
                <div
                  className="w-full backdrop-blur-[10px] border-gradient2 cursor-pointer p-[2px] rounded-[100px]"
                  onClick={handleConnect}
                  onClick={() => setStep(4)}
                >
                  <div className="bg-[#121212] rounded-[100px]">
                    <button className="flex items-center   w-full text-white justify-center text-center text-sm py-3 px-6 rounded-[100px] hover:bg-gradient-to-r from-[#19B1D2] to-[#0094FF] hover:bg-[#209af1] transition-colors duration-300 ease-in-out">
                      <span>Continue</span>
                      <FaLongArrowAltRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
      </div>
    </>
    // <div className="w-full flex flex-col items-center gap-6 px-4 md:px-0 mt-40">
    //   <p className="text-white text-center text-lg md:text-xl">{text}</p>
    //   <div className="w-full md:w-[50%] h-[300px] md:h-[400px] p-[1px] rounded-xl">
    //     <div className="w-full h-full flex flex-row gap-8 justify-center items-end rounded-xl pb-[5px] relative">
    //       {/* Video element for live camera feed */}
    //       <video
    //         ref={videoRef}
    //         className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
    //         autoPlay
    //         muted
    //       ></video>

    //       <Link href={`/crimerecorder/video`} className="w-full md:w-auto relative z-10">
    //         <Icons icon={icon1} text={`Record a Video`} />
    //       </Link>
    //       <Link href={`/crimerecorder/photo`} className="w-full md:w-auto relative z-10">
    //         <Icons icon={icon2} text={`Take a Picture`} />
    //       </Link>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Record;
