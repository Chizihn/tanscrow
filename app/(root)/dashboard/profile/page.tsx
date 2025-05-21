"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@apollo/client";
import { User } from "@/types/user";

import { VerificationDocument } from "@/types/verification";
import { PersonalInfoTab } from "@/components/profile/PersonalInfoTab";
import { VerificationTab } from "@/components/profile/VerificationTab";
import { SecurityTab } from "@/components/profile/SecurityTab";
import { AccountTab } from "@/components/profile/AccountTab";
import { MY_VERIFICATION_DOCUMENTS } from "@/graphql/queries/verification";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user) as User;
  const { setUser } = useAuthStore();

  const { loading, error } = useQuery<{
    myVerificationDocuments: VerificationDocument[];
  }>(MY_VERIFICATION_DOCUMENTS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data?.myVerificationDocuments) {
        setUser({
          ...user,
          verificationDocuments: data.myVerificationDocuments,
        });
      }
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your account information and verification
        </p>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 mt-4">
          <PersonalInfoTab user={user} />
        </TabsContent>

        <TabsContent value="verification" className="space-y-4 mt-4">
          <VerificationTab user={user} loading={loading} error={error} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="account" className="space-y-4 mt-4">
          <AccountTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
