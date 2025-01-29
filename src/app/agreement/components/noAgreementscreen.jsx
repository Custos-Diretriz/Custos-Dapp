import React from 'react'
import Image from 'next/image';
import Button from '@/components/Button';
import Link from 'next/link';
const NoAgreementscreen = () => {
  return (
    <div className="m-auto w-full text-center items-center flex flex-col space-y-4">
      <Image
        src="/gifs/noagreement.gif"
        alt="noagreement"
        width={200}
        height={200}
      />
      <p className="text-[#EAFBFF]">
        You have not created any agreement yet. You can start creating one from
        here.
      </p>
      {/* <Button
        text="Create Agreement"
        icon={<Image src="/Plus.svg" alt="plus" width={18} height={18} />}
        link={"/agreement/create"}
      /> */}

      <Link href="/agreement/create">
        <button className="launch-pad-button-container" link={"/agreement/create"}>
          <Image src="./NewAgreeButton.png" alt="Zoom Image" />
        </button>
      </Link>
    </div>
  );
}

export default NoAgreementscreen;