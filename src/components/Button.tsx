import React from 'react';

// Button component with optional props for text, icon, onClick handler, and link
const Button = ({ text, icon, onClick, link }: { text: string, icon?: any, onClick?: () => void, link: string }) => {
  return (
    
    <a
      href={link}
      onClick={onClick}
      className="rounded-[2em] text-white md:px-4 md:py-3 px-1 py-1 flex transform hover:scale-105 transition-transform duration-300 border-gradient bg-opacity-50 backdrop-filter backdrop-blur-lg items-center justify-between text-center space-x-2 "
    >
        <p className=" items-center justify-center text-center flex">

      {text}
        </p>
        <p className=" items-center justify-center text-center flex">

      {icon && <span className="mr-2">{icon}</span>}
        </p>
    </a>
  );
};

export default Button;
