'use client';
import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useNotification } from "../../../context/NotificationProvider";

const Filename = ({ open, onClose, onSubmit }: { open: boolean, onClose: () => void, onSubmit: (name: string) => void }) => {
  const [fileName, setFileName] = useState("");
  const [countdown, setCountdown] = useState(5); // Start with 5 seconds
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const { openNotification } = useNotification();

  const generateUniqueFileName = () => {
    const currentTime = new Date().toISOString();
    return `file_${currentTime}`;
  };

  useEffect(() => {
    if (open && fileName.trim() === "") {
      countdownRef.current = setTimeout(() => {
        if (countdown === 1) {
          const generatedName = generateUniqueFileName();
          setFileName(generatedName);
          onSubmit(generatedName);
          setFileName("");
          onClose();
        } else {
          setCountdown(countdown - 1);
        }
      }, 1000);

      return () => {
        if (countdownRef.current) {
          clearTimeout(countdownRef.current);
        }
      };
    }
  }, [countdown, fileName, open, onSubmit, onClose]);

  const handleInputChange = (e: any) => {
    setFileName(e.target.value);
    setCountdown(5);
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
    }
  };

  const handleSubmit = () => {
    if (fileName.trim()) {
      onSubmit(fileName);
      setFileName("");
      setCountdown(5);
      onClose();
    } else {
      openNotification("error", "", "Please enter a valid filename");
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="border rounded-xl bg-[#04080C] p-4 border-[#19B1D2] shadow-2xl flex flex-col m-auto 
                      w-full max-w-lg lg:max-w-2xl sm:max-w-md">
        <div className="w-full flex justify-between items-center mb-4">
          <button className="text-white" onClick={onClose}>
            <FaTimes size={20} />
          </button>
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] text-center text-lg sm:text-xl md:text-2xl">
            Would you like to name your evidence?
          </h1>
        </div>

        <input
          type="text"
          value={fileName}
          onChange={handleInputChange}
          className="border bg-[#04080C] text-white p-2 w-full mb-4 rounded text-sm sm:text-base md:text-lg"
          placeholder="Give Your Evidence a Name"
        />
        
        <div className="flex justify-end space-x-4">
          {fileName ? (
            <button
              onClick={handleSubmit}
              className="mt-5 bg-[#0094FF] text-white py-2 px-4 rounded-full mb-5 text-sm sm:text-base md:text-lg"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="mt-5 text-[#0094FF] py-2 px-4 rounded-full mb-5 text-3xl sm:text-4xl md:text-5xl"
            >
              {`${countdown} Seconds `}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filename;
