import { FormEvent, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Transaction } from "@/types/transaction";
import { AlertCircle, Loader2 } from "lucide-react";
import { OpenDisputeInput } from "@/types/input";
import { Input } from "@/components/ui/input";

interface DisputeFormProps {
  transaction: Transaction;
  onSubmit: (data: OpenDisputeInput) => void;
  loading: boolean;
}

const DisputeForm: React.FC<DisputeFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  const [reason, setReason] = useState<string>("");

  const [description, setDescription] = useState<string>("");

  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError("Please provide details about the dispute");
      return;
    }

    onSubmit({
      description,
      reason,

      transactionId: transaction.id,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 mb-6">
        <div className="gap-4">
          <Label htmlFor="reason">Dispute Details</Label>
          <Input
            id="reason"
            placeholder="Please provide a description"
            value={reason}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Textarea
            id="reason"
            placeholder="Please provide details about the issue you're experiencing"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
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
        <Button type="submit" disabled={loading} variant="destructive">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Dispute
        </Button>
      </DialogFooter>
    </form>
  );
};

export default DisputeForm;
