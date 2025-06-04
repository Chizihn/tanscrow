// src/components/transactions/create/TransactionForm.tsx
"use client";
import React, { useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_TRANSACTION } from "@/graphql/mutations/transaction";
import { showErrorToast, showSuccessToast } from "@/components/Toast";
import { useAuthStore } from "@/store/auth-store";
import { useTransactionStore } from "@/store/transaction-store";
import { SearchUserType, User } from "@/types/user";
import PageRouter from "@/components/PageRouter";

import {
  TransactionRole,
  TransactionType,
  DeliveryMethod,
} from "@/types/transaction";
import { PaymentCurrency } from "@/types/payment";
import SuccessMessage from "./SuccessMessage";
import TransactionStepIndicator from "./TransactionStepIndicator";
import TransactionDetailsStep from "./TransactionDetailsStep";
import CounterpartyStep from "./CounterPartyStep";
import ConfirmationStep from "./ConfirmationStep";
import { SEARCH_USER } from "@/graphql/queries/user";

export interface TransactionFormData {
  title: string;
  description: string;
  type: TransactionType;
  amount: string;
  currency: PaymentCurrency;
  counterpartyIdentifier: string;
  deliveryMethod: DeliveryMethod;
  termsAccepted: boolean;
  role: TransactionRole;
}

export default function TransactionForm() {
  const user = useAuthStore((state) => state.user) as User;
  const [step, setStep] = useState<number>(1);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState<TransactionFormData>({
    title: "",
    description: "",
    type: TransactionType.SERVICE,
    amount: "",
    currency: PaymentCurrency.NGN,
    counterpartyIdentifier: "",
    deliveryMethod: DeliveryMethod.DIGITAL,
    termsAccepted: false,
    role: TransactionRole.BUYER,
  });
  const [counterParty, setCounterParty] = useState<Partial<User> | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);
  const { transaction, setTransaction } = useTransactionStore();

  // Changed from useQuery to useLazyQuery to manually control when the query runs
  const [searchUser, { loading: searchingUser, error }] = useLazyQuery<{
    searchUser: Partial<User>;
  }>(SEARCH_USER, {
    onCompleted: (data) => {
      if (data?.searchUser) {
        setCounterParty(data.searchUser);
      } else {
        setCounterParty(null);
      }
    },
    onError: () => {
      setCounterParty(null);
    },
  });

  // Function to manually trigger the user search
  const handleSearchCounterparty = (identifier: string) => {
    if (identifier.trim()) {
      searchUser({
        variables: {
          input: {
            query: identifier,
            searchType: SearchUserType.TRANSACTION,
          },
        },
      });
    } else {
      setCounterParty(null);
    }
  };

  const [createTransaction, { loading: creatingTransaction }] = useMutation(
    CREATE_TRANSACTION,
    {
      onCompleted: (data) => {
        setTransaction(data?.createTransaction);
        setTransactionSuccess(true);
        showSuccessToast("Transaction created successfully!");
      },
      onError: (error) => {
        showErrorToast(
          error.message || "Failed to create transaction. Please try again."
        );
      },
    }
  );

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCreateTransaction = () => {
    const parsedAmount = parseFloat(formData.amount || "0") || 0;

    const transactionData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      amount: parsedAmount,
      paymentCurrency: formData.currency,
      deliveryMethod: formData.deliveryMethod,
      expectedDeliveryDate: date,
      buyerId:
        formData.role === TransactionRole.BUYER
          ? (user?.id as string)
          : (counterParty?.id as string),
      sellerId:
        formData.role === TransactionRole.SELLER
          ? (user?.id as string)
          : (counterParty?.id as string),
    };

    createTransaction({
      variables: { input: transactionData },
    });
  };

  if (transactionSuccess) {
    return <SuccessMessage transaction={transaction} />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <PageRouter
          parentLabel="Back to Transactions"
          parentPath="/dashboard/transactions"
        />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Create Transaction
          </h2>
          <p className="text-muted-foreground">
            Set up a new escrow transaction in a few steps
          </p>
        </div>
      </div>

      <TransactionStepIndicator currentStep={step} />

      {step === 1 && (
        <TransactionDetailsStep
          formData={formData}
          date={date}
          setDate={setDate}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          nextStep={nextStep}
        />
      )}

      {step === 2 && (
        <CounterpartyStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleCheckboxChange={handleCheckboxChange}
          setCounterParty={setCounterParty}
          counterParty={counterParty}
          nextStep={nextStep}
          prevStep={prevStep}
          loading={searchingUser}
          error={error?.message as string}
          searchCounterparty={handleSearchCounterparty}
        />
      )}

      {step === 3 && (
        <ConfirmationStep
          formData={formData}
          date={date}
          handleCreateTransaction={handleCreateTransaction}
          creatingTransaction={creatingTransaction}
          prevStep={prevStep}
        />
      )}
    </div>
  );
}
