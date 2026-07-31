"use client";
import React, { useContext } from "react";
import { cn } from "../../lib/utils";
import { WalletContext } from "../walletprovider";

export const Chip = ({ tone = "cyan", children, className }) => (
  <span
    className={cn(
      "inline-flex max-w-full items-center gap-1.5 truncate rounded-full border px-3 py-1 text-[11px] leading-5 sm:text-xs",
      tone === "cyan" && "border-[#19B1D2]/25 bg-[#19B1D2]/10 text-[#19B1D2]",
      tone === "blue" && "border-[#0094FF]/25 bg-[#0094FF]/10 text-[#0094FF]",
      tone === "muted" && "border-white/10 bg-white/[0.04] text-[#8E9A9A]",
      className
    )}
  >
    {children}
  </span>
);

/**
 * Chain + session status. Wraps instead of overflowing on narrow screens.
 */
export default function StatusChips({ sessionLabel, className }) {
  const { selectedChain, isGuest } = useContext(WalletContext);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Chip tone="cyan">
        <span
          aria-hidden
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#19B1D2]"
        />
        {selectedChain?.name}
      </Chip>
      <Chip tone="blue">
        {sessionLabel ?? (isGuest ? "Guest session" : "Wallet connected")}
      </Chip>
    </div>
  );
}
