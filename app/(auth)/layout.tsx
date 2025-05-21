// auth/layout.jsx
"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex flex-row bg-gradient-to-br from-background to-secondary/50">
      {/* Children container - fixed width on the left with overflow scrolling */}
      <Card className="min-h-screen lg:max-w-[30rem] w-full flex flex-col rounded-none p-0 m-0 overflow-y-auto scrollbar-none lg:border-4 lg:border-r-sidebar-primary ">
        <div className="w-full h-full ">{children}</div>
      </Card>

      {/* Image container - takes the rest of the space */}
      <div className="hidden lg:flex h-screen w-full relative">
        <Image
          src="/images/tanscow-auth.png"
          alt="Tanscow auth placeholder"
          priority
          fill
          quality={100}
          loading="eager"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
          className="opacity-65"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
