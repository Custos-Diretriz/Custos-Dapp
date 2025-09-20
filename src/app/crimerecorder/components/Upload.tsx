import Image from "next/image";
import React from "react";

const NFTImagePlaceholder = ({ imageURI }: { imageURI: any }) => (
  <div className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
    {imageURI ? (
      <Image
        src={imageURI} 
        alt="NFT Preview" 
        className="w-full h-full object-cover rounded-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "/api/placeholder/300/150";
        }}
      />
    ) : (
      <Image 
        src="/api/placeholder/300/150" 
        alt="NFT Placeholder"
        className="w-full h-full object-cover rounded-lg"
      />
    )}
  </div>
);

export const Upload = ({ uri }: { uri: any }) => {
  return (
    <div className="w-[90vw] xs:w-[80vw] sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[550px] 
                    min-w-[250px] max-w-[600px] 
                    rounded-xl 
                    border-[0.1px] border-[rgba(0,149,255,0.39)] 
                    p-2 xs:p-3 sm:p-4 md:p-5
                    mx-auto 
                    my-4 xs:my-6 sm:my-8 md:my-10">
      <div className="rounded-lg w-full h-full flex flex-col gap-2 xs:gap-3 sm:gap-4 items-start">
        {/* Image Container */}
        <div className="w-full rounded-lg 
                      h-[120px] xs:h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] 
                      bg-[rgba(131,106,106,0.29)]">
          <NFTImagePlaceholder imageURI={uri} />
        </div>
        
        {/* Info Container */}
        <div className="w-full flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 
                      items-start xs:items-center justify-between">
          {/* Record Badge */}
          <div className="rounded-full 
                        py-1 xs:py-1.5 sm:py-2 
                        px-2 xs:px-3 sm:px-4 md:px-6
                        text-[#0094ff] 
                        text-[10px] xs:text-xs sm:text-sm
                        border-[0.1px] border-[rgba(0,149,255,0.39)]
                        hover:bg-[#0094ff]/10 transition-colors duration-200">
            Record
          </div>
          
          {/* Timestamp */}
          <p className="text-[#0094ff] 
                      text-[10px] xs:text-xs sm:text-sm
                      break-all xs:break-normal">
            <span className="text-white">Timestamp: </span>
            {Date()}
          </p>
        </div>
        
        {/* Button Container */}
        <div className="w-full flex justify-center mt-2 xs:mt-3 sm:mt-4">
          <button className="rounded-full 
                          text-white 
                          text-[10px] xs:text-xs sm:text-sm
                          bg-[#0094ff] 
                          py-2 xs:py-2.5 sm:py-3 
                          px-4 xs:px-6 sm:px-8 md:px-10
                          hover:bg-[#0077CC] 
                          transition-all duration-200 
                          hover:scale-105 
                          active:scale-95">
            Download Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;