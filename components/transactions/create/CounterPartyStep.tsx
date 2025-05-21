// src/components/transactions/create/CounterpartyStep.tsx
import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, Loader2, Search } from "lucide-react";
import { DeliveryMethod, TransactionRole } from "@/types/transaction";
import { User } from "@/types/user";
import { TransactionFormData } from "./TransactionForm";
import UserSearchResult from "./UserSearchResult";

interface CounterpartyStepProps {
  formData: TransactionFormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCounterParty: (user: Partial<User> | null) => void;
  counterParty: Partial<User> | null;
  nextStep: () => void;
  prevStep: () => void;
  loading: boolean;
  error: string | null;
  searchCounterparty: (identifier: string) => void;
}

export default function CounterpartyStep({
  formData,
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
  setCounterParty,
  counterParty,
  nextStep,
  prevStep,
  loading,
  error,
  searchCounterparty,
}: CounterpartyStepProps) {
  const [localIdentifier, setLocalIdentifier] = useState(
    formData.counterpartyIdentifier || ""
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const validateStep2 = () => {
    return (
      formData.counterpartyIdentifier && formData.termsAccepted && counterParty
    );
  };

  const handleSearch = () => {
    if (localIdentifier) {
      // Update the form data with the local identifier
      const event = {
        target: {
          name: "counterpartyIdentifier",
          value: localIdentifier,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleInputChange(event);

      // Trigger the search
      searchCounterparty(localIdentifier);
    } else {
      setCounterParty(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalIdentifier(e.target.value);
    // If user clears the input, reset counterparty
    if (!e.target.value) {
      setCounterParty(null);
      const event = {
        target: {
          name: "counterpartyIdentifier",
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(event);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Counterparty Details</CardTitle>
        <CardDescription>
          Provide details about the other party in this transaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        <div className="space-y-2">
          <Label htmlFor="counterpartyIdentifier">
            Email/Phone of{" "}
            {formData.role === TransactionRole.BUYER ? "Seller" : "Buyer"}{" "}
          </Label>
          <div className="relative flex gap-2">
            <Input
              id="counterpartyIdentifier"
              name="counterpartyIdentifier"
              placeholder="Enter email address or phone number"
              value={localIdentifier}
              onChange={handleLocalChange}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              required
            />
            <Button type="button" onClick={handleSearch} variant="secondary">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          {!counterParty && (
            <p className="text-sm text-muted-foreground">
              Press Enter or click Search button after typing the complete
              identifier
            </p>
          )}

          {formData.counterpartyIdentifier && !loading && (
            <UserSearchResult user={counterParty} error={error} />
          )}
        </div>

        <div className="space-y-2">
          <Label>Delivery Method</Label>
          <Select
            value={formData.deliveryMethod}
            onValueChange={(value) =>
              handleSelectChange("deliveryMethod", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select delivery method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DeliveryMethod.DIGITAL}>Digital</SelectItem>
              <SelectItem value={DeliveryMethod.IN_PERSON}>
                In Person
              </SelectItem>
              <SelectItem value={DeliveryMethod.SHIPPING}>Shipping</SelectItem>
              <SelectItem value={DeliveryMethod.COURIER}>Courier</SelectItem>
              <SelectItem value={DeliveryMethod.OTHER}>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="termsAccepted" className="text-sm">
              I agree to the{" "}
              <a
                href="/terms-of-service"
                className="text-primary hover:underline"
                target="_blank"
              >
                Terms and Conditions
              </a>
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} disabled={!validateStep2()}>
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
