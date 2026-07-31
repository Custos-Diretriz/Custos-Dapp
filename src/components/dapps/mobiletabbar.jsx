"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "../../lib/utils";
import { NAV_LINKS, isLinkActive } from "./navLinks";

/**
 * Thumb-reachable primary navigation. Mobile only — the desktop rail covers
 * the same destinations above `md`.
 */
const MobileTabBar = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-[#04080C]/95 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {NAV_LINKS.map((link) => {
          const active = isLinkActive(pathname, link);
          return (
            <li key={link.href} className="flex-1">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-[60px] flex-col items-center justify-center gap-1 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0094FF]/70",
                  active ? "text-white" : "text-neutral-500"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-5 top-0 h-[2px] rounded-b-full bg-gradient-to-r from-[#19B1D2] to-[#A02294] transition-opacity",
                    active ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="relative h-[22px] w-[22px]">
                  <Image
                    src={active ? link.activeIcon : link.icon}
                    alt=""
                    fill
                    sizes="22px"
                    className={cn(
                      "object-contain transition-opacity",
                      active ? "opacity-100" : "opacity-60"
                    )}
                  />
                </span>
                <span className="text-[10px] font-medium leading-none">
                  {link.shortLabel}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileTabBar;
