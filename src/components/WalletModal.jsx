// WalletModal.jsx
import React from "react";
import Image from "next/image";
import { XIcon } from "@heroicons/react/outline";
import argent from "../../public/argent.svg";
import braavos from "../../public/braavos.svg";
import metamask from "../../public/metamask-icon.svg";
import walletconnect from "../../public/wallet-connect.svg";

const WalletModal = ({
  isOpen,
  onClose,
  onSelectWallet,
  handleEthereumConnect,
}) => {
  if (!isOpen) return null;

  const handleStarknetSelect = async (walletId) => {
    console.log("Selected Starknet wallet:", walletId);
    try {
      await onSelectWallet({ id: walletId });
    } catch (error) {
      console.error("Error in wallet selection:", error);
    }
  };

  return (
    <div className="fixed h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#091219] rounded-lg p-6 md:max-w-[475px] w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-white font-semibold">Connect Wallet</h2>
          <button onClick={onClose} className="hover:text-gray-400 text-white">
            <XIcon className="h-8 w-8" />
          </button>
        </div>

        <div className="flex mt-5 flex-col gap-4">
          <p className=" text-base mb-7">
            Select the wallet you will like to connect
          </p>
          {/* Starknet Section */}
          <div>
            <div className="flex justify-between items-center gap-3">
              <button
                onClick={() => handleStarknetSelect("braavos")}
                className="flex items-center gap-3 w-[200px] py-4 px-10 border-gradient2 rounded-[32px] bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
              >
                <span className="text-sm">Braavos</span>
                <Image
                  src={braavos}
                  alt="Braavos"
                  width={32}
                  height={32}
                  className="ml-1"
                />
              </button>
              <button
                onClick={() => handleStarknetSelect("argentX")}
                className="flex items-center gap-3 w-[200px] py-4 px-10 border-gradient2 rounded-[32px] bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
              >
                <span className="text-sm">Argent X</span>
                <Image
                  src={argent}
                  alt="Argent"
                  width={32}
                  height={32}
                  className=" ml-1"
                />
              </button>
            </div>
          </div>

          {/* Ethereum Section */}
          <div className="border-b border-gray-700 pb-4">
            <div className="flex justify-between items-center gap-3">
              <button
                onClick={() => handleEthereumConnect("metamask")}
                className="flex items-center gap-3 w-[200px] py-4 px-10 border-gradient2 rounded-[32px] bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
              >
                <span className=" text-sm">MetaMask</span>
                <Image
                  src={metamask}
                  alt="MetaMask"
                  width={32}
                  height={32}
                  className="ml-1"
                />
              </button>
              <button
                onClick={() => handleEthereumConnect("walletconnect")}
                className="flex items-center gap-3 w-[200px] py-4 px-10 border-gradient2 rounded-[32px] bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
              >
                <span className=" text-sm">WalletConnect</span>
                <Image
                  src={walletconnect}
                  alt="WalletConnect"
                  width={32}
                  height={32}
                  className="ml-1"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
