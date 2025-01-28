import React from "react";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";

const NoRecordScreen = () => {
  return (
    <div className="m-auto w-full text-center items-center flex flex-col gap-10 justify-center h-screen">
      <Image
        src="/gifs/noagreement.gif"
        alt="norecord"
        width={200}
        height={200}
      />
      <p className="text-[#EAFBFF]">
        You have not saved any video or image on the blockchain yet. <br />
        Launch your camera to record your evidence.
      </p>
      {/* <Button
        text="Create Agreement"
        icon={<Image src="/Plus.svg" alt="plus" width={18} height={18} />}
        link={"/agreement/create"}
      /> */}

      <Link href="/crimerecorder/record">
        <button
          className="launch-pad-button-container"
          link={"/crimerecorder/record"}
        >
          <Image src="/RecordButton.png" alt="Zoom Image" />
        </button>
      </Link>
    </div>
  );
};

export default NoRecordScreen;
