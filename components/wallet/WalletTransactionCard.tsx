import {
  WalletTransaction,
  WalletTransactionStatus,
  WalletTransactionType,
} from "@/types/wallet";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Clock,
  Plus,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDate } from "@/utils";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Add this import
import { APP_URL } from "@/constants";

interface WalletTransactionCardProps {
  transaction: Partial<WalletTransaction>;
}

const WalletTransactionCard: React.FC<WalletTransactionCardProps> = ({
  transaction,
}) => {
  const typeInfo = getTransactionTypeInfo(
    transaction.type as WalletTransactionType
  );
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter(); // Add this line

  const handleConfirmPayment = async () => {
    if (
      !transaction.reference ||
      transaction.status !== WalletTransactionStatus.PENDING
    ) {
      return;
    }
    setIsConfirming(true);

    router.push(
      `${APP_URL}/payment/verify/paystack?trxref=${encodeURIComponent(
        transaction.reference
      )}&reference=${encodeURIComponent(transaction.reference)}`
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full bg-muted ${typeInfo.color}`}>
              {typeInfo.icon}
            </div>
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(transaction.createdAt as Date)} •
                <span className="font-medium">{transaction.reference}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">
              ₦{transaction.amount?.toLocaleString()}
            </p>
            <Badge
              variant={getStatusBadgeVariant(
                transaction.status as WalletTransactionStatus
              )}
            >
              {transaction.status}
            </Badge>
            {transaction.status === WalletTransactionStatus.PENDING &&
              transaction.type !== WalletTransactionType.WITHDRAWAL && (
                <Button
                  variant="default"
                  size="sm"
                  className="ml-4"
                  onClick={handleConfirmPayment}
                  disabled={isConfirming}
                >
                  {isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm Payment"
                  )}
                </Button>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletTransactionCard;

// Helper functions used in the component
function getTransactionTypeInfo(type: WalletTransactionType) {
  switch (type) {
    case WalletTransactionType.DEPOSIT:
      return {
        icon: <ArrowDown className="h-4 w-4" />,
        color: "text-green-600",
      };
    case WalletTransactionType.WITHDRAWAL:
      return { icon: <ArrowUp className="h-4 w-4" />, color: "text-red-600" };
    case WalletTransactionType.ESCROW_FUNDING:
      return {
        icon: <ArrowUpRight className="h-4 w-4" />,
        color: "text-blue-600",
      };
    case WalletTransactionType.ESCROW_RELEASE:
      return {
        icon: <ArrowDown className="h-4 w-4" />,
        color: "text-green-600",
      };
    case WalletTransactionType.ESCROW_REFUND:
      return {
        icon: <ArrowDown className="h-4 w-4" />,
        color: "text-amber-600",
      };
    case WalletTransactionType.FEE_PAYMENT:
      return { icon: <ArrowUp className="h-4 w-4" />, color: "text-red-600" };
    case WalletTransactionType.BONUS:
      return { icon: <Plus className="h-4 w-4" />, color: "text-green-600" };
    default:
      return { icon: <Clock className="h-4 w-4" />, color: "text-gray-600" };
  }
}

function getStatusBadgeVariant(status: WalletTransactionStatus) {
  switch (status) {
    case WalletTransactionStatus.COMPLETED:
      return "success";
    case WalletTransactionStatus.PENDING:
      return "secondary";
    case WalletTransactionStatus.FAILED:
      return "destructive";
    case WalletTransactionStatus.REVERSED:
      return "outline";
    default:
      return "secondary";
  }
}
