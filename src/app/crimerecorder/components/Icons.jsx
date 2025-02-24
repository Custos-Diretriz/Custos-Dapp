import Image from "next/image";
import React from "react";

const Icons = ({ icon, text, isFlipped = false }) => {
  return (
    <div className="flex flex-col items-center mb-6 gap-2">
      <div className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16">
        <Image 
          className={`transition-transform duration-1000 ${isFlipped ? 'rotate-180' : 'rotate-0'}`} 
          src={icon} 
          alt="icon" 
          layout="responsive" 
          width={24} 
          height={24} 
        />
      </div>
      <span className="text-white text-xs md:text-sm lg:text-base">{text}</span>
    </div>
  );
};

export default Icons;
