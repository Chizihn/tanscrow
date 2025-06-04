import React from "react";
import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, X, Loader2 } from "lucide-react";

interface UserSearchResultProps {
  user: Partial<User> | null;
  error?: string | null;
  loading?: boolean;
  onClearUser?: () => void;
}

export default function UserSearchResult({
  user,
  error,
  loading = false,
  onClearUser,
}: UserSearchResultProps) {
  // Show loading state
  if (loading) {
    return (
      <div className="mt-2 flex items-center gap-2 text-muted-foreground bg-muted/30 p-3 rounded border">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Searching for user...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="mt-2 flex items-center justify-between gap-2 text-destructive bg-destructive/10 p-3 rounded border border-destructive/20">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">
            User not found. Please check the email/phone.
          </span>
        </div>
        {onClearUser && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearUser}
            className="h-6 w-6 p-0 hover:bg-destructive/20"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  // Show no user found state (only when not loading and no error)
  if (!user) {
    return (
      <div className="mt-2 flex items-center justify-between gap-2 text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">No user found with this identifier.</span>
        </div>
        {onClearUser && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearUser}
            className="h-6 w-6 p-0 hover:bg-amber-100"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  // Show successful user found state
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
        <div className="font-medium ">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-sm text-muted-foreground">
          {user.email || user.phoneNumber}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-600" />
        {onClearUser && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearUser}
            className="h-6 w-6 p-0 "
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
