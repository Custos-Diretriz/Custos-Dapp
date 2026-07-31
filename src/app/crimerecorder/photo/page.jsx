"use client";
import React from "react";
import icon3 from "../../../../public/record.png";
import { Recording } from "../components/Recording";
import PageHeader from "../../../components/dapps/PageHeader";

const TakePicture = () => (
  <div className="flex flex-col gap-6" id="take-picture">
    <PageHeader
      title="Take a photo"
      subtitle="Capture a still image and anchor it on the blockchain. It is timestamped the moment it is saved."
    />
    <Recording
      text="Take a picture to keep on the blockchain"
      icon1={icon3}
      imgText="Click to Take a Picture"
      category="image"
    />
  </div>
);

export default TakePicture;
