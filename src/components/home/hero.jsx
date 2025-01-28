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

  // Define cardsData array inside the Hero component
  const cardsData = [
    {
      src: "/image_fx_3.png",
      title: "Agreement documentation",
      description: "Custos’ smart agreement management will secure your signed documents transparently.",
    },
  ];

  const Card = ({ src, title, description }) => (
    <div
      className="transform transition-transform duration-300 hover:scale-110 hover:z-10 backdrop-filter backdrop-blur-[10px] bg-[#030D1B] shadow-lg rounded-lg w-full md:w-[780px] h-auto md:h-[380px] sm:w-full"
      style={{
        borderRadius: "20px",
        border: "0.5px solid rgba(255, 255, 255, 0.1)",
        margin: '0 auto',
        // This controls the width of the card. You can adjust it for different breakpoints below.
      }}
    >
      <div className="flex flex-col sm:flex-row items-stretch justify-start h-full w-full">
        {/* Image Section */}
        <div className="w-full sm:w-[45%] h-auto sm:h-full">
          <Image
            src={src}
            alt={title}
            width={388} // Image width will be 55% of the card width on larger screens
            height={380}
            objectFit="cover"
            className="will-change-auto rounded-t-[20px] sm:rounded-l-[20px] sm:rounded-tr-none sm:rounded-b-none w-full h-full"

          />
        </div>
  
        {/* Text Section */}
        <div className="flex flex-col justify-center items-center sm:items-start p-6 w-full sm:w-[45%] h-auto sm:h-full">
          <div className="w-12 h-12 flex items-center justify-center bg-[#A02294] rounded-full mb-4 mx-auto sm:mx-0">
            <img src="/star.png" alt="" className="w-6 h-6" />
          </div>
          <div className="font-bold text-lg sm:text-xl mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent text-center sm:text-left">
            {title}
          </div>
          <p className="text-gray-300 text-sm sm:text-base w-full sm:w-[90%] text-center sm:text-left">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
  

  return (
    <main
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: 'url("./patterns.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
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
          <TracingBeam>
            <div className="flex flex-wrap md:flex-row w-full gap-6 justify-center">
              {/* First and Second Cards */}
              {["/image_fx_ (1).png", "/image_fx_2.png"].map((src, index) => (
                <div
                  key={index}
                  className="transform transition-transform duration-300 hover:scale-110 hover:z-10 backdrop-filter backdrop-blur-[10px] bg-[#030D1B] shadow-lg rounded-lg"
                  style={{
                    width: "388px",
                    height: "380px",
                    borderRadius: "20px",
                    border: "0.5px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="flex flex-col items-center h-full">
                    <div className="h-[70%] w-full">
                      <Image
                        src={src}
                        alt="Card Image"
                        layout="responsive"
                        width={388}
                        height={200}
                        className="will-change-auto object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center h-[30%] text-center">
                      <div className="font-bold text-[1.2em] mb-2 bg-gradient-to-r from-[#0094FF] to-[#A02294] bg-clip-text text-transparent">
                        {index === 0
                          ? "Crime scene recorder"
                          : "A very secure blockchain safe"}
                      </div>
                      <p className="text-gray-700 text-[0.8em] w-[80%] bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
                        {index === 0
                          ? "We are providing a decentralized crime recorder. Videos on Custos are transparent."
                          : "Leveraging Starknet’s advanced technology for unparalleled security, we built a safe for agreements and videos."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Third Card */}
              <div className="flex justify-center w-full mt-6">
                {cardsData.map((card, index) => (
                  <Card
                    key={index}
                    src={card.src}
                    title={card.title}
                    description={card.description}
                    // Optional props for Card component to control width
                cardWidth="md:w-[65%]" // Adjust width for medium screens and up
                cardMaxWidth="350px" // Set a maximum width for responsiveness
                  />
                ))}
              </div>
            </div>
          </TracingBeam>
        </div>
      </div>
    </main>
  );
};

export default Hero;
