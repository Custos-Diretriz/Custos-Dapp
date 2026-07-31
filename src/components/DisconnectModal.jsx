"use client";
import React, { useEffect } from "react";
import { XIcon } from "@heroicons/react/outline";

const DisconnectModal = ({ isOpen, onClose, onDisconnect, address }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleModalClick = (e) => e.stopPropagation();

  const handleDisconnect = () => {
    onDisconnect();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Disconnect wallet"
    >
      <div
        className="w-full max-w-lg rounded-t-3xl border border-[#170F2E] bg-[#08001F] px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-5 sm:rounded-3xl sm:px-8 sm:pb-8 sm:pt-6"
        onClick={handleModalClick}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-medium text-[#F9F9F9] lg:text-2xl">
            Disconnect wallet
          </h3>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="-mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-xl text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="my-6 space-y-3">
          <p className="text-sm leading-relaxed text-[#A199B8] lg:text-base">
            You are disconnecting your wallet from Custos Diretriz. Are you sure
            you want to continue?
          </p>
          {address && (
            <p className="break-all rounded-xl bg-white/[0.04] px-3 py-2 text-[11px] text-[#19B1D2]">
              {address}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            className="border-gradient2 h-12 flex-1 rounded-[32px] bg-[#1a1a1a] text-sm text-white transition-colors hover:bg-[#2a2a2a] lg:text-base"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="border-gradient2 h-12 flex-1 rounded-[32px] bg-[#1a1a1a] text-sm text-white transition-colors hover:bg-[#2a2a2a] lg:text-base"
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
