import { Input } from "../../../../components/ui/input";
import Image from "next/image";

const suggestions = [
  "Both parties agree to maintain confidentiality of all shared information.",
  "Payment terms are net 30 days from invoice date.",
  "This agreement is governed by the laws of [Your Jurisdiction].",
  "Either party may terminate this agreement with 30 days written notice.",
  "Any disputes will be resolved through binding arbitration.",
  //   "Consulting Agreement",
];

export default function StepSix({ setStep }) {
  return (
    <>
      {" "}
      <div className="p-8 flex items-center justify-center flex-col gap-4">
        <div className="text-center flex flex-col ">
          <h1 className="text-[28px] text-[#8E9A9A] font-bold">
            What are the terms of this agreement?
          </h1>
          <p>
            Outline the key terms, conditions, and obligations for all parties
            involved.
          </p>
        </div>
        <div className="rounded-2xl box border-gradien w-full p-6">
          <div className="sh"></div>

          <div className="flex flex-col gap-8">
            <div>
              <label htmlFor="name">Terms of agreement</label>
              {/* <input type="text" /> */}
              <Input
                as="textarea"
                placeholder="Either party may terminate this agreement with 30 days written notice."
                className="h-[10em]"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/AI-stars.svg"
                  alt="Crime Recorder Image"
                  width={400}
                  height={100}
                  className="w-[2em] h-[2em] fade-in-image"
                />
                <p className=" font-bold text-[20px]">Suggestions</p>
              </div>
              <div className="grid grid-cols-1   gap-2">
                {suggestions.map((suggestion, index) => (
                  <p
                    key={index}
                    className="rounded-md  px-[1em] py-2 bg-[rgba(45,72,92,0.5)] backdrop-blur border border-[#2D485C] text-[#EAFBFF] w-fit shadow-md"
                  >
                    {suggestion}
                  </p>
                ))}
              </div>
            </div>
            <div
              className="w-full backdrop-blur-[10px] border-gradient2 cursor-pointer p-[2px] rounded-[100px]"
              // onClick={handleConnect}
              onClick={() => setStep(7)}
            >
              <div className="bg-[#121212] rounded-[100px]">
                <button className="flex items-center   w-full text-white justify-center text-center text-sm py-3 px-6 rounded-[100px] hover:bg-gradient-to-r from-[#19B1D2] to-[#0094FF] hover:bg-[#209af1] transition-colors duration-300 ease-in-out">
                  <span>Create My Agreement</span>
                  {/* <FaLongArrowAltRight className="ml-2" /> */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
