"use client";
import Link from "next/link";
import Image from "next/image";

export const Logo = ({ open }) => {
  return (
    <Link
      href="/"
      className="font-normal flex items-center justify-center text-sm text-white py-1 relative z-20"
    >
      <div className="flex items-center gap-2 w-full">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        {open && (
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={120} 
            height={40}
            className="max-w-full" 
          />
        )}
      </div>
    </Link>
  );
};

export const LogoIcon = ({ open }) => {
  return (
    <Link
      href="/logoicon.png"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="flex items-center gap-2 w-full">
        <Image src="/logoicon.png" alt="Logo" width={55} height={55} />
        {open && (
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={120} 
            height={55}
            className="max-w-full" 
          />
        )}
      </div>
    </Link>
  );
}; 