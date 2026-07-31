"use client";
import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

const AUTO_SUBMIT_SECONDS = 5;

const generateUniqueFileName = () => `file_${new Date().toISOString()}`;

const Filename = ({ open, onClose, onSubmit }) => {
  const [fileName, setFileName] = useState("");
  const [countdown, setCountdown] = useState(AUTO_SUBMIT_SECONDS);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (!open || fileName.trim() !== "") return;

    countdownRef.current = setTimeout(() => {
      if (countdown === 1) {
        const generatedName = generateUniqueFileName();
        setFileName("");
        onSubmit(generatedName);
        onClose();
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearTimeout(countdownRef.current);
  }, [countdown, fileName, open, onSubmit, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleInputChange = (e) => {
    setFileName(e.target.value);
    setCountdown(AUTO_SUBMIT_SECONDS);
    clearTimeout(countdownRef.current);
  };

  const handleSubmit = () => {
    const name = fileName.trim() || generateUniqueFileName();
    setFileName("");
    setCountdown(AUTO_SUBMIT_SECONDS);
    onSubmit(name);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[85] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filename-title"
    >
      <div className="w-full max-w-lg rounded-t-2xl border border-[#19B1D2] bg-[#04080C] px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-5 shadow-2xl sm:rounded-2xl sm:px-6 sm:pb-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h1
            id="filename-title"
            className="gradient-text text-lg font-medium sm:text-xl"
          >
            Would you like to name your evidence?
          </h1>
          <button
            type="button"
            aria-label="Close"
            className="-mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white transition-colors hover:bg-white/5"
            onClick={onClose}
          >
            <FaTimes size={18} />
          </button>
        </div>

        <label htmlFor="filename-input" className="sr-only">
          Evidence name
        </label>
        <input
          id="filename-input"
          type="text"
          value={fileName}
          autoFocus
          maxLength={80}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="h-12 w-full rounded-xl border border-white/15 bg-[#0E171C] px-4 text-sm text-white placeholder:text-[#5a6b73] focus:border-[#0094FF] focus:outline-none focus:ring-1 focus:ring-[#0094FF]/40 sm:text-base"
          placeholder="Give your evidence a name"
        />

        {!fileName && (
          <p className="mt-3 text-xs text-[#19B1D2]" aria-live="polite">
            Saving automatically in {countdown}s with a generated name.
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full px-5 text-sm text-[#19B1D2] transition-colors hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-12 rounded-full bg-[#0094FF] px-6 text-sm font-medium text-white transition-colors hover:bg-[#0b84dc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70"
          >
            {fileName ? "Save evidence" : `Save now (${countdown}s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filename;
