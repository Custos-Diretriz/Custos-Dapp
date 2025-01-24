"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { TracingBeam } from "@aceternity/ui";
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
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-white py-20 mx-auto flex flex-col justify-center items-center w-full px-4">
        <div onClick={toggleLaunchDapps} className="flex w-fit h-fit">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="relative br w-full text-white shadow-xl py-3 px-6 transform hover:scale-105 transition-all duration-500 bg-opacity-50 backdrop-filter backdrop-blur-xl flex items-center justify-center"
            onClick={toggleLaunchDapps}
          >
            <span className="flex items-center">Launch Custos Dapp</span>
          </HoverBorderGradient>
        </div>
        {showLaunchDapps && <ShowLaunchDapps closeModal={closeModal} />}
        <p className="text-6xl sm:text-5xl font-semibold my-6 bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent text-center w-full p-3">
          The new blockchain safe
        </p>
        <p className="max-w-[16rem] sm:max-w-[18rem] md:max-w-lg mb-10 bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent text-center">
          Custos will secure your evidence and legal agreements
        </p>

        <div className="flex flex-col lg:flex-row justify-center w-fit gap-[4em] mt-[4rem]">
          
          <TracingBeam>
            <div className="transform box transition-transform duration-300 hover:scale-110 backdrop-filter backdrop-blur-[10px] bg-[#ffffff12] shadow-lg rounded-lg w-full">
              <div className="w-fit p-2 sm:w-[20em] rounded-[1.1em] shadow-lg flex flex-col items-center relative h-full overflow-clip">
                <div className="py-2 text-center h-full">
                  <div className="font-bold text-[1.2em] mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
                    Crime scene recorder
                  </div>
                  <p className="text-gray-700 text-[0.8em] w-[80%] m-auto text-center bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
                    We are providing a decentralized crime recorder. Videos on
                    Custos are transparent
                  </p>
                </div>
                <div className="h-fit">
                  <Image
                    src="/ime.png"
                    alt="Card Image"
                    width={200}
                    height={100}
                    className="will-change-auto"
                  />
                </div>
              </div>
            </div>
          </TracingBeam>

          
          <TracingBeam>
            <div className="transform box transition-transform duration-300 hover:scale-110 backdrop-filter backdrop-blur-[10px] bg-[#ffffff12] shadow-lg rounded-lg w-full">
              <div className="w-fit p-2 sm:w-[20em] rounded-[1.1em] shadow-lg flex flex-col items-center relative h-full overflow-clip">
                <div className="py-2 text-center h-full">
                  <div className="font-bold text-[1.2em] mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
                    A very secure blockchain safe
                  </div>
                  <p className="text-gray-700 text-[0.8em] w-[80%] m-auto text-center bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
                    Leveraging on Starknet’s advanced technology for unparalleled
                    security and efficiency, we have built a safe for your
                    agreement and videos.
                  </p>
                </div>
                <div className="h-fit mb-5">
                  <Image
                    src="/img.png"
                    alt="Card Image"
                    width={150}
                    height={100}
                    className="will-change-auto"
                  />
                </div>
              </div>
            </div>
          </TracingBeam>

          {/* Card 3 */}
          <TracingBeam>
            <div className="transform box transition-transform duration-300 hover:scale-110 backdrop-filter backdrop-blur-[10px] bg-[#ffffff12] shadow-lg rounded-lg w-full">
              <div className="w-fit p-2 sm:w-[20em] rounded-[1.1em] shadow-lg flex flex-col items-center relative h-full overflow-clip">
                <div className="py-2 text-center h-full">
                  <div className="font-bold text-[1.2em] mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
                    Agreement documentation
                  </div>
                  <p className="text-gray-700 text-[0.8em] w-[80%] m-auto text-center bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
                    Custos’ smart agreement management will secure your signed
                    documents transparently
                  </p>
                </div>
                <div className="h-fit mb-4">
                  <Image
                    src="/ima.png"
                    alt="Card Image"
                    width={200}
                    height={100}
                    className="will-change-auto"
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
