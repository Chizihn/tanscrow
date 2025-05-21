"use client";

import { useState } from "react";
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

// Define verification types
type VerificationType = "EMAIL" | "PHONE";

// Define props interface
interface AccountVerificationProps {
  type?: VerificationType;
  contactInfo?: string; // Email or phone number to verify
}

// Define schemas based on verification type
const verifyTokenSchema = z.object({
  token: z.string().min(1, "Verification code is required"),
});

const resendEmailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const resendPhoneSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
});

export function AccountVerification({
  type,
  contactInfo,
}: AccountVerificationProps) {
  const user = useAuthStore((state) => state.user) as User;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Determine verification type from props or user data
  const verificationType: VerificationType =
    type || (user?.providers[0]?.provider === "EMAIL" ? "EMAIL" : "PHONE");

  // Set up appropriate form based on verification type
  const verifyForm = useForm<z.infer<typeof verifyTokenSchema>>({
    resolver: zodResolver(verifyTokenSchema),
    defaultValues: {
      token: "",
    },
  });

  const resendEmailForm = useForm<z.infer<typeof resendEmailSchema>>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: {
      email: verificationType === "EMAIL" ? contactInfo || "" : "",
    },
  });

  const resendPhoneForm = useForm<z.infer<typeof resendPhoneSchema>>({
    resolver: zodResolver(resendPhoneSchema),
    defaultValues: {
      phone: verificationType === "PHONE" ? contactInfo || "" : "",
    },
  });

  // Verify mutations
  const [verifyEmail] = useMutation(VERIFY_EMAIL, {
    onCompleted: () => {
      toast.success("Email verified successfully!");
      setIsVerified(true);
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify email!");
      setIsLoading(false);
    },
  });

  const [verifyPhone] = useMutation(
    VERIFY_PHONE, // Changed from VERIFY_EMAIL to VERIFY_PHONE
    {
      onCompleted: () => {
        toast.success("Phone number verified successfully!");
        setIsVerified(true);
        setIsLoading(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to verify phone number!");
        setIsLoading(false);
      },
    }
  );

  // Resend mutations
  const [resendEmailVerify] = useMutation(RESEND_VERIFY_EMAIL, {
    onCompleted: () => {
      toast.success("Email verification code sent!");
      setIsResending(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send email verification code!");
      setIsResending(false);
    },
  });

  const [resendPhoneVerify] = useMutation(RESEND_VERIFY_PHONE, {
    onCompleted: () => {
      toast.success("SMS verification code sent!");
      setIsResending(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send SMS verification code!");
      setIsResending(false);
    },
  });

  // Submit handlers
  async function onVerifySubmit(data: z.infer<typeof verifyTokenSchema>) {
    setIsLoading(true);
    if (verificationType === "EMAIL") {
      verifyEmail({
        variables: data,
      });
    } else {
      verifyPhone({
        variables: data,
      });
    }
  }

  async function onResendSubmit(
    data: z.infer<typeof resendEmailSchema> | z.infer<typeof resendPhoneSchema>
  ) {
    setIsResending(true);
    if (verificationType === "EMAIL") {
      resendEmailVerify({
        variables: { email: "email" in data ? data.email : contactInfo },
      });
    } else {
      resendPhoneVerify({
        variables: { phone: "phone" in data ? data.phone : contactInfo },
      });
    }
  }

  // Success state
  if (isVerified) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-success" />
          </div>
          <CardTitle className="text-center">
            {verificationType === "EMAIL" ? "Email" : "Phone Number"} Verified
          </CardTitle>
          <CardDescription className="text-center">
            Your {verificationType === "EMAIL" ? "email" : "phone number"} has
            been successfully verified. You can now access all features.
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

  // Verification form
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          Verify Your {verificationType === "EMAIL" ? "Email" : "Phone Number"}
        </CardTitle>
        <CardDescription>
          We sent a verification code to{" "}
          {contactInfo ||
            `your ${verificationType === "EMAIL" ? "email" : "phone number"}`}
          . Please enter it below.
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
                    <Input placeholder="Enter code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Verifying..."
                : `Verify ${verificationType === "EMAIL" ? "Email" : "Phone"}`}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?
          </p>

          {/* Conditional form rendering based on verification type */}
          {verificationType === "EMAIL" ? (
            <Form {...resendEmailForm}>
              <form
                onSubmit={resendEmailForm.handleSubmit(onResendSubmit)}
                className="mt-2"
              >
                {!contactInfo && (
                  <FormField
                    control={resendEmailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button
                  variant="outline"
                  type="submit"
                  className="mt-2"
                  disabled={isResending}
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...resendPhoneForm}>
              <form
                onSubmit={resendPhoneForm.handleSubmit(onResendSubmit)}
                className="mt-2"
              >
                {!contactInfo && (
                  <FormField
                    control={resendPhoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormControl>
                          <Input
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button
                  variant="outline"
                  type="submit"
                  className="mt-2"
                  disabled={isResending}
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
