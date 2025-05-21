import React from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Landmark } from "lucide-react";
import Link from "next/link";
import { PaymentCurrency, PaymentGateway } from "@/types/payment";

export default function FundWalletPage() {
  const wallet = {
    id: "1",
    balance: 250000,
    currency: PaymentCurrency.NGN,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/wallet">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fund Wallet</h2>
          <p className="text-muted-foreground">Add funds to your wallet</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Funding</CardTitle>
          <CardDescription>
            Enter the amount and select your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter amount"
              min="1000"
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum amount: ₦1,000
            </p>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup defaultValue={PaymentGateway.PAYSTACK}>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value={PaymentGateway.PAYSTACK} id="paystack" />
                <Label
                  htmlFor="paystack"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  <div>
                    <p>Paystack</p>
                    <p className="text-xs text-muted-foreground">
                      Pay with card, bank transfer, or USSD
                    </p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem
                  value={PaymentGateway.FLUTTERWAVE}
                  id="flutterwave"
                />
                <Label
                  htmlFor="flutterwave"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  <div>
                    <p>Flutterwave</p>
                    <p className="text-xs text-muted-foreground">
                      Pay with card, bank transfer, or mobile money
                    </p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label
                  htmlFor="bank_transfer"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Landmark className="h-4 w-4" />
                  <div>
                    <p>Direct Bank Transfer</p>
                    <p className="text-xs text-muted-foreground">
                      Transfer to our bank account
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium mb-2">Payment Summary</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span>₦0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Processing Fee (1.5%)
                </span>
                <span>₦0.00</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₦0.00</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Proceed to Payment</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₦{wallet.balance.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            Available for transactions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
