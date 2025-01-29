import React from 'react';
import Image from 'next/image';

const Shape = () => {
  return (
    <div className="h-[14em] mb-16 mx-auto ">
      {/* <div className="shape"></div> */}
      <div className="eclipse-container ">
        <Image
          src="./ecllipse.png"
          alt="Eclipse Image"
          className="eclipse w-[40%] max-md-[600px]:w-[65%]"
        />
      </div>
    </div>
  );
};

export default Shape;
