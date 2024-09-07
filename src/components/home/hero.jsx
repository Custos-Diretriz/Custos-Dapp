/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Image from "next/image";
// import Agree from "./agree";
// import gsap from "gsap";
import { useEffect, useState, useRef } from "react";
const Hero = () => {
  const starRef = useRef(null);

  useEffect(() => {}, []);
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-white py-20 mx-auto flex flex-col justify-center items-center w-full px-4">
        <a href="/services" className=" flex w-fit h-fit">
          <button className="relative br w-full text-white shadow-lg py-3 px-6 transform hover:scale-105 transition-transform duration-300 border-gradient bg-opacity-50  backdrop-filter backdrop-blur-lg flex items-center justify-center ">
            <span className="flex items-center">Launch Custos Dapp</span>
            <img
              src="/star.png"
              className="absolute w-6 h-8 z-20 animate-star"
              alt="Star Icon"
            />
          </button>
        </a>

        <p className="text-4xl font-bold my-6 bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent text-center w-full p-3">
          The new blockchain safe
        </p>
        <p className="text-lg mb-10 bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent text-center">
          Custos will secure your evidence and legal agreements
        </p>

        <div className="flex flex-col lg:flex-row justify-center w-fit gap-4 mt-[4rem]">
          <div className="p-2 transform transition-transform duration-300 hover:scale-110">
            <div className="w-fit sm:w-[20em] rounded-[1.1em] shadow-lg border-gradient bg-opacity-95 backdrop-filter backdrop-blur-[10px] flex flex-col items-center relative h-[20em] overflow-clip">
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
            <div className="w-fit sm:w-[20em] rounded-[1.1em] shadow-lg border-gradient bg-opacity-95 backdrop-filter backdrop-blur-[10px] flex flex-col items-center relative h-[20em] overflow-clip">
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
            <div className="w-fit sm:w-[20em] rounded-[1.1em] shadow-lg border-gradient bg-opacity-95 backdrop-filter backdrop-blur-[10px] flex flex-col items-center relative h-[20em] overflow-clip">
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
