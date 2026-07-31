"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import { WalletContext } from "./walletprovider";

export default function ChainSelector({ compact = false, full = false }) {
  const { selectedChain, switchChain, chains, switching } =
    useContext(WalletContext);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSelect = async (key) => {
    setOpen(false);
    await switchChain(key);
  };

  return (
    <div className={cn("relative", full ? "w-full" : "w-auto")} ref={ref}>
      <button
        type="button"
        disabled={switching}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Network: ${selectedChain.name}. Change network`}
        className={cn(
          "border-gradient2 cursor-pointer rounded-full p-[1px] text-[#ededef] transition-transform duration-200 active:scale-[0.97]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70",
          "disabled:opacity-60",
          full ? "w-full" : "w-auto"
        )}
      >
        <span
          className={cn(
            "flex h-11 items-center gap-2 rounded-full bg-[#121212] text-sm",
            compact ? "px-2.5" : "px-3.5",
            full && "w-full justify-center"
          )}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#0094FF]" />
          <span className="max-w-[12ch] truncate">
            {switching ? "Switching…" : selectedChain.name}
          </span>
          {!compact && (
            <span
              aria-hidden
              className={cn(
                "text-[10px] text-[#19B1D2] transition-transform duration-200",
                open && "rotate-180"
              )}
            >
              ▾
            </span>
          )}
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute z-[70] mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-2xl",
            full ? "inset-x-0 w-full" : "right-0 w-[min(72vw,224px)]"
          )}
        >
          {chains.map((c) => {
            const isSelected = c.key === selectedChain.key;
            return (
              <button
                key={c.key}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(c.key)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-[#1e2f37]",
                  isSelected ? "text-[#0094FF]" : "text-[#ededef]"
                )}
              >
                <span className="truncate">{c.name}</span>
                {isSelected && <span aria-hidden>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
