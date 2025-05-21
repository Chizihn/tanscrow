import { Transaction } from "@/types/transaction";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface ConfirmDeliveryFormProps {
  transaction: Transaction;
  onSubmit: (transactionId: string) => void;
  loading: boolean;
}

const ConfirmDeliveryForm: React.FC<ConfirmDeliveryFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  return (
    <div className="space-y-4 mb-6">
      <p>
        Confirm that you have received the goods or services as described in
        this transaction. This will release the funds to the seller.
      </p>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This action cannot be undone. Once you confirm delivery, the funds
          will be released to the seller.
        </AlertDescription>
      </Alert>

      <DialogFooter>
        <Button onClick={() => onSubmit(transaction.id)} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Delivery
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ConfirmDeliveryForm;
