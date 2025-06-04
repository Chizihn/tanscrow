"use client";
import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import { GET_AUDIT_LOGS } from "@/graphql/queries/audit-logs";
import { AuditLog } from "@/types/audit-logs";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDate } from "@/utils";

export default function AuditLogs() {
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(
    null
  );

  const { data, loading, error, refetch } = useQuery<{
    getAuditLogs: { items: AuditLog[]; total: number; hasMore: boolean };
  }>(GET_AUDIT_LOGS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  if (loading)
    return (
      <div>
        <LoadingState message="Getting logs..." />
      </div>
    );

  if (error)
    return (
      <div>
        <ErrorState message={error.message} onRetry={refetch} />
      </div>
    );

  const auditLogs = data?.getAuditLogs?.items ?? [];

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "text-green-600 bg-muted/80";
      case "UPDATE":
        return "text-blue-600 bg-muted/80";
      case "DELETE":
        return "text-red-600 bg-muted/80";
      case "LOGIN":
        return "text-purple-600 bg-muted/80";
      case "FAILED_LOGIN":
        return "text-orange-600 bg-muted/80";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="min-h-screen h-full flex">
      {/* Main Content */}
      <div
        className={`flex-1 p-6 ${
          selectedAuditLog ? "lg:mr-96" : ""
        } transition-all duration-300`}
      >
        <div className="mb-6">
          <PageHeader
            title="Audit Logs"
            description="Track all system activities and changes"
          />
        </div>

        <div className="space-y-3">
          {auditLogs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No audit logs found</p>
              </CardContent>
            </Card>
          ) : (
            auditLogs.map((log) => (
              <Card
                key={log.id}
                onClick={() => setSelectedAuditLog(log)}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAuditLog?.id === log.id
                    ? "border-primary bg-muted/80"
                    : "hover:border-border/80"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                      <span className="text-sm font-medium text-card-foreground">
                        {log.category}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{log.entityType}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Sidebar - Desktop */}
      {selectedAuditLog && (
        <aside className="hidden lg:block fixed right-0 top-0 z-50 h-full w-96 border-l bg-foreground dark:bg-background border-gray-200 shadow-lg overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <CardTitle className="text-lg">Audit Log Details</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedAuditLog(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <AuditLogDetail
                  label="ID"
                  value={selectedAuditLog.id}
                  monospace
                />
                <AuditLogDetail
                  label="Action"
                  value={
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                        selectedAuditLog.action
                      )}`}
                    >
                      {selectedAuditLog.action}
                    </span>
                  }
                />
                <AuditLogDetail
                  label="Category"
                  value={selectedAuditLog.category}
                />
                <AuditLogDetail
                  label="Entity Type"
                  value={selectedAuditLog.entityType}
                />
                <AuditLogDetail
                  label="Created At"
                  value={formatDate(selectedAuditLog.createdAt)}
                />
                <AuditLogDetail
                  label="IP Address"
                  value={selectedAuditLog.ipAddress}
                  monospace
                />
                <AuditLogDetail
                  label="User Agent"
                  value={selectedAuditLog.userAgent}
                  breakAll
                />

                {selectedAuditLog.details &&
                  Object.keys(selectedAuditLog.details).length > 0 && (
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Details
                      </Label>
                      <Card className="mt-1">
                        <CardContent className="p-3">
                          <pre className="text-xs text-muted-foreground whitespace-pre-wrap overflow-x-auto">
                            {JSON.stringify(selectedAuditLog.details, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                {selectedAuditLog.references &&
                  selectedAuditLog.references.length > 0 && (
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        References
                      </Label>
                      <div className="mt-1 space-y-1">
                        {selectedAuditLog.references.map((ref, index) => (
                          <Card key={index}>
                            <CardContent className="p-2">
                              <p className="text-sm text-card-foreground font-mono break-all">
                                {ref}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </ScrollArea>
        </aside>
      )}

      {/* Sidebar - Mobile */}
      <Sheet
        open={!!selectedAuditLog && window.innerWidth < 1024}
        onOpenChange={() => setSelectedAuditLog(null)}
      >
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Audit Log Details</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-full py-4">
            <div className="space-y-4">
              <AuditLogDetail
                label="ID"
                value={selectedAuditLog?.id}
                monospace
              />
              {selectedAuditLog && (
                <AuditLogDetail
                  label="Action"
                  value={
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                        selectedAuditLog.action
                      )}`}
                    >
                      {selectedAuditLog.action}
                    </span>
                  }
                />
              )}
              <AuditLogDetail
                label="Category"
                value={selectedAuditLog?.category}
              />
              <AuditLogDetail
                label="Entity Type"
                value={selectedAuditLog?.entityType}
              />
              <AuditLogDetail
                label="Created At"
                value={
                  selectedAuditLog?.createdAt
                    ? formatDate(selectedAuditLog.createdAt)
                    : ""
                }
              />
              <AuditLogDetail
                label="IP Address"
                value={selectedAuditLog?.ipAddress}
                monospace
              />
              <AuditLogDetail
                label="User Agent"
                value={selectedAuditLog?.userAgent}
                breakAll
              />

              {selectedAuditLog?.details &&
                Object.keys(selectedAuditLog.details).length > 0 && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Details
                    </Label>
                    <Card className="mt-1">
                      <CardContent className="p-3">
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(selectedAuditLog.details, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                )}

              {selectedAuditLog?.references &&
                selectedAuditLog.references.length > 0 && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      References
                    </Label>
                    <div className="mt-1 space-y-1">
                      {selectedAuditLog.references.map((ref, index) => (
                        <Card key={index}>
                          <CardContent className="p-2">
                            <p className="text-sm text-card-foreground font-mono break-all">
                              {ref}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface AuditLogDetailProps {
  label: string;
  value: React.ReactNode;
  monospace?: boolean;
  breakAll?: boolean;
}

const AuditLogDetail: React.FC<AuditLogDetailProps> = ({
  label,
  value,
  monospace,
  breakAll,
}) => {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      <p
        className={`mt-1 text-sm text-card-foreground ${
          monospace ? "font-mono" : ""
        } ${breakAll ? "break-all" : ""}`}
      >
        {value}
      </p>
    </div>
  );
};
