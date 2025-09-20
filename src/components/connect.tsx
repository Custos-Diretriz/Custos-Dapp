"use client";
import React, { useContext, useEffect, useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import { padAddress, truncAddress } from "../utils/serializer";
import Image from "next/image";
import { WalletContext } from "./walletprovider";
import WalletModal from "./WalletModal";
import DisconnectModal from "./DisconnectModal";

function ConnectButtonComponent() {
  const [connected, setConnected] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const walletContext = useContext(WalletContext);
  const connection = walletContext?.connection;
  const connectWallet = walletContext?.connectWallet;
  const disconnectWallet = walletContext?.disconnectWallet;
  const address = walletContext?.address;
  const wallet = walletContext?.wallet;

  useEffect(() => {
    setConnected(!!wallet);
  }, [wallet, connected]);

  const handleConnect = async () => {
    await connectWallet?.();
    // setShowConnectModal(true);
  };

  const handleDisconnectClick = () => {
    setShowDisconnectModal(true);
  };

  // const handleStarknetSelect = async (selectedWallet) => {
  //   try {
  //     await connectStarknetWallet(selectedWallet.id);
  //     setShowConnectModal(false);
  //   } catch (error) {
  //     console.error("Error in Starknet selection:", error);
  //   }
  // };

  // const handleEthereumConnect = async (walletType) => {
  //   try {
  //     await connectEthereumWallet(walletType);
  //     setShowConnectModal(false);
  //   } catch (error) {
  //     console.error("Error in Ethereum connection:", error);
  //   }
  // };

  return (
    <>
      <div className="justify-end flex max-w-[13em] overflow-hidden w-fit items-end">
        {connected ? (
          <div
            className="cursor-pointer border-gradient2 w-full rounded-full text-[#ededef] p-[1px]"
            onClick={handleDisconnectClick}
          >
            <div className="bg-[#121212] border-gradient2 rounded-full py-2 px-3 flex gap-2">
              <Image
                className="rounded-full"
                src={generateAvatarURL(address || "")}
                alt=""
                width={24}
                height={24}
              />
              <span className="w-full bg-transparent rounded-full overflow-hidden text-sm">
                {truncAddress(address || "")}
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

      {/* Connect Modal */}
      <WalletModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        // onSelectWallet={handleStarknetSelect}
        // handleEthereumConnect={handleEthereumConnect}
      />

      {/* Disconnect Modal */}
      <DisconnectModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onDisconnect={() => disconnectWallet?.()}
      />
    </>
  );
}

export default ConnectButtonComponent;