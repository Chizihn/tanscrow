"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Download, FileText, Upload } from "lucide-react";
import Link from "next/link";
import { getStatusBadgeVariant } from "@/utils/transaction";
import { Dispute, DisputeStatus } from "@/types/dispute";
import { GET_DISPUTE } from "@/graphql/queries/dispute";
import { useQuery } from "@apollo/client";
import PageRouter from "../PageRouter";
import ErrorState from "../ErrorState";
import LoadingState from "../LoadingState";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/user";
import { formatDate } from "@/utils";

interface Props {
  id: string;
}
const DisputeDetail: React.FC<Props> = ({ id }) => {
  const user = (useAuthStore((state) => state.user) as User) || {};
  const { data, loading, error } = useQuery<{ dispute: Dispute }>(GET_DISPUTE, {
    variables: { disputeId: id },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    skip: !id,
    onCompleted: (data) => {
      if (data.dispute) {
        console.log("dispute", data.dispute);
      }
    },
  });

  const dispute = data?.dispute ?? null;

  if (loading)
    return (
      <>
        <PageRouter
          parentPath="/dashboard/disputes"
          parentLabel="Back to Disputes"
        />
        <LoadingState message="Loading dispute details..." />
      </>
    );
  if (error)
    return (
      <>
        <PageRouter
          parentPath="/dashboard/disputes"
          parentLabel="Back to Disputes"
        />
        <ErrorState message={error.message} />
      </>
    );
  if (!dispute)
    return (
      <>
        <PageRouter
          parentPath="/dashboard/disputes"
          parentLabel="Back to Disputes"
        />
        <ErrorState message="Dispute not found" />
      </>
    );

  //   const isInitiator = dispute.initiatorId === user.id;
  const isBuyer = dispute.transaction?.buyer?.id === user.id;
  //   const isSeller = dispute.transaction.seller.id === user.id;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <PageRouter
          parentPath="/dashboard/disputes"
          parentLabel="Back to Disputes"
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Dispute Details
              </h2>
              <Badge variant={getStatusBadgeVariant(dispute.status)}>
                {dispute.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Transaction: {dispute.transaction.transactionCode}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/transactions/${dispute.transaction?.id}`}>
                View Transaction
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dispute Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Dispute Information</CardTitle>
            <CardDescription>Details about the dispute</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Transaction Title
              </h4>
              <p className="font-medium">{dispute.transaction.title}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Reason for Dispute
              </h4>
              <p>{dispute.reason}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Description
              </h4>
              <p>{dispute.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Initiated By
                </h4>
                <p>
                  {dispute.initiator.firstName} {dispute.initiator.lastName} (
                  {isBuyer ? "Buyer" : "Seller"})
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Date Opened
                </h4>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(dispute.createdAt)}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Transaction Amount
                </h4>
                <p className="font-semibold">₦{dispute.transaction?.amount}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Status
                </h4>
                <Badge variant={getStatusBadgeVariant(dispute.status)}>
                  {dispute.status}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Parties Involved</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <h5 className="text-sm font-medium text-muted-foreground">
                    Buyer
                  </h5>
                  <p className="font-medium">
                    {dispute.transaction.buyer?.firstName}{" "}
                    {dispute.transaction.buyer?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dispute.transaction.buyer?.email}
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="text-sm font-medium text-muted-foreground">
                    Seller
                  </h5>
                  <p className="font-medium">
                    {dispute.transaction.seller?.firstName}{" "}
                    {dispute.transaction.seller?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dispute.transaction.seller?.email}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dispute Status */}
        <Card>
          <CardHeader>
            <CardTitle>Dispute Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="relative pl-6 pb-4">
                <div className="absolute top-2 left-0 w-4 h-4 rounded-full bg-primary"></div>
                <div className="absolute top-2 left-2 bottom-0 w-0.5 bg-muted-foreground/20"></div>
                <div className="space-y-1">
                  <p className="font-medium">Dispute Opened</p>
                  <p className="text-sm text-muted-foreground">
                    Dispute has been initiated
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(dispute.createdAt)}
                  </p>
                </div>
              </div>
              {dispute.status === DisputeStatus.IN_REVIEW && (
                <div className="relative pl-6 pb-4">
                  <div className="absolute top-2 left-0 w-4 h-4 rounded-full bg-primary"></div>
                  <div className="space-y-1">
                    <p className="font-medium">Under Review</p>
                    <p className="text-sm text-muted-foreground">
                      A moderator is reviewing the dispute
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(dispute.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {dispute.status === DisputeStatus.OPENED && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Your dispute is being processed. A moderator will review the
                  case shortly.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Evidence Section */}
      <Card>
        <CardHeader>
          <CardTitle>Evidence</CardTitle>
          <CardDescription>
            Documents and evidence submitted for this dispute
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dispute.evidence && dispute.evidence.length > 0 ? (
            <div className="space-y-4">
              {dispute.evidence?.map((evidence) => (
                <div
                  key={evidence.id}
                  className="flex items-start gap-4 p-3 border rounded-lg"
                >
                  <div className="p-2 rounded-full bg-muted">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{evidence.evidenceType}</p>
                    <p className="text-sm text-muted-foreground">
                      {evidence.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted by{" "}
                      {evidence.submittedBy === user.id
                        ? "you"
                        : evidence.submittedBy === dispute.transaction.buyer?.id
                        ? "buyer"
                        : "seller"}{" "}
                      on {formatDate(evidence?.createdAt as Date)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-3 w-3" /> View
                  </Button>
                </div>
              ))}

              <div className="mt-4">
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Submit New Evidence
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No evidence has been submitted yet
              </p>
              <Button className="mt-4">
                <Upload className="mr-2 h-4 w-4" /> Submit Evidence
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Communication Section */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Communication</CardTitle>
          <CardDescription>
            Messages between parties and moderator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dispute.messages?.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender.id === user.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender.id === user.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{message.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs opacity-70">
                      {message.sender.firstName} {message.sender.lastName}
                    </p>
                    <p className="text-xs opacity-70">
                      {message.createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <Textarea placeholder="Type your message here..." rows={3} />
            <div className="flex justify-end">
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card> */}
    </div>
  );
};

export default DisputeDetail;
