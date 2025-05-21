"use client";
import React from "react";
import { FileX } from "lucide-react";

interface TransactionEmptyStateProps {
  type: "all" | "deposits" | "withdrawals" | "escrow";
}

export default function TransactionEmptyState({
  type,
}: TransactionEmptyStateProps) {
  const messages = {
    all: "You don't have any transactions yet.",
    deposits: "You haven't made any deposits yet.",
    withdrawals: "You haven't made any withdrawals yet.",
    escrow: "You don't have any escrow transactions yet.",
  };

  const actionText = {
    all: "Start by funding your wallet to see transactions here.",
    deposits: "Fund your wallet to see deposits here.",
    withdrawals:
      "You need to have funds in your wallet before you can withdraw.",
    escrow:
      "Escrow transactions appear when you're involved in trades or services.",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg">
      <div className="bg-muted rounded-full p-3 mb-4">
        <FileX className="h-6 w-6 text-muted-foreground" />
      </div>
      <h4 className="text-lg font-medium">{messages[type]}</h4>
      <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
        {actionText[type]}
      </p>
    </div>
  );
}
