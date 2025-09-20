import Image from "next/image";
import {
  FaChevronDown,
  FaArrowRight,
  FaPlus,
  FaVideo,
  FaUser,
  FaUserPlus,
  FaPhone,
} from "react-icons/fa";

export default function ShowLaunchDapps({ closeModal }: { closeModal: () => void }) {
  return (
    <>
      <div className="sm:fixed fixed p-4   inset-0 h-[100vh] z-50 flex items-center justify-center w-full bg-[#00000098] bg-opacity-90 ">
        <div className="relative bg-[#091219] rounded-lg shadow-lg border-gradient md:w-[50%] w-full sm:flex md:flex-row h-fit md:h-auto ">
          <button
            onClick={closeModal}
            className="absolute top-0 right-0 flex items-center justify-center text-[3em] text-white w-12 h-12 rounded-full"
            style={{ zIndex: 60 }}
          >
            &times;
          </button>

          <div className=" flex p-6 flex-col justify-between bg-opacity-90 bg-[#091219] bg-[url('/Rectangle.png')] bg-cover bg-center bg-repeat">
            <div>
              <p className="text-3xl text-white">Launch Dapps</p>
              <p className="mt-4 text-gray-300">
                Decentralized apps help you leverage blockchain technology to
                secure your evidence and legal agreements.
              </p>
            </div>
            <Image
              src="/group.png"
              alt="group"
              width={200}
              height={100}
              className="rounded-lg mt-8"
            />
          </div>

          <div className="flex flex-col gap-4 sm:gap-4  m-auto w-full sm:p-0 p-4 rounded-lg md:h-auto bg-[#091219]">
            <a
              href="/agreement"
              className="text-white mb-4 z-[100] bg-[#091219] w-full hover:bg-[#015A9B] sm:p-4 rounded-lg cursor-pointer"
            >
              <p className="flex items-center text-xl font-semibold">
                <FaPlus className="mr-2" />
                Create Agreement
              </p>
              <p className="text-gray-300 mt-1">
                Custos ensures that agreements are securely stored.
              </p>
            </a>

            <a
              href="/crimerecorder"
              className="text-white mb-4 z-[100] hover:bg-[#015A9B] bg-[#091219] sm:p-4 rounded-lg cursor-pointer"
            >
              <p className="flex items-center text-xl font-semibold text-white">
                <FaVideo className="mr-2" />
                Record Video
              </p>
              <p className="text-gray-300 mt-1">
                Custos ensures that agreements are securely stored.
              </p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
