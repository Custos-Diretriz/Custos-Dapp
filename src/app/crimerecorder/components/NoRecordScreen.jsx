import React from "react";
import Image from "next/image";
import Link from "next/link";
import { VideoCameraIcon, CameraIcon } from "@heroicons/react/outline";

const NoRecordScreen = () => (
  <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-10 text-center sm:px-8 sm:py-14">
    <Image
      src="/gifs/noagreement.gif"
      alt=""
      width={200}
      height={200}
      className="h-32 w-32 sm:h-40 sm:w-40"
      unoptimized
    />

    <div className="space-y-1.5">
      <h2 className="text-lg font-semibold text-white sm:text-xl">
        No evidence saved yet
      </h2>
      <p className="text-sm leading-relaxed text-[#8E9A9A]">
        Nothing has been anchored on the blockchain from this account. Launch
        your camera to capture your first piece of evidence.
      </p>
    </div>

    <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
      <Link
        href="/crimerecorder/record"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0094FF] px-6 text-sm font-medium text-white transition-colors hover:bg-[#0b84dc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70"
      >
        <VideoCameraIcon className="h-5 w-5" aria-hidden />
        Record a video
      </Link>
      <Link
        href="/crimerecorder/photo"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm text-white transition-colors hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70"
      >
        <CameraIcon className="h-5 w-5" aria-hidden />
        Take a photo
      </Link>
    </div>
  </div>
);

export default NoRecordScreen;
