import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Privacy Policy | Tanscrow",
  description:
    "Learn about how Tanscrow handles your data and protects your privacy.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">
              Privacy Policy
            </h1>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg mb-6">Last Updated: June 1, 2024</p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                1. Introduction
              </h2>
              <p>
                At Tanscrow, we take your privacy seriously. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our digital escrow service. Please read
                this privacy policy carefully. If you do not agree with the
                terms of this privacy policy, please do not access the site.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                2. Information We Collect
              </h2>
              <p>
                We collect information that you provide directly to us when you
                register for an account, create or modify your profile, set
                preferences, or make transactions through our service.
              </p>
              <p>
                This information may include your name, email address, phone
                number, billing information, transaction information, and any
                other information you choose to provide.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                3. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>
                  Send technical notices, updates, security alerts, and support
                  messages
                </li>
                <li>
                  Respond to your comments, questions, and customer service
                  requests
                </li>
                <li>
                  Communicate with you about products, services, offers, and
                  events
                </li>
                <li>
                  Monitor and analyze trends, usage, and activities in
                  connection with our service
                </li>
                <li>
                  Detect, investigate, and prevent fraudulent transactions and
                  other illegal activities
                </li>
                <li>
                  Personalize and improve the service and provide content or
                  features that match user profiles or interests
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                4. Sharing of Information
              </h2>
              <p>We may share the information we collect as follows:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  With vendors, consultants, and other service providers who
                  need access to such information to carry out work on our
                  behalf
                </li>
                <li>
                  In response to a request for information if we believe
                  disclosure is in accordance with, or required by, any
                  applicable law, regulation, or legal process
                </li>
                <li>
                  If we believe your actions are inconsistent with our user
                  agreements or policies, or to protect the rights, property,
                  and safety of Tanscrow or others
                </li>
                <li>
                  In connection with, or during negotiations of, any merger,
                  sale of company assets, financing, or acquisition of all or a
                  portion of our business by another company
                </li>
                <li>
                  Between and among Tanscrow and our current and future parents,
                  affiliates, subsidiaries, and other companies under common
                  control and ownership
                </li>
                <li>With your consent or at your direction</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                5. Data Security
              </h2>
              <p>
                We take reasonable measures to help protect information about
                you from loss, theft, misuse and unauthorized access,
                disclosure, alteration, and destruction. However, no security
                system is impenetrable and we cannot guarantee the security of
                our systems 100%.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                6. Your Choices
              </h2>
              <p>
                You may update, correct, or delete your account information at
                any time by logging into your account or contacting us. If you
                wish to delete or deactivate your account, please note that we
                may retain certain information as required by law or for
                legitimate business purposes.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                7. Changes to this Privacy Policy
              </h2>
              <p>
                We may change this privacy policy from time to time. If we make
                changes, we will notify you by revising the date at the top of
                the policy and, in some cases, we may provide you with
                additional notice (such as adding a statement to our website or
                sending you a notification).
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                8. Contact Us
              </h2>
              <p>
                If you have any questions about this privacy policy, please
                contact us at:{" "}
                <a
                  href="mailto:privacy@tanscrow.com"
                  className="text-primary hover:underline"
                >
                  privacy@tanscrow.com
                </a>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
}
