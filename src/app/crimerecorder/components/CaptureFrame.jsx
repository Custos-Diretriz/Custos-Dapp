"use client";
import React from "react";
import Image from "next/image";
import { MdFlipCameraIos } from "react-icons/md";
import bg from "../../../../public/Rectangle.png";
import { cn } from "../../../lib/utils";

/**
 * The camera surface shared by the photo, video and upload flows.
 * Sized fluidly: full-bleed-ish on phones, capped at a readable width on
 * desktop, with the viewport locked to 16:9 so nothing jumps while the
 * stream warms up.
 */
export const CaptureCard = ({ children, className }) => (
  <section
    className={cn(
      "relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.07] bg-[#132229] shadow-[0_20px_60px_-24px_rgba(0,0,0,0.9)]",
      className
    )}
  >
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
    <div className="relative flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
      {children}
    </div>
  </section>
);

export const CaptureViewport = ({ children, className }) => (
  <div
    className={cn(
      "relative aspect-video w-full overflow-hidden rounded-xl bg-black",
      className
    )}
  >
    {children}
  </div>
);

export const RecIndicator = ({ label = "REC" }) => (
  <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 backdrop-blur-sm">
    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
    <span className="text-[11px] font-semibold tracking-wide text-white">
      {label}
    </span>
  </div>
);

export const SwitchCameraButton = ({ onClick, flipped, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label="Switch camera"
    title="Switch camera"
    className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70 disabled:opacity-40"
  >
    <MdFlipCameraIos
      className={cn(
        "h-6 w-6 transition-transform duration-500",
        flipped && "rotate-180"
      )}
    />
  </button>
);

/**
 * Primary capture control. 72px target, unmistakable state change between
 * idle and recording.
 */
export const CaptureButton = ({ onClick, recording, disabled, label, mode }) => (
  <div className="flex flex-col items-center gap-2">
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={mode === "video" ? recording : undefined}
      className={cn(
        "grid h-[72px] w-[72px] place-items-center rounded-full border-[3px] transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#132229]",
        "active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
        recording
          ? "border-red-400/70 bg-red-500/15 focus-visible:ring-red-400"
          : "border-[#0094FF]/60 bg-[#0094FF]/10 hover:bg-[#0094FF]/20 focus-visible:ring-[#0094FF]"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "block transition-all duration-200",
          recording
            ? "h-6 w-6 rounded-[4px] bg-red-500"
            : "h-12 w-12 rounded-full bg-[#0094FF]"
        )}
      />
    </button>
    <span className="text-center text-xs font-medium text-white sm:text-sm">
      {label}
    </span>
  </div>
);

export const LoadingOverlay = ({ text }) => (
  <div
    role="status"
    aria-live="polite"
    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-6 backdrop-blur-[10px]"
  >
    <div className="flex flex-col items-center text-center">
      <Image
        src="/logo.svg"
        alt=""
        width={88}
        height={88}
        className="h-16 w-16 animate-pulse sm:h-[88px] sm:w-[88px]"
      />
      <p className="mt-4 max-w-xs text-sm text-white sm:text-base">{text}</p>
    </div>
  </div>
);
