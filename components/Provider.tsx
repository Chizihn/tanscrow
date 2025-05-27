"use client";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { useQuery } from "@apollo/client";
import { ME } from "@/graphql/queries/user";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/user";
import { isTokenExpired, token } from "@/utils/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AuthInitializer() {
  const router = useRouter();
  const { isAuthenticated, setUser, setIsAuthenticated, logout } =
    useAuthStore();

  useEffect(() => {
    if (isAuthenticated && isTokenExpired(token)) {
      logout();
      router.push("/signin");
    }
  }, [isAuthenticated, logout, router]);

  useQuery<{ me: User }>(ME, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    skip: !token,
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
        setIsAuthenticated(true);
      }
    },
  });

  return null;
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ApolloProvider client={apolloClient}>
        <AuthInitializer />
        <Toaster position="top-right" closeButton={true} />
        {children}
      </ApolloProvider>
    </ThemeProvider>
  );
}
