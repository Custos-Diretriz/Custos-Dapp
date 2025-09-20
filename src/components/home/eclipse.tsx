import React from 'react';
import Image from 'next/image';

const Shape = () => {
  return (
    <div className="h-[14em] mb-16 mx-auto flex items-center justify-center  ">
      {/* <div className="shape"></div> */}
      <div className="eclipse-container w-[40%] max-md:w-[65%] relative ">
        <Image
          src="/ecllipse.png"
          alt="Eclipse Image"
          width={600}
          height={400}
          layout="responsive"
          className="eclipse"
        />
      </div>
    </div>
  );
};

export default Shape;
