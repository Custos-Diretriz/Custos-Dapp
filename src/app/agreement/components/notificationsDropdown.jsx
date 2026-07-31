"use client";
import React from "react";
import Image from "next/image";
import { cn } from "../../../lib/utils";

const NotificationsDropdown = ({ open, notifications = [] }) => {
  if (!open) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className={cn(
        // full-width sheet under the header on phones, anchored popover above sm
        "fixed inset-x-3 top-[68px] z-50 rounded-2xl border border-white/10 bg-[#050519] p-4 text-white shadow-2xl",
        "sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[340px]"
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-medium">Notifications</h2>
        <button
          type="button"
          disabled={!notifications.length}
          className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] text-neutral-300 transition-colors hover:bg-white/5 disabled:opacity-40"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex max-h-[min(50vh,320px)] flex-col gap-2 overflow-y-auto">
        {notifications.length ? (
          notifications.map((n, i) => (
            <div
              key={n.id ?? i}
              className="flex gap-2.5 rounded-xl border border-white/10 p-2.5"
            >
              <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#171735]">
                <Image src="/bell.svg" alt="" width={16} height={16} />
              </span>
              <p className="min-w-0 break-words text-[11px] leading-relaxed text-neutral-400">
                {n.message}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-8 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#171735]">
              <Image src="/bell.svg" alt="" width={18} height={18} />
            </span>
            <p className="text-sm text-neutral-300">You&apos;re all caught up</p>
            <p className="text-[11px] text-neutral-500">
              Agreement and evidence activity will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
