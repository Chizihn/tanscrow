import React from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import { Notification, Notifications } from "@/types/notification";

interface NotificationsListProps {
  notifications: Notifications;
  loading: boolean;
  unreadCount: number;
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
  markAllAsReadLoading: boolean;
}

export function NotificationsList({
  notifications,
  loading,
  unreadCount,
  onNotificationClick,
  onMarkAllAsRead,
  markAllAsReadLoading,
}: NotificationsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center">
        <Bell className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllAsRead}
            disabled={markAllAsReadLoading}
          >
            {markAllAsReadLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            Mark all read
          </Button>
        </div>
      )}

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={onNotificationClick}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
