"use client";
import React, { useContext } from "react";
import Modal from "react-modal";
import { WalletContext } from "./walletprovider";
import { CHAIN_TYPES } from "../lib/chains";

export default function WalletModal() {
  const {
    walletModalOpen,
    closeWalletModal,
    connectWallet,
    methods,
    selectedChain,
  } = useContext(WalletContext);

  const options = [
    {
      key: methods.PRIVY,
      title: "Email, phone or social",
      body: "Creates a secure wallet for you — no extension, no seed phrase. Best on mobile.",
      badge: "Recommended",
      chains: "Celo & other EVM chains",
    },
    {
      key: methods.PRIVY,
      title: "Existing EVM wallet",
      body: "MetaMask, Rainbow, Coinbase Wallet or WalletConnect.",
      chains: "Celo & other EVM chains",
    },
    {
      key: methods.STARKNETKIT,
      title: "Starknet wallet",
      body: "ArgentX, Braavos or Argent Mobile. Uses gasless transactions.",
      chains: "Starknet",
    },
  ];

  return (
    <Modal
      isOpen={walletModalOpen}
      onRequestClose={closeWalletModal}
      ariaHideApp={false}
      className="flex items-center justify-center fixed inset-0 p-4"
      overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
    >
      <div className="w-full max-w-md bg-[#121212] border border-[#2a2a2a] rounded-2xl p-6 text-white">
        <h2 className="text-lg mb-1">Connect to Custos Diretriz</h2>
        <p className="text-xs text-[#19B1D2] mb-5">
          Currently on {selectedChain.name}. You can also keep recording as a
          guest — evidence is anchored onchain either way.
        </p>

        <div className="flex flex-col gap-3">
          {options.map((opt, i) => (
            <button
              key={`${opt.key}-${i}`}
              onClick={() => connectWallet(opt.key)}
              className="text-left p-4 rounded-xl bg-[#1e2f37] hover:bg-[#243a44] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#0094FF]">{opt.title}</span>
                {opt.badge && (
                  <span className="text-[10px] px-2 py-[2px] rounded-full bg-[#0094FF]/20 text-[#0094FF]">
                    {opt.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#EAFBFF] mt-1">{opt.body}</p>
              <p className="text-[10px] text-[#19B1D2] mt-2">{opt.chains}</p>
            </button>
          ))}
        </div>

        <button
          onClick={closeWalletModal}
          className="w-full mt-5 py-3 text-xs text-[#19B1D2] hover:text-white transition-colors"
        >
          Continue as guest
        </button>
      </div>
    </Modal>
  );
}