// src/components/transactions/create/ConfirmationStep.tsx
import React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TransactionRole } from "@/types/transaction";
import { TransactionFormData } from "./TransactionForm";

interface ConfirmationStepProps {
  formData: TransactionFormData;
  date: Date | undefined;
  handleCreateTransaction: () => void;
  creatingTransaction: boolean;
  prevStep: () => void;
}

export default function ConfirmationStep({
  formData,
  date,
  handleCreateTransaction,
  creatingTransaction,
  prevStep,
}: ConfirmationStepProps) {
  const parsedAmount = parseFloat(formData.amount || "0") || 0;
  const rawFee = parsedAmount ? parsedAmount * 0.015 : 0;
  const escrowFee = Math.round(rawFee * 100) / 100;
  const totalAmount = parsedAmount + escrowFee;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Confirm</CardTitle>
        <CardDescription>
          Review your transaction details before confirming
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Transaction Title
              </h4>
              <p className="font-medium mt-1">{formData.title}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Transaction Type
              </h4>
              <p className="font-medium mt-1">{formData.type}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Your Role
              </h4>
              <p className="capitalize font-medium mt-1">
                {formData.role.toLowerCase()}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Amount
              </h4>
              <p className="font-medium mt-1">
                ₦{parsedAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Expected Delivery Date
              </h4>
              <p className="font-medium mt-1">
                {date ? format(date, "PPP") : "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Delivery Method
              </h4>
              <p className="font-medium mt-1">{formData.deliveryMethod}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground">
            Counterparty Email/Phone
          </h4>
          <p className="font-medium mt-1">{formData.counterpartyIdentifier}</p>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Fee Breakdown</h4>
          <div className="space-y-2 rounded-lg p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction Amount</span>
              <span className="font-medium">
                ₦{parsedAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Escrow Fee{" "}
                {formData.role === TransactionRole.BUYER ? "(1.5%)" : "(0%)"}
              </span>
              <span className="font-medium">
                ₦
                {escrowFee.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-medium">
              <span>Total Amount</span>
              <span className="text-primary">
                ₦
                {totalAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button
          onClick={handleCreateTransaction}
          disabled={creatingTransaction}
          className="min-w-[180px]"
        >
          {creatingTransaction ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Transaction"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
