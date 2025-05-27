import React from "react";
import { Clock } from "lucide-react";
import { Notification } from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div
      className={`relative p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
        !notification.isRead
          ? "border-l-4 border-l-blue-500 bg-card "
          : "bg-background"
      }`}
      onClick={() => onClick(notification)}
    >
      <div className="flex items-start justify-between space-x-2">
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium line-clamp-1">
              {notification.title}
            </h4>
            {!notification.isRead && (
              <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-blue-500" />
            )}
          </div>
          {/* <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p> */}
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formatRelativeTime(new Date(notification.createdAt))}
          </div>
        </div>
      </div>
    </div>
  );
}
