"use client";
import { cn } from "../../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Logo } from "./logo";
import ConnectButtoncomponent from "../connect";
import { NAV_LINKS, isLinkActive } from "./navLinks";

const SidebarLink = ({ link, expanded, onNavigate }) => {
  const pathname = usePathname();
  const active = isLinkActive(pathname, link);

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={expanded ? undefined : link.label}
      className={cn(
        "relative flex h-12 items-center rounded-xl transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70",
        expanded ? "gap-3 px-4" : "justify-center px-0",
        active
          ? "bg-white/[0.07] text-white"
          : "text-neutral-400 hover:bg-white/[0.04] hover:text-white"
      )}
    >
      {/* active rail marker */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#19B1D2] to-[#A02294] transition-opacity",
          active ? "opacity-100" : "opacity-0"
        )}
      />
      <span className="relative h-6 w-6 shrink-0">
        <Image
          src={active ? link.activeIcon : link.icon}
          alt=""
          fill
          sizes="24px"
          className="object-contain"
        />
      </span>
      <span
        className={cn(
          "whitespace-nowrap text-[15px] font-medium transition-[opacity,transform] duration-200",
          expanded
            ? "opacity-100"
            : "pointer-events-none w-0 -translate-x-2 opacity-0"
        )}
      >
        {link.label}
      </span>
    </Link>
  );
};

const NavList = ({ expanded, onNavigate }) => (
  <nav aria-label="Dapp sections" className="flex flex-1 flex-col gap-1.5 px-3">
    {NAV_LINKS.map((link) => (
      <SidebarLink
        key={link.href}
        link={link}
        expanded={expanded}
        onNavigate={onNavigate}
      />
    ))}
  </nav>
);

/**
 * Desktop only: a 76px icon rail that overlay-expands on hover, so expanding
 * never reflows page content. On mobile the bottom tab bar covers the same
 * destinations, so no sidebar is rendered at all.
 */
export const Sidebar = () => {
  const [hovered, setHovered] = useState(false);

  return (
    // z sits above the sticky header (z-50) so the expanded panel overlays the
    // header instead of sliding under it
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="sticky top-0 z-[55] hidden h-[100dvh] w-[76px] shrink-0 md:block"
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 flex flex-col overflow-hidden border-r border-white/[0.06] bg-[#04080C] py-4",
          "transition-[width,box-shadow] duration-200 ease-out",
          hovered
            ? "w-[248px] shadow-[10px_0_50px_-16px_rgba(0,0,0,0.9)]"
            : "w-[76px]"
        )}
      >
        <div
          className={cn(
            "mb-6 flex h-10 items-center",
            hovered ? "px-4" : "justify-center px-0"
          )}
        >
          <Logo open={hovered} />
        </div>

        <NavList expanded={hovered} />

        <div
          className={cn(
            "mt-4 border-t border-white/[0.06] pt-4",
            hovered ? "px-4" : "px-2"
          )}
        >
          <ConnectButtoncomponent
            compact={!hovered}
            showChainSelector={hovered}
            maxLabelChars={4}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
