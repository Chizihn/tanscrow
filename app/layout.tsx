import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/components/Provider";
import { Suspense } from "react";
import LoadingState from "@/components/LoadingState";

export const metadata: Metadata = {
  title: "Escrow | Secure Digital Escrow Service",
  description:
    "Escrow is your trusted digital escrow service for safe and seamless online transactions. Protect your payments and deliveries with our secure platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<LoadingState />}>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased" suppressHydrationWarning>
          <Provider>{children}</Provider>
        </body>
      </html>
    </Suspense>
  );
}
