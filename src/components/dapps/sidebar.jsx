"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Logo } from "./logo";
import ConnectButtoncomponent from "@/components/connect";

export const Sidebar = ({ children, open, setOpen }) => {
  return (
    <aside
      className={cn(
        "fixed md:sticky top-0 left-0 h-screen z-50",
        "w-[80px] hover:w-[300px] md:hover:w-[300px]",
        "transition-all duration-300 ease-in-out",
        "bg-[#04080C] border-r border-neutral-800"
      )}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <nav className="h-full flex flex-col gap-2 p-3">
        <div className="h-16 flex items-center justify-center">
          <Logo open={open} />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {children}
        </div>
        <div className="hidden md:flex justify-center items-center mt-16">
          <ConnectButtoncomponent open={open} />
        </div>
      </nav>
    </aside>
  );
};

export const SidebarBody = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {children}
    </div>
  );
};

export const SidebarLink = ({ link, open }) => {
  const pathname = usePathname();
  const isActive = pathname === link.href;

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 rounded-lg",
        "text-neutral-400 hover:text-white",
        "hover:bg-neutral-800/50",
        "transition-all duration-150 ease-in-out",
        "group",
        "p-3",
        open ? "justify-start pl-6" : "justify-center",
        isActive && "text-white bg-neutral-800/50"
      )}
    >
      <div className="relative w-6 h-6">
        <div className="absolute" style={{ 
          width: '21.01px', 
          height: '21.56px',
          top: '1.22px',
          left: '1.49px'
        }}>
          {isActive ? link.activeIcon || link.icon : link.icon}
        </div>
      </div>
      {open && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium text-base whitespace-nowrap overflow-hidden"
        >
          {link.label}
        </motion.span>
      )}
    </Link>
  );
}; 