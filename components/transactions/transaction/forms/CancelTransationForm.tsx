import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CancelTransactionInput } from "@/types/input";
import { Transaction } from "@/types/transaction";
import { AlertCircle, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

interface CancelTransactionFormProps {
  transaction: Transaction;
  onSubmit: (data: CancelTransactionInput) => void;
  loading: boolean;
}

const CancelTransactionForm: React.FC<CancelTransactionFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError("Please provide a reason for cancellation");
      return;
    }
    onSubmit({
      transactionId: transaction.id,
      reason,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="reason">Reason for Cancellation</Label>
          <Textarea
            id="reason"
            placeholder="Please explain why you're cancelling this transaction"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This action cannot be undone. Once the transaction is cancelled, it
            cannot be reopened.
          </AlertDescription>
        </Alert>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={loading} variant="destructive">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Cancel Transaction
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CancelTransactionForm;
