"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { GET_WALLET } from "@/graphql/queries/wallet";
import { VERIFY_PAYMENT } from "@/graphql/mutations/transaction";
import { showErrorToast, showSuccessToast } from "@/components/Toast";
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { WalletTransaction } from "@/types/wallet";

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
    useState<Partial<WalletTransaction | null>>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Extract reference from the URL parameters
  const tx_ref = searchParams.get("tx_ref");
  const reference = searchParams.get("reference") || tx_ref;

  // GraphQL operations
  const [verifyPayment] = useMutation(VERIFY_PAYMENT, {
    onCompleted: (data) => {
      if (data?.verifyPayment) {
        setVerificationStatus("success");
        setPaymentDetails({
          reference: (reference as string) || (tx_ref as string),
          amount: 0, // Amount will be updated from wallet data
        });
        showSuccessToast("Wallet funded successfully!");
      } else {
        setVerificationStatus("failed");
        showErrorToast("Payment verification failed");
      }
    },
    onError: (error) => {
      console.error("Payment verification error:", error);
      setVerificationStatus("error");
      showErrorToast("Verification failed. Please try again.");
    },
  });

  const {
    data: walletData,
    loading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useQuery(GET_WALLET, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const wallet = walletData?.getWallet;

  // Clean up polling interval
  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearTimeout(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // Handle successful payment
  const handleSuccess = useCallback(
    (message: string) => {
      setVerificationStatus("success");
      showSuccessToast(message);
      clearPolling();
      setTimeout(() => {
        router.push("/dashboard/wallet");
      }, 3000);
    },
    [router, clearPolling]
  );

  // Handle failed payment
  const handleFailure = useCallback(
    (message: string) => {
      setVerificationStatus("failed");
      showErrorToast(message);
      clearPolling();
      setTimeout(() => {
        router.push("/dashboard/wallet");
      }, 5000);
    },
    [router, clearPolling]
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

  // Check payment status and handle accordingly
  const checkPaymentStatus = useCallback(() => {
    if (verificationStatus !== "loading") return;

    if (wallet) {
      const lastTransactionStatus = wallet.lastTransaction?.status;
      if (lastTransactionStatus === "SUCCESS") {
        // Update payment details with actual wallet data
        setPaymentDetails((prev) => ({
          ...prev,
          amount: wallet.lastTransaction?.amount || 0,
          currency: wallet.lastTransaction?.currency || "USD",
          walletBalance: wallet.balance || 0,
        }));
        handleSuccess("Wallet funding successful");
        return;
      }
      if (lastTransactionStatus === "FAILED") {
        handleFailure("Wallet funding failed. Please try again.");
        return;
      }
    }

    // Continue polling if still pending
    if (pollCount < MAX_POLL_ATTEMPTS) {
      pollIntervalRef.current = setTimeout(() => {
        refetchWallet()
          .then(() => {
            setPollCount((prev) => prev + 1);
          })
          .catch((error) => {
            console.error("Error refetching wallet:", error);
            setPollCount((prev) => prev + 1);
          });
      }, POLL_INTERVAL);
    } else {
      handleTimeout();
    }
  }, [
    verificationStatus,
    wallet,
    pollCount,
    refetchWallet,
    handleSuccess,
    handleFailure,
    handleTimeout,
  ]);

  // Initial payment verification
  useEffect(() => {
    if (!reference && !tx_ref) {
      setVerificationStatus("error");
      showErrorToast("Invalid payment reference");
      router.push("/dashboard/wallet");
      return;
    }

    // Attempt direct verification first
    const paymentRef = reference || tx_ref;
    if (paymentRef) {
      verifyPayment({
        variables: { reference: paymentRef },
      }).catch((error) => {
        console.error("Initial verification failed:", error);
        // Continue with polling even if initial verification fails
      });
    }
  }, [reference, tx_ref, router, verifyPayment]);

  // Start polling when verification is still loading and we have wallet data
  useEffect(() => {
    if (verificationStatus === "loading" && !walletLoading && wallet) {
      checkPaymentStatus();
    }

    return clearPolling;
  }, [
    verificationStatus,
    walletLoading,
    wallet,
    checkPaymentStatus,
    clearPolling,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return clearPolling;
  }, [clearPolling]);

  // Navigation handlers
  const handleReturnToWallet = () => {
    router.push("/dashboard/wallet");
  };

  const handleRetry = () => {
    setVerificationStatus("loading");
    setPollCount(0);
    const paymentRef = reference || tx_ref;
    if (paymentRef) {
      verifyPayment({
        variables: { reference: paymentRef },
      }).catch((error) => {
        console.error("Retry verification failed:", error);
        showErrorToast("Failed to retry verification");
      });
    }
  };

  // Get status message
  const getStatusMessage = () => {
    if (walletLoading && verificationStatus === "loading")
      return "Retrieving wallet details...";

    const status = wallet?.lastTransaction?.status;
    switch (status) {
      case "SUCCESS":
        return "Wallet funding successful! Redirecting...";
      case "PENDING":
        return "Processing wallet funding...";
      case "FAILED":
        return "Wallet funding failed. Redirecting...";
      default:
        return "Verifying wallet funding...";
    }
  };

  const renderStatusIcon = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
        );
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />;
      case "failed":
        return <XCircle className="h-12 w-12 text-red-500 mx-auto" />;
      case "error":
      case "timeout":
        return <AlertCircle className="h-12 w-12 text-orange-500 mx-auto" />;
      default:
        return (
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
        );
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center">
            <div className="mb-4">{renderStatusIcon()}</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verifying Wallet Funding
            </h2>
            <p className="text-gray-600 mb-4">{getStatusMessage()}</p>

            {pollCount > 3 && (
              <p className="text-sm text-gray-500">
                This is taking longer than usual. Please wait...
              </p>
            )}

            <div className="mt-4 text-sm text-gray-500">
              Reference: {reference || tx_ref}
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="mb-4">{renderStatusIcon()}</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Wallet Funded Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Your wallet has been funded successfully.
            </p>

            {paymentDetails && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="text-left space-y-2">
                  {Number(paymentDetails.amount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold">
                        {paymentDetails.currency}{" "}
                        {paymentDetails.amount?.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-mono text-sm break-all">
                      {paymentDetails.reference}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Balance:</span>
                    <span className="font-semibold text-green-600">
                      {paymentDetails.currency}{" "}
                      {paymentDetails.balanceBefore?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleReturnToWallet}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Return to Wallet
            </button>
          </div>
        );

      case "failed":
        return (
          <div className="text-center">
            <div className="mb-4">{renderStatusIcon()}</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Wallet Funding Failed
            </h2>
            <p className="text-gray-600 mb-4">
              We couldn&apos;t verify your wallet funding. Your account has not
              been charged.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-mono text-sm break-all">
                    {reference || tx_ref}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Retry Verification
              </button>

              <button
                onClick={handleReturnToWallet}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Wallet
              </button>
            </div>
          </div>
        );

      case "error":
      case "timeout":
        return (
          <div className="text-center">
            <div className="mb-4">{renderStatusIcon()}</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {verificationStatus === "timeout"
                ? "Verification Timeout"
                : "Verification Error"}
            </h2>
            <p className="text-gray-600 mb-4">
              {verificationStatus === "timeout"
                ? "Wallet funding verification timed out. Please check your wallet balance or contact support."
                : "Something went wrong while verifying your wallet funding. Please try again or contact support."}
            </p>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>

              <button
                onClick={handleReturnToWallet}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Back to Wallet
              </button>
            </div>
          </div>
        );

      default:
        return renderContent();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="text-center max-w-md w-full bg-card p-8 rounded-lg shadow-md">
        {renderContent()}

        {walletError && verificationStatus === "loading" && (
          <div className="mt-4 p-4 bg-destructive/10 rounded text-destructive text-sm">
            Error checking wallet status. Please check your wallet balance.
          </div>
        )}
      </div>
    </div>
  );
}
