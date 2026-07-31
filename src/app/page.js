"use client";

import Hero from "../components/home/hero";
import Navbar from "../components/navbar";
// import Footer from "@/components/footer";
import Agree from "../components/home/agree";
import FadeInSection from "../components/fadeInSection";
import InstallPWA from "../components/InstallPWA";
import { useEffect } from "react";
import Image from "next/image";
const isBrowser = () => typeof window !== "undefined"; 
import "./globals.css";
export default function Home() {
  // useEffect(() => { }, [isBrowser()]);

  return (
    <div className="min-h-screen kanit">
      {isBrowser() && <InstallPWA />}
      <main className="kanit">
        <div className="">
          <Navbar />
        </div>
        <FadeInSection>
          <Hero />
        </FadeInSection>
        <div className="bg-black py-8 flex md:flex-ro items-center justify-center gap-8 md:gap-40">
          <div className="flex flex-col items-center justify-center space-y-4 md:flex">
            <Image
              src={"./seccure.svg"}
              alt="Card Image"
              // layout="responsive"
              width={70}
              height={70}
              className="will-change-auto md:w-[100%]  object-cover rounded-lg"
            />
            <p>Secure</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Image
              src={"./tamper-proof.svg"}
              alt="Card Image"
              // layout="responsive"
              width={70}
              height={70}
              className="will-change-auto md:w-[100%] object-cover rounded-lg"
            />
            <p>Tamper Proof</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Image
              src={"./immutable.svg"}
              alt="Card Image"
              // layout="responsive"
              width={70}
              height={70}
              className="will-change-auto md:w-[100%] object-cover rounded-lg"
            />
            <p>Immutable</p>
          </div>
        </div>
        <Agree />
      </main>
    </div>
  );
}
