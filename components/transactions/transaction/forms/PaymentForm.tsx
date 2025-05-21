import { showErrorToast, showWarnToast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProcessPaymentInput } from "@/types/input";
import { PaymentGateway } from "@/types/payment";
import { Transaction } from "@/types/transaction";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

interface PaymentFormProps {
  transaction: Transaction;
  onSubmit: (data: ProcessPaymentInput) => void;
  loading: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway | null>(
    null
  );

  const paymentGatewayOptions = Object.values(PaymentGateway).map((option) => ({
    label: option,
    value: option,
  }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!paymentGateway) {
      showWarnToast("Please select a payment method");
      return;
    }

    try {
      onSubmit({
        transactionId: transaction.id,
        paymentGateway: paymentGateway,
      });
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

        <div className="space-y-3">
          <Label htmlFor="payment-gateway">Payment Gateway</Label>

          <Select
            value={paymentGateway ?? undefined}
            onValueChange={(val: string) =>
              setPaymentGateway(val as PaymentGateway)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a payment method" />
            </SelectTrigger>
            <SelectContent>
              {paymentGatewayOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete Payment
        </Button>
      </DialogFooter>
    </form>
  );
};

export default PaymentForm;
