"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import { WalletContext } from "./walletprovider";

export default function ChainSelector({ compact = false }) {
  const { selectedChain, switchChain, chains, switching } =
    useContext(WalletContext);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSelect = async (key) => {
    setOpen(false);
    await switchChain(key);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={switching}
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer border-gradient2 rounded-full text-[#ededef] p-[1px] disabled:opacity-60"
      >
        <div className="bg-[#121212] rounded-full py-2 px-3 flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-[#0094FF]" />
          <span>{switching ? "Switching…" : selectedChain.name}</span>
          {!compact && <span className="text-[#19B1D2]">▾</span>}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-[#121212] border border-[#2a2a2a] rounded-xl overflow-hidden z-50 shadow-lg">
          {chains.map((c) => (
            <button
              key={c.key}
              onClick={() => handleSelect(c.key)}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-[#1e2f37] transition-colors ${
                c.key === selectedChain.key
                  ? "text-[#0094FF]"
                  : "text-[#ededef]"
              }`}
            >
              {c.name}
              {c.key === selectedChain.key && (
                <span className="float-right">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}