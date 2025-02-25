'use client'
/* eslint-disable @next/next/no-img-element */
import React from 'react';

const BackgroundWrapper = ({ children }) => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Noise background */}
      <div
        style={{
          backgroundImage: "url('/Rectangle.png')",
          backgroundSize: "cover", // Ensures it covers the entire screen
          backgroundRepeat: "repeat",
          backgroundAttachment: "fixed",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          mixBlendMode: "overlay",
          filter: "brightness(1.5)",
          animation: "fallingNoise 5s linear infinite",
        }}
      />


      {/* Main content */}
      {children}

      {/* Keyframe styles for animation */}
      <style jsx>{`
        @keyframes fallingNoise {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BackgroundWrapper;
