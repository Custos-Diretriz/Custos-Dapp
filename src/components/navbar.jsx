"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaChevronDown,
  FaArrowRight,
  FaPlus,
  FaVideo,
  FaUser,
  FaUserPlus,
  FaPhone,
} from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import ConnectButtoncomponent from "./connect";

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
      <nav className="py-[2rem] pr-[4rem] pl-[1rem] z-50 fixed top-0 w-full ">
        <div className="w-full mx-auto">
          <div className="flex justify-around items-center">
            <div className="">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={250}
                  height={50}
                  className="rounded-lg"
                />
              </Link>
            </div>
            <div className="hidden lg:flex items-center">
              <ul className="flex gap-[3rem] items-center">
                <li>
                  <button
                    onClick={toggleLaunchDapps}
                    className="text-white hover:text-[#c92eff] flex items-center"
                  >
                    Launch Dapps
                    <FaChevronDown className="w-5 h-5 ml-1" />
                  </button>
                </li>

                <li>
                  <button
                    onClick={toggleCompany}
                    className="text-white hover:text-[#c92eff] flex items-center"
                  >
                    Company
                  </button>
                </li>
              </ul>
            </div>
            <div className="flex items-center space-x-4">
              <div className="lg:hidden flex items-center">
                <button onClick={toggleMenu}>
                  {isMenuOpen ? (
                    <AiOutlineClose className="text-white w-6 h-6" />
                  ) : (
                    <AiOutlineMenu className="text-white w-6 h-6" />
                  )}
                </button>
              </div>
              <div className="hidden lg:block">
                <ConnectButtoncomponent />
              </div>
            </div>
          </div>
          {isMenuOpen && (
            <div className="lg:hidden bg-black bg-opacity-80 p-4">
              <ul className="flex flex-col space-y-4 mt-4">
                <li>
                  <button
                    onClick={toggleLaunchDapps}
                    className="text-white hover:text-[#c92eff] flex items-center justify-between w-full"
                  >
                    Launch Dapps
                  </button>
                </li>
                <li>
                  <button
                    onClick={toggleCompany}
                    className="text-white hover:text-[#c92eff] flex items-center justify-between"
                  >
                    Company
                  </button>
                </li>
                <li className="self-center">
                  <ConnectButtoncomponent />
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

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
                Decentralized apps help you leverage blockchain technology to
                secure your evidence and legal agreements.
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
            <a href="/agreement" className="text-white mb-4 z-[100] w-full hover:bg-[#015A9B] sm:p-4 rounded-lg cursor-pointer">
              <p className="flex items-center text-xl font-semibold">
                <FaPlus className="mr-2" />
                Create Agreement
              </p>
              <p className="text-gray-300 mt-1">
                Custos ensures that agreements are securely stored.
              </p>
            </a>
            
            
                <a href="/crimerecorder" className="text-white mb-4 z-[100] hover:bg-[#015A9B] sm:p-4 rounded-lg cursor-pointer">
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

      {showCompany && (
        <div className="sm:fixed absolute inset-0 z-50  flex items-center justify-center bg-[#00000098] bg-opacity-90 ">
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
                <p className="text-3xl text-white">Invulnerable</p>
                <p className="my-4 text-gray-300">
                  Custos Diretriz is mastering the art of preservation and
                  shielding on the blockchain.
                </p>
                <Link
                  href="#"
                  className="mt-4 text-gray-300 z-[100] hover:bg-[#015A9B] flex items-center"
                >
                  Join the Community
                  <FaArrowRight className="ml-1" />
                </Link>
                <Link
                  href="#"
                  className="mt-2 text-gray-300 z-[100] hover:bg-[#015A9B] flex items-center"
                >
                  Learn More About Custos
                  <FaArrowRight className="ml-1" />
                </Link>
              </div>
              <Image
                src="/gifs/company.gif"
                alt="gif"
                width={400}
                height={100}
                className="rounded-lg "
              />
            </div>


                    <div className="flex flex-col gap-4 sm:gap-4 m-auto w-full p-0 rounded-lg md:h-auto bg-[#091219]">


                  <Link href="/about" className="text-white z-[100] hover:bg-[#015A9B] rounded-lg w-full items-center p-2">
              
                <p className="flex sm:text-xl gap-4 sm:gap-6 h-full font-semibold text-white ">
                <img
                src="/about.svg"
                alt="about"
                className="rounded-lg h-fit p-1 w-[2em]"
              />
                    <p className="flex flex-col ">
                      About Us
                <p className="text-gray-300 text-[0.8em] mt-1 font-thin">
                  Get to know the team behind Custos
                </p>
                      </p>
                </p>
                  </Link>





                  <Link href="#" className="text-white z-[100] hover:bg-[#015A9B] rounded-lg w-full items-center p-2">
              
                <p className="flex sm:text-xl gap-4 sm:gap-6 h-full font-semibold text-white ">
                <img
                src="/careers.svg"
                alt="careers"
                className="rounded-lg h-fit w-[2em]"
              />
                    <p className="flex flex-col ">
                      Careers
                <p className="text-gray-300 text-[0.8em] mt-1 font-thin">
                  Find your dream role
                </p>
                      </p>
                </p>
                  </Link>



                  <Link href="#" className="text-white z-[100] hover:bg-[#015A9B] rounded-lg w-full items-center p-2">
              
                  <p className="flex sm:text-xl gap-4 sm:gap-6 h-full font-semibold text-white ">
                <img
                src="/call.svg"
                alt="call"

                className="rounded-lg h-fit w-[2em]"
              />
                    <p className="flex flex-col ">
                      Contact Us
                <p className="text-gray-300 text-[0.8em] mt-1 font-thin">
                  Reach out to us for questions and clarifications
                </p>
                      </p>
                </p>
                  </Link>



            </div>


          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
