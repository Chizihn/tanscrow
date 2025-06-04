"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import {
  EscrowStatus,
  Transaction,
  TransactionStatus,
} from "@/types/transaction";
import { DEFAULT_USER_IMG } from "@/constants";
import { format } from "date-fns";

interface TransactionInfoProps {
  transaction: Transaction;
  isBuyer: boolean;
}

const TransactionInfo: React.FC<TransactionInfoProps> = ({
  transaction,
  isBuyer,
}) => {
  const getEscrowBadgeVariant = (status: EscrowStatus) => {
    switch (status) {
      case "NOT_FUNDED":
        return "outline";
      case "FUNDED":
        return "default";
      case "RELEASED":
        return "success";
      case "REFUNDED":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Description
            </h4>
            <p>{transaction.description}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Transaction Type
            </h4>
            <p>{transaction.type}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Amount
            </h4>
            <p>₦{transaction.amount.toLocaleString()}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Escrow Fee
            </h4>
            <p>₦{transaction.escrowFee.toLocaleString()}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Total Amount
            </h4>
            <p className="font-semibold">
              ₦{transaction.totalAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Escrow Status
            </h4>
            <Badge variant={getEscrowBadgeVariant(transaction.escrowStatus)}>
              {transaction.escrowStatus.replace("_", " ")}
            </Badge>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Created Date
            </h4>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(transaction.createdAt), "PPP")}</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Expected Delivery
            </h4>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {transaction.expectedDeliveryDate
                  ? format(new Date(transaction.expectedDeliveryDate), "PPP")
                  : "Not specified"}
              </span>
            </div>
          </div>

          {transaction.deliveryMethod && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Delivery Method
              </h4>
              <p>{transaction.deliveryMethod}</p>
            </div>
          )}

          {transaction.status === TransactionStatus.COMPLETED && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Actual Delivery Date
              </h4>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {transaction.actualDeliveryDate
                    ? format(new Date(transaction.actualDeliveryDate), "PPP")
                    : "Not specified"}
                </span>
              </div>
            </div>
          )}

          {transaction.trackingInfo && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Tracking Information
              </h4>
              <p>{transaction.trackingInfo}</p>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Parties Involved</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg flex items-center gap-3">
              <div className="flex-shrink-0">
                <Image
                  src={transaction.buyer?.profileImageUrl || DEFAULT_USER_IMG}
                  alt={`${transaction.buyer.firstName} ${transaction.buyer.lastName}`}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <div>
                <h5 className="text-sm font-medium text-muted-foreground">
                  Buyer {isBuyer && "(You)"}
                </h5>
                <p className="font-medium">
                  {transaction.buyer.firstName} {transaction.buyer.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.buyer.email}
                </p>
              </div>
            </div>
            <div className="p-4 border rounded-lg flex items-center gap-3">
              <div className="flex-shrink-0">
                <Image
                  src={transaction.seller?.profileImageUrl || DEFAULT_USER_IMG}
                  alt={`${transaction.seller.firstName} ${transaction.seller.lastName}`}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <div>
                <h5 className="text-sm font-medium text-muted-foreground">
                  Seller {!isBuyer && "(You)"}
                </h5>
                <p className="font-medium">
                  {transaction.seller.firstName} {transaction.seller.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.seller.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionInfo;
