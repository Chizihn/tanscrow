import React from "react";
import { Card, CardContent } from "../ui/card";
import { FileText } from "lucide-react";

const NoDisputes = () => {
  return (
    <Card>
      <CardContent className="p-8 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No disputes found</h3>
        <p className="text-muted-foreground mb-4">
          You don&apos;t have any disputes at the moment.
        </p>
      </CardContent>
    </Card>
  );
};

export default NoDisputes;
