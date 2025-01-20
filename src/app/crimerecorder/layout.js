"use client";
import { useState, useEffect } from "react"; 
import { FiX } from "react-icons/fi"; 
import "../globals.css";

import Sidepane from "@/components/dapps/sidepane";
import Header from "@/components/dapps/header";
import Image from 'next/image';

export default function RootLayout({ children }) {
  const [isSidepaneOpen, setSidepaneOpen] = useState(false); // State to toggle sidepane

  // Function to toggle sidepane visibility
  const toggleSidepane = (e) => {
    e.stopPropagation(); // Stop event propagation
    setSidepaneOpen(!isSidepaneOpen);
  };

  // Effect to disable scrolling when sidepane is open
  useEffect(() => {
    if (isSidepaneOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidepaneOpen]);

  // Function to close sidepane if clicked outside
  const handleOutsideClick = (e) => {
    console.log("triggered");
    if (!e.target.closest(".sidepane")) {
      setSidepaneOpen(false);
    }
  };



  return (
    <div
      className={`flex min-h-[100vh] w-full relative ${
        isSidepaneOpen ? "sidepane-open backdrop-blur-lg" : ""
      }`}
      onClick={handleOutsideClick}
    >
      {/* Sidepane */}
      <div
        className={`w-fit ${
          isSidepaneOpen ? "sticky" : "hidden"
        } min-h-screen z-20 md:flex top-0 left-0 sidepane sticky`}
      >
        <Sidepane 
        isOpen={isSidepaneOpen}
        onClose={() => setSidepaneOpen(false)}
        />
      </div>

      {/* Main content area */}
      <div
        className={`flex flex-col w-full h-[100vh] overflow-y-scroll scrollbar-hide md:pl-0 ${
          isSidepaneOpen ? "backdrop-blur-lg" : ""
        }`}
      >
        {/* Header */}
        <div className="flex w-full sticky top-0 z-[400]">
          <Header />
          <button className="md:hidden z-30" onClick={(e) => toggleSidepane(e)}>
            {isSidepaneOpen ? (
              <FiX size={40} className="text-[#afb9c0e1]" />
            ) : (
              <Image src="/hamburger.svg" alt="Menu" width={50} height={20} />
            )}
          </button>
        </div>

        {/* Children Content */}
        <div className="flex flex-col p-3 w-full mb-10">{children}</div>
        
      </div>
    </div>
  );
}
