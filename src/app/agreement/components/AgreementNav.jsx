import { GlobalStateContext } from "@/context/GlobalStateProvider";
import React, { useContext } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Page from "../[...slug]/page";
import Image from "next/image";

const AgreementNav = ({ activeTab, setActiveTab, text, mode}) => {
  const { globalState } = useContext(GlobalStateContext);
  return (
    <div className="flex flex-col w-full p-4 gap-4 ">
      {/* Back Button */}
      {/* ${
          globalState !== "" ? "rounded-[1em] p-4 validate-gradient" : ""
        } */}
      <div
        className={`flex flex-col gap-6 `}
      >
        <div className="flex items-center">
          <button
            className="w-fit text-[#EAFBFF] "
            onClick={() => window.history.back()}
          >
            <div className="w-fit  flex justify-start items-centr">
              <FaArrowLeft className="mr-2 mt-[3px] text-[#EAFBFF]" />
              <p className="text-[#EAFBFF] font-bold">Back</p>
            </div>
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-3xl font-bold text-white">{text}</p>
          {/* <div className={`${globalState !== "" ? "flex" : "hidden"}`}>
            <div className="button-transition">
              <Image
                src="./PrintAgreement.png"
                alt="Print Agreement"
                width={"90%"}
                onClick={() => {}} // Move to next step on click
              />
            </div>
            <div className="button-transition">
              <Image
                src="./FinalValidateButton.png"
                alt="Validate Agreement"
                width={"90%"}
                onClick={() => {}} // Move to next step on click
              />
            </div>
          </div> */}
        </div>
      </div>

      {/* Tab Navigation */}
      {!mode &&
      <div className="relative">
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
          {/* {finalValidate === "show" ? ( */}
          {/* 
          <div
            className={`bg-black absolute z-20 left-0 right-0 h-[70vh] ${
              globalState !== "" ? "block" : "hidden"
            }`}
          >
            <p className="text-[55px] text-teal-50">xdede::: {globalState}</p>
            <div>
            </div>
          </div> */}
          {/* {globalState === "" ? (
            ""
          ) : (
            <Page agreementAccessToken={globalState} />
          )} */}
          {/* ) : (
            ""
          )} */}
        </div>
      </div>
}
    </div>
  );
};

export default AgreementNav;
