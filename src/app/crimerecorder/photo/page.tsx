"use client";
import React from "react";
import icon3 from "../../../../public/record.png";
import { Recording } from "../components/Recording";
import { Header } from "../components/Header";

const TakePicture = () => {
  const text = {
    text2: `Take a picture to keep on the blockchain`,
  };

  return (
    <div className="w-full px-4 sm:px-10">
      <div className="flex justify-center mt-20 sm:mt-40" id="take-picture">
        <Recording
          text={text.text2}
          icon1={icon3}
          imgText={`Click to Take a Picture`}
          category={`image`}
        />
      </div>
    </div>
  );
};

export default TakePicture;
