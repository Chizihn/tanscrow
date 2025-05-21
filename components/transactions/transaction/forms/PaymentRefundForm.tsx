import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RequestRefundInput } from "@/types/input";
import { Transaction } from "@/types/transaction";
import { AlertCircle, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

interface RequestRefundFormProps {
  transaction: Transaction;
  onSubmit: (data: RequestRefundInput) => void;
  loading: boolean;
}

const RequestRefundForm: React.FC<RequestRefundFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError("Please provide a reason for requesting refund");
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
          <Label htmlFor="reason">Reason for Refund Request</Label>
          <Textarea
            id="reason"
            placeholder="Please explain why you're requesting a refund"
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
      </div>

      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Request Refund
        </Button>
      </DialogFooter>
    </form>
  );
};

export default RequestRefundForm;
