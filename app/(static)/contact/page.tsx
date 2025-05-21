import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Tanscrow - Get in Touch",
  description:
    "Contact Tanscrow's support team for assistance with your digital escrow transactions. We're here to help 24/7.",
  openGraph: {
    title: "Contact Tanscrow - We're Here to Help",
    description:
      "Get in touch with our support team for assistance with your transactions and account.",
    type: "website",
    siteName: "Tanscrow",
  },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto">
            <div itemScope itemType="https://schema.org/ContactPage">
              <h1 className="text-3xl md:text-4xl font-bold mb-8">
                Contact Us
              </h1>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg mb-8">
                  Have questions about our escrow service? Our support team is
                  available 24/7 to assist you. Choose your preferred method of
                  contact below.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div itemScope itemType="https://schema.org/Organization">
                    <h2 className="text-2xl font-semibold mb-6">
                      Contact Information
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 mt-1" />
                        <div>
                          <p className="font-medium">Phone Support</p>
                          <p itemProp="telephone">+1 (800) 123-4567</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Available 24/7
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 mt-1" />
                        <div>
                          <p className="font-medium">Email Support</p>
                          <p itemProp="email">support@tanscrow.com</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Response within 24 hours
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 mt-1" />
                        <div
                          itemProp="address"
                          itemScope
                          itemType="https://schema.org/PostalAddress"
                        >
                          <p className="font-medium">Office Address</p>
                          <p>
                            <span itemProp="streetAddress">
                              123 Business Avenue
                            </span>
                            , <span itemProp="addressLocality">New York</span>,{" "}
                            <span itemProp="addressRegion">NY</span>{" "}
                            <span itemProp="postalCode">10001</span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Business Hours: Mon-Fri, 9 AM - 6 PM EST
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold mb-6">
                      Quick Support
                    </h2>
                    <div className="space-y-4">
                      <p>For the fastest support:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          Check our{" "}
                          <a
                            href="/faq"
                            className="text-primary hover:underline"
                          >
                            FAQ page
                          </a>{" "}
                          for instant answers
                        </li>
                        <li>
                          Log in to your account to view transaction status
                        </li>
                        <li>
                          Email us with your transaction ID for specific
                          inquiries
                        </li>
                      </ul>
                      <p className="mt-4">
                        For urgent matters related to active transactions,
                        please use our phone support line for immediate
                        assistance.
                      </p>
                    </div>
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
