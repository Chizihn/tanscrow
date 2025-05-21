"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "./ui/AnimatedSection";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is Tanscrow and how does it work?",
    answer:
      "Tanscrow is a secure digital escrow service that facilitates safe transactions between buyers and sellers. We act as a trusted third party, holding funds until both parties fulfill their obligations.",
  },
  {
    question: "How secure are transactions on Tanscrow?",
    answer:
      "We employ bank-level security measures, including encryption and secure payment processing. Your funds are held in segregated accounts, and all transactions are monitored for fraud prevention.",
  },
  {
    question: "What fees does Tanscrow charge?",
    answer:
      "Our fee structure is transparent and competitive. We charge a small percentage of the transaction value, which varies based on the transaction size and type. View our pricing page for detailed information.",
  },
  {
    question: "How long does the escrow process take?",
    answer:
      "The duration varies depending on the transaction type and terms agreed upon by both parties. Typically, once both parties fulfill their obligations, funds are released within 24-48 hours.",
  },
  {
    question: "What happens if there's a dispute?",
    answer:
      "We have a comprehensive dispute resolution process. Our team will review the case, examine evidence from both parties, and make a fair decision based on our terms of service and applicable regulations.",
  },
];

function FAQItem({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex justify-between items-center w-full py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-4"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-600 dark:text-gray-300">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
