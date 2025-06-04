"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_WALLET } from "@/graphql/queries/wallet";
import { showErrorToast, showSuccessToast } from "@/components/Toast";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { API_URL_2 } from "@/constants";

enum VerificationStatus {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  ERROR = "ERROR",
}

interface PaymentData {
  reference: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
}

interface PaymentVerificationResponse {
  success: boolean;
  message?: string;
  data?: PaymentData;
}

export default function WalletFundingCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>(
    VerificationStatus.LOADING
  );
  const [paymentDetails, setPaymentDetails] = useState<PaymentData | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Prevent multiple verification calls
  const verificationAttempted = useRef(false);
  const isVerifying = useRef(false);

  // Extract parameters from URL
  const tx_ref = searchParams.get("tx_ref");
  const reference = searchParams.get("reference") || tx_ref;
  const gateway = searchParams.get("gateway") || "paystack";
  const urlStatus = searchParams.get("status");

  // GraphQL query for wallet refetch
  const { refetch: refetchWallet } = useQuery(GET_WALLET, {
    fetchPolicy: "network-only",
  });

  // Check if this is a direct redirect from payment gateway
  const isDirectRedirect = urlStatus === "success" || urlStatus === "failed";

  // Verify payment with backend API
  const verifyPayment = async () => {
    // Prevent multiple simultaneous calls
    if (isVerifying.current) {
      return;
    }

    if (!reference) {
      setStatus(VerificationStatus.ERROR);
      setErrorMessage("Invalid or missing payment reference");
      showErrorToast("Invalid payment reference");
      setTimeout(() => router.push("/dashboard/wallet"), 3000);
      return;
    }

    isVerifying.current = true;

    try {
      const response = await fetch(
        `${API_URL_2}/webhooks/payment/verify/${gateway}?${
          gateway === "paystack" ? "reference" : "tx_ref"
        }=${encodeURIComponent(reference)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        throw new Error(
          errorData.message ||
            `Verification failed with status: ${response.status}`
        );
      }

      const result: PaymentVerificationResponse = await response.json();

      if (result.success && result.data) {
        setStatus(VerificationStatus.SUCCESS);
        setPaymentDetails(result.data);
        showSuccessToast("Wallet funded successfully!");

        // Refetch wallet data
        try {
          await refetchWallet();
        } catch (refetchError) {
          console.warn("Failed to refetch wallet data:", refetchError);
        }

        // Redirect after 4 seconds
        setTimeout(() => {
          router.push("/dashboard/wallet");
        }, 4000);
      } else {
        setStatus(VerificationStatus.FAILED);
        setErrorMessage(result.message || "Payment verification failed");
        showErrorToast(result.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus(VerificationStatus.ERROR);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to verify payment";
      setErrorMessage(errorMsg);
      showErrorToast(errorMsg);
    } finally {
      isVerifying.current = false;
    }
  };

  // Handle different scenarios on component mount
  useEffect(() => {
    // Prevent multiple executions
    if (verificationAttempted.current) {
      return;
    }

    verificationAttempted.current = true;

    if (isDirectRedirect) {
      if (urlStatus === "success") {
        // Verify the payment even if status says success
        verifyPayment();
      } else if (urlStatus === "failed") {
        setStatus(VerificationStatus.FAILED);
        const reason = searchParams.get("reason") || "Payment failed";
        setErrorMessage(reason);
        showErrorToast(`Payment failed: ${reason}`);
      }
    } else {
      // Normal verification flow
      verifyPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run only once

  const getStatusIcon = () => {
    switch (status) {
      case VerificationStatus.LOADING:
        return <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />;
      case VerificationStatus.SUCCESS:
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case VerificationStatus.FAILED:
        return <XCircle className="w-12 h-12 text-red-600" />;
      case VerificationStatus.ERROR:
        return <AlertCircle className="w-12 h-12 text-orange-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case VerificationStatus.LOADING:
        return {
          title: "Verifying Payment",
          message: "Please wait while we confirm your transaction...",
        };
      case VerificationStatus.SUCCESS:
        return {
          title: "Payment Successful!",
          message:
            "Your wallet has been funded successfully. Redirecting to wallet...",
        };
      case VerificationStatus.FAILED:
        return {
          title: "Payment Failed",
          message:
            errorMessage ||
            "We couldn't process your payment. Please try again.",
        };
      case VerificationStatus.ERROR:
        return {
          title: "Something Went Wrong",
          message:
            errorMessage || "An error occurred while checking your payment.",
        };
    }
  };

  const handleReturnToWallet = () => {
    router.push("/dashboard/wallet");
  };

  const handleRetry = () => {
    // Reset refs for retry
    verificationAttempted.current = false;
    isVerifying.current = false;

    setStatus(VerificationStatus.LOADING);
    setErrorMessage("");
    verifyPayment();
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center space-y-6">
          {/* Status Icon */}
          <div className="flex justify-center">{getStatusIcon()}</div>

          {/* Status Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {statusInfo.title}
            </h1>
            <p className="text-gray-600">{statusInfo.message}</p>
          </div>

          {/* Payment Details (Success only) */}
          {status === VerificationStatus.SUCCESS && paymentDetails && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Amount Added</p>
                <p className="text-2xl font-bold text-green-700">
                  {paymentDetails.currency}{" "}
                  {paymentDetails.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  via {paymentDetails.gateway}
                </p>
              </div>
            </div>
          )}

          {/* Reference */}
          {reference && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">
                Transaction Reference
              </p>
              <p className="font-mono text-sm text-gray-800 break-all">
                {reference}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {status === VerificationStatus.SUCCESS ? (
              <button
                onClick={handleReturnToWallet}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Continue to Wallet
              </button>
            ) : status === VerificationStatus.FAILED ||
              status === VerificationStatus.ERROR ? (
              <div className="space-y-2">
                <button
                  onClick={handleRetry}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Retry Verification
                </button>
                <button
                  onClick={handleReturnToWallet}
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Back to Wallet
                </button>
              </div>
            ) : null}
          </div>

          {/* Loading State Button */}
          {status === VerificationStatus.LOADING && (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-medium cursor-not-allowed"
            >
              Verifying...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
