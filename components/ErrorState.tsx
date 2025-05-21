"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the props interface
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="bg-red-100 p-3 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <p className="text-lg font-medium text-muted-foreground mb-4">
        {message}
      </p>
      {onRetry && <Button onClick={onRetry}>Try Again</Button>}
    </div>
  );
};

export default ErrorState;
