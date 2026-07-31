"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiX } from "react-icons/fi";
import { cn } from "../../lib/utils";
import ConnectButtoncomponent from "../connect";
import { UseReadContractData } from "../../utils/fetchcontract";
import NotificationsDropdown from "../../app/agreement/components/notificationsDropdown";

/** Icon button with a 44px touch target regardless of the glyph size. */
const IconButton = React.forwardRef(function IconButton(
  { className, active, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        // stays a comfortable target, but gives back a few px on tiny phones
        "grid h-11 w-11 shrink-0 place-items-center rounded-xl text-neutral-300 transition-colors max-[380px]:h-10 max-[380px]:w-10",
        "hover:bg-white/[0.06] hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70",
        active && "bg-white/[0.06] text-white ring-1 ring-[#0094FF]/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

const SearchField = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  autoFocus,
  className,
}) => (
  <form onSubmit={onSubmit} role="search" className={cn("relative", className)}>
    <FiSearch
      aria-hidden
      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
    />
    <input
      type="search"
      inputMode="numeric"
      autoFocus={autoFocus}
      placeholder="Search by agreement ID"
      aria-label="Search by agreement ID"
      value={value}
      onChange={onChange}
      className={cn(
        "h-11 w-full rounded-full border border-white/10 bg-[#101A20] pl-10 pr-4 text-sm text-white",
        "placeholder:text-neutral-500",
        "transition-colors focus:border-[#0094FF] focus:outline-none focus:ring-1 focus:ring-[#0094FF]/40"
      )}
    />
    {isLoading && (
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[#19B1D2]">
        …
      </span>
    )}
  </form>
);

export const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);

  const { fetchData } = UseReadContractData();

  // Notifications are not wired to a feed yet — drive the badge off real data
  // so we never show a fake count.
  const unreadCount = 0;

  useEffect(() => {
    const onClickOutside = (e) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setError("");
    setSearchResult(null);

    try {
      const agreementId = parseInt(searchTerm, 10);
      if (isNaN(agreementId)) {
        throw new Error("Enter a valid agreement ID (a number)");
      }

      const result = await fetchData("agreement", "get_agreement_details", [
        { low: agreementId, high: 0 },
      ]);
      if (!result) throw new Error(`No agreement found for ID ${agreementId}`);
      setSearchResult({ id: agreementId, data: result });
    } catch (err) {
      setError(err.message || "An error occurred while searching");
    } finally {
      setIsLoading(false);
    }
  };

  const dismissResult = () => {
    setSearchResult(null);
    setError("");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#04080C]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-1 px-3 sm:gap-2 sm:px-4 lg:px-6">
        {/* ------------------------------------------------------- mobile logo */}
        <Link
          href="/"
          className="min-w-0 shrink md:hidden"
          aria-label="Custos home"
        >
          <Image
            src="/logo.png"
            alt="Custos Diretriz"
            width={132}
            height={26}
            className="h-[18px] w-auto max-w-full sm:h-[22px]"
            priority
          />
        </Link>

        {/* ---------------------------------------------------- desktop search */}
        <SearchField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSubmit={handleSearch}
          isLoading={isLoading}
          className="mx-auto hidden w-full max-w-md md:block"
        />

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2 md:ml-0">
          {/* mobile search toggle */}
          <IconButton
            onClick={() => setMobileSearchOpen((s) => !s)}
            aria-label={mobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={mobileSearchOpen}
            active={mobileSearchOpen}
            className="md:hidden"
          >
            {mobileSearchOpen ? (
              <FiX className="h-5 w-5" />
            ) : (
              <FiSearch className="h-5 w-5" />
            )}
          </IconButton>

          {/* notifications */}
          <div className="relative" ref={notificationsRef}>
            <IconButton
              onClick={() => setNotificationsOpen((s) => !s)}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              active={notificationsOpen}
            >
              <span className="relative block h-5 w-5">
                <Image src="/bell.svg" alt="" fill sizes="20px" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1 grid min-w-[16px] place-items-center rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
            </IconButton>
            <NotificationsDropdown open={notificationsOpen} />
          </div>

          <div className="hidden sm:block">
            <ConnectButtoncomponent />
          </div>
          <div className="sm:hidden">
            <ConnectButtoncomponent compact showChainSelector={false} />
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- mobile search row */}
      {mobileSearchOpen && (
        <div className="px-3 pb-3 md:hidden">
          <SearchField
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSubmit={handleSearch}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* ------------------------------------------------------- search feedback */}
      {(error || searchResult) && (
        <div className="px-3 pb-3 sm:px-4 lg:px-6">
          <div
            role="status"
            className={cn(
              "mx-auto flex max-w-md items-start justify-between gap-3 rounded-xl border px-4 py-2.5 text-xs",
              error
                ? "border-red-500/30 bg-red-500/10 text-red-200"
                : "border-[#0094FF]/30 bg-[#0094FF]/10 text-[#EAFBFF]"
            )}
          >
            <span className="min-w-0 break-words">
              {error || `Agreement #${searchResult.id} found.`}
            </span>
            <button
              type="button"
              onClick={dismissResult}
              aria-label="Dismiss"
              className="shrink-0 text-current opacity-70 transition-opacity hover:opacity-100"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
