"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "./ui/AnimatedSection";

export function HeroSection() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            The Safest Way to
            <span className="text-primary block mt-2">Buy and Sell Online</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-4">
            Tanscrow protects both buyers and sellers with secure escrow
            payments, ensuring your money is released only when you&apos;re 100%
            satisfied.
          </p>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-8">
            Join thousands of satisfied users who trust Tanscrow for their
            high-value online transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="btn-primary flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={18} />
            </Link>
            <Link
              href="/#how-it-works"
              className="btn-outline flex items-center justify-center gap-2"
            >
              How It Works
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-success"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>100% Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-success"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>Trusted by 10,000+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-success"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
