import { DeliveryMethod, Transaction } from "@/types/transaction";
import { FormEvent, useState } from "react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertCircle, Calendar, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DeliveryUpdateData } from "@/types/input";

// ✅ Props interface with corrected onSubmit type
interface UpdateDeliveryFormProps {
  transaction: Transaction;
  onSubmit: (data: DeliveryUpdateData) => void;
  loading: boolean;
}

const UpdateDeliveryForm: React.FC<UpdateDeliveryFormProps> = ({
  transaction,
  onSubmit,
  loading,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(
    transaction.deliveryMethod || null
  );
  const [trackingInfo, setTrackingInfo] = useState<string>(
    transaction.trackingInfo || ""
  );
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    transaction.expectedDeliveryDate || format(new Date(), "yyyy-MM-dd")
  );
  const [error, setError] = useState<string>("");

  // ✅ Use Object.values to get enum values
  const deliveryMethodOptions = Object.values(DeliveryMethod).map((option) => ({
    label: option,
    value: option,
  }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!deliveryMethod) {
      setError("Please select a delivery method");
      return;
    }

    onSubmit({
      transactionId: transaction.id,
      deliveryMethod,
      trackingInfo,
      expectedDeliveryDate: new Date(expectedDeliveryDate).toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="delivery-method">Delivery Method</Label>
          <Select
            value={deliveryMethod ?? undefined}
            onValueChange={(val) => setDeliveryMethod(val as DeliveryMethod)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select delivery method" />
            </SelectTrigger>
            <SelectContent>
              {deliveryMethodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tracking-info">Tracking Information</Label>
          <Input
            id="tracking-info"
            placeholder="Enter tracking number or details"
            value={trackingInfo}
            onChange={(e) => setTrackingInfo(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="expected-delivery-date">Expected Delivery Date</Label>
          <div className="relative">
            <Input
              id="expected-delivery-date"
              type="date"
              value={expectedDeliveryDate as string}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
            />
            <Calendar className="absolute right-3 top-3 h-4 w-4 opacity-50" />
          </div>
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
          Update Delivery Information
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UpdateDeliveryForm;
