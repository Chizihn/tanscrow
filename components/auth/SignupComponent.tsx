"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCard } from "./AuthCard";
import { CardContent, CardFooter } from "../ui/card";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
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
import { EmailSignupSchema, emailSignUpSchema, Payload } from "@/types/auth";
import SocialProvider from "./SocialProvider";
import { SIGN_UP_WITH_EMAIL } from "@/graphql/mutations/auth";
import { useMutation } from "@apollo/client";
import { useAuthStore } from "@/store/auth-store";
import { cookieStorage } from "@/utils/session";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "../Toast";

export function SignUpComponent() {
  const router = useRouter();
  const { setUser, setAccessToken } = useAuthStore();

  const emailSignUpForm = useForm<EmailSignupSchema>({
    resolver: zodResolver(emailSignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const storeAuthData = (data: Payload) => {
    cookieStorage.setItem("token", data.token);
    setAccessToken(data.token);
    setUser(data.user);
  };

  const [signUpWithEmail, { loading: emailSignupLoading }] = useMutation(
    SIGN_UP_WITH_EMAIL,
    {
      onCompleted: (data) => {
        showSuccessToast("Account created successfully!");
        storeAuthData(data.signupWithEmail);
        router.push("/verify");
      },
      onError: (error) => {
        showErrorToast(error.message || "An error occurred");
      },
    }
  );

  async function onEmailSignUpSubmit(data: EmailSignupSchema) {
    const formData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
    };

    signUpWithEmail({
      variables: { input: formData },
    });
  }

  return (
    <AuthCard
      title="Create an account"
      description="You can create an account to start using our service"
    >
      <CardContent className="pt-1 pb-6">
        <Form {...emailSignUpForm}>
          <form
            onSubmit={emailSignUpForm.handleSubmit(onEmailSignUpSubmit)}
            className="space-y-8"
          >
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={emailSignUpForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" /> First Name
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

            {/* Email */}
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

            {/* Phone Number - NOW ADDED BACK */}
            <FormField
              control={emailSignUpForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      className="bg-secondary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
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

            {/* Confirm Password */}
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

            {/* Submit Button */}
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
