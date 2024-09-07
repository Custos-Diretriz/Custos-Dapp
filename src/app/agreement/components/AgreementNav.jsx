import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const AgreementNav = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col w-full p-4 gap-4">
      {/* Back Button */}
      <div className="flex items-center">
        <button
          className="w-full text-[#EAFBFF] flex justify-start items-center"
          onClick={() => window.history.back()}
        >
          <FaArrowLeft className="mr-2 text-[#EAFBFF]" />
          <p className="text-[#EAFBFF]">Back</p>
        </button>
      </div>

      <p className="text-3xl font-bold text-white">Agreements</p>

      {/* Tab Navigation */}
      <div className="flex justify-around w-fit gap-16 text-lg">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-2 ${
            activeTab === "all"
              ? "text-white border-b-4 underlined-border-gradient"
              : "text-transparent bg-clip-text bg-gradient-to-r from-[#BEBDBD] to-[#858585]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-2 ${
            activeTab === "pending"
              ? "text-white border-b-4 underlined-border-gradient"
              : "text-transparent bg-clip-text bg-gradient-to-r from-[#BEBDBD] to-[#858585]"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab("signed")}
          className={`pb-2 ${
            activeTab === "signed"
              ? "text-white border-b-4 underlined-border-gradient"
              : "text-transparent bg-clip-text bg-gradient-to-r from-[#BEBDBD] to-[#858585]"
          }`}
        >
          Signed
        </button>
        <button
          onClick={() => setActiveTab("validated")}
          className={`pb-2 ${
            activeTab === "validated"
              ? "text-white border-b-4 underlined-border-gradient"
              : "text-transparent bg-clip-text bg-gradient-to-r from-[#BEBDBD] to-[#858585]"
          }`}
        >
          Validated
        </button>
      </div>
    </div>
  );
};

export default AgreementNav;