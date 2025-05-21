"use client";

import { AnimatedSection } from "./ui/AnimatedSection";

type StepProps = {
  number: number;
  title: string;
  description: string;
  delay: number;
};

function Step({ number, title, description, delay }: StepProps) {
  return (
    <AnimatedSection delay={delay} className="relative">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
          {number}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      {number < 4 && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />
      )}
    </AnimatedSection>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Create an Account",
      description:
        "Sign up for a free Tanscrow account in minutes. Verify your identity to enhance security.",
    },
    {
      number: 2,
      title: "Initiate a Transaction",
      description:
        "Create a new transaction, specify details, and invite the other party to join.",
    },
    {
      number: 3,
      title: "Secure Payment",
      description:
        "Buyer deposits funds into Tanscrow's secure escrow account. Seller is notified when funds are received.",
    },
    {
      number: 4,
      title: "Delivery & Confirmation",
      description:
        "Seller delivers goods or services. Buyer confirms receipt and satisfaction, releasing funds to the seller.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Tanscrow Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Our simple 4-step process ensures safe and secure transactions for
            both parties.
          </p>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto space-y-12 md:space-y-16">
          {steps.map((step, index) => (
            <Step
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>

        <AnimatedSection delay={0.6} className="mt-16 text-center">
          <a
            href="/signup"
            className="btn-primary inline-flex items-center justify-center"
          >
            Start Your First Secure Transaction
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
