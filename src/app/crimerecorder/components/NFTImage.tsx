"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const NFTImageTemplate = ({ imageURI }: { imageURI: any }) => {
  const [nftImageURL, setNftImageURL] = useState<string | null>(null);

  const baseIpfs = "https://ipfs.io/ipfs/";

  useEffect(() => {
    if (imageURI && imageURI !== "undefined" && imageURI !== "uri") {
      const url = `${baseIpfs}${imageURI}`;
      setNftImageURL(url);
    }
  }, [imageURI]);

  return (
    <div className="w-full h-full">
      <Image
        className="w-full h-full"
        src={nftImageURL ? nftImageURL : "/secure.png"} // Set fallback image conditionally
        width={250}
        height={100}
        alt="nft"
      />
    </div>
  );
};

export default NFTImageTemplate;
