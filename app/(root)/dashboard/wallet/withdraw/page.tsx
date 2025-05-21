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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PaymentCurrency } from "@/types/payment";

export default function WithdrawFundsPage() {
  const wallet = {
    id: "1",
    balance: 250000,
    currency: PaymentCurrency.NGN,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/wallet">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Withdraw Funds</h2>
          <p className="text-muted-foreground">
            Transfer funds to your bank account
          </p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Withdrawals are processed within 24 hours. Minimum withdrawal amount
          is ₦5,000.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Bank Account Details</CardTitle>
          <CardDescription>
            Enter your bank account information for the withdrawal
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
              min="5000"
              max={wallet.balance}
              required
            />
            <p className="text-xs text-muted-foreground">
              Available balance: ₦{wallet.balance.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Select>
              <SelectTrigger id="bankName">
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="access">Access Bank</SelectItem>
                <SelectItem value="gtb">Guaranty Trust Bank</SelectItem>
                <SelectItem value="zenith">Zenith Bank</SelectItem>
                <SelectItem value="first">First Bank</SelectItem>
                <SelectItem value="uba">United Bank for Africa</SelectItem>
                <SelectItem value="sterling">Sterling Bank</SelectItem>
                <SelectItem value="union">Union Bank</SelectItem>
                <SelectItem value="fcmb">FCMB</SelectItem>
                <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                <SelectItem value="stanbic">Stanbic IBTC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              placeholder="Enter 10-digit account number"
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              name="accountName"
              placeholder="Enter account name"
              required
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium mb-2">Withdrawal Summary</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span>₦0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Processing Fee (₦100)
                </span>
                <span>₦100.00</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total to Receive</span>
                <span>₦0.00</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Withdraw Funds</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            No recent withdrawals
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
