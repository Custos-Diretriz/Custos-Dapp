/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Image from "next/image";
// import Agree from "./agree";
// import gsap from "gsap";
import { useEffect, useState, useRef } from "react";
import { FaPlus, FaVideo } from "react-icons/fa";
const Hero = () => {
  const [showLaunchDapps, setShowLaunchDapps] = useState(false);
  const starRef = useRef(null);

    const toggleLaunchDapps = () => {
      setShowLaunchDapps(!showLaunchDapps);
    };
   const closeModal = () => {
     setShowLaunchDapps(false);
    //  setShowCompany(false);
   };

  useEffect(() => {}, []);
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-white py-20 mx-auto flex flex-col justify-center items-center w-full px-4">
        <div
          // href="/services"
          onClick={toggleLaunchDapps}
          className=" flex w-fit h-fit"
        >
          <button className="relative br w-full text-white shadow-lg py-3 px-6 transform hover:scale-105 transition-transform duration-300 border-gradient bg-opacity-50  backdrop-filter backdrop-blur-lg flex items-center justify-center ">
            <span className="flex items-center">Launch Custos Dapps</span>
            <img
              src="/star.png"
              className="absolute w-6 h-8 z-20 animate-star"
              alt="Star Icon"
            />
          </button>
        </div>
        {showLaunchDapps && (
          <div className="sm:fixed absolute inset-0 z-50 flex items-center justify-center w-full bg-[#00000098] bg-opacity-90 ">
            <div className="relative bg-[#091219] rounded-lg shadow-lg border-gradient md:w-[50%] w-full sm:flex md:flex-row h-full md:h-auto ">
              <button
                onClick={closeModal}
                className="absolute top-0 right-0 flex items-center justify-center text-[3em] text-white w-12 h-12 rounded-full"
                style={{ zIndex: 60 }}
              >
                &times;
              </button>

              <div className=" flex p-6 flex-col justify-between bg-opacity-90 bg-[#091219] bg-[url('/Rectangle.png')] bg-cover bg-center bg-repeat">
                <div>
                  <p className="text-3xl text-white">Launch Dapps</p>
                  <p className="mt-4 text-gray-300">
                    Decentralized apps help you leverage blockchain technology
                    to secure your evidence and legal agreements.
                  </p>
                </div>
                <Image
                  src="/group.png"
                  alt="group"
                  width={200}
                  height={100}
                  className="rounded-lg mt-8"
                />
              </div>

              <div className="flex flex-col gap-4 sm:gap-4  m-auto w-full sm:p-0 p-4 rounded-lg md:h-auto bg-[#091219]">
                <a
                  href="/agreement"
                  className="text-white mb-4 z-[100] w-full hover:bg-[#015A9B] sm:p-4 rounded-lg cursor-pointer"
                >
                  <p className="flex items-center text-xl font-semibold">
                    <FaPlus className="mr-2" />
                    Create Agreement
                  </p>
                  <p className="text-gray-300 mt-1">
                    Custos ensures that agreements are securely stored.
                  </p>
                </a>

                <a
                  href="/crimerecorder"
                  className="text-white mb-4 z-[100] hover:bg-[#015A9B] sm:p-4 rounded-lg cursor-pointer"
                >
                  <p className="flex items-center text-xl font-semibold text-white">
                    <FaVideo className="mr-2" />
                    Record Video
                  </p>
                  <p className="text-gray-300 mt-1">
                    Custos ensures that agreements are securely stored.
                  </p>
                </a>
              </div>
            </div>
          </div>
        )}
        <p className="text-4xl font-bold my-6 bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent text-center w-full p-3">
          The new blockchain safe
        </p>
        <p className="text-lg mb-10 bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent text-center">
          Custos will secure your evidence and legal agreements
        </p>

        <div className="flex flex-col lg:flex-row justify-center w-fit gap-4 mt-[4rem]">
          <div className="p-2 transform transition-transform duration-300 hover:scale-110">
            <div className="w-fit sm:w-[20em] rounded-[1.1em]  shadow-lg border-gradient bg-[#ffffff09] backdrop-filter backdrop-blur-[2px] flex flex-col items-center relative h-[20em] overflow-clip">
              <div className="py-2 text-center h-full">
                <div className="font-bold text-[1.2em] mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
                  Crime scene recorder
                </div>
                <p className="text-gray-700 text-[0.8em] w-[80%] m-auto text-center items-center justify-center bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
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

          <div className="p-2 transform transition-transform duration-300 hover:scale-110">
            <div className="w-fit sm:w-[20em] rounded-[1.1em] shadow-lg border-gradient bg-[#ffffff09] backdrop-filter backdrop-blur-[2px] flex flex-col items-center relative h-[20em] overflow-clip">
              <div className="py-2 text-center h-full">
                <div className="font-bold text-[1.2em] mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
                  A very secure blockchain safe
                </div>
                <p className="text-gray-700 text-[0.8em] w-[80%] m-auto text-center items-center justify-center bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
                  Leveraging on Starknet’s advanced technology for unparalleled
                  security and efficiency, we have built a safe for your
                  agreement and videos
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

          <div className="p-2 transform transition-transform duration-300 hover:scale-110">
            <div className="w-fit sm:w-[20em] rounded-[1.1em] shadow-lg border-gradient bg-[#ffffff09]  backdrop-filter backdrop-blur-[2px] flex flex-col items-center relative h-[20em] overflow-clip">
              <div className="py-2 text-center h-full">
                <div className="font-bold text-[1.2em] mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
                  Agreement documentation
                </div>
                <p className="text-gray-700 text-[0.8em] w-[80%] m-auto text-center items-center justify-center bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
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
        </div>
      </div>
    </main>
  );
};

export default Hero;
