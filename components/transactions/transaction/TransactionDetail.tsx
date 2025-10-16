"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Transaction } from "@/types/transaction";
import { GET_TRANSACTION } from "@/graphql/queries/transaction";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/user";
import LoadingState from "../../LoadingState";
import ErrorState from "../../ErrorState";
import PageRouter from "../../PageRouter";
import TransactionHeader from "./TransactionHeader";
import TransactionActions, { ActionType } from "./TransactionActions";
import TransactionInfo from "./TransactionInfo";
import TransactionTimeline from "./TransactionTimeline";
import TransactionTabs from "./TransactionTab";

interface Props {
  id: string;
}

const TransactionDetail: React.FC<Props> = ({ id }) => {
  const user = useAuthStore((state) => state.user) as User;
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);

  const { data, loading, error, refetch } = useQuery<{
    transaction: Transaction;
  }>(GET_TRANSACTION, {
    variables: { transactionId: id },
    fetchPolicy: "network-only",
    // nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    skip: !id,
    onCompleted: (data) => {
      if (data.transaction) {
        console.log("transaction", data.transaction);
      }
    },
  });

  const transaction = data?.transaction;

  if (loading)
    return (
      <>
        <PageRouter
          parentPath="/dashboard/transactions"
          parentLabel="Back to Transactions"
        />
        <LoadingState message="Loading transaction details..." />
      </>
    );
  if (error)
    return (
      <>
        <PageRouter
          parentPath="/dashboard/transactions"
          parentLabel="Back to Transactions"
        />
        <ErrorState message={error.message} />
      </>
    );
  if (!transaction)
    return (
      <>
        <PageRouter
          parentPath="/dashboard/transactions"
          parentLabel="Back to Transactions"
        />
        <ErrorState message="Transaction not found" />
      </>
    );

  const isBuyer = transaction.buyer.id === user.id;
  // const isSeller = transaction.seller.id === user.id;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <PageRouter
          parentPath="/dashboard/transactions"
          parentLabel="Back to Transactions"
        />
        <TransactionHeader
          transaction={transaction}
          user={user}
          setActiveAction={setActiveAction}
        />
        <div className="flex gap-4 mt-2">
          {isBuyer && (
            <a href={`/users/${transaction.seller.id}`} target="_blank" rel="noopener noreferrer">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">View Seller Profile</button>
            </a>
          )}
          {!isBuyer && (
            <a href={`/users/${transaction.buyer.id}`} target="_blank" rel="noopener noreferrer">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">View Buyer Profile</button>
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TransactionInfo transaction={transaction} isBuyer={isBuyer} />
        </div>

        <TransactionTimeline logs={transaction.logs} />
      </div>

      {activeAction && (
        <TransactionActions
          transaction={transaction}
          actionType={activeAction}
          // isBuyer={isBuyer}
          // isSeller={isSeller}
          onClose={() => setActiveAction(null)}
          onComplete={() => {
            refetch();
            setActiveAction(null);
          }}
        />
      )}

      <TransactionTabs
        transaction={transaction}
        //  isBuyer={isBuyer}
        //  isSeller={isSeller}
      />
    </div>
  );
};

export default TransactionDetail;
