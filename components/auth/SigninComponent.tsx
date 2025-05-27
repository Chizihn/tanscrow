"use client";

import { useState } from "react";
import SocialProvider from "./SocialProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmailSigninSchema,
  emailSignInSchema,
  Payload,
  PhoneSigninSchema,
  phoneSignInSchema,
} from "@/types/auth";
import { AuthCard } from "./AuthCard";
import { CardContent, CardFooter } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowRight, Lock, Mail, Phone } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import { useMutation } from "@apollo/client";
import {
  SIGN_IN_WITH_EMAIL,
  SIGN_IN_WITH_PHONE,
} from "@/graphql/mutations/auth";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { cookieStorage } from "@/utils/session";
import { useRouter } from "next/navigation";

export function SignInComponent() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<string>("email");
  const { setUser, setToken } = useAuthStore();

  // Email sign in form
  const emailSignInForm = useForm({
    resolver: zodResolver(emailSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Phone sign in form
  const phoneSignInForm = useForm({
    resolver: zodResolver(phoneSignInSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  // Store authentication data (token and user info)
  const storeAuthData = (data: Payload) => {
    // Store token in cookie for persistence
    cookieStorage.setItem("token", data.token);

    // Update auth store
    setToken(data.token);
    setUser(data.user);
  };

  //Sign in with email mutation
  const [signInWithEmail, { loading: emailSigninLoading }] = useMutation(
    SIGN_IN_WITH_EMAIL,
    {
      onCompleted: (data) => {
        toast.success("Welcome back!");
        storeAuthData(data.signinWithEmail);
        router.push("/dashboard");
      },
      onError: (error) => {
        toast.error(error.message || "An error occured");
      },
    }
  );

  //Sign in with phone number mutation
  const [signInWithPhone, { loading: phoneSigninLoading }] = useMutation(
    SIGN_IN_WITH_PHONE,
    {
      onCompleted: (data) => {
        toast.success("Welcome back!");
        storeAuthData(data.signinWithPhone); // Assuming response structure
        router.push("/dashboard");
      },
      onError: (error) => {
        toast.error(error.message || "An error occured");
      },
    }
  );

  // Form submit handlers
  async function onEmailSignInSubmit(data: EmailSigninSchema) {
    await signInWithEmail({
      variables: { input: data },
    });
  }

  async function onPhoneSignInSubmit(data: PhoneSigninSchema) {
    await signInWithPhone({
      variables: { input: data },
    });
  }

  return (
    <AuthCard title="Welcome Back" description="Sign in to access your account">
      <CardContent className=" pt-1 pb-6 ">
        <Tabs
          value={authMethod}
          onValueChange={setAuthMethod}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="email"
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary"
              disabled={phoneSigninLoading}
            >
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger
              value="phone"
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary"
              disabled={emailSigninLoading}
            >
              <Phone className="h-4 w-4" />
              Phone
            </TabsTrigger>
          </TabsList>

          {/* Email Sign In Form */}
          <TabsContent value="email" className="mt-0">
            <Form {...emailSignInForm}>
              <form
                onSubmit={emailSignInForm.handleSubmit(onEmailSignInSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={emailSignInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          className="bg-secondary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={emailSignInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Password
                        </FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          className="bg-secondary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-6 group"
                  disabled={emailSigninLoading}
                >
                  {emailSigninLoading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Phone Sign In Form */}
          <TabsContent value="phone" className="mt-0">
            <Form {...phoneSignInForm}>
              <form
                onSubmit={phoneSignInForm.handleSubmit(onPhoneSignInSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={phoneSignInForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1234567890"
                          type="tel"
                          className="bg-secondary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={phoneSignInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Password
                        </FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          className="bg-secondary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-6 group"
                  disabled={phoneSigninLoading}
                >
                  {phoneSigninLoading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pb-6 px-6">
        <SocialProvider />
        <div className="text-center mt-4 text-sm text-muted-foreground">
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </CardFooter>
    </AuthCard>
  );
}
