"use client";
import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border-4 border-t-[#00D1FF] border-b-[#A02294] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
