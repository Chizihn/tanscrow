import { Dispute } from "@/types/dispute";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

interface DisputeCardProps {
  dispute: Dispute;
  // statusVariant: string;
  // userId: string;
}

const DisputeCard: React.FC<DisputeCardProps> = ({ dispute }) => {
  //   const isInitiator = dispute.initiatorId === userId;

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold">{dispute.transaction.title}</h3>
              <Badge variant="secondary">{dispute.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {dispute.reason}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3 w-3" />
              <span>Opened on {dispute.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-col md:items-end gap-1">
            <p className="font-semibold">
              ₦{dispute.transaction.amount?.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Transaction: {dispute.transaction.transactionCode}
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/disputes/${dispute.id}`}>
                View Details <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisputeCard;
