import React from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Notification, NotificationType } from "@/types/notification";

interface NotificationDetailProps {
  notification: Notification;
  onBack: () => void;
  markAsReadLoading: boolean;
}

export function NotificationDetail({
  notification,
  onBack,
}: NotificationDetailProps) {
  const getNotificationTypeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TRANSACTION:
        return "bg-blue-100 text-blue-800";
      case NotificationType.DISPUTE:
        return "bg-red-100 text-red-800";
      case NotificationType.VERIFICATION:
        return "bg-green-100 text-green-800";
      case NotificationType.PAYMENT:
        return "bg-purple-100 text-purple-800";
      case NotificationType.SYSTEM:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
    <div className="space-y-6 px-2 lg:px-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        {/* <h2 className="text-lg font-semibold">Notification Details</h2> */}
      </div>

      <div className="space-y-2 ">
        <div className="flex items-center space-x-2">
          <Badge className={getNotificationTypeColor(notification.type)}>
            {notification.type}
          </Badge>
          {!notification.isRead && (
            <Badge variant="secondary" className="text-xs">
              New
            </Badge>
          )}
        </div>
        <h3 className="text-lg font-semibold">{notification.title}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          {formatRelativeTime(new Date(notification.createdAt))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Message</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
}
