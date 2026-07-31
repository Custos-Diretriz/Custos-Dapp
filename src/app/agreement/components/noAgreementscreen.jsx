import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/outline";

const NoAgreementscreen = () => (
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
        Nothing here yet
      </h2>
      <p className="text-sm leading-relaxed text-[#8E9A9A]">
        You have not created any agreements yet. Draft one and both parties can
        sign it onchain.
      </p>
    </div>

    <Link
      href="/agreement/create"
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0094FF] px-6 text-sm font-medium text-white transition-colors hover:bg-[#0b84dc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70 sm:w-auto"
    >
      <PlusIcon className="h-5 w-5" aria-hidden />
      Create agreement
    </Link>
  </div>
);

export default NoAgreementscreen;
