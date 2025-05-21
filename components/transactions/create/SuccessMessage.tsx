// src/components/transactions/create/SuccessMessage.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Transaction } from "@/types/transaction";

interface SuccessMessageProps {
  transaction: Partial<Transaction> | null;
}

export default function SuccessMessage({ transaction }: SuccessMessageProps) {
  return (
    <div className="text-center py-12 space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold">Transaction Created Successfully!</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Your transaction &quot;{transaction?.title}&quot; has been created and
        the counterparty has been notified.
      </p>
      <div className="flex justify-center gap-4 pt-4">
        <Link href="/dashboard/transactions">
          <Button variant="outline">View All Transactions</Button>
        </Link>
        <Link href={`/dashboard/transactions/${transaction?.id}`}>
          <Button>View Transaction Details</Button>
        </Link>
      </div>
    </div>
  );
}
