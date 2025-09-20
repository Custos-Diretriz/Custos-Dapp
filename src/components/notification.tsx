import React, { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { FaInfo } from "react-icons/fa6";

import { useNotification } from "../context/NotificationProvider";

const Notification = ({ type, headText, subText }: { type: string, headText?: string, subText?: string }) => {
  const { closeNotification } = useNotification();

  const getBg = () => {
    if (type === "error") {
      return "linear-gradient(95.46deg, rgba(246, 116, 62, 0.28) -6.96%, rgba(212, 37, 37, 0.29) 108.25%)";
    } else if (type === "success") {
      return "linear-gradient(95.46deg, rgba(50, 185, 114, 0.28) -6.96%, rgba(43, 163, 137, 0.29) 108.25%)";
    } else if (type === "info") {
      return "linear-gradient(95.46deg, rgba(46, 134, 180, 0.28) -6.96%, rgba(49, 151, 186, 0.29) 108.25%)";
    } else if (type === "warning") {
      return "linear-gradient(95.46deg, rgba(250, 172, 5, 0.28) -6.96%, rgba(253, 148, 4, 0.29) 108.25%)";
    }
  }

  const getBorder = () => {
    if (type === "error") {
      return "border-[#F0863A]";
    } else if (type === "success") {
      return "border-[#43D590]";
    } else if (type === "info") {
      return "border-[#7BCFED]";
    } else if (type === "warning") {
      return "border-[#FFDF8D]";
    }
  }
  return (
    <div className="fixed top-10 left-0 w-full flex justify-center z-[500]">
      <div className="relative">
        <div className={`border ${getBorder()} flex items-start gap-4 p-4 rounded-2xl w-full max-w-[505px]`} style={{background: getBg()}}>
          <div className="text-white bg-[#0C1215] rounded-[6px] p-2">
            {type === "error" && <IoCloseOutline />}
            {type === "success" && <FaCheck />}
            {(type === "info" || type === "warning") && <FaInfo />}
          </div>
          <div className="flex text-white flex-col">
            {headText && <p className="text-xl font-bold mb-1">{headText}</p>}
            {subText &&<p className="text-sm">
              {subText}
            </p>}
          </div>
          <IoCloseOutline className="text-white ml-6 cursor-pointer" size={24} onClick={() => closeNotification()} />
        </div>
      </div>
    </div>
  );
};

export default Notification;
