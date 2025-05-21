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

interface TransactionTabsProps {
  transaction: Transaction;
  // isBuyer: boolean;
  // isSeller?: boolean
}

const TransactionTabs: React.FC<TransactionTabsProps> = ({}) => {
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
          {/* <CardContent>
            {transaction && transaction.messages.length > 0 ? (
              <MessagesList messages={transaction.messages} currentUserId={isBuyer ? transaction.buyer.id : transaction.seller.id} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No messages yet</p>
                <Button className="mt-4">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Conversation
                </Button>
              </div>
            )}
          </CardContent> */}
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
          {/* <CardContent>
            {transaction.documents && transaction.documents.length > 0 ? (
              <DocumentsList documents={transaction.documents} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No documents uploaded yet
                </p>
                <Button className="mt-4">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            )}
          </CardContent> */}
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TransactionTabs;
