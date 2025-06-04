"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  XCircle,
  Truck,
} from "lucide-react";
import { User } from "@/types/user";
import { Transaction, TransactionStatus } from "@/types/transaction";
import { ActionType } from "./TransactionActions";

interface TransactionHeaderProps {
  transaction: Transaction;
  user: User;
  setActiveAction: (action: ActionType) => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  transaction,
  user,
  setActiveAction,
}) => {
  const isBuyer = transaction.buyer.id === user.id;
  const isSeller = transaction.seller.id === user.id;

  const getStatusBadgeVariant = (status: TransactionStatus) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "IN_PROGRESS":
        return "default";
      case "COMPLETED":
      case "DELIVERED":
        return "success";
      case "DISPUTED":
      case "REFUND_REQUESTED":
        return "destructive";
      case "CANCELED":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getActionButtons = () => {
    // Buyer actions
    if (isBuyer) {
      switch (transaction.status) {
        case "PENDING":
          return (
            <Button
              onClick={() => setActiveAction("PAYMENT")}
              className="w-full md:w-auto"
            >
              Pay Now
            </Button>
          );
        case "IN_PROGRESS":
          return (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => setActiveAction("CONFIRM_DELIVERY")}
                className="w-full md:w-auto"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Delivery
              </Button>
              <Button
                onClick={() => setActiveAction("CANCEL")}
                variant="outline"
                className="w-full md:w-auto"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          );
        case "DELIVERED":
          return (
            <Button
              // onClick={() => setActiveAction("RELEASE_ESCROW")}
              className="w-full md:w-auto"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Payment sent
            </Button>
          );
        case "IN_PROGRESS":
        case "DELIVERED":
          if (transaction.escrowStatus === "FUNDED") {
            return (
              <Button
                onClick={() => setActiveAction("REQUEST_REFUND")}
                variant="outline"
                className="w-full md:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Request Refund
              </Button>
            );
          }
          break;
      }
    }

    // Seller actions
    if (isSeller) {
      switch (transaction.status) {
        case "IN_PROGRESS":
          return (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => setActiveAction("UPDATE_DELIVERY")}
                className="w-full md:w-auto"
              >
                <Truck className="mr-2 h-4 w-4" />
                Update Delivery
              </Button>
              <Button
                onClick={() => setActiveAction("CANCEL")}
                variant="outline"
                className="w-full md:w-auto"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          );
      }
    }

    // Common actions for both buyer and seller
    if (
      (isBuyer || isSeller) &&
      transaction.status !== "COMPLETED" &&
      transaction.status !== "CANCELED" &&
      transaction.escrowStatus !== "REFUNDED"
    ) {
      return (
        <Button
          onClick={() => setActiveAction("DISPUTE")}
          variant="destructive"
          className="w-full md:w-auto"
          disabled={transaction.status === TransactionStatus.DISPUTED}
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Raise Dispute
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {transaction.title}
          </h2>
          <Badge variant={getStatusBadgeVariant(transaction.status)}>
            {transaction.status.replace("_", " ")}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Transaction Code: {transaction.transactionCode}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        {getActionButtons()}
      </div>
    </div>
  );
};

export default TransactionHeader;
