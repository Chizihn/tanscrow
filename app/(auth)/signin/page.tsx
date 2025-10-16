"use client"
import { SignInComponent } from "@/components/auth/SigninComponent";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const pendingId = localStorage.getItem("pendingProductId");
      if (pendingId) {
        localStorage.removeItem("pendingProductId");
        router.push(`/marketplace/${pendingId}`);
      }
    }
  }, [isAuthenticated, router]);

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <SignInComponent />
    </div>
  );
}
