"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import ShowLaunchDapps from "../../components/showLaunchDapps";
import { FaLongArrowAltRight } from "react-icons/fa";

const About = () => {
  const [showLaunchDapps, setShowLaunchDapps] = useState(false);
  const starRef = useRef(null);

  const toggleLaunchDapps = () => {
    setShowLaunchDapps(!showLaunchDapps);
  };
  const closeModal = () => {
    setShowLaunchDapps(false);
  };

  return (
    <main className="items-center justify-center min-h-screen">
      <Navbar />
      <div className="text-white py-20 mx-auto flex flex-col justify-center items-center w-full max-w-screen-xl px-4">
        <div className="flex w-fit h-fit">
          <button 
            onClick={toggleLaunchDapps}
            className="relative br w-full text-white shadow-lg py-3 px-6 transform hover:scale-105 transition-transform duration-300 border-gradient bg-opacity-50 mt-20 mb-5 backdrop-filter backdrop-blur-lg flex items-center justify-center"
          >
            <span className="flex items-center">Launch Custos Dapp</span>
            <Image
              src="/star.png"
              className="absolute w-6 h-8 z-20 animate-star"
              alt="Star Icon"
            />
          </button>
        </div>

        {showLaunchDapps && <ShowLaunchDapps closeModal={closeModal} />}

        <p className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent text-center w-full p-3">
          We are building a safe on the <br /> blockchain for your assets
        </p>

        <div className="flex flex-wrap justify-center space-x-0 space-y-4 sm:space-x-4 sm:space-y-0">
          <div className="max-w-sm w-full sm:w-auto rounded overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center relative m-2">
            <Image
              src="/assets.png"
              alt="Card Image"
              width={400}
              height={200}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto transform hover:scale-105 transition-transform duration-300">
        <div className="flex flex-col md:flex-row justify-between items-center my-32">
          <div className="md:w-1/2 mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent md:text-[50px] text-[30px] text-center md:text-center">
            <p className="mb-12 text-3xl text center">About Custos Diretriz</p>
            <div className="flex justify-center">
              <Image
                src="/ElliH.png"
                alt="Image"
                width={200} // Keep the width smaller for desktop
                height={100} // Keep the height smaller for desktop
                className="w-48 h-auto md:w-32 pt-5 eclipse"
              />
            </div>
          </div>
          <div className="md:w-1/2 max-w-sm mx-auto text-[20px] bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent text-center md:text-left mt-10 md:mt-0">
            <p>
              At Custos Diretriz, we are dedicated to revolutionizing safety and security{" "}
              <br />
              through innovative protocol platforms.
            </p>
            <br />
            <p>
              Our mission is to empower individuals and communities to crime scene witnessing<br />
              and streamline agreement systems.
              
            </p>
          </div>
        </div>
      </div>

      <div className="flex mt-8 items-center justify-center transform hover:scale-105 transition-transform duration-300">
        <div className="text-center p-8 bg-transparent rounded shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent md:text-[50px] text-[30px]">
            <p className="text-3xl mb-4 md:mb-0 mr-2">Our vision</p>
            <div className="flex justify-center">
              <Image
                src="/ElliS.png"
                alt="Image"
                width={200}
                height={100}
                className="w-12 h-auto md:w-32 md:mr-4 mb-4 md:mb-0 pt-8 eclipse"
              />
            </div>
          </div>

          <div className="text-left mt-6">
            {" "}
            {/* Adds some margin above the text paragraphs */}
            <div className="mx-auto text-[20px] bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent text-center">
              <p>
                By leveraging technology and collaboration, we strive to build a world<br />
                where everyone feels empowered to make a <br />
                difference in their communities.
              </p>
              <br />
              <p>
                We envision a safer and more transparent society where individuals<br />
                 have the tools and resources they need to contribute to <br />
                crime prevention and intervention efforts.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center p-8 bg-transparent rounded shadow-lg mt-20 bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
        <p className="mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent md:text-[50px] text-[30px]">
          Meet the team
        </p>
        <p className="text-[20px] mb-4">
          We have an amazing developer team building Custos
        </p>
      </div>

      <div className="flex flex-wrap justify-center space-x-0 space-y-4 sm:space-x-4 sm:space-y-0 p-4">
        {/* Add padding to the outer div */}
        <div className="max-w-sm w-full sm:w-auto rounded overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 border-gradient bg-opacity-50 backdrop-filter backdrop-blur-lg flex flex-col items-center relative m-2 h-72">
          <div className="px-6 py-4 text-center">
            <Image
              src="/jery.png"
              alt="Card Image"
              width={200}
              height={100}
              className="w-full h-40 object-cover"
            />
            <div className="font-bold text-xl mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
              Jeremiah D. Oyeniran
            </div>
            <p className="text-gray-700 text-base bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
              Smart Contract Developer
            </p>
          </div>
        </div>

        <div className="max-w-sm w-full sm:w-auto rounded overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 border-gradient bg-opacity-50 backdrop-filter backdrop-blur-lg flex flex-col items-center relative m-2 h-72">
          <div className="px-6 py-4 text-center">
            <Image
              src="/goodness.png"
              alt="Card Image"
              width={200}
              height={100}
              className="w-full h-40 object-cover"
            />
            <div className="font-bold text-xl mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
              Faith M. Robert
            </div>
            <p className="text-gray-700 text-base bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
              Smart Contract Developer
            </p>
          </div>
        </div>

        <div className="max-w-sm w-full sm:w-auto rounded overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 border-gradient bg-opacity-50 backdrop-filter backdrop-blur-lg flex flex-col items-center relative m-2 h-72">
          <div className="px-6 py-4 text-center">
            <Image
              src="/faith.png"
              alt="Card Image"
              width={200}
              height={100}
              className="w-full h-40 object-cover"
            />
            <div className="font-bold text-xl mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
              Goodness T. Kolapo
            </div>
            <p className="text-gray-700 text-base bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
              Smart Contract Developer
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
        <div className="text-center p-8 bg-transparent rounded shadow-lg mt-20">
          <p className="md:text-[50px] text-[30px] mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
            Reach out to us
          </p>
          <p className="text-[20px] mb-4">
            We paid the price to keep your videos and legal agreements safe.
          </p>
        </div>
        <div className="flex box-btn items-center text-white text-sm mb-10 py-4 px-8 rounded-[100px] bg-[#84c2f513] backdrop-filter backdrop-blur-[10px] hover:bg-[#209af1] transition-colors duration-300 ease-in-out">
          <div className="sh-btn"></div>
          Send Us a Message
          <FaLongArrowAltRight className="ml-2" />
        </div>
      </div>
    </main>
  );
};

export default About;
