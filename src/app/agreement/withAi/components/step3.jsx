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

export default function StepThree({ setStep }) {
  return (
    <>
      {" "}
      <div className="p-8 flex items-center justify-center flex-col gap-4">
        <div className="text-center flex flex-col ">
          <h1 className="text-[28px] text-[#8E9A9A] font-bold">
            What type of agreement do you want to create?
          </h1>
          <p>
            Give your agreement a clear, descriptive title that both parties
            will understand.
          </p>
        </div>
        <div className="rounded-2xl box border-gradien w-full p-6">
          <div className="sh"></div>

          <div className="flex flex-col gap-8">
            <div>
              <label htmlFor="name">Enter agreement title</label>
              {/* <input type="text" /> */}
              <Input name="name" />
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
              <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2">
                {suggestions.map((suggestion, index) => (
                  <p
                    key={index}
                    className="rounded-full  px-[1em] py-2 bg-[rgba(45,72,92,0.5)] backdrop-blur border border-[#2D485C] text-[#EAFBFF] w-fit shadow-md"
                  >
                    {suggestion}
                  </p>
                ))}
              </div>
            </div>
            <div
              className="w-full backdrop-blur-[10px] border-gradient2 cursor-pointer p-[2px] rounded-[100px]"
              // onClick={handleConnect}
              onClick={() => setStep(4)}
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
