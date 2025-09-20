"use client"
import { useState } from "react";
import StepOne from "./components/step1";
import StepTwo from "./components/step2";
import StepThree from "./components/step3";
import Step4 from "./components/step4";
import StepFive from "./components/step5";
import StepSix from "./components/step6";
import StepSeven from "./components/step8";
import StepEight from "./components/step8";

export default function CreateAgreementWithAi() {
  const [step, setStep] = useState(1);

  console.log("Current Step:", step);
  return (
    <>
      {/* <StepThree setStep={setStep} /> */}
      {/* <StepThree setStep={setStep} /> */}
      {step === 1 && <StepOne setStep={setStep} />}
      {step === 2 && <StepTwo setStep={setStep} />}
      {step === 3 && <StepThree setStep={setStep} />}
      {step === 4 && <Step4 setStep={setStep} />}
      {step === 5 && <StepFive setStep={setStep} />}
      {step === 6 && <StepSix setStep={setStep} />}
      {step === 7 && <StepSeven setStep={setStep} />}
      {step === 8 && <StepEight setStep={setStep} />}
    </>
  );
}
