import { Input } from "../../../../components/ui/input";
import Image from "next/image";

export default function StepFive({ setStep }) {
  return (
    <>
      {" "}
      <div className="p-8 flex items-center justify-center flex-col gap-4">
        <div className="text-center flex flex-col ">
          <h1 className="text-[28px] text-[#8E9A9A] font-bold">
            Who should sign this agreement?
          </h1>
          <p>
            We&apos;ll send the agreement to this person for their review and
            signature.
          </p>
        </div>
        <div className="rounded-2xl box border-gradien w-full p-6">
          <div className="sh"></div>
          <div className="flex flex-col gap-8">
            <div>
              <label htmlFor="name">What is their name?</label>
              {/* <input type="text" /> */}
              <Input placeholder="e.g John Doe" name="name" />
            </div>
            <div>
              <label htmlFor="email">What is their email?</label>
              {/* <input type="text" /> */}
              <Input placeholder="example@gmail.com" name="email" />
              <p className="text-[#ECF3FF75] text-sm">
                This person will receive an email with the agreement to review
                and sign
              </p>
            </div>
          </div>
          <div
            className="w-full backdrop-blur-[10px] mt-8 border-gradient2 cursor-pointer p-[2px] rounded-[100px]"
            // onClick={handleConnect}
            onClick={() => setStep(6)}
          >
            <div className="bg-[#121212] rounded-[100px]">
              <button className="flex items-center   w-full text-white justify-center text-center text-sm py-3 px-6 rounded-[100px] hover:bg-gradient-to-r from-[#19B1D2] to-[#0094FF] hover:bg-[#209af1] transition-colors duration-300 ease-in-out">
                <span>Continue</span>
                {/* <FaLongArrowAltRight className="ml-2" /> */}
              </button>
            </div>
          </div>
        </div>

        {/* <div className="flex items-center gap-4 w-full">
          <hr className="flex-1 border-t border-[#8E9A9A]" />
          <p className="text-[#8E9A9A]">Or get started with</p>
          <hr className="flex-1 border-t border-[#8E9A9A]" />
        </div> */}

        <div className="flex items-center gap-2 border-[0.3px] border-blue-300 rounded-md    justify-center p-2">
          <p className="text-[#8E9A9A] text-sm">
            Note: After you sign the agreement, we will send it to the other
            party for their signature.
          </p>
        </div>
      </div>
    </>
  );
}
