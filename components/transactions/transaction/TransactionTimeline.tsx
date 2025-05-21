"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionLog } from "@/types/transaction";
import { formatDate } from "@/utils";

interface TransactionTimelineProps {
  logs: TransactionLog[];
}

const TransactionTimeline: React.FC<TransactionTimelineProps> = ({ logs }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div key={log.id} className="relative pl-6 pb-4">
              {index < logs.length - 1 && (
                <div className="absolute top-2 left-2 bottom-0 w-0.5 bg-muted-foreground/20"></div>
              )}
              <div className="absolute top-2 left-0 w-4 h-4 rounded-full bg-primary"></div>
              <div className="space-y-1">
                <p className="font-medium">{log.action.replace(/_/g, " ")}</p>
                <p className="text-sm text-muted-foreground">
                  {log.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(log.createdAt) || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTimeline;
