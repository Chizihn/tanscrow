// src/components/transactions/create/UserSearchResult.tsx
import React from "react";
import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, CheckCircle } from "lucide-react";

interface UserSearchResultProps {
  user: Partial<User> | null;
  error?: string | null;
}

export default function UserSearchResult({
  user,
  error,
}: UserSearchResultProps) {
  if (error) {
    return (
      <div className="mt-2 flex items-center gap-2 text-destructive bg-destructive/10 p-2 rounded">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">
          User not found. Please check the email/phone.
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-2 flex items-center gap-2 text-amber-500 bg-card-50 p-2 rounded">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">No user found with this identifier.</span>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-3 p-3 rounded border">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={user.profileImageUrl || ""}
          alt={user.firstName || "User"}
        />
        <AvatarFallback>
          {(user.firstName?.[0] || "") + (user.lastName?.[0] || "")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="font-medium">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-sm text-muted-foreground">
          {user.email || user.phoneNumber}
        </div>
      </div>
      <CheckCircle className="h-5 w-5 text-green-600" />
    </div>
  );
}
