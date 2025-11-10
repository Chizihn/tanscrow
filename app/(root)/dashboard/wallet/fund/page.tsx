"use client";

import React, { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";
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
import { CreditCard, Loader2 } from "lucide-react";
import { PaymentCurrency, PaymentGateway } from "@/types/payment";
import { FUND_WALLET } from "@/graphql/mutations/wallet";
import { showErrorToast, showSuccessToast } from "@/components/Toast";
import { capitalizeFirstChar } from "@/utils";
import { FundWalletInput } from "@/types/wallet";
import PageRouter from "@/components/PageRouter";
import PageHeader from "@/components/PageHeader";

export default function FundWalletPage() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PaymentGateway.PAYSTACK);

  const [fundWallet, { loading: funding }] = useMutation(FUND_WALLET, {
    onCompleted: (data) => {
      showSuccessToast(
        `Payment initialized! Redirecting to ${capitalizeFirstChar(
          paymentMethod
        )}...`
      );
      window.location.href = data.fundWallet.redirectUrl;
    },
    onError: (error) => {
      showErrorToast(error.message || "An error occured!");
    },
  });

  const amountNumber = parseFloat(amount) || 0;
  const isValidAmount = !isNaN(amountNumber) && amountNumber >= 1000;
  const processingFee = isValidAmount
    ? Math.round(amountNumber * 0.015 * 100) / 100
    : 0;
  const total = isValidAmount
    ? Math.round((amountNumber + processingFee) * 100) / 100
    : 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const fundingData: FundWalletInput = {
      amount: total,
      currency: PaymentCurrency.NGN,
      paymentGateway: paymentMethod,
      platform: "WEB",
    };

    fundWallet({
      variables: { input: fundingData },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <PageRouter
          parentLabel="Back to Wallet"
          parentPath="/dashboard/wallet"
        />

        <PageHeader
          title="Fund Wallet"
          description="Add funds to your wallet"
        />
      </div>

      {/* Funding Card */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Funding</CardTitle>
          <CardDescription>
            Enter the amount and select your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                min="1000"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Minimum amount: ₦1,000
              </p>
            </div>

            {/* Payment Method */}
            <div className="space-y-2 mt-4">
              <Label>Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) =>
                  setPaymentMethod(value as PaymentGateway)
                }
              >
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem
                    value={PaymentGateway.PAYSTACK}
                    id="paystack"
                  />
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
                {/* <div className="flex items-center space-x-2 border rounded-md p-3">
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
                </div> */}
              </RadioGroup>
            </div>

            {/* Payment Summary */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium mb-2">Payment Summary</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span>₦{amountNumber.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Processing Fee (1.5%)
                  </span>
                  <span>₦{processingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <CardFooter className="px-0">
              <Button type="submit" className="w-full mt-4" disabled={funding}>
                {funding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Wallet Balance */}
      {/* <Card>
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
      </Card> */}
    </div>
  );
}
