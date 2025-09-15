"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function StepSeven({ setStep }) {
  const steps = [
    "Employment contract",
    "Effective from...",
    "Identifying second party",
    "Terms of agreement",
    "Creating agreement",
    "Adding extra spices",
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 3000); // move every 3 seconds
      return () => clearTimeout(timer);
    }

    if (currentStep === steps.length) {
      // When all steps are done → move to step 7
      const finalTimer = setTimeout(() => {
        setStep(8);
      }, 1000); // slight delay so last animation finishes
      return () => clearTimeout(finalTimer);
    }
  }, [currentStep, steps.length, setStep]);

  return (
    <div className="p-8 flex items-center justify-center flex-col gap-14">
      <div className="text-center flex flex-col">
        <h1 className="text-[28px] text-[#8E9A9A] font-bold">
          A moment, Custos Lawyer is cooking!
        </h1>
        <p>We are creating your agreement. It will be ready in a moment.</p>
      </div>

      <div className="flex flex-col gap-4 items-start">
        {steps.map((step, index) => {
          let status = "waiting"; // default
          if (index < currentStep) status = "completed";
          if (index === currentStep) status = "pending";

          const icons = {
            completed: "/checkmark-circle-completed.svg",
            pending: "/checkmark-circle-pending.svg",
            waiting: "/checkmark-circle-waiting.svg",
          };

          const textColors = {
            completed: "text-[#0094FF]",
            pending: "text-white animate-pulse",
            waiting: "text-gray-400",
          };

          return (
            <div
              key={index}
              className={`flex items-center justify-center gap-2 transition-all duration-500 ease-in-out`}
            >
              <Image
                src={icons[status]}
                alt={step}
                width={24}
                height={24}
                className={`fade-in-image`}
              />
              <p className={`${textColors[status]} transition-all`}>{step}</p>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .fade-in-image {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
