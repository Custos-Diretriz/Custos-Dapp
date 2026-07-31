"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { cn } from "../../lib/utils";

/**
 * Consistent page masthead for dapp screens: optional back affordance, title,
 * supporting copy and a trailing action slot that stacks on small screens.
 */
export default function PageHeader({
  title,
  subtitle,
  actions,
  showBack = true,
  className,
  children,
}) {
  const router = useRouter();

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {showBack && (
        <button
          type="button"
          onClick={() => router.back()}
          className="-ml-2 flex h-10 w-fit items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#EAFBFF] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70"
        >
          <FaArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back
        </button>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="break-words text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-[#8E9A9A] sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          // full width on phones so the action isn't a cramped target
          <div className="w-full shrink-0 [&>*]:w-full sm:w-auto sm:[&>*]:w-auto">
            {actions}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
