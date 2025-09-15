"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaPlus } from "react-icons/fa";
// import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is Custos Diretriz?",
    answer:
      "Custos Diretriz is a blockchain-powered platform designed to protect trust between people and organizations. Right now, it does two powerful things: ",
  },
  {
    question: "How does the agreement creation work?",
    answer:
      "You can create legally sound agreements, sign them digitally, and store them securely on the blockchain with AI assistance.",
  },
  {
    question: "Why should I record a crime on Custos?",
    answer:
      "Recording crimes creates tamper-proof evidence on the blockchain that can be trusted in future investigations or legal processes.",
  },
  {
    question: "Is Custos legally recognized?",
    answer:
      "Yes, agreements and records stored on the blockchain can be used as legally binding evidence in many jurisdictions.",
  },
  {
    question: "What makes Custos different from other tools?",
    answer:
      "Custos combines agreement signing, AI summarization, and blockchain crime recording into one secure platform.",
  },
  {
    question: "Who can use Custos?",
    answer:
      "Anyone who needs fairness, transparency, and accountability—whether individuals or organizations.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" border-t-[0.2px] border-[#8080805e]">
      <div className="max-w-3xl mx-auto space-y-4 mb-12 border-l-[0.2px] py-10 border-[#8080805e]">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b-[0.2px] px-10 border-[#8080805e] pb-3"
          >
            <button
              className="flex items-center gap-8 w-full text-left text-lg font-medium text-gray-200 focus:outline-none"
              onClick={() => toggle(index)}
            >
              <motion.span
                animate={{ rotate: openIndex === index ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaPlus className="w-5 h-5 text-gray-400" />
              </motion.span>
              {faq.question}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 text-gray-400 text-sm leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
