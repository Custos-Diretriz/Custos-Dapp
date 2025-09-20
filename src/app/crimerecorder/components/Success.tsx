"use client";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { GlobalStateContext } from "../../../context/GlobalStateProvider";
import { useModal } from "../../../context/ModalProvider";

const SuccessScreen = () => {
  const modalContext = useModal();
  const closeModal = modalContext?.closeModal;
  // if (!isModalOpen) {
  //   return null;
  // }

  return (
    <div className="fixed bg-[#04090ECC] flex top-0 w-screen h-screen items-center justify-center z-[400]">
      <div className=" border rounded-xl bg-[#04080C] p-4 md:p-6 lg:p-8 border-[#19B1D2] w-[90%] sm:w-[75%] md:w-[60%] lg:w-[40%] shadow-2xl flex flex-col items-center justify-center m-auto">
        <div className="w-full flex justify-between gap-x-8 sm:gap-x-16 md:gap-x-24 lg:gap-x-32 flex-row-reverse relative mb-4">
          <button className="text-white" onClick={() => closeModal?.()}>
            <FaTimes size={20} />
          </button>
          <h1 className="max-w-[80%] sm:w-full text-transparent bg-clip-text bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A]">
            Your Media is saved onChain
          </h1>
        </div>
        <div className="h-full flex items-center justify-center m-6 align-middle w-full text-center ">
          <Image src={"/success.svg"} width={150} height={150} alt="success" />
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
