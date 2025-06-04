"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import {
  RESEND_VERIFY_EMAIL,
  RESEND_VERIFY_PHONE,
  VERIFY_EMAIL,
  VERIFY_PHONE,
} from "@/graphql/mutations/user";
import { useAuthStore } from "@/store/auth-store";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { ProviderType } from "@/types/provider";
import LoadingState from "../LoadingState";

const verifyTokenSchema = z.object({
  token: z.string().min(1, "Verification code is required"),
});

export function AccountVerification() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user) as User;
  const { setUser } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const primaryProvider = user?.providers?.[0];
  const isEmailVerification = primaryProvider?.provider === ProviderType.EMAIL;
  const contactInfo = primaryProvider?.providerId || "";

  // Wait until user and providers are loaded before rendering
  useEffect(() => {
    if (user) {
      setPageLoading(false);
    }
  }, [user]);

  const verifyForm = useForm<z.infer<typeof verifyTokenSchema>>({
    resolver: zodResolver(verifyTokenSchema),
    defaultValues: { token: "" },
  });

  const [verifyEmail] = useMutation(VERIFY_EMAIL, {
    onCompleted: () => {
      setUser({ ...user, verified: true });
      toast.success("Email verified successfully!");
      router.push("/dashboard");
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify email!");
      setIsLoading(false);
    },
  });

  const [verifyPhone] = useMutation(VERIFY_PHONE, {
    onCompleted: (data) => {
      setUser({ ...user, verified: data?.verifyPhoneOtp });
      toast.success("Phone verified successfully!");
      router.push("/dashboard");
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify phone!");
      setIsLoading(false);
    },
  });

  const [resendEmailVerify] = useMutation(RESEND_VERIFY_EMAIL, {
    onCompleted: () => {
      toast.success("Email verification code resent!");
      setIsResending(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resend email code!");
      setIsResending(false);
    },
  });

  const [resendPhoneVerify] = useMutation(RESEND_VERIFY_PHONE, {
    onCompleted: () => {
      toast.success("Phone verification code resent!");
      setIsResending(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resend phone code!");
      setIsResending(false);
    },
  });

  async function onVerifySubmit(data: z.infer<typeof verifyTokenSchema>) {
    setIsLoading(true);
    if (isEmailVerification) {
      verifyEmail({ variables: { input: { token: data.token } } });
    } else {
      verifyPhone({ variables: { input: { token: data.token } } });
    }
  }

  async function onResendCode() {
    setIsResending(true);
    if (isEmailVerification) {
      resendEmailVerify({ variables: { input: { email: contactInfo } } });
    } else {
      resendPhoneVerify({ variables: { Input: { phone: contactInfo } } });
    }
  }

  // 🌀 Show loading while checking provider
  if (pageLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingState message="Preparing verification..." />
      </div>
    );

  // ❌ No verification required
  if (
    !primaryProvider ||
    (primaryProvider.provider !== ProviderType.EMAIL &&
      primaryProvider.provider !== ProviderType.PHONE)
  ) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>No Verification Required</CardTitle>
          <CardDescription>
            No email or phone verification is needed for your account.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/dashboard">Continue to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // ✅ Already verified
  if (user?.verified) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
          <CardTitle>
            {isEmailVerification ? "Email" : "Phone"} Verified
          </CardTitle>
          <CardDescription>
            Your {isEmailVerification ? "email" : "phone"} has been successfully
            verified.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/dashboard">Continue to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // 🔐 Verification form
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          Verify Your {isEmailVerification ? "Email" : "Phone"}
        </CardTitle>
        <CardDescription>
          We sent a code to <strong>{contactInfo}</strong>. Enter it below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...verifyForm}>
          <form
            onSubmit={verifyForm.handleSubmit(onVerifySubmit)}
            className="space-y-4"
          >
            <FormField
              control={verifyForm.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter verification code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Verifying..."
                : `Verify ${isEmailVerification ? "email" : "number"}`}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?
          </p>
          <Button
            variant="outline"
            onClick={onResendCode}
            className="mt-2"
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend Code"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
