"use client";
import { useState, useContext, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { cn } from "../lib/utils";
import ConnectButtoncomponent from "./connect";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { WalletContext } from "./walletprovider";

const PRIMARY_LINKS = [
  { href: "/agreement", label: "Create Agreement" },
  { href: "/crimerecorder", label: "Crime Recorder" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Contact" },
];

const Navbar = () => {
  const [showCompany, setShowCompany] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const { openWalletModal, address, disconnectWallet, ready } =
    useContext(WalletContext);
  const accountRef = useRef(null);
  const pathname = usePathname();

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccount(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      setIsMenuOpen(false);
      setShowCompany(false);
      setShowAccount(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close the sheet on navigation.
  useEffect(() => {
    setIsMenuOpen(false);
    setShowCompany(false);
  }, [pathname]);

  // Lock scroll behind the mobile sheet.
  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="nav-shadow relative z-50 mx-3 my-3 rounded-3xl border-[0.5px] border-[#ffffff44] bg-[#2749626b] px-4 py-3 backdrop-blur-md sm:rounded-full sm:px-6 md:mx-8 md:my-4 md:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="block shrink-0" aria-label="Custos home">
            <Image
              src="/logo-new.svg"
              alt="Custos Diretriz"
              width={250}
              height={50}
              className="h-8 w-auto rounded-lg sm:h-10 lg:h-12"
              priority
            />
          </Link>

          {/* --------------------------------------------------- desktop links */}
          <ul className="hidden items-center gap-8 lg:flex xl:gap-12">
            {PRIMARY_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="whitespace-nowrap text-white transition-colors duration-200 hover:text-[#c92eff]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setShowCompany(true)}
                className="text-white transition-colors duration-200 hover:text-[#c92eff]"
              >
                Company
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-white transition-colors duration-200 hover:text-[#c92eff]"
              >
                Services
              </button>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            {/* ------------------------------------------------ desktop account */}
            <div className="relative hidden lg:block" ref={accountRef}>
              {address ? (
                <>
                  <HoverBorderGradient
                    containerClassName="rounded-full group"
                    as="button"
                    onClick={() => setShowAccount((s) => !s)}
                    className="flex items-center space-x-2 bg-[#0495F8] px-6 py-3 text-white transition-transform duration-300 ease-out hover:scale-105 hover:shadow-lg dark:bg-black dark:text-white"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#19B1D2]" />
                    <span>{shortAddress}</span>
                  </HoverBorderGradient>

                  {showAccount && (
                    <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#121212] shadow-lg">
                      <p className="break-all border-b border-[#2a2a2a] px-4 py-3 text-[11px] text-[#19B1D2]">
                        {address}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccount(false);
                          disconnectWallet();
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-white transition-colors hover:bg-[#1e2f37]"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <HoverBorderGradient
                  containerClassName="rounded-full group"
                  as="button"
                  onClick={openWalletModal}
                  className="flex items-center space-x-2 bg-[#0495F8] px-6 py-3 text-white transition-transform duration-300 ease-out hover:scale-105 hover:shadow-lg dark:bg-black dark:text-white"
                >
                  <span>{ready ? "Get Started" : "Loading…"}</span>
                  <FaArrowRight className="ml-1 rotate-[-35deg] transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:rotate-0" />
                </HoverBorderGradient>
              )}
            </div>

            {/* --------------------------------------- mobile / tablet controls */}
            <div className="hidden sm:block lg:hidden">
              <ConnectButtoncomponent compact showChainSelector={false} />
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((s) => !s)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70 lg:hidden"
            >
              {isMenuOpen ? (
                <AiOutlineClose className="h-6 w-6" />
              ) : (
                <AiOutlineMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------- mobile sheet */}
      <div
        aria-hidden={!isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-3 top-[84px] z-40 origin-top rounded-3xl border border-[#ffffff22] bg-[#050B10]/95 p-4 shadow-2xl backdrop-blur-xl transition-all duration-200 lg:hidden",
          isMenuOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        )}
      >
        <nav className="flex flex-col">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-xl px-4 py-3.5 text-base text-white transition-colors hover:bg-white/5 hover:text-[#c92eff]"
            >
              {link.label}
            </Link>
          ))}

          <div className="my-2 h-px bg-white/10" />

          <p className="px-4 pb-1 pt-2 text-[11px] uppercase tracking-wider text-[#19B1D2]">
            Company
          </p>
          {COMPANY_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-xl px-4 py-3 text-sm text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-3 border-t border-white/10 pt-4">
            <ConnectButtoncomponent full />
          </div>
        </nav>
      </div>

      {/* ----------------------------------------------- desktop company modal */}
      {showCompany && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-4"
          onClick={() => setShowCompany(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Company"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="border-gradient relative w-full max-w-lg rounded-t-3xl bg-[#091219] p-6 pb-[calc(24px+env(safe-area-inset-bottom))] shadow-lg sm:rounded-2xl sm:pb-6"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Company</h2>
              <button
                type="button"
                onClick={() => setShowCompany(false)}
                aria-label="Close"
                className="-mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white transition-colors hover:bg-white/10"
              >
                <AiOutlineClose className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col">
              {COMPANY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-white transition-colors hover:bg-white/5 hover:text-[#c92eff]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
