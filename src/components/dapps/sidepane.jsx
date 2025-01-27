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
        <div className="relative w-full h-full">
          <Image 
            src="/agreements.png" 
            alt="" 
            fill
            className="object-contain"
          />
        </div>
      ),
      labelClassName: "text-base",
    },
    {
      href: "/crimerecorder/record",
      label: "Videos",
      icon: (
        <div className="relative w-full h-full">
          <Image 
            src="/videos.png" 
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
            src="/imagesicon.png" 
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
            src="/settings.png" 
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
        <div className="flex flex-col gap-4">
          <div className="flex-1 px-3">
            <div className="space-y-4">
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
