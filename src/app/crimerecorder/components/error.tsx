"use client";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useModal } from "../../../context/ModalProvider";

const ErrorScreen = () => {
  const modalContext = useModal();
  const closeModal = modalContext?.closeModal;
  const message = modalContext?.message;
  // if (!open) {
  //   return null;
  // }

  return (
    <div className="fixed bg-[#04090ECC] flex top-0 w-screen h-screen items-center justify-center z-[400]">
      <div className="border rounded-xl bg-[#04080C] p-4 md:p-6 lg:p-8 border-[#19B1D2] w-[90%] sm:w-[75%] md:w-[60%] lg:w-[40%] shadow-2xl flex flex-col items-center justify-center m-auto z-50">
        <div className="w-full flex justify-between gap-x-8 sm:gap-x-16 md:gap-x-24 lg:gap-x-32 flex-row-reverse mb-4">
          <button className="text-white" onClick={() => closeModal?.()}>
            <FaTimes size={20} />
          </button>
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] text-sm sm:text-base md:text-lg lg:text-xl ">
            {message || "You encountered an error; file not saved on-chain."}
          </h1>
        </div>
        <div className="flex items-center justify-center m-4 sm:m-6 md:m-8 lg:m-10 align-middle w-full">
          <Image
            src={"/error.png"}
            width={150}
            height={150}
            alt="error"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
