"use client";
import React, { useContext } from "react";
import { FaArrowRight } from "react-icons/fa";
import { WalletContext } from "./walletprovider";

function ConnectButtoncomponent() {
  const { connection, connectWallet, disconnectWallet } =
    useContext(WalletContext);

  return (
    <div className="hover:cursor-pointer p-[1px] rounded-full bg-gradient-to-r from-[#0094ff] to-[#A02294] text-[#ededef]">
      {connection ? (
        <button
          onClick={disconnectWallet}
          className="w-full bg-black py-2 px-4 rounded-full"
        >
          Disconnect
        </button>
      ) : (
        <button
          onClick={connectWallet}
          className="w-full flex items-center bg-black py-2 px-4 rounded-full"
        >
          <span className="mr-2">Connect Wallet</span>
          <FaArrowRight />
        </button>
      )}
    </div>
  );
}

export default ConnectButtoncomponent;
