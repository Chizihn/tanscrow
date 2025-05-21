"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApolloError } from "@apollo/client";
import { WalletTransaction, WalletTransactionType } from "@/types/wallet";
import WalletTransactionCard from "@/components/wallet/WalletTransactionCard";
import TransactionEmptyState from "./TransactionEmptyState";

interface TransactionHistoryProps {
  transactions: WalletTransaction[];
  isLoading: boolean;
  error: ApolloError | undefined;
}

export default function TransactionHistory({
  transactions,
  isLoading,
  error,
}: TransactionHistoryProps) {
  if (isLoading) {
    return (
      <div>
        <h3 className="text-lg font-medium mb-4">Transaction History</h3>
        <div className="text-muted-foreground text-sm">
          Loading transactions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 className="text-lg font-medium mb-4">Transaction History</h3>
        <div className="p-4 bg-destructive/10 rounded-lg">
          <p className="text-destructive">
            Unable to load transactions: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const depositTransactions = transactions.filter(
    (t) => t.type === WalletTransactionType.DEPOSIT
  );

  const withdrawalTransactions = transactions.filter(
    (t) => t.type === WalletTransactionType.WITHDRAWAL
  );

  const escrowTransactions = transactions.filter(
    (t) =>
      t.type === WalletTransactionType.ESCROW_FUNDING ||
      t.type === WalletTransactionType.ESCROW_RELEASE ||
      t.type === WalletTransactionType.ESCROW_REFUND
  );

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Transaction History</h3>
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="escrow">Escrow</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <WalletTransactionCard
                key={transaction.id}
                transaction={transaction}
              />
            ))
          ) : (
            <TransactionEmptyState type="all" />
          )}
        </TabsContent>

        <TabsContent value="deposits" className="space-y-4">
          {depositTransactions.length > 0 ? (
            depositTransactions.map((transaction) => (
              <WalletTransactionCard
                key={transaction.id}
                transaction={transaction}
              />
            ))
          ) : (
            <TransactionEmptyState type="deposits" />
          )}
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          {withdrawalTransactions.length > 0 ? (
            withdrawalTransactions.map((transaction) => (
              <WalletTransactionCard
                key={transaction.id}
                transaction={transaction}
              />
            ))
          ) : (
            <TransactionEmptyState type="withdrawals" />
          )}
        </TabsContent>

        <TabsContent value="escrow" className="space-y-4">
          {escrowTransactions.length > 0 ? (
            escrowTransactions.map((transaction) => (
              <WalletTransactionCard
                key={transaction.id}
                transaction={transaction}
              />
            ))
          ) : (
            <TransactionEmptyState type="escrow" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
