"use client";
import React from "react";
import { cn } from "../../lib/utils";
import Sidepane from "./sidepane";
import Header from "./header";
import MobileTabBar from "./mobiletabbar";

/**
 * Shared chrome for the authenticated dapp surfaces (agreements + crime
 * recorder): a desktop icon rail, sticky header and a mobile bottom tab bar.
 * Mobile has no sidebar — the tab bar is the only navigation.
 */
export default function DappShell({ children, contentClassName }) {
  return (
    <div className="flex min-h-[100dvh] w-full">
      <Sidepane />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

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
