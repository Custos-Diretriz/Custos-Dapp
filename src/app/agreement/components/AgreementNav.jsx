"use client";
import React from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/outline";
import { cn } from "../../../lib/utils";
import PageHeader from "../../../components/dapps/PageHeader";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "signed", label: "Signed" },
  { key: "validated", label: "Validated" },
];

const AgreementNav = ({ activeTab, setActiveTab, text, mode, counts = {} }) => (
  <PageHeader
    title={text}
    subtitle="Create, sign and validate agreements — every signature is anchored onchain."
    actions={
      <Link
        href="/agreement/create"
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0094FF] px-5 text-sm font-medium text-white transition-colors hover:bg-[#0b84dc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70 sm:w-auto"
      >
        <PlusIcon className="h-4 w-4" aria-hidden />
        New agreement
      </Link>
    }
  >
    {!mode && (
      // Scrolls horizontally on phones instead of wrapping into a tall block.
      <div className="scrollbar-hide -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div
          role="tablist"
          aria-label="Filter agreements"
          className="inline-flex w-max min-w-full gap-1 rounded-xl border border-[#409ddb8b] bg-[#04080C] p-1.5 sm:w-auto sm:min-w-0"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex h-10 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-sm transition-colors sm:px-5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70",
                  isActive
                    ? "bg-white/[0.07] text-white ring-1 ring-[#409ddb8b]"
                    : "text-[#9aa4a4] hover:bg-white/[0.04] hover:text-white"
                )}
              >
                {tab.label}
                {counts[tab.key] > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[10px] leading-4",
                      isActive
                        ? "bg-[#0094FF]/20 text-[#0094FF]"
                        : "bg-white/[0.06] text-[#8E9A9A]"
                    )}
                  >
                    {counts[tab.key]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    )}
  </PageHeader>
);

export default AgreementNav;
