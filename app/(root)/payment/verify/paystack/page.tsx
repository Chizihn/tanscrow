"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_WALLET, GET_WALLET_TRANSACTIONS } from "@/graphql/queries/wallet";
import { showErrorToast, showSuccessToast } from "@/components/Toast";
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Wallet,
  Clock,
} from "lucide-react";
import {
  WalletTransaction,
  WalletTransactionStatus,
  WalletTransactionType,
} from "@/types/wallet";

const MAX_POLL_ATTEMPTS = 10;
const POLL_INTERVAL = 3000;

type VerificationStatus =
  | "loading"
  | "success"
  | "failed"
  | "error"
  | "timeout";

export default function WalletFundingCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pollCount, setPollCount] = useState<number>(0);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("loading");
  const [paymentDetails, setPaymentDetails] =
    useState<WalletTransaction | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Extract reference from the URL parameters
  const tx_ref = searchParams.get("tx_ref");
  const reference = searchParams.get("reference") || tx_ref;

  // GraphQL operations
  const {
    loading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useQuery(GET_WALLET, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const [
    getTransactions,
    { loading: transactionsLoading, error: transactionsError },
  ] = useLazyQuery(GET_WALLET_TRANSACTIONS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      handleTransactionData(data?.getWalletTransactions || []);
    },
    onError: (error) => {
      console.error("Error fetching transactions:", error);
      setVerificationStatus("error");
      showErrorToast("Failed to fetch transaction details");
      clearPolling();
    },
  });

  // Clean up polling interval
  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearTimeout(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // Handle transaction data
  const handleTransactionData = useCallback(
    (transactionsList: WalletTransaction[]) => {
      // Find the transaction by reference
      const transaction = transactionsList.find(
        (tx: WalletTransaction) =>
          tx.reference === reference &&
          tx.type === WalletTransactionType.DEPOSIT
      );

      if (transaction) {
        if (transaction.status === WalletTransactionStatus.COMPLETED) {
          setVerificationStatus("success");
          setPaymentDetails(transaction);
          showSuccessToast("Wallet funded successfully!");
          clearPolling();

          // Refetch wallet to get updated balance
          refetchWallet();

          setTimeout(() => {
            router.push("/dashboard/wallet");
          }, 4000);
        } else if (transaction.status === WalletTransactionStatus.FAILED) {
          setVerificationStatus("failed");
          setPaymentDetails(transaction);
          showErrorToast("Payment failed");
          clearPolling();
        } else if (transaction.status === WalletTransactionStatus.PENDING) {
          // Still pending, continue polling
          if (pollCount < MAX_POLL_ATTEMPTS) {
            schedulePoll();
          } else {
            handleTimeout();
          }
        }
      } else {
        // Transaction not found yet, continue polling
        if (pollCount < MAX_POLL_ATTEMPTS) {
          schedulePoll();
        } else {
          handleTimeout();
        }
      }
    },
    [clearPolling, pollCount, reference, refetchWallet, router]
  );

  // Handle timeout
  const handleTimeout = useCallback(() => {
    setVerificationStatus("timeout");
    clearPolling();
    showErrorToast(
      "Payment verification timed out. Please check your wallet balance."
    );
    setTimeout(() => {
      router.push("/dashboard/wallet");
    }, 5000);
  }, [router, clearPolling]);

  // Schedule next poll
  const schedulePoll = useCallback(() => {
    pollIntervalRef.current = setTimeout(() => {
      setPollCount((prev) => prev + 1);
      getTransactions();
    }, POLL_INTERVAL);
  }, [getTransactions]);

  // Handle manual retry
  const handleRetry = useCallback(() => {
    setVerificationStatus("loading");
    setPollCount(0);
    clearPolling();
    getTransactions();
  }, [getTransactions, clearPolling]);

  // Initial setup and validation
  useEffect(() => {
    if (!reference) {
      setVerificationStatus("error");
      showErrorToast("Invalid payment reference");
      router.push("/dashboard/wallet");
      return;
    }

    // Start initial transaction check
    getTransactions();
  }, [reference, router, getTransactions]);

  // Cleanup on unmount
  useEffect(() => {
    return clearPolling;
  }, [clearPolling]);

  // Navigation handlers
  const handleReturnToWallet = () => {
    clearPolling();
    router.push("/dashboard/wallet");
  };

  // Get status message
  const getStatusMessage = () => {
    if (transactionsLoading) return "Checking transaction status...";
    if (walletLoading) return "Updating wallet balance...";

    switch (verificationStatus) {
      case "loading":
        return `Verifying payment... (${pollCount}/${MAX_POLL_ATTEMPTS})`;
      case "success":
        return "Payment confirmed! Redirecting to wallet...";
      case "failed":
        return "Payment could not be processed";
      case "timeout":
        return "Verification timed out";
      case "error":
        return "Something went wrong";
      default:
        return "Processing...";
    }
  };

  const renderStatusIcon = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          </div>
        );
      case "success":
        return (
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        );
      case "failed":
        return (
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        );
      case "error":
      case "timeout":
        return (
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center space-y-6">
            {renderStatusIcon()}

            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Verifying Payment
              </h1>
              <p className="text-gray-600 text-lg">{getStatusMessage()}</p>
            </div>

            {/* Progress indicator */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${Math.min(
                    (pollCount / MAX_POLL_ATTEMPTS) * 100,
                    90
                  )}%`,
                }}
              />
            </div>

            {pollCount > 3 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Taking longer than usual
                  </span>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  Your payment is being processed. Please don&apos;t close this
                  page.
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm font-medium">Payment Reference</span>
              </div>
              <p className="font-mono text-sm text-gray-900 break-all bg-white px-3 py-2 rounded-lg border">
                {reference}
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-6">
            {renderStatusIcon()}

            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-green-900">
                Payment Successful!
              </h1>
              <p className="text-green-700 text-lg">
                Your wallet has been funded successfully
              </p>
            </div>

            {paymentDetails && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-green-800 mb-4">
                  <Wallet className="w-5 h-5" />
                  <span className="font-semibold">Transaction Details</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <span className="text-gray-600 block">Amount Added</span>
                    <span className="font-bold text-green-700 text-lg">
                      {paymentDetails.currency}{" "}
                      {paymentDetails.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-600 block">New Balance</span>
                    <span className="font-bold text-green-700 text-lg">
                      {paymentDetails.currency}{" "}
                      {paymentDetails.balanceAfter.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-green-200">
                  <div className="text-xs text-gray-600 mb-1">Reference</div>
                  <div className="font-mono text-xs text-gray-800 bg-white px-2 py-1 rounded border break-all">
                    {paymentDetails.reference}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleReturnToWallet}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Continue to Wallet
            </button>
          </div>
        );

      case "failed":
        return (
          <div className="text-center space-y-6">
            {renderStatusIcon()}

            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-red-900">
                Payment Failed
              </h1>
              <p className="text-red-700 text-lg">
                We couldn&apos;t process your payment
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="space-y-3">
                <p className="text-red-800 text-sm">
                  Your payment could not be completed. This might be due to:
                </p>
                <ul className="text-red-700 text-sm space-y-1 text-left">
                  <li>• Insufficient funds in your account</li>
                  <li>• Bank declined the transaction</li>
                  <li>• Network connectivity issues</li>
                </ul>

                {paymentDetails && (
                  <div className="pt-3 border-t border-red-200">
                    <div className="text-xs text-red-600 mb-1">Reference</div>
                    <div className="font-mono text-xs text-red-800 bg-white px-2 py-1 rounded border break-all">
                      {paymentDetails.reference}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-yellow-600 text-white py-4 px-6 rounded-xl hover:bg-yellow-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={transactionsLoading}
              >
                {transactionsLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking Again...</span>
                  </div>
                ) : (
                  "Try Again"
                )}
              </button>

              <button
                onClick={handleReturnToWallet}
                className="w-full bg-gray-600 text-white py-4 px-6 rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Wallet
              </button>
            </div>
          </div>
        );

      case "error":
      case "timeout":
        return (
          <div className="text-center space-y-6">
            {renderStatusIcon()}

            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-orange-900">
                {verificationStatus === "timeout"
                  ? "Verification Timeout"
                  : "Something Went Wrong"}
              </h1>
              <p className="text-orange-700 text-lg">
                {verificationStatus === "timeout"
                  ? "We couldn't verify your payment in time"
                  : "An error occurred while checking your payment"}
              </p>
            </div>

            {(walletError || transactionsError) && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-orange-800 text-sm font-medium mb-1">
                      Error Details
                    </p>
                    <p className="text-orange-700 text-sm">
                      {walletError?.message ||
                        transactionsError?.message ||
                        "Unknown error occurred"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <p className="text-gray-700 text-sm mb-3">
                {verificationStatus === "timeout"
                  ? "Your payment may still be processing. Please check your wallet balance or contact support if the issue persists."
                  : "Please try again or contact support if the problem continues."}
              </p>

              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-600 mb-1">Reference</div>
                <div className="font-mono text-xs text-gray-800 bg-white px-2 py-1 rounded border break-all">
                  {reference}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={transactionsLoading}
              >
                {transactionsLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Trying Again...</span>
                  </div>
                ) : (
                  "Try Again"
                )}
              </button>

              <button
                onClick={handleReturnToWallet}
                className="w-full bg-gray-600 text-white py-4 px-6 rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold"
              >
                Back to Wallet
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
