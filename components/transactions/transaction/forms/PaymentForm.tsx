import { showErrorToast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Transaction } from "@/types/transaction";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";

interface PaymentFormProps {
  transaction: Transaction;
  onSubmit: (transactionId: string) => void;
  loading: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      onSubmit(transaction.id);
      // Optionally call showSuccessMessage if `onSubmit` is synchronous and successful here
    } catch (error) {
      console.log("Payment failed error", error);

      showErrorToast("Payment failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 mb-6">
        <div className="space-y-3">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            value={`₦${transaction.totalAmount.toLocaleString()}`}
            disabled
          />
        </div>
      </div>

      <DialogFooter>
        {transaction.isPaid ? (
          <p className="text-green-600 font-medium">Payment Complete</p>
        ) : (
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Payment
          </Button>
        )}
      </DialogFooter>
    </form>
  );
};

export default PaymentForm;
