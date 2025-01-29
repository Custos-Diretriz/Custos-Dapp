"use client";
import React, { useContext, useEffect, useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import { padAddress, truncAddress } from "@/utils/serializer";
import Image from "next/image";
import { WalletContext } from "./walletprovider";
import { cn } from "@/lib/utils";

function ConnectButtoncomponent({ open }) {
  const [connected, setConnected] = useState(null);
  const { connection, connectWallet, disconnectWallet, address, wallet } =
    useContext(WalletContext);

  useEffect(() => {
    console.log("connected account; ", address);
    setConnected(wallet);
  }, [wallet, connected, address]);

  const handleEthereumConnect = async (walletType) => {
    try {
      await connectEthereumWallet(walletType);
      setShowConnectModal(false);
    } catch (error) {
      console.error("Error in Ethereum connection:", error);
    }
  };

  return (
    <div className={cn(
      "justify-end flex overflow-hidden items-end",
      open ? "max-w-[13em] w-fit" : "w-10 h-10"
    )}>
      {connected ? (
        <div
          className={cn(
            "cursor-pointer border-gradient2 rounded-full text-[#ededef] p-[1px]",
            open ? "w-full" : "w-10 h-10"
          )}
          onClick={disconnectWallet}
        >
          {open ? (
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
          ) : (
            <div className="w-full h-full bg-[#121212] rounded-full flex items-center justify-center">
              <Image
                className="rounded-full"
                src={generateAvatarURL(address)}
                alt=""
                width={24}
                height={24}
              />
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "backdrop-blur-[10px] border-gradient2 cursor-pointer p-[2px] rounded-[100px]",
            open ? "w-full" : "w-10 h-10"
          )}
          onClick={handleConnect}
        >
          <div className="bg-[#121212] rounded-[100px] h-full">
            {!open ? (
              <div className="w-full h-full flex items-center justify-center text-white">
                <FaLongArrowAltRight className="text-lg" />
              </div>
            ) : (
              <button className="flex items-center text-white text-sm py-3 px-6 rounded-[100px] hover:bg-gradient-to-r from-[#19B1D2] to-[#0094FF] hover:bg-[#209af1] transition-colors duration-300 ease-in-out">
                <span>Connect Wallet</span>
                <FaLongArrowAltRight className="ml-2" />
              </button>
            )}
          </div>
        </div>
      )}

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
    </div>
  );
}

export default ConnectButtoncomponent;

