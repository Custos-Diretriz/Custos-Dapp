import React from 'react';
import Image from 'next/image';

const Loading = ({text}: {text: string}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-90 z-50">
      <div className="relative w-32 h-32 sm:w-48 sm:h-48">
        {/* Rotating logo */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full animate-spin-slow">
          <Image
            src="/logo.svg"
            alt="Custos Logo"
            width={50}  
            height={50} 
            className="w-full h-full"
          />
        </div>

        {/* Rotating incomplete circles */}
        <div className="absolute top-0 left-0 rounded-full w-full h-full animate-reverse-spin">
          <div className="w-full h-full border-4 border-[#0094FF] rounded-full border-t-transparent"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full animate-spin-slow">
          <div className="w-full h-full border-4 border-[#A02294] rounded-full border-b-transparent"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full animate-spin">
          <div className="w-full h-full border-4 border-[#A02294] rounded-full border-l-transparent border-r-transparent"></div>
        </div>
      </div>
      {/* Centering the text and reducing the size */}
      <p className="absolute bottom-10 text-white text-sm sm:text-xl font-bold animate-pulse text-center">
        {text}
      </p>
    </div>
  );
};

export default Loading;
