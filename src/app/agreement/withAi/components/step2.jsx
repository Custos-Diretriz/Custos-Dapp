import { Input } from "../../../../components/ui/input";
import { useRef, useState } from "react";

export default function StepTwo({ setStep }) {
  // State for the 4-digit code
  const [code, setCode] = useState(["", "", "", ""]);
  // Refs for each input
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Handle input change and jump to next
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9a-zA-Z]/, ""); // Only alphanumeric
    if (!val) return;
    const newCode = [...code];
    newCode[idx] = val[0];
    setCode(newCode);

    // Move to next input if not last
    if (idx < 3 && val) {
      inputRefs[idx + 1].current.focus();
    }

    // If all filled, go to next step
    if (newCode.every((c) => c.length === 1)) {
      setTimeout(() => setStep(3), 200); // slight delay for UX
    }
  };

  // Handle backspace to jump to previous
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs[idx - 1].current.focus();
    }
  };

  return (
    <>
      {" "}
      <div className="p-8 flex items-center justify-center flex-col gap-4">
        <div className="text-center flex flex-col ">
          <h1 className="text-[28px] text-[#8E9A9A] font-bold">
            Verify your profile.
          </h1>
          <p>
            We sent you a verification code to your mail. Enter the code into
            the boxes.
          </p>
        </div>
        <div className="rounded-2xl box border-gradien w-fit p-6">
          <div className="sh"></div>
          <div className="flex flex-col gap-8">
            <div>
              <label htmlFor="name">Enter verification code</label>
              <div className="flex gap-2 mt-[1em]">
                {[0, 1, 2, 3].map((idx) => (
                  <Input
                    key={idx}
                    ref={inputRefs[idx]}
                    value={code[idx]}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="w-[4em] h-[4em] text-center"
                    maxLength={1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
