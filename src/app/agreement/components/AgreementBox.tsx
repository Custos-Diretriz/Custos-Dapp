"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

interface AgreementBoxProps {
  id: number;
  title: string;
  content: string;
  onSelect: (id: number) => void;
}

const AgreementBox = ({id, title, content, onSelect}: AgreementBoxProps): React.JSX.Element => {
  return (
  
            <div
              key={id}
              className="relative border-gradient w-auto cursor-pointer h-[330px] bg-[#010E12] text-white py-4 rounded-[20px] po overflow-hidden transition-opacity duration-100 ease-in-out hover:opacity-90"
              onClick={() => onSelect(id)}
            >
              <div
                className="absolute inset-0 border-[1px] border-transparent rounded-[20px]"
                style={{
                  background: "radial-gradient(13.75% 27.94% at 50% 50%, rgba(39, 73, 98, 0.7) 0%, rgba(45, 72, 92, 0.7) 100%)",
                  zIndex: -1,
                }}
              ></div>
  
              <div className="w-full relative">
                <h3 className="relative text-[#EAFBFF] font-bold text-lg px-4 py-2 text-center">
                  {title}
                </h3>
                <div
                  className="border-t-2 mt-2"
                  style={{
                    borderWidth: "1px",
                    borderImageSource:
                      "radial-gradient(13.75% 27.94% at 50% 50%, rgba(39, 73, 98, 0.7) 0%, rgba(45, 72, 92, 0.7) 100%)",
                    borderImageSlice: 1,
                  }}
                ></div>
              </div>
  
              {/* Box Content */}
              <div className="px-4 pt-6 pb-6">
                <p className="text-sm line-clamp-[7]">{content}</p>
              </div>
  
              <div className="w-full absolute bottom-0 left-0">
                <div
                  className="border-t-2"
                  style={{
                    borderWidth: "1px",
                    borderImageSource:
                      "radial-gradient(13.75% 27.94% at 50% 50%, rgba(39, 73, 98, 0.7) 0%, rgba(45, 72, 92, 0.7) 100%)",
                    borderImageSlice: 1,
                  }}
                ></div>
                <h3 className="relative text-[#EAFBFF] font-bold text-lg px-4 py-4 w-full text-center">
                  {/* {title} */}
                </h3>
              </div>
            </div>
          
  )
}

export default AgreementBox
