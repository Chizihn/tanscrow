// src/components/transactions/create/TransactionDetailsStep.tsx
import React from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronRight } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { TransactionRole, TransactionType } from "@/types/transaction";
import { TransactionFormData } from "./TransactionForm";

interface TransactionDetailsStepProps {
  formData: TransactionFormData;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
  nextStep: () => void;
}

export default function TransactionDetailsStep({
  formData,
  date,
  setDate,
  handleInputChange,
  handleSelectChange,
  nextStep,
}: TransactionDetailsStepProps) {
  const parsedAmount = parseFloat(formData.amount || "0") || 0;
  const rawFee = parsedAmount ? parsedAmount * 0.015 : 0;
  const escrowFee = Math.round(rawFee * 100) / 100;

  const validateStep1 = () => {
    return formData.title && formData.description && formData.amount && date;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
        <CardDescription>
          Provide the basic details of your transaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Website Development"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Description for what this transaction entails"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Are you the Buyer or Seller?</Label>
          <RadioGroup
            value={formData.role}
            onValueChange={(value) => handleSelectChange("role", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={TransactionRole.BUYER} id="buyer" />
              <Label htmlFor="buyer">Buyer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={TransactionRole.SELLER} id="seller" />
              <Label htmlFor="seller">Seller</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Transaction Type</Label>
          <RadioGroup
            value={formData.type}
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={TransactionType.SERVICE} id="service" />
              <Label htmlFor="service">Service</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={TransactionType.DIGITAL} id="digital" />
              <Label htmlFor="digital">Digital Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={TransactionType.PHYSICAL} id="physical" />
              <Label htmlFor="physical">Physical Product</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">
            Amount (₦){" "}
            <span className="text-gray-400">
              (Amount both party has agreed upon)
            </span>{" "}
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
          <div className="text-sm text-muted-foreground mt-1 flex items-center">
            <span className="mr-2">Escrow fee:</span>
            <span className="font-medium">₦{escrowFee.toLocaleString()}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Expected Delivery Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(d: Date) => d < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={nextStep} disabled={!validateStep1()}>
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
