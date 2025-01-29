"use client";
import React from "react";
import { XIcon } from "@heroicons/react/outline";

const DisconnectModal = ({ isOpen, onClose, onDisconnect }) => {
  if (!isOpen) return null;

  const handleClose = (e) => {
    // Prevent click from bubbling to parent
    e.stopPropagation();
    onClose();
  };

  const handleModalClick = (e) => {
    // Prevent click from bubbling to backdrop
    e.stopPropagation();
  };

  const handleDisconnect = () => {
    onDisconnect();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 h-screen bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="w-full md:w-[500px] bg-[#08001F] text-center border border-[#170F2E] rounded-3xl py-12 px-6 relative"
        onClick={handleModalClick}
      >
        <div className=" flex justify-between items-center">
          <h3 className="text-[18px] lg:text-2xl font-medium text-[#F9F9F9]">
            Disconnect wallet
          </h3>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XIcon className="w-8 h-8" />
          </button>
        </div>

        <div className="py-[30px] px-[16px] lg:py-[81px] lg:px-[55px] my-6">
          <p className="text-[#A199B8] text-sm lg:text-base leading-[22px]">
            You are disconnecting your wallet from Custos Diretriz. Are you sure
            you want to continue with this process?
          </p>
        </div>

        <div className="text-center flex justify-between items-center gap-x-4">
          <button
            className="py-3 text-sm lg:text-base w-[200px] text-center lg:py-4 transition-colors px-10 border-gradient2 rounded-[32px] bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="py-3 text-sm lg:text-base w-[200px] text-center lg:py-4 transition-colors gap-3 px-10 border-gradient2 rounded-[32px] bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
            onClick={handleDisconnect}
          >
            Yes, Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisconnectModal;
