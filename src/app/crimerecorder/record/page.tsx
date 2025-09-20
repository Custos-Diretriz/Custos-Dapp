"use client";
import { Record } from "../components/Record";
import icon1 from "../../../../public/record2.png";
import icon2 from "../../../../public/picture.png";

const Recorder = () => {
  const text = {
    text1: `You can record a video, or take a picture to keep on the blockchain`,
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-10">
      <div className="flex flex-col items-center mt-[-50px] md:mt-[-100px]">
        <Record text={text.text1} icon1={icon1} icon2={icon2} />
      </div>
    </div>
  );
};

export default Recorder;
