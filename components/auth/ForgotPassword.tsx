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
import { CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { AuthCard } from "./AuthCard";
import { FORGOT_PASSWORD } from "@/graphql/mutations/auth";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [forgotPassword] = useMutation(FORGOT_PASSWORD, {
    onError: (error) => {
      toast.error(
        error.message || "Failed to send reset instructions. Please try again."
      );
      console.error("Forgot password error:", error);
    },
  });

  async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    try {
      const response = await forgotPassword({
        variables: { input: { email: data.email } },
      });

      if (response.data) {
        setIsSubmitted(true);
        toast.success("Password reset instructions sent to your email");
      }
    } catch (error) {
      // Error is handled by onError callback in useMutation
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <AuthCard
        title="Check Your Email"
        description="We've sent password reset instructions to your email address."
        classname="py-8"
      >
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-success" />
        </div>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/signin">Return to Sign In</Link>
          </Button>
        </CardFooter>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset Password"
      description="Enter your email address and we'll send you instructions to reset
          your password."
      classname="py-8"
    >
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.doe@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Send Reset Instructions"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild className="w-full mt-2">
          <Link href="/signin" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Sign In
          </Link>
        </Button>
      </CardFooter>
    </AuthCard>
  );
}
