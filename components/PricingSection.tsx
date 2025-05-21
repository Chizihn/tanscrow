"use client";

import { Check } from "lucide-react";
import { AnimatedSection } from "./ui/AnimatedSection";

type PricingTierProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  delay: number;
};

function PricingTier({
  name,
  price,
  description,
  features,
  buttonText,
  isPopular = false,
  delay,
}: PricingTierProps) {
  return (
    <AnimatedSection
      delay={delay}
      className={`card h-full flex flex-col ${
        isPopular ? "border-2 border-primary" : ""
      }`}
    >
      {isPopular && (
        <div className="bg-primary text-white text-sm font-medium py-1 px-3 rounded-full self-start mb-4">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "Custom" && (
          <span className="text-gray-500 dark:text-gray-400">/month</span>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-success flex-shrink-0 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href="/signup"
        className={`w-full text-center py-2 px-4 rounded-lg transition-colors ${
          isPopular ? "btn-primary" : "btn-outline"
        }`}
      >
        {buttonText}
      </a>
    </AnimatedSection>
  );
}

export function PricingSection() {
  const pricingTiers = [
    {
      name: "Basic",
      price: "$29",
      description:
        "Perfect for individuals and small businesses just getting started.",
      features: [
        "Up to 10 transactions per month",
        "Basic buyer & seller protection",
        "Email support",
        "Standard verification",
        "3-day fund release",
      ],
      buttonText: "Get Started",
      isPopular: false,
    },
    {
      name: "Professional",
      price: "$79",
      description:
        "Ideal for growing businesses with regular transaction needs.",
      features: [
        "Up to 50 transactions per month",
        "Advanced buyer & seller protection",
        "Priority email & chat support",
        "Enhanced verification",
        "1-day fund release",
        "Dispute resolution assistance",
      ],
      buttonText: "Get Started",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description:
        "Tailored solutions for large businesses with high-volume needs.",
      features: [
        "Unlimited transactions",
        "Premium buyer & seller protection",
        "24/7 dedicated support",
        "Advanced verification & security",
        "Same-day fund release",
        "Priority dispute resolution",
        "Custom integration options",
      ],
      buttonText: "Contact Sales",
      isPopular: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Choose the plan that fits your transaction needs. All plans include
            our core security features.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingTier
              key={tier.name}
              name={tier.name}
              price={tier.price}
              description={tier.description}
              features={tier.features}
              buttonText={tier.buttonText}
              isPopular={tier.isPopular}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
