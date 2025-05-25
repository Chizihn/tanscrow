"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCard } from "./AuthCard";
import { CardContent, CardFooter } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
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
import {
  EmailSignupSchema,
  emailSignUpSchema,
  Payload,
  PhoneSignupSchema,
  phoneSignUpSchema,
} from "@/types/auth";
import SocialProvider from "./SocialProvider";
import {
  SIGN_UP_WITH_EMAIL,
  SIGN_UP_WITH_PHONE,
} from "@/graphql/mutations/auth";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { cookieStorage } from "@/utils/session";
import { useRouter } from "next/navigation";

// Sign Up component for the sign-up page
export function SignUpComponent() {
  const router = useRouter();

  const [authMethod, setAuthMethod] = useState<string>("email");
  const { setUser, setToken } = useAuthStore();

  // Email sign up form
  const emailSignUpForm = useForm({
    resolver: zodResolver(emailSignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Phone sign up form
  const phoneSignUpForm = useForm({
    resolver: zodResolver(phoneSignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
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

  //Sign up with email mutation
  const [signUpWithEmail, { loading: emailSignupLoading }] = useMutation(
    SIGN_UP_WITH_EMAIL,
    {
      onCompleted: (data) => {
        router.push("/dashboard");

        storeAuthData(data.signUpWithEmail);
        toast.success("Account created successfully!");
      },
      onError: (error) => {
        toast.error(error.message || "An error occurred");
      },
    }
  );

  //Sign up with phone number mutation
  const [signUpWithPhone, { loading: phoneSignupLoading }] = useMutation(
    SIGN_UP_WITH_PHONE,
    {
      onCompleted: (data) => {
        router.push("/dashboard");

        storeAuthData(data.signUpWithPhone);

        toast.success("Account created successfully!");
      },
      onError: (error) => {
        toast.error(error.message || "An error occurred");
      },
    }
  );

  // Form submit handlers
  async function onEmailSignUpSubmit(data: EmailSignupSchema) {
    // Exclude confirmPassword from the data sent to backend
    const { confirmPassword, ...formData } = data;

    signUpWithEmail({
      variables: { input: formData },
    });
  }

  async function onPhoneSignUpSubmit(data: PhoneSignupSchema) {
    // Exclude confirmPassword from the data sent to backend
    const { confirmPassword, ...formData } = data;

    signUpWithPhone({
      variables: { input: formData },
    });
  }

  return (
    <AuthCard
      title="Create an account"
      description="You can create an account to start using our escrow service"
    >
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
              disabled={phoneSignupLoading}
            >
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger
              value="phone"
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary"
              disabled={emailSignupLoading}
            >
              <Phone className="h-4 w-4" />
              Phone
            </TabsTrigger>
          </TabsList>

          {/* Email Sign Up Form */}
          <TabsContent value="email" className="mt-0">
            <Form {...emailSignUpForm}>
              <form
                onSubmit={emailSignUpForm.handleSubmit(onEmailSignUpSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={emailSignUpForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" /> First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            className="bg-secondary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailSignUpForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="bg-secondary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={emailSignUpForm.control}
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
                  control={emailSignUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Password
                      </FormLabel>
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

                <FormField
                  control={emailSignUpForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Confirm Password
                      </FormLabel>
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
                  disabled={emailSignupLoading}
                >
                  {emailSignupLoading ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Phone Sign Up Form */}
          <TabsContent value="phone" className="mt-0">
            <Form {...phoneSignUpForm}>
              <form
                onSubmit={phoneSignUpForm.handleSubmit(onPhoneSignUpSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={phoneSignUpForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" /> First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            className="bg-secondary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={phoneSignUpForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="bg-secondary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={phoneSignUpForm.control}
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
                  control={phoneSignUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email (Optional)
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
                  control={phoneSignUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Password
                      </FormLabel>
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

                <FormField
                  control={phoneSignUpForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Confirm Password
                      </FormLabel>
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
                  disabled={phoneSignupLoading}
                >
                  {phoneSignupLoading ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create Account
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
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardFooter>
    </AuthCard>
  );
}
