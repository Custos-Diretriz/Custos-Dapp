"use client";
import { useState, useEffect, useContext } from "react"; 
import { FiX } from "react-icons/fi"; 
import "../globals.css";
import Footer from "@/components/footer";
import Metadata from "../metadata";
import BackgroundWrapper from "@/components/backgroundwrapper";

import Sidepane from "@/components/dapps/sidepane";
import Header from "@/components/dapps/header";
import Image from 'next/image';
import { WalletContext } from "@/components/walletprovider"; // Import WalletContext

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

  return (
    <div className="flex min-h-[100vh] w-full">
      {/* Sidepane */}
      <Sidepane 
        isOpen={isSidepaneOpen} 
        onClose={() => setSidepaneOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-col w-full h-[100vh] overflow-y-scroll scrollbar-hide md:pl-0">
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
