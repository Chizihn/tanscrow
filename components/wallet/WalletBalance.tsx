"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, CreditCard, Plus, Wallet as WalletIcon } from "lucide-react";
import Link from "next/link";
import { Wallet } from "@/types/wallet";

interface WalletBalanceProps {
  wallet: Wallet;
}

export default function WalletBalance({ wallet }: WalletBalanceProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="overflow-hidden border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Available Balance
          </CardTitle>
          <WalletIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₦{wallet.balance.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Available for withdrawal or transactions
          </p>
          <div className="mt-4 flex gap-2">
            <Button asChild>
              <Link href="/dashboard/wallet/fund">
                <Plus className="mr-2 h-4 w-4" /> Fund Wallet
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/wallet/withdraw">
                <ArrowUp className="mr-2 h-4 w-4" /> Withdraw
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-l-4 border-l-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Escrow Balance</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₦{wallet.escrowBalance.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Funds held in escrow for ongoing transactions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
