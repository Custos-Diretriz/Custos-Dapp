import React from "react";
import Image from "next/image";
import { FaDiscord, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <div className="bg-black py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-gray-700 text-base bg-gradient-to-r from-[#EAF9FF] to-[#8E9A9A] bg-clip-text text-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 place-items-start">
          <div>
            <Image
              src="/logo.png"
              alt="Custos Logo"
              width={150}
              height={50}
              className="mb-4"
            />
            <p className="mb-2">Questions? Comments? Concerns?</p>
            <p>
              Send us a mail at{" "}
              <a href="mailto:admin@custosdiretriz.com" className="">
                admin@custosdiretriz.com
              </a>
            </p>
          </div>
          <div className="text-start md:text-left">
            <h3 className="text-xl font-semibold mb-2">Company</h3>
            <ul>
              <li>
                <a href="/about" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" className="hover:underline">
                  Services
                </a>
              </li>
            </ul>
          </div>
          <div className="text-start md:text-left">
            <h3 className="text-xl font-semibold mb-2">Legal</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          <div className="text-start md:text-left">
            <h3 className="text-xl font-semibold mb-2">Resources</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  Docs
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  System Status
                </a>
              </li>
            </ul>
          </div>
          <div className="text-start md:text-left">
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <ul className="flex flex-col items-start md:items-start">
              <li className="flex items-center mb-2 ">
                <FaDiscord className="mr-2 text-white" />
                <a
                  href="https://discord.com/invite/R7PgreKj"
                  className="hover:underline"
                >
                  Discord
                </a>
              </li>
              <li className="flex items-center mb-2">
                <FaTwitter className="mr-2 text-white" />
                <a
                  href="https://twitter.com/custosdiretriz"
                  className="hover:underline"
                >
                  Twitter
                </a>
              </li>
              <li className="flex items-center mb-2">
                <FaLinkedin className="mr-2 text-white" />
                <a href="https://www.linkedin.com/company/custosdiretriz/" className="hover:underline">
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center mb-2">
                <FaGithub className="mr-2 text-white" />
                <a
                  href="https://github.com/Custos-Diretriz"
                  className="hover:underline"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center">
          © 2025 Custos Diretriz. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Footer;
