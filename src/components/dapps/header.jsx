import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import ConnectButtoncomponent from "@/components/connect";
import { UseReadContractData } from "@/utils/fetchcontract";
import NotificationsDropdown from "@/app/agreement/components/notificationsDropdown";
import Image from 'next/image';

export const Header = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { fetchData } = UseReadContractData();

  const [notificationDropDowm, showNotificationDropDowm] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle(newState);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSearchResult(null);

    try {
      const agreementId = parseInt(searchTerm, 10);
      if (isNaN(agreementId)) {
        throw new Error("Please enter a valid agreement ID (number)");
      }

      const result = await fetchData("agreement", "get_agreement_details", [
        { low: agreementId, high: 0 },
      ]);
      setSearchResult(result);
    } catch (err) {
      setError(err.message || "An error occurred while searching");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backdrop-blur flex items-center justify-between w-full px-4 sm:py-4 py-6">
      {/* Logo on the left */}
      <div className="flex items-center md:hidden">
        <a href="/">
          <Image src="/logo.png" alt="Logo" width={250} height={250} />
        </a>
      </div>

      {/* Main Header Content */}
      <div className="flex items-center justify-between flex-grow w-full">
        {/* Search Input */}
        <div className="relative mx-auto max-w-md w-full hidden md:block">
          <input
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1E1E1E] text-white border border-gray-600 rounded-full focus:outline-none focus:border-[#00A3FF]"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Image src="/search-normal.svg" alt="Search" width={24} height={24} />
          </div>
        </div>

        <div className="flex items-center space-x-7 relative">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-white hidden md:block"
          >
            <Image src="/darkmodeicon.svg" alt="Dark Mode" width={24} height={24} />
          </button>
          {/* Notification  Bell*/}
          <button
            className={`text-white hidden md:block rounded-md  p-[2px] hover:bg-[#2c2c2c] ${
              notificationDropDowm ? "border  border-blue-400" : ""
            }`}
            onClick={() => showNotificationDropDowm(!notificationDropDowm)}
          >
            <Image src="/bell.svg" alt="Bell" width={24} height={24} />
            <div className="rounded-full flex items-center justify-center w-[2em] h-[1em] text-[10px] bg-red-500 absolute"
            width={24} height={24}>
              5
            </div>
          </button>
          {/* Notification Dropdown Container */}
          <NotificationsDropdown notificationDropDowm={notificationDropDowm} />

          <div className="block">
            <ConnectButtoncomponent open={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
