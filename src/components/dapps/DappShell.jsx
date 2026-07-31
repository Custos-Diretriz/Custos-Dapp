"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import Sidepane from "./sidepane";
import Header from "./header";
import MobileTabBar from "./mobiletabbar";

/**
 * Shared chrome for the authenticated dapp surfaces (agreements + crime
 * recorder): desktop icon rail, mobile drawer, sticky header and a mobile
 * bottom tab bar.
 */
export default function DappShell({ children, contentClassName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever navigation happens.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll behind the drawer.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-[100dvh] w-full">
      <Sidepane mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setMobileOpen(true)} />

        <main
          className={cn(
            "flex-1 px-4 pt-5 sm:px-6 lg:px-8",
            // clear the mobile tab bar (60px) + the device safe area
            "pb-[calc(76px+env(safe-area-inset-bottom))] md:pb-12",
            contentClassName
          )}
        >
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>

        <MobileTabBar />
      </div>
    </div>
  );
}
