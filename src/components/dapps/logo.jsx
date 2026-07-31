"use client";
import Link from "next/link";
import Image from "next/image";

/**
 * The wordmark (233×22) already contains the shield mark, so pairing it with
 * the standalone icon overflows the 248px expanded rail and clips the text.
 * Collapsed → icon only; expanded → wordmark only, sized to fit the rail.
 */
export const Logo = ({ open }) => (
  <Link
    href="/"
    aria-label="Custos Diretriz home"
    className="flex min-w-0 items-center rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70"
  >
    {open ? (
      <Image
        src="/logo.png"
        alt="Custos Diretriz"
        width={233}
        height={22}
        className="h-auto w-[186px] max-w-full"
        priority
      />
    ) : (
      <Image
        src="/logo.svg"
        alt="Custos Diretriz"
        width={32}
        height={32}
        className="h-8 w-8 shrink-0"
        priority
      />
    )}
  </Link>
);

export const LogoIcon = ({ open }) => (
  <Link
    href="/"
    aria-label="Custos Diretriz home"
    className="flex items-center gap-2.5 rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70"
  >
    <Image
      src="/logoicon.png"
      alt=""
      width={44}
      height={44}
      className="h-11 w-11 shrink-0"
    />
    {open && (
      <Image
        src="/logo.png"
        alt="Custos Diretriz"
        width={132}
        height={28}
        className="h-[22px] w-auto"
      />
    )}
  </Link>
);
