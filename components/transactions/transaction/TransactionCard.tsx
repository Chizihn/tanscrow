import { Transaction } from "@/types/transaction";
import React from "react";
import { Card, CardContent } from "../../ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "../../ui/button";
import Link from "next/link";
import { formatDate } from "@/utils";

interface TransactionCardProps {
  transaction: Partial<Transaction>;
  statusColor: string;
  userId: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  statusColor,
}) => {
  // const isBuyer = transaction.buyer?.id === userId;
  // const counterparty = isBuyer ? transaction.seller : transaction.buyer;

  return (
    <Card className="hover:bg-accent/50 transition-colors border overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          {/* Header with title and status */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base truncate pr-2">
              {transaction.title}
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusColor}`}
            >
              {transaction.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {transaction.description || "No description provided"}
          </p>

          {/* Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-2">
            <div className="space-y-2">
              {/* Counterparty */}
              {/* <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {isBuyer ? "Seller" : "Buyer"}:{" "}
                  <span className="font-medium text-foreground">
                    {counterparty?.firstName} {counterparty?.lastName}
                  </span>
                </span>
              </div> */}

              {/* Date */}
              <p className="text-xs text-muted-foreground">
                Created: {formatDate(transaction.createdAt as Date)}
              </p>
            </div>

            {/* Amount and action */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <p className="font-semibold text-right">
                ₦{transaction.amount?.toLocaleString() || "0"}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
                asChild
              >
                <Link href={`/dashboard/transactions/${transaction.id}`}>
                  View <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
