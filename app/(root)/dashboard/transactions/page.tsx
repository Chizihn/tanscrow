"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function TransactionsPage() {
  const user = (useAuthStore((state) => state.user) as User) || {};
  const { data, loading, error } = useQuery<{ transactions: Transaction[] }>(
    GET_TRANSACTIONS,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    }
  );

  const transactions: Transaction[] = data?.transactions ?? [];

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            Manage your escrow transactions
          </p>
        </div>
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
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <p className="text-red-600">Error: {error.message}</p>
        </div>
      )}

      {/* Tabs for filtering by role */}
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

        {/* All Transactions */}
        <TabsContent value="all" className="space-y-4 mt-4">
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active" disabled={loading}>
                Active
              </TabsTrigger>
              <TabsTrigger value="completed" disabled={loading}>
                Completed
              </TabsTrigger>
              <TabsTrigger value="disputed" disabled={loading}>
                Disputed
              </TabsTrigger>
            </TabsList>

            {/* Active */}
            <TabsContent value="active" className="space-y-4 mt-4">
              {loading ? (
                // Skeleton loaders while loading
                <>
                  <TransactionCardSkeleton />
                </>
              ) : transactions.filter(
                  (t) =>
                    t.status === TransactionStatus.PENDING ||
                    t.status === TransactionStatus.IN_PROGRESS
                ).length === 0 ? (
                <div className="py-10 text-center border rounded-lg">
                  <p className="text-muted-foreground">
                    No active transactions found
                  </p>
                </div>
              ) : (
                transactions
                  .filter(
                    (t) =>
                      t.status === TransactionStatus.PENDING ||
                      t.status === TransactionStatus.IN_PROGRESS
                  )
                  ?.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      statusColor={getStatusColor(transaction.status)}
                      userId={user?.id as string}
                    />
                  ))
              )}
            </TabsContent>

            {/* Completed */}
            <TabsContent value="completed" className="space-y-4 mt-4">
              {loading ? (
                // Skeleton loaders while loading
                <>
                  <TransactionCardSkeleton />
                  <TransactionCardSkeleton />
                </>
              ) : transactions.filter(
                  (t) =>
                    t.status === TransactionStatus.COMPLETED ||
                    t.status === TransactionStatus.DELIVERED
                ).length === 0 ? (
                <div className="py-10 text-center border rounded-lg">
                  <p className="text-muted-foreground">
                    No completed transactions found
                  </p>
                </div>
              ) : (
                transactions
                  .filter(
                    (t) =>
                      t.status === TransactionStatus.COMPLETED ||
                      t.status === TransactionStatus.DELIVERED
                  )
                  .map((transaction) => (
                    <TransactionCard
                      key={transaction?.id}
                      transaction={transaction}
                      statusColor={getStatusColor(transaction.status)}
                      userId={user?.id as string}
                    />
                  ))
              )}
            </TabsContent>

            {/* Disputed */}
            <TabsContent value="disputed" className="space-y-4 mt-4">
              {loading ? (
                // Skeleton loaders while loading
                <>
                  <TransactionCardSkeleton />
                </>
              ) : transactions.filter(
                  (t) => t.status === TransactionStatus.DISPUTED
                ).length === 0 ? (
                <div className="py-10 text-center border rounded-lg">
                  <p className="text-muted-foreground">
                    No disputed transactions found
                  </p>
                </div>
              ) : (
                transactions
                  .filter((t) => t.status === TransactionStatus.DISPUTED)
                  ?.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      statusColor={getStatusColor(transaction.status)}
                      userId={user.id as string}
                    />
                  ))
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* As Buyer */}
        <TabsContent value="buyer" className="space-y-4 mt-4">
          {loading ? (
            // Skeleton loaders while loading
            <>
              <TransactionCardSkeleton />
              <TransactionCardSkeleton />
            </>
          ) : transactions.filter((t) => t.buyer?.id === (user?.id as string))
              .length === 0 ? (
            <div className="py-10 text-center border rounded-lg">
              <p className="text-muted-foreground">
                No transactions found where you are the buyer
              </p>
            </div>
          ) : (
            transactions
              .filter((t) => t.buyer?.id === (user?.id as string))
              ?.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  statusColor={getStatusColor(transaction.status)}
                  userId={user?.id as string}
                />
              ))
          )}
        </TabsContent>

        {/* As Seller */}
        <TabsContent value="seller" className="space-y-4 mt-4">
          {loading ? (
            // Skeleton loaders while loading
            <>
              <TransactionCardSkeleton />
              <TransactionCardSkeleton />
            </>
          ) : transactions.filter((t) => t.seller?.id === (user?.id as string))
              .length === 0 ? (
            <div className="py-10 text-center border rounded-lg">
              <p className="text-muted-foreground">
                No transactions found where you are the seller
              </p>
            </div>
          ) : (
            transactions
              .filter((t) => t.seller?.id === (user?.id as string))
              ?.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  statusColor={getStatusColor(transaction.status)}
                  userId={user?.id as string}
                />
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
