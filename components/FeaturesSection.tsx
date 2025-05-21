"use client";

import { Shield, Wallet, ShieldCheck, Clock, Globe, Users } from "lucide-react";
import { AnimatedSection } from "./ui/AnimatedSection";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
};

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <AnimatedSection
      delay={delay}
      className="card flex flex-col items-center text-center h-full"
    >
      <div className="rounded-full bg-primary/10 p-3 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </AnimatedSection>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: <Wallet className="w-8 h-8 text-primary" />,
      title: "Secure Payments",
      description:
        "Your funds are held safely in escrow until you're satisfied with the received goods or services.",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Buyer Protection",
      description:
        "Shop with confidence knowing your payment is protected until you confirm receipt.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Seller Assurance",
      description:
        "Guaranteed payment once you've delivered the goods or services as agreed.",
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Timely Transactions",
      description:
        "Set clear timelines for delivery and payment release with automatic reminders.",
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Global Reach",
      description:
        "Conduct secure transactions with partners anywhere in the world.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Dispute Resolution",
      description:
        "Our dedicated team helps resolve any issues that may arise during transactions.",
    },
  ];

  return (
    <section
      id="features"
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Features That Protect You
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Tanscrow provides powerful features to ensure safe and secure
            transactions for both buyers and sellers.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
