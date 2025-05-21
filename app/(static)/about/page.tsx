import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "About Us | Tanscrow - Your Trusted Digital Escrow Partner",
  description:
    "Learn about Tanscrow's mission to make online transactions safer, our team, and our commitment to providing secure digital escrow services.",
  openGraph: {
    title: "About Tanscrow - Your Trusted Digital Escrow Partner",
    description:
      "Learn about our mission to make online transactions safer and more secure through our digital escrow service.",
    type: "website",
    siteName: "Tanscrow",
  },
};

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto">
            <div itemScope itemType="https://schema.org/Organization">
              <h1
                className="text-3xl md:text-4xl font-bold mb-8"
                itemProp="name"
              >
                About Tanscrow
              </h1>

              <div className="prose dark:prose-invert max-w-none">
                <div className="mb-12">
                  <h2 className="text-2xl font-semibold mt-8 mb-4">
                    Our Mission
                  </h2>
                  <p itemProp="description">
                    At Tanscrow, we&apos;re on a mission to make online
                    transactions safer and more secure for everyone. We
                    understand the challenges and risks involved in online
                    purchases, which is why we&apos;ve created a robust digital
                    escrow platform that protects both buyers and sellers.
                  </p>
                </div>

                <div className="mb-12">
                  <h2 className="text-2xl font-semibold mt-8 mb-4">
                    Why Choose Tanscrow
                  </h2>
                  <ul className="space-y-4">
                    <li>
                      <strong>Security First:</strong> Your security is our top
                      priority. We use bank-level encryption and security
                      measures to protect your transactions.
                    </li>
                    <li>
                      <strong>Transparent Process:</strong> Our escrow process
                      is straightforward and transparent, with clear steps and
                      communication throughout.
                    </li>
                    <li>
                      <strong>Expert Support:</strong> Our dedicated support
                      team is available 24/7 to assist you with any questions or
                      concerns.
                    </li>
                    <li>
                      <strong>Global Reach:</strong> We facilitate secure
                      transactions for clients worldwide, supporting multiple
                      currencies and payment methods.
                    </li>
                  </ul>
                </div>

                <div className="mb-12">
                  <h2 className="text-2xl font-semibold mt-8 mb-4">
                    Our Values
                  </h2>
                  <ul className="space-y-4">
                    <li>
                      <strong>Trust:</strong> Building and maintaining trust is
                      at the core of everything we do.
                    </li>
                    <li>
                      <strong>Innovation:</strong> We continuously improve our
                      platform to provide the best possible service.
                    </li>
                    <li>
                      <strong>Integrity:</strong> We operate with complete
                      transparency and honesty in all our dealings.
                    </li>
                    <li>
                      <strong>Customer Focus:</strong> Your success and
                      satisfaction drive our decisions and actions.
                    </li>
                  </ul>
                </div>

                <div className="mb-12">
                  <h2 className="text-2xl font-semibold mt-8 mb-4">
                    Our Commitment
                  </h2>
                  <p>
                    We&apos;re committed to providing a secure, efficient, and
                    user-friendly platform that makes online transactions safer
                    for everyone. Whether you&apos;re a business owner,
                    freelancer, or individual buyer, we&apos;re here to ensure
                    your transactions are protected.
                  </p>
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
