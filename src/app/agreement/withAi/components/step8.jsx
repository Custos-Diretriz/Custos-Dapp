import { Input } from "../../../../components/ui/input";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";

const suggestions = [
  "Both parties agree to maintain confidentiality of all shared information.",
  "Payment terms are net 30 days from invoice date.",
  "This agreement is governed by the laws of [Your Jurisdiction].",
  "Either party may terminate this agreement with 30 days written notice.",
  "Any disputes will be resolved through binding arbitration.",
  //   "Consulting Agreement",
];

export default function StepEight({ setStep }) {
  return (
    <>
      {" "}
      <div className="p-8 flex items-center justify-center flex-col gap-4">
        <div className="text-center flex flex-col ">
          <h1 className="text-[28px] text-[#8E9A9A] font-bold">
            Done! Your agreement is ready.
          </h1>
          <p>
            You can edit or add anything to your agreement. See the preview
            below.
          </p>
        </div>
        <div className="rounded-2xl box border-gradien w-full p-6">
          <div className="sh"></div>

          <div className="flex flex-col gap-8">
            <div>
              <label htmlFor="name">Agreement summary</label>
              <Input
                as="textarea"
                placeholder="Either party may terminate this agreement with 30 days written notice."
                className="h-[20em]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl box border-gradien w-full p-6">
          <div className="sh"></div>

          <div className="flex flex-col gap-8">
            <div>
              <label htmlFor="name">Full agreement document</label>
              <Input
                as="textarea"
                placeholder="Either party may terminate this agreement with 30 days written notice."
                className="h-[20em]"
              />
            </div>
            <div className="flex items-center justify-center gap-4">
              <div
                className="w-full backdrop-blur-[10px] border-gradient2 cursor-pointer p-[2px] rounded-[100px]"
                // onClick={handleConnect}
                onClick={() => setStep(7)}
              >
                <div className="bg-[#121212] rounded-[100px]">
                  <button className="flex items-center   w-full text-white justify-center text-center text-sm py-3 px-6 rounded-[100px] hover:bg-gradient-to-r from-[#19B1D2] to-[#0094FF] hover:bg-[#209af1] transition-colors duration-300 ease-in-out">
                    <span>Edit Agreement</span>
                    <FaEdit className="ml-2" />
                  </button>
                </div>
              </div>
              <div
                className="w-full backdrop-blur-[10px] border-gradient2 cursor-pointer p-[2px] rounded-[100px]"
                // onClick={handleConnect}
                onClick={() => setStep(7)}
              >
                <div className="bg-[#121212] rounded-[100px]">
                  <button className="flex items-center   w-full text-white justify-center text-center text-sm py-3 px-6 rounded-[100px] hover:bg-gradient-to-r from-[#19B1D2] to-[#0094FF] hover:bg-[#209af1] transition-colors duration-300 ease-in-out">
                    <span>Proceed to Sign Agreement</span>
                    {/* <FaLongArrowAltRight className="ml-2" /> */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
