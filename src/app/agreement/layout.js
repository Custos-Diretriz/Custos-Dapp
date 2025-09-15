"use client";
import { useState, useEffect } from "react";
import { FiX, FiMenu } from "react-icons/fi";
import "../globals.css";
import Header from "../../components/dapps/header";
import Sidepane from "../../components/dapps/sidepane";

export default function RootLayout({ children }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => {
    if (isMobile) {
      setMobileOpen(!isMobileOpen);
    } else {
      setCollapsed(!isCollapsed);
    }
  };

  useEffect(() => {
    if (isMobile && isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileOpen, isMobile]);

  return (
    <div className="flex min-h-screen w-full">
      

      {/* Mobile Overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity 
            ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMobileOpen(false)}
        />
      )}

      
      
<div className={`
        fixed md:relative h-full z-50
        ${isMobile ? 
          `transform transition-transform duration-300 w-64
           ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}` 
          : 
          `transition-all duration-300 
           ${isCollapsed ? 'w-0' : 'w-fit'}`
        }`}
      >
        <Sidepane 

        />
      </div>

      {/* Main Content */}
      <div className={`flex flex-col w-full`}
      >
        {/* Header with spacing for fixed button */}
        <div className="fixed w-full right-0 top-0 z-30 p-2 n flex">
          <Header />
          <button
        onClick={toggleMenu}
        className="z-30 top-4 left-4 w-fit bg-inherit backdrop-blur"
        aria-label={isMobile ? "Toggle menu" : "Collapse menu"}
      >
        {isMobile ? (
          isMobileOpen ? <FiX className="w-8 h-8 text-[#ffffff]" /> : <FiMenu className="w-8 h-8 text-[#ffffff]" />
        ): ''}
      </button>
        </div>

        <div className="w-full items-center mt-20 px-3 flex justify-center m-auto">{children}</div>
      </div>
    </div>
  );
}