import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Tanscrow",
  description:
    "Find answers to common questions about Tanscrow's digital escrow service, transaction process, fees, and security measures.",
};

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">
              Frequently Asked Questions
            </h1>

            <div className="prose dark:prose-invert max-w-none">
              <div itemScope itemType="https://schema.org/FAQPage">
                <div
                  itemScope
                  itemType="https://schema.org/Question"
                  itemProp="mainEntity"
                >
                  <h2
                    className="text-2xl font-semibold mt-8 mb-4"
                    itemProp="name"
                  >
                    What is Tanscrow and how does it work?
                  </h2>
                  <div
                    itemScope
                    itemType="https://schema.org/Answer"
                    itemProp="acceptedAnswer"
                  >
                    <p itemProp="text">
                      Tanscrow is a secure digital escrow service that acts as a
                      trusted third party in online transactions. When you make
                      a purchase, we hold the payment safely until both buyer
                      and seller fulfill their obligations. This protects both
                      parties and ensures a smooth transaction process.
                    </p>
                  </div>
                </div>

                <div
                  itemScope
                  itemType="https://schema.org/Question"
                  itemProp="mainEntity"
                >
                  <h2
                    className="text-2xl font-semibold mt-8 mb-4"
                    itemProp="name"
                  >
                    How much does Tanscrow cost?
                  </h2>
                  <div
                    itemScope
                    itemType="https://schema.org/Answer"
                    itemProp="acceptedAnswer"
                  >
                    <p itemProp="text">
                      Our fees are transparent and competitive. The exact fee
                      depends on the transaction amount and type. You can view
                      our current fee structure on our pricing page. The fee is
                      typically a small percentage of the transaction amount.
                    </p>
                  </div>
                </div>

                <div
                  itemScope
                  itemType="https://schema.org/Question"
                  itemProp="mainEntity"
                >
                  <h2
                    className="text-2xl font-semibold mt-8 mb-4"
                    itemProp="name"
                  >
                    How does Tanscrow protect my money?
                  </h2>
                  <div
                    itemScope
                    itemType="https://schema.org/Answer"
                    itemProp="acceptedAnswer"
                  >
                    <p itemProp="text">
                      We use bank-level security measures to protect your funds.
                      All transactions are encrypted, and funds are held in
                      secure escrow accounts. We also have a comprehensive
                      dispute resolution process in case any issues arise during
                      the transaction.
                    </p>
                  </div>
                </div>

                <div
                  itemScope
                  itemType="https://schema.org/Question"
                  itemProp="mainEntity"
                >
                  <h2
                    className="text-2xl font-semibold mt-8 mb-4"
                    itemProp="name"
                  >
                    What happens if there&apos;s a dispute?
                  </h2>
                  <div
                    itemScope
                    itemType="https://schema.org/Answer"
                    itemProp="acceptedAnswer"
                  >
                    <p itemProp="text">
                      If a dispute arises, our dedicated support team will
                      review the case and mediate between both parties.
                      We&apos;ll examine all evidence provided and work towards
                      a fair resolution. The funds remain safely in escrow until
                      the dispute is resolved.
                    </p>
                  </div>
                </div>

                <div
                  itemScope
                  itemType="https://schema.org/Question"
                  itemProp="mainEntity"
                >
                  <h2
                    className="text-2xl font-semibold mt-8 mb-4"
                    itemProp="name"
                  >
                    How long does the escrow process take?
                  </h2>
                  <div
                    itemScope
                    itemType="https://schema.org/Answer"
                    itemProp="acceptedAnswer"
                  >
                    <p itemProp="text">
                      The duration varies depending on the transaction type and
                      both parties&apos; actions. Typically, once payment is
                      received, the seller delivers the goods or services, and
                      after the buyer confirms satisfaction, we release the
                      funds to the seller within 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
}
