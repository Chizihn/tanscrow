"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTION } from "@/graphql/queries/transaction";
import { showErrorToast, showSuccessToast } from "@/components/Toast";

export default function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pollCount, setPollCount] = useState<number>(0);
  const [pollingComplete, setPollingComplete] = useState<boolean>(false);

  // Extract transaction ID from the URL parameters
  // const status = searchParams.get("status");
  const tx_ref = searchParams.get("tx_ref");

  // Extract the transaction UUID from the tx_ref
  const extractedTxId = tx_ref?.match(
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
  )?.[0];

  // Query the transaction status
  const { data, loading, error, refetch } = useQuery(GET_TRANSACTION, {
    variables: { transactionId: extractedTxId },
    fetchPolicy: "network-only",
    skip: !extractedTxId,
    notifyOnNetworkStatusChange: true,
  });

  const transaction = data?.transaction;

  // Poll for transaction status updates
  useEffect(() => {
    // Don't poll if we've completed or if there's no transaction ID
    if (pollingComplete || !extractedTxId) return;

    // Check if payment is confirmed
    if (transaction?.isPaid && transaction?.status === "IN_PROGRESS") {
      showSuccessToast("Payment confirmed successfully");
      setPollingComplete(true);
      router.push(`/dashboard/transactions/${extractedTxId}`);
      return;
    }

    // Check if payment has failed
    if (transaction?.payment?.status === "FAILED") {
      showErrorToast("Payment verification failed. Please try again.");
      setPollingComplete(true);
      router.push(`/dashboard/transactions/${extractedTxId}`);
      return;
    }

    // If status is still pending and we haven't polled too many times
    if (pollCount < 10) {
      const timer = setTimeout(() => {
        refetch();
        setPollCount((prev) => prev + 1);
      }, 3000); // Poll every 3 seconds

      return () => clearTimeout(timer);
    } else {
      // Give up after 10 attempts (30 seconds)
      showErrorToast(
        "Payment verification timed out. Please check your transaction history."
      );
      setPollingComplete(true);
      router.push(`/dashboard/transactions/${extractedTxId}`);
    }
  }, [transaction, pollCount, extractedTxId, pollingComplete, refetch, router]);

  // Handle initial navigation if parameters are invalid
  useEffect(() => {
    if (!extractedTxId) {
      showErrorToast("Invalid payment reference");
      router.push("/dashboard/transactions");
    }
  }, [extractedTxId, router]);

  // Show user-friendly status message
  const getStatusMessage = () => {
    if (!transaction) return "Retrieving transaction details...";
    if (transaction.isPaid) return "Payment confirmed! Redirecting...";
    if (transaction.payment?.status === "PENDING")
      return "Payment is being processed...";
    if (transaction.payment?.status === "FAILED")
      return "Payment failed. Redirecting...";
    return "Verifying payment status...";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="text-center max-w-md w-full bg-card p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Payment Verification</h2>

        {loading && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Verifying Payment...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we verify your payment
            </p>
          </div>
        )}

        <p className="text-muted-foreground mb-2">{getStatusMessage()}</p>

        {pollCount > 3 && !pollingComplete && (
          <p className="text-sm text-muted-foreground mt-4">
            This is taking longer than usual. Please wait...
          </p>
        )}

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 rounded text-destructive text-sm">
            Error checking payment status. Please check your transaction
            history.
          </div>
        )}
      </div>
    </div>
  );
}
