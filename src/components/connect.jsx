"use client";
import React, { useContext, useEffect, useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import { padAddress, truncAddress } from "@/utils/serializer";
import Image from "next/image";
// import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
// import { connect, useStarknetkitConnectModal } from "starknetkit";
// import { useNotification } from "@/context/NotificationProvider";
import { connects, WalletContext } from "./walletprovider";
import { cn } from "@/lib/utils";

function ConnectButtoncomponent({ open }) {
  const [connected, setConnected] = useState(null);
  const { connection, connectWallet, disconnectWallet, address, wallet } =
    useContext(WalletContext);


  useEffect(() => {
    setConnected(!!address);
  }, [address, wallet]);

  const handleConnect = () => {
    setShowConnectModal(true);
  };

  const handleDisconnectClick = () => {
    setShowDisconnectModal(true);
  };

  const handleStarknetSelect = async (selectedWallet) => {
    try {
      await connectStarknetWallet(selectedWallet.id);
      setShowConnectModal(false);
    } catch (error) {
      console.error("Error in Starknet selection:", error);
    }
  };

  const handleEthereumConnect = async (walletType) => {
    try {
      await connectEthereumWallet(walletType);
      setShowConnectModal(false);
    } catch (error) {
      console.error("Error in Ethereum connection:", error);
    }
  };

  return (
    <div
      className={cn(
        "justify-end flex overflow-hidden items-end",
        open ? "max-w-[13em] w-fit" : "w-10 h-10"
      )}
    >
      {connected ? (
        <div
          className={cn(
            "cursor-pointer border-gradient2 rounded-full text-[#ededef] p-[1px]",
            open ? "w-full" : "w-10 h-10"
          )}
          onClick={disconnectWallet}
        >
          <div className="bg-[#121212] border-gradient2 rounded-full py-2 px-3 flex gap-2">
            <Image
              className="rounded-full"
              src={generateAvatarURL(address)}
              alt=""
              width={24}
              height={24}
            />
            {open && (
              <span className="w-full bg-transparent rounded-full overflow-hidden text-sm">
                {truncAddress(address)}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div
          className="w-full backdrop-blur-[10px] border-gradient2 cursor-pointer p-[2px] rounded-[100px]"
          onClick={handleConnect}
        >
          <div className="bg-[#121212] rounded-[100px] flex justify-center items-center">
            <button className="flex items-center justify-center text-white text-sm py-3 px-6 rounded-[100px] hover:bg-gradient-to-r from-[#19B1D2] to-[#0094FF] hover:bg-[#209af1] transition-colors duration-300 ease-in-out">
              {open && <span>Connect Wallet</span>}
              <FaLongArrowAltRight className={open ? "ml-2" : ""} />
            </button>

          </div>
        )}
      </div>

      {/* Connect Modal */}
      <WalletModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onSelectWallet={handleStarknetSelect}
        handleEthereumConnect={handleEthereumConnect}
      />

      {/* Disconnect Modal */}
      <DisconnectModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onDisconnect={disconnectWallet}
      />
    </>
  );
}


export default ConnectButtonComponent;
