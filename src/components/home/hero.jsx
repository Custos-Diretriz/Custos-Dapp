"use client";
import React, { useState } from "react";
import Image from "next/image";
import { TracingBeam } from "./tracingBeam";
import ShowLaunchDapps from "../showLaunchDapps";
import { HoverBorderGradient } from "./hoverButton";

const Hero = () => {
  const [showLaunchDapps, setShowLaunchDapps] = useState(false);

  const toggleLaunchDapps = () => {
    setShowLaunchDapps(!showLaunchDapps);
  };
  const closeModal = () => {
    setShowLaunchDapps(false);
  };

  return (
    <main
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: 'url("./patterns.png")', // Replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Optional: Keeps the background fixed while scrolling
      }}
    >
      <div className="text-white py-20 mx-auto flex flex-col justify-center items-center w-full px-4">
        <div onClick={toggleLaunchDapps} className="flex w-fit h-fit">
          <HoverBorderGradient
            containerClassName="rounded-full"
            className="relative w-full text-white py-4 px-8 transform hover:scale-110 transition-all duration-300 bg-opacity-50 backdrop-filter backdrop-blur-lg flex items-center justify-center"
            duration={3}
          >
            <span className="flex items-center">Launch Custos Dapp</span>
            <img
              src="/star.png"
              className="absolute w-6 h-8 z-20 animate-star"
              alt="Star Icon"
            />
          </HoverBorderGradient>
        </div>
        {showLaunchDapps && <ShowLaunchDapps closeModal={closeModal} />}
        <p className="text-6xl sm:text-5xl font-semibold my-6 bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent text-center w-full p-3">
          The New Blockchain Safe
        </p>
        <p className="max-w-[16rem] sm:max-w-[18rem] md:max-w-lg mb-10 bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent text-center">
          Custos will secure your evidence and legal agreements
        </p>

        <div className="flex flex-col items-center gap-[1rem] mt-[2rem]">
          {/* Wrapper for the entire section */}
          <TracingBeam>
            {/* Section containing the first two cards */}
            <div
              className="flex flex-row w-full gap-6 justify-center"
              style={{
                borderRadius: "20px 0px 0px 0px",
                border: "0.5px solid transparent",
              }}
            >
              {/* First Card */}
              <div
                className="transform transition-transform duration-300 hover:scale-110 hover:z-10 backdrop-filter backdrop-blur-[10px] bg-[#030D1B] shadow-lg rounded-lg"
                style={{
                  width: "388px",
                  height: "380px",
                  borderRadius: "20px", // Added border radius
                  border: "0.5px solid rgba(255, 255, 255, 0.1)", // Subtle border
                }}
              >
                <div className="flex flex-col items-center h-full">
                  {/* Image Section */}
                  <div className="h-[70%] w-full">
                    <Image
                      src="/image_fx_ (1).png"
                      alt="Card Image"
                      layout="responsive"
                      width={388}
                      height={200} // 70% of 366px
                      className="will-change-auto object-cover"
                      style={{
                        borderRadius: "20px", // Added border radius
                      }}
                    />
                  </div>
                  {/* Text Section */}
                  <div className="flex flex-col items-center justify-center h-[30%] text-center">
                    <div className="font-bold text-[1.2em] mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
                      Crime scene recorder
                    </div>
                    <p className="text-gray-700 text-[0.8em] w-[80%] bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
                      We are providing a decentralized crime recorder. Videos on
                      Custos are transparent.
                    </p>
                  </div>
                </div>
              </div>

              {/* Second Card */}
              <div
                className="transform transition-transform duration-300 hover:scale-110 hover:z-10 backdrop-filter backdrop-blur-[10px] bg-[#030D1B] shadow-lg rounded-lg"
                style={{
                  width: "388px",
                  height: "380px",
                  borderRadius: "20px", // Added border radius
                  border: "0.5px solid rgba(255, 255, 255, 0.1)", // Subtle border
                }}
              >
                <div className="flex flex-col items-center h-full">
                  {/* Image Section */}
                  <div className="h-[70%] w-full">
                    <Image
                      src="/image_fx_2.png"
                      alt="Card Image"
                      layout="responsive"
                      width={388}
                      height={200} // 70% of 366px
                      className="will-change-auto object-cover"
                      style={{
                        borderRadius: "20px", // Added border radius
                      }}
                    />
                  </div>
                  {/* Text Section */}
                  <div className="flex flex-col items-center justify-center h-[30%] text-center">
                    <div className="font-bold text-[1.2em] mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
                      A very secure blockchain safe
                    </div>
                    <p className="text-gray-700 text-[0.8em] w-[80%] bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
                      Leveraging on Starknet’s advanced technology for
                      unparalleled security and efficiency, we have built a safe
                      for your agreement and videos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wrapper for the third card */}
            <div
              className="w-[800px] mt-[1rem] rounded-[20px] bg-[#030D1B] flex justify-center items-center"
              style={{ border: "0.5px solid transparent" }}
            >
              <div
                className="transform transition-transform duration-300 hover:scale-110 backdrop-filter backdrop-blur-[10px] bg-[#030D1B] shadow-lg rounded-[20px] flex flex-col lg:flex-row items-center justify-between w-full h-full"
                style={{
                  borderRadius: "20px",
                  border: "0.5px solid transparent",
                }}
              >
                {/* Left Section: Text and Image */}
                <div className="flex flex-col h-full justify-center items-start w-full lg:w-[60%] text-center lg:text-left bg-[#030D1B] px-6">
                  {" "}
                  {/* Added px-6 for equal distance */}
                  {/* Image Section */}
                  <div className="mb-3">
                    {" "}
                    {/* Optional margin for spacing between the image and title */}
                    <img
                      src="/star.png"
                      alt="Icon"
                      className="w-10 h-10 mx-auto lg:mx-0 mb-3"
                    />
                  </div>
                  {/* Title Section */}
                  <div className="font-bold text-[1.4em] mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
                    Agreement documentation
                  </div>
                  {/* Text Section */}
                  <p className="text-gray-300 text-[0.8em] w-full sm:w-[80%] lg:w-[90%] m-auto text-center lg:text-left">
                    Custos’ smart agreement management will secure your signed
                    documents transparently.
                  </p>
                </div>

                {/* Right Section: Image */}
                <div className="h-full w-[45%]">
                  <Image
                    src="/image_fx_ 3.png"
                    alt="Card Image"
                    width={450}
                    height={366}
                    objectFit="cover"
                    className="rounded-[20px]"
                  />
                </div>
              </div>
            </div>
          </TracingBeam>
        </div>
      </div>
    </main>
  );
};

export default Hero;
