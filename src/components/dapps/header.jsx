import Image from "next/image";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import ConnectButtoncomponent from "@/components/connect";
import { UseReadContractData } from '@/utils/fetchcontract'

export const Header = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { fetchData } = UseReadContractData();

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
    setError('');
    setSearchResult(null);

    try {
      const agreementId = parseInt(searchTerm, 10);
      if (isNaN(agreementId)) {
        throw new Error('Please enter a valid agreement ID (number)');
      }

      const result = await fetchData('agreement', 'get_agreement_details', [{ low: agreementId, high: 0 }]);
      setSearchResult(result);
    } catch (err) {
      setError(err.message || 'An error occurred while searching');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between w-full px-4 sm:py-4 py-6 bg-transparent">
      {/* Logo on the left */}
      <div className="flex items-center md:hidden">
        <a href="/"><Image src="/logo.png" alt="Logo" width={250} height={250} /></a>
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
            <img src="/search-normal.svg" alt="Search" className="w-5 h-5" />
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center space-x-7">
          <button onClick={toggleDarkMode} className="text-white hidden md:block">
            <img src="/darkmodeicon.svg" alt="Dark Mode" className="w-5 h-5" />
          </button>
          <button className="text-white hidden md:block">
            <img src="/bell.svg" alt="Notifications" className="w-5 h-5" />
          </button>
          <div className="hidden md:block">
            <ConnectButtoncomponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
