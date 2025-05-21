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
import { AuthCard } from "./AuthCard";
import { RESET_PASSWORD } from "@/graphql/mutations/auth";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { token } from "@/utils/session";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  // Set up the reset password mutation
  const [resetPassword] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      setIsReset(true);
      toast.success("Password has been successfully reset");
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to reset password. Please try again."
      );
      console.error("Reset password error:", error);
      setIsLoading(false);
    },
  });

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    if (!token) {
      toast.error(
        "Reset token is missing. Please use the link from your email."
      );
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        variables: {
          input: {
            newPassword: data.newPassword,
            token: token,
          },
        },
      });
    } catch (error) {
      // Error is handled by onError callback in useMutation
      console.error("Reset password error:", error);
    }
  }

  if (isReset) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-success" />
          </div>
          <CardTitle className="text-center">Password Reset</CardTitle>
          <CardDescription className="text-center">
            Your password has been successfully reset.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/signin">Sign In with New Password</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Error state if no token is available
  if (!token) {
    return (
      <AuthCard
        title="Invalid Reset Link"
        description="This password reset link is invalid or has expired. Please request a new one."
        classname="py-8"
      >
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/forgot-password">Request New Reset Link</Link>
          </Button>
        </CardFooter>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create New Password"
      description="Enter and confirm your new password below."
      classname="py-8"
    >
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your new password"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm your new password"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </AuthCard>
  );
}
