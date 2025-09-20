import React from "react";

import Record from "../../app/crimerecorder/components/Record";
import icon1 from "../../../public/record2.png";
import icon2 from "../../../public/picture.png";
import icon3 from "../../../public/record.png";
import icon4 from "../../../public/pause.png";

const Recorder = () => {
  const text = {
    text1: `You can record a video, or take a picture to keep on the blockchain`,
    text2: `Take a picture to keep on the blockchain`,
    text3: `Record a video to keep on the blockchain`,
  };

  return (
    <div className="h-screen w-full m-10">
     
      <div className="flex justify-center">
        <Record text={text.text1} icon1={icon1} icon2={icon2} />
      </div>
    </div>
  );
};

export default Recorder;
