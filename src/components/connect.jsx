"use client";
import React, { useContext, useEffect, useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import { padAddress, truncAddress } from "@/utils/serializer";
import Image from "next/image";
import { WalletContext } from "./walletprovider";
import WalletModal from "./WalletModal";

function ConnectButtonComponent() {
  const [connected, setConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {
    wallet,
    connectStarknetWallet,
    connectEthereumWallet,
    disconnectWallet,
    address,
    walletType,
  } = useContext(WalletContext);

  useEffect(() => {
    setConnected(!!address);
  }, [address, wallet]);

  const handleConnect = () => {
    setShowModal(true);
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const handleStarknetSelect = async (selectedWallet) => {
    console.log("Handling Starknet wallet selection:", selectedWallet);
    try {
      await connectStarknetWallet(selectedWallet.id);
      setShowModal(false);
    } catch (error) {
      console.error("Error in Starknet selection:", error);
    }
  };

  const handleEthereumConnect = async (walletType) => {
    try {
      await connectEthereumWallet(walletType);
      setShowModal(false);
    } catch (error) {
      console.error("Error in Ethereum connection:", error);
    }
  };

  return (
    <>
      <div className="justify-end flex max-w-[13em] overflow-hidden w-fit items-end">
        {connected ? (
          <div
            className="cursor-pointer border-gradient2 w-full rounded-full text-[#ededef] p-[1px]"
            onClick={handleDisconnect}
          >
            <div className="bg-[#121212] border-gradient2 rounded-full py-2 px-3 flex gap-2">
              <Image
                className="rounded-full"
                src={generateAvatarURL(address)}
                alt=""
                width={24}
                height={24}
              />
              <span className="w-full bg-transparent rounded-full overflow-hidden text-sm">
                {truncAddress(address)}
              </span>
            </div>
          </div>
        ) : (
          <div
            className="w-full backdrop-blur-[10px] border-gradient2 cursor-pointer p-[2px] rounded-[100px]"
            onClick={handleConnect}
          >
            <div className="bg-[#121212] rounded-[100px]">
              <button className="flex items-center text-white text-sm py-3 px-6 rounded-[100px] hover:bg-gradient-to-r from-[#19B1D2] to-[#0094FF] hover:bg-[#209af1] transition-colors duration-300 ease-in-out">
                <span>Connect Wallet</span>
                <FaLongArrowAltRight className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>

      <WalletModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelectWallet={handleStarknetSelect}
        handleEthereumConnect={handleEthereumConnect}
      />
    </>
  );
}

export default ConnectButtonComponent;
