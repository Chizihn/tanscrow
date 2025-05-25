import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { NotificationBadge } from "./NotificationBadge";
import { NotificationDetail } from "./NotificationDetail";
import { Notification, Notifications } from "@/types/notification";
import { NotificationsList } from "./NotificationsList";

interface NotificationSheetProps {
  notifications: Notifications;
  unreadCount: number;
  loading: boolean;
  selectedNotification: Notification | null;
  markAsReadLoading: boolean;
  markAllAsReadLoading: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNotificationClick: (notification: Notification) => void;
  onBackToNotifications: () => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationSheet({
  notifications,
  unreadCount,
  loading,
  selectedNotification,
  markAsReadLoading,
  markAllAsReadLoading,
  isOpen,
  onOpenChange,
  onNotificationClick,
  onBackToNotifications,
  onMarkAllAsRead,
}: NotificationSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <NotificationBadge
          unreadCount={unreadCount}
          onClick={() => onOpenChange(true)}
        />
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-4">
          {!selectedNotification && <SheetTitle>Notifications</SheetTitle>}
        </SheetHeader>

        <div className="mt-6">
          {selectedNotification ? (
            <NotificationDetail
              notification={selectedNotification}
              onBack={onBackToNotifications}
              markAsReadLoading={markAsReadLoading}
            />
          ) : (
            <NotificationsList
              notifications={notifications}
              loading={loading}
              unreadCount={unreadCount}
              onNotificationClick={onNotificationClick}
              onMarkAllAsRead={onMarkAllAsRead}
              markAllAsReadLoading={markAllAsReadLoading}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
