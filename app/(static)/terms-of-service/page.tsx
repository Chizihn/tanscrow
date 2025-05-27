import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Terms of Service | Tanscrow",
  description:
    "Read the terms and conditions for using Tanscrow's digital escrow services.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">
              Terms of Service
            </h1>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg mb-6">Last Updated: June 1, 2024</p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Tanscrow&apos;s services, you agree to be
                bound by these Terms of Service and all applicable laws and
                regulations. If you do not agree with any of these terms, you
                are prohibited from using or accessing this site.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                2. Description of Service
              </h2>
              <p>
                Tanscrow provides a digital escrow service that facilitates
                transactions between buyers and sellers. We act as a neutral
                third party that holds funds until both parties fulfill their
                obligations as agreed upon.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                3. User Accounts
              </h2>
              <p>
                To use our services, you must create an account. You are
                responsible for maintaining the confidentiality of your account
                information and for all activities that occur under your
                account. You agree to notify us immediately of any unauthorized
                use of your account.
              </p>
              <p>
                You must provide accurate, current, and complete information
                during the registration process and keep your account
                information updated. We reserve the right to suspend or
                terminate your account if any information provided proves to be
                inaccurate, not current, or incomplete.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                4. Fees and Payments
              </h2>
              <p>
                Tanscrow charges a service fee for each transaction processed
                through our platform. This fee is calculated as a percentage of
                the transaction value and is deducted from the transaction
                amount. The exact fee percentage may vary based on the
                transaction size and complexity. We reserve the right to change
                our fees at any time with notice to our users. All fees are
                non-refundable unless otherwise specified.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                5. Transaction Process
              </h2>
              <p>
                When using our escrow service, the buyer deposits funds with
                Tanscrow. We hold these funds until the buyer confirms
                satisfaction with the goods or services provided by the seller.
                Once confirmed, we release the funds to the seller.
              </p>
              <p>
                If a dispute arises, our dispute resolution process will be
                initiated. Both parties agree to cooperate with this process and
                abide by the final decision.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                6. Prohibited Activities
              </h2>
              <p>
                Users are prohibited from using Tanscrow for any illegal
                activities, including but not limited to money laundering,
                fraud, or the sale of illegal goods or services. We reserve the
                right to report suspicious activities to appropriate
                authorities.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                7. Limitation of Liability
              </h2>
              <p>
                Tanscrow shall not be liable for any direct, indirect,
                incidental, special, consequential, or exemplary damages
                resulting from your use or inability to use the service or for
                the cost of procurement of substitute services.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                8. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless Tanscrow, its
                officers, directors, employees, agents, and third parties, for
                any losses, costs, liabilities, and expenses relating to or
                arising out of your use of the service or your violation of
                these Terms of Service.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                9. Modifications to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms of Service at any
                time. We will notify users of any significant changes. Your
                continued use of the service after such modifications
                constitutes your acceptance of the revised terms.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                10. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of [Jurisdiction], without regard to its conflict
                of law provisions.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                11. Contact Information
              </h2>
              <p>
                If you have any questions about these Terms, please contact us
                at:{" "}
                <a
                  href="mailto:legal@tanscrow.com"
                  className="text-primary hover:underline"
                >
                  legal@tanscrow.com
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
