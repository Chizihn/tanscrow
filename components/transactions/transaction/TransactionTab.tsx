"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MessageSquare, Download } from "lucide-react";
import { Transaction } from "@/types/transaction";
import DocumentsList from "./DocumentsList";

interface TransactionTabsProps {
  transaction: Transaction;
  refetch?: () => void;
}

const TransactionTabs: React.FC<TransactionTabsProps> = ({ transaction, refetch }) => {
  return (
    <Tabs defaultValue="messages">
      <TabsList className="grid grid-cols-2 w-full max-w-md">
        <TabsTrigger value="messages" className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          Messages
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Documents
        </TabsTrigger>
      </TabsList>

      <TabsContent value="messages" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Communicate with the other party</CardDescription>
          </CardHeader>
        </Card>
      </TabsContent>

      <TabsContent value="documents" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Documents & Evidence</CardTitle>
            <CardDescription>
              Upload and view transaction documents
            </CardDescription>
          </CardHeader>
          <div className="p-4">
            <DocumentsList documents={transaction.documents || []} transaction={transaction} refetch={refetch} />
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TransactionTabs;
