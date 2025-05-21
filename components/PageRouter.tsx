"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageRouterProps {
  parentPath: string;
  parentLabel: string;
}

const PageRouter: React.FC<PageRouterProps> = ({ parentPath, parentLabel }) => {
  return (
    <div className="mb-6">
      <Link
        href={parentPath}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {parentLabel}
      </Link>
    </div>
  );
};

export default PageRouter;
