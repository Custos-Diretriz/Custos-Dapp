// WalletModal.jsx
import React from "react";
import Image from "next/image";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#121212] rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-white font-semibold">Connect Wallet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ×
          </button>
        </div>

        <div className="flex mt-36 flex-col gap-4">
          {/* Ethereum Section */}
          <div className="border-b mt-20 border-gray-700 pb-4">
            <h3 className="text-white mb-3">Ethereum Wallets</h3>
            <div className="grid gap-3">
              <button
                onClick={() => handleEthereumConnect("metamask")}
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
              >
                <img src="/metamask.svg" alt="MetaMask" className="w-6 h-6" />
                <span>MetaMask</span>
              </button>
              <button
                onClick={() => handleEthereumConnect("walletconnect")}
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
              >
                <img
                  src="/walletconnect.svg"
                  alt="WalletConnect"
                  className="w-6 h-6"
                />
                <span>WalletConnect</span>
              </button>
            </div>
          </div>

          {/* Starknet Section */}
          <div>
            <h3 className="text-white mb-3">Starknet Wallets</h3>
            <div className="grid gap-3">
              <button
                onClick={() => handleStarknetSelect("argentX")}
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
              >
                <img src="/argent.svg" alt="Argent" className="w-6 h-6" />
                <span>Argent X</span>
              </button>
              <button
                onClick={() => handleStarknetSelect("braavos")}
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
              >
                <img src="/braavos.svg" alt="Braavos" className="w-6 h-6" />
                <span>Braavos</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
