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
import PageHeader from "@/components/PageHeader";
import { Star } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { MY_VERIFICATION_DOCUMENTS } from "@/graphql/queries/verification";
import { USER_REVIEWS_GIVEN } from "@/graphql/queries/reviews";
import { Review } from "@/types/transaction";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user) as User;
  const { setUser } = useAuthStore();

  // === Verification Documents ===
  const { loading: verLoading, error: verError } = useQuery<{
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

  // === Reviews Given (by current user) ===
  const {
    data: reviewsGivenData,
    loading: reviewsGivenLoading,
    error: reviewsGivenError,
  } = useQuery(USER_REVIEWS_GIVEN, {
    fetchPolicy: "cache-and-network",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your account information and verification"
      />

      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="reviews-given">Reviews Given</TabsTrigger>
        </TabsList>

        {/* === Personal Info === */}
        <TabsContent value="personal" className="space-y-4 mt-4">
          <PersonalInfoTab user={user} />
        </TabsContent>

        {/* === Verification === */}
        <TabsContent value="verification" className="space-y-4 mt-4">
          <VerificationTab user={user} loading={verLoading} error={verError} />
        </TabsContent>

        {/* === Security === */}
        <TabsContent value="security" className="space-y-4 mt-4">
          <SecurityTab />
        </TabsContent>

        {/* === Account === */}
        <TabsContent value="account" className="space-y-4 mt-4">
          <AccountTab />
        </TabsContent>

        {/* === Reviews Given (NEW) === */}
        <TabsContent value="reviews-given" className="space-y-4 mt-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">
              Reviews You&apos;ve Given
            </h3>

            {reviewsGivenLoading ? (
              <LoadingState />
            ) : reviewsGivenError ? (
              <ErrorState message={reviewsGivenError.message} />
            ) : reviewsGivenData?.userReviewsGiven?.length ? (
              <div className="space-y-4">
                {reviewsGivenData.userReviewsGiven.map((review: Review) => (
                  <div
                    key={review.id}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {/* Stars */}
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            review.rating >= star
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground">
                        to{" "}
                        <span className="font-medium">
                          {review.seller.firstName} {review.seller.lastName}
                        </span>
                      </span>
                    </div>

                    <p className="text-sm text-foreground">{review.comment}</p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                You haven&apos;t written any reviews yet.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
