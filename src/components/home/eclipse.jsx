import React from 'react';
import Image from 'next/image';

const Shape = () => {
  return (
    <div className=" ">
      {/* <div className="shape"></div> */}
      <div className="eclipse-container ">
        <img
          src="./ecllipse.png"
          alt="Eclipse Image"
          className="eclipse w-[40%] max-md-[600px]:w-[65%]"
        />
      </div>
    </div>
  );
};

export default Shape;
