import { Input } from "../../../../components/ui/input";
import Image from "next/image";

const suggestions = [
  " Employment Contract",
  "Partner Agreement",
  "Freelance Contract",
  "Non-Disclosure Agreement",
  "Service Agreement",
  "Consulting Agreement",
];

export default function Step4({ setStep }) {
  return (
    <>
      {" "}
      <div className="p-8 flex items-center justify-center flex-col gap-4">
        <div className="text-center flex flex-col ">
          <h1 className="text-[28px] text-[#8E9A9A] font-bold">
            When does this agreement start?
          </h1>
          <p>Choose the effective date for this agreement</p>
        </div>
        <div className="rounded-2xl box border-gradien w-full p-6">
          <div className="sh"></div>

          <div className="flex flex-col gap-8">
            <div>
              <label htmlFor="date" className="mb-2">Agreement start date</label>
              {/* <input type="text" /> */}
              <Input name="date" type="date"/>
            </div>
 
            <div
              className="w-full backdrop-blur-[10px] border-gradient2 cursor-pointer p-[2px] rounded-[100px]"
              // onClick={handleConnect}
              onClick={() => setStep(5)}
            >
              <div className="bg-[#121212] rounded-[100px]">
                <button className="flex items-center   w-full text-white justify-center text-center text-sm py-3 px-6 rounded-[100px] hover:bg-gradient-to-r from-[#19B1D2] to-[#0094FF] hover:bg-[#209af1] transition-colors duration-300 ease-in-out">
                  <span>Continue</span>
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
