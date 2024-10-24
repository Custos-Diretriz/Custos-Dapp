"use client";

import React, { useContext } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { WalletContext } from "./walletprovider";

function ConnectButtoncomponent() {
  const { address, connection, connectWallet, disconnectWallet } =
    useContext(WalletContext);

  const handleConnect = async () => {
    console.log("Attempting to connect wallet...");
    await connectWallet();
  };

  return (
    <div className="justify-end flex max-w-[13em] overflow-hidden w-fit items-end">
      {connection ? (
        <div
          className="cursor-pointer border-gradient py-2 px-4 w-full rounded-full text-[#ededef] bg-gradient-to-r from-[#00A3FF] to-[#0047FF] p-[1px]"
          onClick={disconnectWallet}
        >
          <div className="bg-[#121212] rounded-full py-1 px-3">
            <button
              onClick={disconnectWallet}
              className="w-full bg-transparent rounded-full overflow-hidden text-sm"
            >
              {address}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full backdrop-blur-[10px] bg-gradient-to-r from-[#00A3FF] to-[#0047FF] p-[2px] rounded-[100px]">
          <div className="bg-[#121212] rounded-[100px]">
            <button
              onClick={handleConnect}
              className="flex items-center text-white text-sm py-3 px-6 rounded-[100px] hover:bg-[#209af133] transition-colors duration-300 ease-in-out"
            >
              <span>Connect Wallet</span>
              <FaLongArrowAltRight className="ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConnectButtoncomponent;