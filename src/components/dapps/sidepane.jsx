import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import ConnectButtoncomponent from "@/components/connect";

const Sidepane = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/",
      text: "Home",
    },
    {
      href: "/company",
      text: "Company",
    },
    {
      href: "/agreement/create",
      text: "Agreement",
      icon: "/Plus.svg"
    },
    {
      href: "/crimerecorder",
      text: "Videos",
      icon: "/cameraicon.svg"
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen w-full md:w-[300px] flex flex-col
          md:bg-black
          backdrop-blur-xl md:backdrop-blur-none
          bg-white/5
          transition-all duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >

        <div className="absolute inset-0 md:hidden bg-gradient-to-b from-white/10 to-transparent opacity-20" />
        <div className="relative flex flex-col h-full p-8">
          {/* Logo */}
          <div className="w-full flex justify-center md:justify-start mb-16">
            <Link href="/" className="w-auto" onClick={onClose}>
              <Image 
                src="/logo.png" 
                alt="logo" 
                width={232.7} 
                height={22} 
                priority 
                className="transition-opacity hover:opacity-80"
              />
            </Link>
          </div>

          {/* Navlinks */}
          <div className="flex flex-col gap-6 justify-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`group relative
                    ${isActive ? 'text-[#00A3FF]' : 'text-white hover:text-[#00A3FF]'}`}
                >
                  {/* Mobile layout */}
                  <div className="md:hidden">
                    <div className={`flex items-center justify-center p-4 rounded-xl`}>
                      <span className="font-medium text-lg">{link.text}</span>
                      {link.icon && (
                        <div className="p-2 rounded-lg">
                          <Image 
                            src={link.icon} 
                            alt="" 
                            width={24} 
                            height={24} 
                            className="transition-transform group-hover:scale-110"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:flex items-center justify-between w-full p-2">
                    <span className="font-medium text-lg">{link.text}</span>
                    {link.icon && (
                      <Image 
                        src={link.icon} 
                        alt="" 
                        width={20} 
                        height={20}
                        className="transition-transform group-hover:scale-110" 
                      />
                    )}
                  </div>

                  {/* Active- Desktop indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00A3FF] rounded-r hidden md:block" />
                  )}
                </Link>
              );
            })}

            {/* Connect Wallet Button - Mobile */}
            <div className="md:hidden flex justify-center">
              <div className="p-4 rounded-x">
                <ConnectButtoncomponent />
              </div>
            </div>
          </div>

          {/* Connect Wallet Button - Desktop */}
          <div className="hidden md:block w-full mt-auto">
            <ConnectButtoncomponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidepane;