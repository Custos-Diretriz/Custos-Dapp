import React from 'react';
import Image from 'next/image';
import { FaTimes, FaTimesCircle } from 'react-icons/fa';

interface SuccessScreenProps {
  onClose: () => void;
  isSuccess?: boolean;
  message?: string;
}

const SuccessScreen = ({ onClose, isSuccess, message }: SuccessScreenProps): React.JSX.Element => {
  return (
    <div className="border rounded-xl bg-[#04080C] p-8 relative border-[#19B1D2] h-fit w-fit max-w-[24em] shadow-2xl items-center justify-center flex flex-col m-auto">
      <div className="w-full flex justify-between gap-x-16 flex-row-reverse">
        <button className="text-white absolute top-4 right-2" onClick={onClose}>
          <FaTimes size={20} />
        </button>
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A]">
          {message}
        </h1>
      </div>
      <div className="h-full flex items-center justify-center m-auto align-middle w-full text-center">
        {isSuccess ? (
          <Image 
            src="/success.svg"
            width={150} 
            height={150} 
            alt="success" 
          />
        ) : (
          <FaTimesCircle size={150} color="#FF0000" />
        )}
      </div>
      {!isSuccess && (
        <p className="text-red-500 mt-4">
          {message}
        </p>
      )}
    </div>
  );
};

export default SuccessScreen;
