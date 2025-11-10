"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MessageSquare, Download, Star } from "lucide-react";
import { Transaction, TransactionStatus } from "@/types/transaction";
import DocumentsList from "./DocumentsList";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHAT_BY_PARTICIPANTS } from "@/graphql/queries/chat";
import { Chat } from "@/types/chat";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CREATE_CHAT } from "@/graphql/mutations/chat";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { showErrorToast } from "@/components/Toast";
import { CREATE_REVIEW } from "@/graphql/mutations/reviews";
import { ReviewInput } from "@/types/reviews"; // ✅ Use your defined type
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TransactionTabsProps {
  transaction: Transaction;
  refetch?: () => void;
}

const TransactionTabs: React.FC<TransactionTabsProps> = ({
  transaction,
  refetch,
}) => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // Determine the other participant
  const otherUserId =
    user?.id === transaction.buyer.id
      ? transaction.seller.id
      : transaction.buyer.id;

  // Fetch existing chat (if any)
  const { data, loading, error } = useQuery<{ getChatByParticipants: Chat }>(
    GET_CHAT_BY_PARTICIPANTS,
    {
      variables: {
        participantIds: [user?.id, otherUserId].filter(Boolean),
      },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      skip: !user?.id || !otherUserId,
    }
  );

  const [createChat, { loading: createChatLoading }] = useMutation(
    CREATE_CHAT,
    {
      onCompleted: (data) => {
        router.push(`/dashboard/chat/${data.createChat.id}`);
      },
      onError: (err) => {
        showErrorToast(err.message);
      },
    }
  );

  const existingChat = data?.getChatByParticipants;

  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");

  const canLeaveReview =
    user?.id === transaction.buyer.id &&
    transaction.status === TransactionStatus.COMPLETED;

  // ✅ Properly typed mutation for createReview
  const [createReview, { loading: createReviewLoading }] = useMutation<
    { createReview: { id: string } }, // Return type
    { input: ReviewInput } // Variables type
  >(CREATE_REVIEW, {
    onCompleted: () => {
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      if (refetch) refetch();
    },
    onError: (err) => {
      showErrorToast(err.message);
    },
  });

  const handleReviewSubmit = () => {
    if (!rating || !comment) {
      showErrorToast("Please provide a rating and a comment.");
      return;
    }

    if (transaction.seller.id) {
      const input: ReviewInput = {
        rating,
        comment,
        sellerId: transaction.seller.id,
      };

      createReview({ variables: { input } });
    }
  };

  const handleCreateChat = () => {
    console.log("Creating chat with:", otherUserId);
    if (otherUserId) {
      createChat({ variables: { participantId: otherUserId as string } });
    }
  };

  return (
    <Tabs defaultValue="messages">
      <TabsList className="grid grid-cols-3 w-full max-w-md">
        <TabsTrigger value="messages" className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          Messages
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Documents
        </TabsTrigger>
        <TabsTrigger value="review" className="flex items-center">
          <Star className="h-4 w-4 mr-2" />
          Review
        </TabsTrigger>
      </TabsList>

      {/* --- Messages Tab --- */}
      <TabsContent value="messages" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Communicate with the other party</CardDescription>
          </CardHeader>
          <div className="p-4">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error.message} />
            ) : existingChat ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-gray-600">
                  Last message:{" "}
                  {existingChat.messages?.[0]?.content || "No messages yet."}
                </p>
                <Button
                  onClick={() =>
                    router.push(`/dashboard/chat/${existingChat.id}`)
                  }
                >
                  Go to Chat
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-gray-600">No chat found with this user.</p>
                <Button onClick={handleCreateChat} disabled={createChatLoading}>
                  {createChatLoading ? "Creating Chat..." : "Start Chatting"}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </TabsContent>

      {/* --- Documents Tab --- */}
      <TabsContent value="documents" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Documents & Evidence</CardTitle>
            <CardDescription>
              Upload and view transaction documents
            </CardDescription>
          </CardHeader>
          <div className="p-4">
            <DocumentsList
              documents={transaction.documents || []}
              transaction={transaction}
              refetch={refetch}
            />
          </div>
        </Card>
      </TabsContent>

      {/* --- Review Tab --- */}
      <TabsContent value="review" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
            <CardDescription>
              Share your experience with the seller.
            </CardDescription>
          </CardHeader>
          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="flex space-x-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "cursor-pointer",
                      rating >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleReviewSubmit} disabled={createReviewLoading}>
              {createReviewLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </Card>
      </TabsContent>
      {canLeaveReview && (
        <TabsContent value="review" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave a Review</CardTitle>
              <CardDescription>
                Share your experience with the seller.
              </CardDescription>
            </CardHeader>
            <div className="p-4 space-y-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "cursor-pointer",
                        rating >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Write your review here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleReviewSubmit}
                disabled={createReviewLoading}
              >
                {createReviewLoading ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default TransactionTabs;
