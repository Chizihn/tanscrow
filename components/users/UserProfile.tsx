"use client";

import { useQuery } from "@apollo/client";
import { GET_USER } from "@/graphql/queries/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import { Review } from "@/types/reviews";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { USER_REVIEWS_RECEIVED } from "@/graphql/queries/reviews";

export interface UserProfileProps {
  id: string;
}

export default function UserProfile({ id }: UserProfileProps) {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id },
    skip: !id,
  });

  const {
    data: reviewsData,
    loading: reviewsLoading,
    error: reviewsError,
  } = useQuery<{ userReviewsReceived: Review[] }>(USER_REVIEWS_RECEIVED, {
    skip: !id,
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  if (!data?.user) return <div>User not found</div>;

  const { user } = data;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profileImageUrl} />
              <AvatarFallback>
                {user.firstName?.[0] ?? ""}
                {user.lastName?.[0] ?? ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {user.firstName} {user.lastName}
              </CardTitle>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            {/* <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger> */}
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">User Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
                {user.phoneNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{user.phoneNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="activity">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Recent Activity</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No recent activity</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Transaction History</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No transaction history</p>
              </CardContent>
            </Card>
          </TabsContent> */}

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Reviews Received</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviewsLoading ? (
                  <LoadingState />
                ) : reviewsError ? (
                  <ErrorState message={reviewsError.message} />
                ) : reviewsData?.userReviewsReceived &&
                  reviewsData.userReviewsReceived.length > 0 ? (
                  reviewsData.userReviewsReceived.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-center mb-2">
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
                        <span className="ml-2 text-sm text-gray-600">
                          by {review.reviewer.firstName}{" "}
                          {review.reviewer.lastName}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
