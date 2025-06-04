"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Wallet, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard/wallet");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleContinueToWallet = () => {
    router.push("/dashboard/wallet");
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-green-200">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            {/* Success Message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-green-900">
                Payment Successful!
              </h1>
              <p className="text-green-700 text-lg">
                Your wallet has been funded successfully
              </p>
            </div>

            {/* Success Details */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-green-800 mb-4">
                <Wallet className="w-5 h-5" />
                <span className="font-semibold">Transaction Complete</span>
              </div>

              <p className="text-green-700 text-sm mb-4">
                Your payment has been processed and your wallet balance has been
                updated.
              </p>

              <div className="bg-white rounded-lg p-3 border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <p className="font-semibold text-green-700">✓ Confirmed</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleContinueToWallet}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Continue to Wallet
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleGoToDashboard}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Go to Dashboard
              </button>
            </div>

            {/* Auto-redirect Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-xs">
                You will be automatically redirected to your wallet in 5 seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
