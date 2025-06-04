"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Transaction, TransactionStatus } from "@/types/transaction";
import { getStatusColor } from "@/utils/transaction";
import TransactionCard from "@/components/transactions/transaction/TransactionCard";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "@/graphql/queries/transaction";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/user";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";

export default function TransactionsPage() {
  const user = (useAuthStore((state) => state.user) as User) || {};
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, loading, error } = useQuery<{ transactions: Transaction[] }>(
    GET_TRANSACTIONS,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    }
  );

  const transactions: Transaction[] = data?.transactions ?? [];

  // Filter transactions based on role and status
  const getFilteredTransactions = (role: string) => {
    let filtered = transactions;

    // Filter by role
    if (role === "buyer") {
      filtered = transactions.filter(
        (t) => t.buyer?.id === (user?.id as string)
      );
    } else if (role === "seller") {
      filtered = transactions.filter(
        (t) => t.seller?.id === (user?.id as string)
      );
    }

    // Filter by status
    if (statusFilter === "active") {
      filtered = filtered.filter(
        (t) =>
          t.status === TransactionStatus.PENDING ||
          t.status === TransactionStatus.IN_PROGRESS
      );
    } else if (statusFilter === "completed") {
      filtered = filtered.filter(
        (t) =>
          t.status === TransactionStatus.COMPLETED ||
          t.status === TransactionStatus.DELIVERED
      );
    } else if (statusFilter === "disputed") {
      filtered = filtered.filter(
        (t) => t.status === TransactionStatus.DISPUTED
      );
    }

    return filtered;
  };

  // Skeleton loader for transaction cards
  const TransactionCardSkeleton = () => (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      </div>
    </div>
  );

  const renderTransactionList = (role: string) => {
    const filteredTransactions = getFilteredTransactions(role);

    if (loading) {
      return (
        <>
          <TransactionCardSkeleton />
          <TransactionCardSkeleton />
        </>
      );
    }

    if (filteredTransactions.length === 0) {
      const getMessage = () => {
        if (role === "buyer")
          return "No transactions found where you are the buyer";
        if (role === "seller")
          return "No transactions found where you are the seller";
        if (statusFilter === "active") return "No active transactions found";
        if (statusFilter === "completed")
          return "No completed transactions found";
        if (statusFilter === "disputed")
          return "No disputed transactions found";
        return "No transactions found";
      };

      return (
        <div className="py-10 text-center border rounded-lg">
          <p className="text-muted-foreground">{getMessage()}</p>
        </div>
      );
    }

    return filteredTransactions.map((transaction) => (
      <TransactionCard
        key={transaction.id}
        transaction={transaction}
        statusColor={getStatusColor(transaction.status)}
        userId={user?.id as string}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Transactions"
          description="  Manage your escrow transactions"
        />

        <Button asChild disabled={loading}>
          <Link href="/dashboard/transactions/create">
            <Plus className="mr-2 h-4 w-4" /> Create Transaction
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-8 w-full"
            disabled={loading}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          disabled={loading}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <p className="text-red-600">Error: {error.message}</p>
        </div>
      )}

      {/* Single level tabs for role filtering */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" disabled={loading}>
            All Transactions
          </TabsTrigger>
          <TabsTrigger value="buyer" disabled={loading}>
            As Buyer
          </TabsTrigger>
          <TabsTrigger value="seller" disabled={loading}>
            As Seller
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {renderTransactionList("all")}
        </TabsContent>

        <TabsContent value="buyer" className="space-y-4 mt-6">
          {renderTransactionList("buyer")}
        </TabsContent>

        <TabsContent value="seller" className="space-y-4 mt-6">
          {renderTransactionList("seller")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
