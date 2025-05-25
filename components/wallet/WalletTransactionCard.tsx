import {
  WalletTransaction,
  WalletTransactionStatus,
  WalletTransactionType,
} from "@/types/wallet";
import { ArrowDown, ArrowUp, ArrowUpRight, Clock, Plus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDate } from "@/utils";

interface WalletTransactionCardProps {
  transaction: Partial<WalletTransaction>;
}

const WalletTransactionCard: React.FC<WalletTransactionCardProps> = ({
  transaction,
}) => {
  const typeInfo = getTransactionTypeInfo(
    transaction.type as WalletTransactionType
  );

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-muted ${typeInfo.color}`}>
              {typeInfo.icon}
            </div>
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(transaction.createdAt as Date)} •{" "}
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
