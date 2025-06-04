"use client";
import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  CreditCard,
  DollarSign,
  Plus,
  Wallet,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@apollo/client";
import { UserDashboardSummary, UserWalletSummary } from "@/types/user";
import {
  GET_USER_DASHBOARD_SUMMARY,
  GET_USER_WALLET_SUMMARY,
} from "@/graphql/queries/user";
import PageHeader from "@/components/PageHeader";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  // Memoize date range to prevent recalculation on every render
  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }, []);

  // Get user dashboard summary
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useQuery<{
    userDashboardSummary: UserDashboardSummary;
  }>(GET_USER_DASHBOARD_SUMMARY, {
    variables: { dateRange },
    fetchPolicy: "cache-first",
    errorPolicy: "all",
  });

  // Get user wallet summary
  const {
    data: walletData,
    loading: walletLoading,
    error: walletError,
  } = useQuery<{
    userWalletSummary: UserWalletSummary;
  }>(GET_USER_WALLET_SUMMARY, {
    fetchPolicy: "cache-first",
    errorPolicy: "all",
  });

  if (dashboardError) {
    console.error("Error fetching dashboard data:", dashboardError);
  }

  if (walletError) {
    console.error("Error fetching wallet data:", walletError);
  }

  const summary = dashboardData?.userDashboardSummary;
  const wallet = walletData?.userWalletSummary;

  return (
    <div className="space-y-8">
      <PageHeader
        title={` Welcome back, ${user?.firstName}!`}
        description="          Here's an overview of your transactions and activities."
      />

      {/* Transaction Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Transactions
            </CardTitle>
            {dashboardLoading ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                summary?.activeTransactions || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Transactions in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Transactions
            </CardTitle>
            {dashboardLoading ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                summary?.completedTransactions || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Disputed Transactions
            </CardTitle>
            {dashboardLoading ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                summary?.disputedTransactions || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Transactions under dispute
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            {walletLoading ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Wallet className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {walletLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `₦${(wallet?.availableBalance || 0).toLocaleString()}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for new transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Escrow Balance
            </CardTitle>
            {walletLoading ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {walletLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `₦${(wallet?.escrowBalance || 0).toLocaleString()}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Held in active transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            {walletLoading ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {walletLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `₦${(wallet?.totalBalance || 0).toLocaleString()}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Available + Escrow balance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            {dashboardLoading ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                summary?.totalTransactions || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            {dashboardLoading ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `₦${(summary?.totalAmount || 0).toLocaleString()}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total transaction value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">As Buyer</CardTitle>
            {dashboardLoading ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Users className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                summary?.transactionsAsBuyer || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Transactions as buyer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">As Seller</CardTitle>
            {dashboardLoading ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Users className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                summary?.transactionsAsSeller || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Transactions as seller
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-4 text-lg font-medium">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <Link href="/dashboard/transactions/create">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Create Transaction
                </CardTitle>
                <Plus className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Start a new escrow transaction
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <Link href="/dashboard/wallet/fund">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Fund Wallet
                </CardTitle>
                <Wallet className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <CardDescription>Add funds to your wallet</CardDescription>
              </CardContent>
            </Link>
          </Card>
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <Link href="/dashboard/wallet/withdraw">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Withdraw Funds
                </CardTitle>
                <DollarSign className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Withdraw funds to your bank account
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Recent Activity</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/transactions">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="space-y-4">
          {dashboardLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            summary?.recentTransactions?.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{transaction.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.role === "BUYER"
                          ? "Buying from"
                          : "Selling to"}{" "}
                        {transaction.counterparty}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₦{transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {transaction.status.toLowerCase().replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="text-center p-8 text-muted-foreground">
                No recent transactions found
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
