"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { Transaction } from "@/types/transaction";
import {
  CANCEL_TRANSACTION,
  CONFIRM_DELIVERY,
  PROCESS_PAYMENT,
  REQUEST_REFUND,
  UPDATE_DELIVERY,
} from "@/graphql/mutations/transaction";
import {
  CancelTransactionInput,
  DeliveryUpdateData,
  OpenDisputeInput,
  ProcessPaymentInput,
  RequestRefundInput,
} from "@/types/input";

import PaymentForm from "./forms/PaymentForm";
import UpdateDeliveryForm from "./forms/UpdateDeliveryForm";
import ConfirmDeliveryForm from "./forms/ConfirmDeliveryForm";
import CancelTransactionForm from "./forms/CancelTransationForm";
import RequestRefundForm from "./forms/PaymentRefundForm";
import DisputeForm from "./forms/DisputeForm";
import { showSuccessToast } from "@/components/Toast";

// Define the possible action types

export type ActionType =
  | "PAYMENT"
  | "UPDATE_DELIVERY"
  | "CONFIRM_DELIVERY"
  | "CANCEL"
  | "REQUEST_REFUND"
  | "DISPUTE";

interface TransactionActionsProps {
  transaction: Transaction;
  actionType: ActionType | null;
  //   isBuyer: boolean;
  //   isSeller: boolean;
  onClose: () => void;
  onComplete: (data?: Partial<Transaction>) => void;
}

const TransactionActions: React.FC<TransactionActionsProps> = ({
  transaction,
  actionType,
  onClose,
  onComplete,
}) => {
  const [error, setError] = useState("");

  const [processPayment, { loading: paymentLoading }] = useMutation(
    PROCESS_PAYMENT,
    {
      onCompleted: (data) => {
        showSuccessToast("Payment Initiated. Redirecting...");
        console.log("pay data", data);

        if (data.processPayment.payment?.gatewayResponse?.redirectUrl) {
          window.location.href =
            data.processPayment.payment.gatewayResponse.redirectUrl;
        }
      },
      onError: (error) => setError(error.message),
      // refetchQueries: [
      //   {
      //     query: GET_TRANSACTION,
      //     variables: { transactionid: transaction.id },
      //   },
      // ],
    }
  );

  const [updateDelivery, { loading: updateDeliveryLoading }] = useMutation(
    UPDATE_DELIVERY,
    {
      onCompleted: (data) => onComplete(data),
      onError: (error) => setError(error.message),
    }
  );

  const [confirmDelivery, { loading: confirmDeliveryLoading }] = useMutation(
    CONFIRM_DELIVERY,
    {
      onCompleted: (data) => onComplete(data),
      onError: (error) => setError(error.message),
    }
  );

  const [cancelTransaction, { loading: cancelTransactionLoading }] =
    useMutation(CANCEL_TRANSACTION, {
      onCompleted: (data) => onComplete(data),
      onError: (error) => setError(error.message),
    });

  const [requestRefund, { loading: requestRefundLoading }] = useMutation(
    REQUEST_REFUND,
    {
      onCompleted: (data) => onComplete(data),
      onError: (error) => setError(error.message),
    }
  );

  const handlePayment = (data: ProcessPaymentInput) => {
    processPayment({ variables: { input: data } });
  };

  const handleUpdateDelivery = (data: DeliveryUpdateData) => {
    updateDelivery({ variables: { input: data } });
  };

  const handleConfirmDelivery = (data: string) => {
    confirmDelivery({ variables: { input: data } });
  };

  const handleCancelTransaction = (data: CancelTransactionInput) => {
    cancelTransaction({ variables: { input: data } });
  };

  const handleRequestRefund = (data: RequestRefundInput) => {
    requestRefund({ variables: { input: data } });
  };

  const handleDispute = (data: OpenDisputeInput) => {
    console.log("Dispute submitted:", data);
    onComplete();
  };

  const actionConfig: Record<
    ActionType,
    {
      title: string;
      description: string;
      form: React.ReactNode;
    }
  > = {
    PAYMENT: {
      title: "Process Payment",
      description: "Complete payment for this transaction",
      form: (
        <PaymentForm
          transaction={transaction}
          onSubmit={handlePayment}
          loading={paymentLoading}
        />
      ),
    },
    UPDATE_DELIVERY: {
      title: "Update Delivery Information",
      description: "Provide delivery details and tracking information",
      form: (
        <UpdateDeliveryForm
          transaction={transaction}
          onSubmit={handleUpdateDelivery}
          loading={updateDeliveryLoading}
        />
      ),
    },
    CONFIRM_DELIVERY: {
      title: "Confirm Delivery",
      description: "Confirm that you have received the goods or services",
      form: (
        <ConfirmDeliveryForm
          transaction={transaction}
          onSubmit={handleConfirmDelivery}
          loading={confirmDeliveryLoading}
        />
      ),
    },
    CANCEL: {
      title: "Cancel Transaction",
      description: "Cancel this transaction",
      form: (
        <CancelTransactionForm
          transaction={transaction}
          onSubmit={handleCancelTransaction}
          loading={cancelTransactionLoading}
        />
      ),
    },
    REQUEST_REFUND: {
      title: "Request Refund",
      description: "Request a refund for this transaction",
      form: (
        <RequestRefundForm
          transaction={transaction}
          onSubmit={handleRequestRefund}
          loading={requestRefundLoading}
        />
      ),
    },
    DISPUTE: {
      title: "Raise Dispute",
      description: "Report an issue with this transaction",
      form: (
        <DisputeForm
          transaction={transaction}
          onSubmit={handleDispute}
          loading={false}
        />
      ),
    },
  };

  if (!actionType) return null;

  const config = actionConfig[actionType];

  return (
    <Dialog open={Boolean(actionType)} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {config.form}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionActions;
