"use client";

import React, { useEffect, useState } from "react";
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
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { NIGERIAN_BANKS } from "@/constants";
import { GET_WALLET, RESOLVE_ACCOUNT_DETAILS } from "@/graphql/queries/wallet";
import PageRouter from "@/components/PageRouter";
import { WalletQueryResult } from "../page";
import ErrorState from "@/components/ErrorState";
import { showErrorToast, showSuccessToast } from "@/components/Toast";
import PageHeader from "@/components/PageHeader";
import { WITHDRAW_TO_NIGERIAN_BANK } from "@/graphql/mutations/wallet";
import { PaymentCurrency } from "@/types/payment";
import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/auth-store";

interface WithdrawInput {
  accountName: string;
  accountNumber: string;
  amount: number;
  bankCode: string;
  bankName: string;
  currency: PaymentCurrency;
}

export default function WithdrawFundsPage() {
  const router = useRouter();
  const [bankCode, setBankCode] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const {
    data,
    loading: walletLoading,
    error: walletError,
  } = useQuery<WalletQueryResult>(GET_WALLET, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const wallet = data?.wallet ?? null;

  // const user = useAuthStore((state) => state.user);

  const [
    resolveAccountDetails,
    { loading: resolvingAccount, error: resolveError },
  ] = useLazyQuery(RESOLVE_ACCOUNT_DETAILS, {
    onCompleted: (data) => {
      if (data?.resolveAccountDetails?.accountName) {
        setAccountName(data.resolveAccountDetails.accountName);
      }
    },
    onError: (error) => {
      showErrorToast(error.message);
      setAccountName("");
    },
    fetchPolicy: "no-cache",
  });

  const [withdraw, { loading: withdrawLoading }] = useMutation(
    WITHDRAW_TO_NIGERIAN_BANK,
    {
      onCompleted: () => {
        showSuccessToast("Withdrawal initiated successfully.");
        // Optionally reset form
        setBankCode("");
        setAccountNumber("");
        setAccountName("");
        setAmount("");
        // Automatically go back after 5 seconds
        setTimeout(() => {
          router.back();
        }, 5000);
      },
      onError: (error) => {
        // Enhanced error handling for verification/document errors
        const message = error.message || "Withdrawal failed.";
        if (
          message.includes("not verified") ||
          message.includes("document") ||
          message.toLowerCase().includes("verification")
        ) {
          showErrorToast(
            "You must be verified and have all required documents before withdrawing. Please complete your verification in your profile."
          );
        } else {
          showErrorToast(message);
        }
      },
    }
  );

  useEffect(() => {
    if (accountNumber.length === 10 && bankCode) {
      setAccountName("");
      resolveAccountDetails({
        variables: {
          input: { accountNumber, bankCode: "001" },
        },
      });
    } else {
      setAccountName("");
    }
  }, [accountNumber, bankCode, resolveAccountDetails]);

  const handleMakeWithdraw = () => {
    const numAmount = Number(amount);
    if (numAmount < 5000) {
      showErrorToast("Minimum withdrawal amount is ₦5,000.");
      return;
    }

    const bank = NIGERIAN_BANKS.find((b) => b.code === bankCode);
    if (!bank) {
      showErrorToast("Invalid bank selected.");
      return;
    }

    const input: WithdrawInput = {
      accountName,
      accountNumber,
      amount: numAmount,
      bankCode,
      bankName: bank.name,
      currency: PaymentCurrency.NGN,
    };

    withdraw({
      variables: { input },
    });
  };

  const numAmount = Number(amount || 0);
  const processingFee = 100;
  const totalToReceive = Math.max(numAmount - processingFee, 0);

  // Name match check
  // const normalizedAccountName = (accountName || "").toLowerCase().replace(/\s+/g, " ");
  // const normalizedFirstName = (user?.firstName || "").toLowerCase();
  // const normalizedLastName = (user?.lastName || "").toLowerCase();
  // const nameMatches =
  //   normalizedAccountName.includes(normalizedFirstName) &&
  //   normalizedAccountName.includes(normalizedLastName);

  if (walletError) {
    return <ErrorState message={walletError.message} />;
  }

  const isFormValid =
    !!accountName &&
    !!accountNumber &&
    !!bankCode &&
    !!wallet &&
    numAmount >= 5000 &&
    numAmount <= wallet.balance;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div>
          <div className="space-y-3">
            <PageRouter
              parentLabel="Back to Wallet"
              parentPath="/dashboard/wallet"
            />
            <PageHeader
              title="Withdraw Funds"
              description="Transfer funds to your bank account"
            />
          </div>
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
        <CardContent className="space-y-10">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              min="5000"
              max={wallet?.balance || 0}
              onChange={(e) => setAmount(e.target.value)}
              disabled={walletLoading || !wallet}
            />
            <p className="text-xs text-muted-foreground">
              {walletLoading ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading balance...
                </span>
              ) : wallet ? (
                `Available balance: ₦${wallet.balance.toLocaleString()}`
              ) : (
                "Balance unavailable"
              )}
            </p>
            {amount && wallet && Number(amount) > Number(wallet.balance) && (
              <p className="text-sm text-red-500">
                Amount exceeds available balance
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank">Bank</Label>
            <Select
              onValueChange={setBankCode}
              disabled={walletLoading || !wallet}
              value={bankCode}
            >
              <SelectTrigger id="bank">
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {NIGERIAN_BANKS.map((bank) => (
                  <SelectItem key={bank.code} value={bank.code}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="Enter 10-digit account number"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              disabled={walletLoading || !wallet}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <div className="relative">
              <Input
                id="accountName"
                value={resolvingAccount ? "Checking..." : accountName}
                className="border-1 bg-gray-400"
                disabled
              />
              {resolvingAccount && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {resolveError?.message && (
                <p className="text-sm text-red-500">
                  Failed to resolve account name. Please check your account
                  number and selected bank.
                </p>
              )}
              {/* {!resolvingAccount && accountName && (
                <p className="text-sm text-orange-500 mt-2">
                  Warning: The resolved bank account name does not match your
                  registered name. Withdrawals are only allowed to accounts
                  owned by you. If this is not your account, please use your own
                  bank details.
                </p>
              )} */}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium mb-2">Withdrawal Summary</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span>₦{numAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee</span>
                <span>₦{processingFee}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total to Receive</span>
                <span>₦{totalToReceive.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            className="w-full"
            onClick={handleMakeWithdraw}
            disabled={!isFormValid || withdrawLoading}
          >
            {withdrawLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              "Withdraw Funds"
            )}
          </Button>
        </CardFooter>
      </Card>
      {/* 
      <Card>
        <CardHeader>
          <CardTitle>Recent Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            No recent withdrawals
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
