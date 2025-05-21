"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dispute, DisputeStatus } from "@/types/dispute";
import NoDisputes from "@/components/disputes/NoDisputes";
import DisputeCard from "@/components/disputes/DisputeCard";
import { GET_DISPUTES } from "@/graphql/queries/dispute";
import { useQuery } from "@apollo/client";

export default function DisputesPage() {
  const { data, loading, error } = useQuery<{ disputes: Dispute[] }>(
    GET_DISPUTES,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    }
  );

  const disputes: Dispute[] = data?.disputes ?? [];

  if (loading)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div>
        <p>Error:{error.message}</p>
      </div>
    );

  if (!loading && disputes?.length === 0)
    return (
      <div>
        <p>No disputes availabe</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Disputes</h2>
          <p className="text-muted-foreground">Manage transaction disputes</p>
        </div>
      </div>

      {/* Tabs for filtering disputes */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Disputes</TabsTrigger>
          <TabsTrigger value="opened">Opened</TabsTrigger>
          <TabsTrigger value="in-review">In Review</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-4">
          {disputes.length > 0 ? (
            disputes.map((dispute) => (
              <DisputeCard
                key={dispute.id}
                dispute={dispute}
                // statusVariant={getStatusBadgeVariant(dispute.status)}
                // userId={user.id}
              />
            ))
          ) : (
            <NoDisputes />
          )}
        </TabsContent>
        <TabsContent value="opened" className="space-y-4 mt-4">
          {disputes.filter((d) => d.status === DisputeStatus.OPENED).length >
          0 ? (
            disputes
              .filter((d) => d.status === DisputeStatus.OPENED)
              .map((dispute) => (
                <DisputeCard
                  key={dispute.id}
                  dispute={dispute}
                  // statusVariant={getStatusBadgeVariant(dispute.status)}
                  // userId={user.id}
                />
              ))
          ) : (
            <NoDisputes />
          )}
        </TabsContent>
        <TabsContent value="in-review" className="space-y-4 mt-4">
          {disputes.filter((d) => d.status === DisputeStatus.IN_REVIEW).length >
          0 ? (
            disputes
              .filter((d) => d.status === DisputeStatus.IN_REVIEW)
              .map((dispute) => (
                <DisputeCard
                  key={dispute.id}
                  dispute={dispute}
                  // statusVariant={getStatusBadgeVariant(dispute.status)}
                  // userId={user.id}
                />
              ))
          ) : (
            <NoDisputes />
          )}
        </TabsContent>
        <TabsContent value="resolved" className="space-y-4 mt-4">
          {disputes.filter(
            (d) =>
              d.status === DisputeStatus.RESOLVED_FOR_BUYER ||
              d.status === DisputeStatus.RESOLVED_FOR_SELLER ||
              d.status === DisputeStatus.RESOLVED_COMPROMISE ||
              d.status === DisputeStatus.CLOSED
          ).length > 0 ? (
            disputes
              .filter(
                (d) =>
                  d.status === DisputeStatus.RESOLVED_FOR_BUYER ||
                  d.status === DisputeStatus.RESOLVED_FOR_SELLER ||
                  d.status === DisputeStatus.RESOLVED_COMPROMISE ||
                  d.status === DisputeStatus.CLOSED
              )
              .map((dispute) => (
                <DisputeCard
                  key={dispute.id}
                  dispute={dispute}
                  // statusVariant={getStatusBadgeVariant(dispute.status)}
                  // userId={user.id}
                />
              ))
          ) : (
            <NoDisputes />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
