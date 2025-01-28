"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";

const Sidepane = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    {
      href: "/agreement/create",
      label: "Agreements",
      icon: (
        <Image 
          src="/agree.svg" 
          alt="" 
          fill
          className="object-contain"
        />
      ),
      activeIcon: (
        <Image 
          src="/agreemSelected.svg" 
          alt="" 
          fill
          className="object-contain"
        />
      ),
      labelClassName: "text-base",
    },
    {
      href: "/crimerecorder/record",
      label: "Videos",
      icon: (
        <div className="relative w-full h-full">
          <Image 
            src="/video.svg" 
            alt="" 
            fill
            className="object-contain"
          />
        </div>
      ),
      activeIcon: (
        <div className="relative w-full h-full">
          <Image 
            src="/videoSelected.svg" 
            alt="" 
            fill
            className="object-contain"
          />
        </div>
      ),
      labelClassName: "text-base",
    },
    {
      href: "/images",
      label: "Images",
      icon: (
        <div className="relative w-full h-full">
          <Image 
            src="/image.svg" 
            alt="" 
            fill
            className="object-contain"
          />
        </div>
      ),
      activeIcon: (
        <div className="relative w-full h-full">
          <Image 
            src="/imageSelected.svg" 
            alt="" 
            fill
            className="object-contain"
          />
        </div>
      ),
      labelClassName: "text-base",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: (
        <div className="relative w-full h-full">
          <Image 
            src="/setting.svg" 
            alt="" 
            fill
            className="object-contain"
          />
        </div>
      ),
      activeIcon: (
        <div className="relative w-full h-full">
          <Image 
            src="/settingSelected.svg" 
            alt="" 
            fill
            className="object-contain"
          />
        </div>
      ),
      labelClassName: "text-base",
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody>
        <div className="flex flex-col gap-10">
          <div className="flex-1 px-3 pt-8">
            <div className={cn(
              "space-y-10 flex flex-col",
              !open && "items-center"
            )}>
              {navLinks.map((link) => (
                <SidebarLink key={link.href} link={link} open={open} />
              ))}
            </div>
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

export default Sidepane;
