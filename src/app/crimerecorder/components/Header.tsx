import Image from "next/image";
import React, { useState } from "react";
import logo from "../../../../public/CustosLogo.png";
import icon from "../../../../public/cameraicon.svg";
import bg from "../../../../public/Rectangle.png";
import { FaBars, FaTimes } from 'react-icons/fa'; // Import both hamburger and X icons
import Link from "next/link";
import ConnectButtoncomponent from "../../../components/connect";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle menu visibility

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); // Toggle menu state
  };

  return (
    <div className="z-50 bg-[#ffffff0a] backdrop-filter backdrop-blur-[10px] fixed top-0 w-full px-10">
      <div className="flex justify-between items-center px-4">
        <Link href={`/`}>
          <Image src={logo} alt="logo" width={232.7} height={22} />
        </Link>
  
        {/* Hamburger or X icon using React Icons */}
        <button className="sm:hidden block" onClick={toggleMenu}>
          {menuOpen ? (
            <FaTimes className="h-6 w-6 text-white" />  // X icon when menu is open
          ) : (
            <FaBars className="h-6 w-6 text-white" />  // Hamburger icon when menu is closed
          )}
        </button>
  
        {/* Menu content hidden on mobile, visible on larger screens */}
        <div className="hidden sm:flex flex-row items-center gap-4">
          <button className="bg-[#0094FF] rounded-full p-[0.2rem]">
            <span
              className="flex justify-between items-center gap-2 rounded-full shadow-[#A02294_2px_1px_2px_0.2px] w-full h-full py-2 sm:py-4 px-6 sm:px-10"
              style={{
                backgroundColor: "#1e2f37",
                backgroundImage: `url(${bg.src})`,
                backgroundSize: "contain",
              }}
            >
              <Link href={`/crimerecorder/video`} className="text-white text-sm sm:text-base">
                Record a Video
              </Link>
              <Image src={icon} alt="camera icon" width={24} height={24} />
            </span>
          </button>
          <ConnectButtoncomponent />
        </div>
      </div>
  
      {/* Toggleable menu content for mobile */}
      {menuOpen && (
        <div className="sm:hidden bg-[#ffffff0a] backdrop-filter backdrop-blur-[10px] fixed top-16 left-0 w-full px-4 py-4 flex flex-col items-start gap-4">
          <Link href={`/crimerecorder/video`} className="text-white text-lg">
            Record a Video
          </Link>
          <ConnectButtoncomponent />
        </div>
      )}
  
      <div className="text-white text-xl sm:text-2xl text-center sm:text-left mt-10">
        Crime Recorder
      </div>
    </div>
  );
};
