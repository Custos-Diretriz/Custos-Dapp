import { HiMagnifyingGlass, HiBell } from "react-icons/hi2";
import Image from "next/image";
import Avatar from "../../../../public/man avatar.png";

function Header() {
  return (
    <div className="flex items-center justify-end bg-inherit p-4 space-x-4">
      {/* Search Bar */}
      <div className="flex items-center w-[180px] md:w-[240px] bg-[#1A1F27] rounded-full px-4 py-2 border border-[#2A2F36]">
        <HiMagnifyingGlass className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent text-sm text-white w-full placeholder-gray-500 focus:outline-none ml-2"
        />
      </div>

      {/* Notification Icon */}
      <button className="w-10 h-10 bg-inherit rounded-full flex items-center justify-center border border-[#2A2F36] hover:border-white">
        <HiBell className="text-gray-400 w-5 h-5" />
      </button>

      {/* Profile Avatar */}
      <div className="w-[86px] h-10 rounded-full bg-black-to-r from-[#274962] to-[#2D485C] p-[2px] rounded-[104px] border-[#0094FF] border-[0.5px]">
        <div className="w-full h-full p-[6px] gap-[6px] flex" style={{ backgroundImage: `url('/path-to-avatar.jpg')` }}>
            <Image src={Avatar} alt="" width={20} height={42} />
            <span className="text-sm">0x3...</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
