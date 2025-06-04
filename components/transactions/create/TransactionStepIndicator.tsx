// src/components/transactions/create/TransactionStepIndicator.tsx
import React from "react";

interface TransactionStepIndicatorProps {
  currentStep: number;
}

export default function TransactionStepIndicator({
  currentStep,
}: TransactionStepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${
            currentStep >= 1
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          1
        </div>
        <span
          className={currentStep >= 1 ? "font-medium" : "text-muted-foreground"}
        >
          Details
        </span>
      </div>
      <div className="h-0.5 flex-1 bg-muted mx-2" />
      <div className="flex items-center space-x-2">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${
            currentStep >= 2
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          2
        </div>
        <span
          className={currentStep >= 2 ? "font-medium" : "text-muted-foreground"}
        >
          Party
        </span>
      </div>
      <div className="h-0.5 flex-1 bg-muted mx-2" />
      <div className="flex items-center space-x-2">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${
            currentStep >= 3
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          3
        </div>
        <span
          className={currentStep >= 3 ? "font-medium" : "text-muted-foreground"}
        >
          Confirm
        </span>
      </div>
    </div>
  );
}
