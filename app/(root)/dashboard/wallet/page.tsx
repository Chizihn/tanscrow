"use client";
import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_WALLET, GET_WALLET_TRANSACTIONS } from "@/graphql/queries/wallet";
import { CREATE_WALLET } from "@/graphql/mutations/wallet";
import EmptyWalletState from "@/components/wallet/EmptyWalletState";
import WalletBalance from "@/components/wallet/WalletBalance";
import { Wallet, WalletTransaction } from "@/types/wallet";
import TransactionHistory from "@/components/wallet/WalletTransactions";
import { showErrorToast, showSuccessToast } from "@/components/Toast";
import { CreateWalletInput } from "@/types/input";
import { PaymentCurrency } from "@/types/payment";

interface WalletQueryResult {
  wallet: Wallet | null;
}

interface TransactionsQueryResult {
  walletTransactions: WalletTransaction[];
}

export default function WalletPage() {
  // Fetch wallet data
  const { data, loading, error } = useQuery<WalletQueryResult>(GET_WALLET, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const wallet = data?.wallet ?? null;

  // Fetch transactions data using the correct query
  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
  } = useQuery<TransactionsQueryResult>(GET_WALLET_TRANSACTIONS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    skip: !wallet?.id, // Skip this query if wallet doesn't exist yet
  });

  const transactions = transactionsData?.walletTransactions ?? [];

  // Create wallet mutation
  const [createWallet, { loading: creatingWallet }] = useMutation(
    CREATE_WALLET,
    {
      onCompleted: () => {
        showSuccessToast("Wallet created successfully!");
      },
      onError: (error) => {
        showErrorToast(error.message || "Failed to create wallet!");
      },
      refetchQueries: [{ query: GET_WALLET }],
    }
  );

  // Handle wallet creation
  const handleCreateWallet = (data: CreateWalletInput) => {
    createWallet({
      variables: { input: data },
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg">
        <p className="text-destructive font-medium">Error: {error.message}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please try refreshing the page or contact support if the issue
          persists.
        </p>
      </div>
    );
  }

  // No wallet state
  if (!wallet) {
    return (
      <EmptyWalletState
        onCreateWallet={() =>
          handleCreateWallet({
            currency: PaymentCurrency.NGN,
          })
        }
        isLoading={creatingWallet}
      />
    );
  }

  // Wallet exists state
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
          <p className="text-muted-foreground">
            Manage your funds and transactions
          </p>
        </div>
      </div>

      <WalletBalance wallet={wallet} />
      <TransactionHistory
        transactions={transactions}
        isLoading={transactionsLoading}
        error={transactionsError}
      />
    </div>
  );
}
