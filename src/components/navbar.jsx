"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronDown, FaArrowRight, FaPlus, FaVideo } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import ConnectButtoncomponent from "./connect";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

const Navbar = () => {
  const [showLaunchDapps, setShowLaunchDapps] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLaunchDapps = () => {
    setShowLaunchDapps(!showLaunchDapps);
  };

  const toggleCompany = () => {
    setShowCompany(!showCompany);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeModal = () => {
    setShowLaunchDapps(false);
    setShowCompany(false);
  };

  return (
    <>
      <nav className="mx-2  md:mx-8 my-4 glass-b bg-[#2749626b] rounded-full border-[0.5px] border-[#ffffff44] py-4 nav-shadow">
        <div className="w-full mx-auto px-4">
          <div className="flex justify-between  md:justify-around items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="block">
                <Image
                  src="/logo-new.svg"
                  alt="Logo"
                  width={250}
                  height={50}
                  className="rounded-lg w-[150px] md:w-[250px]"
                  priority
                />
              </Link>
            </div>

            <div className="hidden lg:flex items-center">
              <ul className="flex gap-12 items-center">
                <li>
                  <a
                    href="/agreement"
                    className="text-white hover:text-[#c92eff] transition-colors duration-200"
                  >
                    Create Agreement
                  </a>
                </li>
                <li>
                  <a
                    href="/crimerecorder"
                    className="text-white hover:text-[#c92eff] transition-colors duration-200"
                  >
                    Crime Recorder
                  </a>
                </li>
                <li>
                  <button
                    onClick={toggleCompany}
                    className="text-white hover:text-[#c92eff] transition-colors duration-200"
                  >
                    Company
                  </button>
                </li>
                <li>
                  <button className="text-white hover:text-[#c92eff] transition-colors duration-200">
                    Services
                  </button>
                </li>
              </ul>
            </div>

            <div className="hidden md:block">
              <HoverBorderGradient
                containerClassName="rounded-full group"
                as="button"
                className="dark:bg-black bg-[#0495F8] px-8 py-3 text-[white] dark:text-white flex items-center space-x-2 
               transition-transform duration-300 ease-out hover:scale-105 hover:shadow-lg"
              >
                <span>Get Started</span>
                <FaArrowRight className="ml-1 rotate-[-35deg] transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:rotate-0" />
              </HoverBorderGradient>
            </div>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-[#ffffff1a] rounded-lg transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <AiOutlineClose className="text-white w-6 h-6" />
              ) : (
                <AiOutlineMenu className="text-white w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="fixed left-0 right-0 top-20 md:hidden bg-[#000000ee] p-4 mt-4 rounded-lg shadow-lg z-50">
              <div className="flex flex-col space-y-4">
                <a
                  href="/agreement"
                  className="text-white hover:text-[#c92eff] py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Create Agreement
                </a>
                <a
                  href="/crimerecorder"
                  className="text-white hover:text-[#c92eff] py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Crime Recorder
                </a>
                <button
                  onClick={toggleCompany}
                  className="text-white hover:text-[#c92eff] py-2 px-4 rounded-lg text-left transition-colors duration-200"
                >
                  Company
                </button>
                <button className="text-white hover:text-[#c92eff] py-2 px-4 rounded-lg text-left transition-colors duration-200">
                  Services
                </button>
                <div className="pt-4 border-t border-gray-700">
                  <ConnectButtoncomponent />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {showCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000ee] bg-opacity-90">
          <div className="relative bg-[#091219] rounded-lg shadow-lg border-gradient md:w-[50%] w-full p-6">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <AiOutlineClose className="w-6 h-6" />
            </button>
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl text-white font-bold">Company</h2>
              <Link
                href="/about"
                className="text-white hover:text-[#c92eff] transition-colors duration-200"
              >
                About Us
              </Link>
              <Link
                href="#"
                className="text-white hover:text-[#c92eff] transition-colors duration-200"
              >
                Careers
              </Link>
              <Link
                href="#"
                className="text-white hover:text-[#c92eff] transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
