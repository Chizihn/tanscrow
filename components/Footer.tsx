"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/#features" },
        { name: "How It Works", href: "/#how-it-works" },
        { name: "Pricing", href: "/#pricing" },
        { name: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "Security", href: "/security" },
        { name: "Compliance", href: "/compliance" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "https://facebook.com" },
    { icon: <Twitter size={20} />, href: "https://twitter.com" },
    { icon: <Instagram size={20} />, href: "https://instagram.com" },
    { icon: <Linkedin size={20} />, href: "https://linkedin.com" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-primary">Tanscrow</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Tanscrow is your trusted digital escrow service for safe and
              seamless online transactions. We protect both buyers and sellers
              with our secure platform.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors"
                  aria-label={`Social media link ${index + 1}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact information */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@tanscrow.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail size={16} />
                  info@tanscrow.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Phone size={16} />
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center md:flex md:justify-between md:text-left">
          <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            © {currentYear} Tanscrow. All rights reserved.
          </p>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 justify-center md:justify-start">
            <Link
              href="/privacy-policy"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
