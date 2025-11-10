"use client";

import React from "react";
import { Loader2 } from "lucide-react";

// Define props interface
interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-full ${className}`}
    >
      <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingState;
