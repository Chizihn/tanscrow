"use client";
import React from "react";
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
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const transactionSummary = {
    active: 3,
    completed: 12,
    disputed: 1,
  };

  const recentActivities = [
    {
      id: "1",
      title: "Website Development",
      date: new Date(2023, 5, 15),
      type: "Transaction Created",
      amount: 150000,
    },
    {
      id: "2",
      title: "Logo Design",
      date: new Date(2023, 5, 10),
      type: "Payment Received",
      amount: 50000,
    },
    {
      id: "3",
      title: "Mobile App Development",
      date: new Date(2023, 5, 5),
      type: "Transaction Completed",
      amount: 300000,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your transactions and activities.
        </p>
      </div>

      {/* Transaction Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Transactions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactionSummary.active}
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
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactionSummary.completed}
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
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactionSummary.disputed}
            </div>
            <p className="text-xs text-muted-foreground">
              Transactions under dispute
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
          {recentActivities.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₦{activity.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
