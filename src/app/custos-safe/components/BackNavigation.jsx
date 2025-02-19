import React from 'react';
import Link from 'next/link';

const BackNavigation = () => {
  return (
    <div className="w-64 h-32 bg-inherit text-white flex flex-col justify-between p-6 mb-12">
      <div className="flex items-center space-x-2 mt-2 ">
        <Link href="/">
          <span className="text-white font-bold">&larr;</span>
          <span className="font-semibold">Back</span>
        </Link>
      </div>
      <div className="text-l font-semibold mt-auto">Video Recorder</div>
    </div>
  )
}

export default BackNavigation;
