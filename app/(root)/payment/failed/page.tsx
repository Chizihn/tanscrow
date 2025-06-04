"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  XCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
} from "lucide-react";

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    const failureReason = searchParams.get("reason");
    setReason(failureReason);
  }, [searchParams]);

  const handleReturnToWallet = () => {
    router.push("/dashboard/wallet");
  };

  const handleTryAgain = () => {
    router.push("/dashboard/wallet");
  };

  const handleContactSupport = () => {
    // Replace with your support URL or email
    window.open("mailto:support@yourapp.com", "_blank");
  };

  const getErrorMessage = (errorReason: string | null) => {
    switch (errorReason) {
      case "invalid_gateway":
        return {
          title: "Invalid Payment Gateway",
          description: "The payment gateway specified is not supported.",
          details: "Please try again with a valid payment method.",
        };
      case "missing_reference":
        return {
          title: "Missing Payment Reference",
          description: "Payment reference is missing from the transaction.",
          details:
            "This usually happens when the payment process was interrupted.",
        };
      case "verification_failed":
        return {
          title: "Payment Verification Failed",
          description:
            "We couldn't verify your payment with the payment provider.",
          details: "Your payment may not have been processed successfully.",
        };
      case "server_error":
        return {
          title: "Server Error",
          description:
            "An error occurred on our servers while processing your payment.",
          details: "Please try again or contact support if the issue persists.",
        };
      default:
        return {
          title: "Payment Failed",
          description: "We couldn't process your payment successfully.",
          details:
            "This could be due to various reasons such as insufficient funds, network issues, or bank restrictions.",
        };
    }
  };

  const errorInfo = getErrorMessage(reason);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-red-200">
          <div className="text-center space-y-6">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-red-900">
                {errorInfo.title}
              </h1>
              <p className="text-red-700 text-lg">{errorInfo.description}</p>
            </div>

            {/* Error Details */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-800 mb-2">
                    What happened?
                  </p>
                  <p className="text-red-700 text-sm mb-3">
                    {errorInfo.details}
                  </p>

                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <p className="text-xs text-gray-600 mb-1">Error Code</p>
                    <p className="font-mono text-sm text-red-700">
                      {reason?.toUpperCase() || "UNKNOWN_ERROR"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Troubleshooting Tips */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                What you can do:
              </h3>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Check your internet connection</li>
                <li>• Verify your account balance</li>
                <li>• Try a different payment method</li>
                <li>• Contact your bank if needed</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <button
                onClick={handleReturnToWallet}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-xl hover:bg-gray-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Wallet
              </button>

              <button
                onClick={handleContactSupport}
                className="w-full bg-orange-100 text-orange-700 py-3 px-6 rounded-xl hover:bg-orange-200 transition-all duration-200 font-medium border border-orange-200"
              >
                Contact Support
              </button>
            </div>

            {/* Support Notice */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-orange-700 text-xs">
                If you continue to experience issues, please contact our support
                team with the error code above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
