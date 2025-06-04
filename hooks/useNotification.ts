import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Notification, Notifications } from "@/types/notification";
import { GET_NOTIFICATIONS } from "@/graphql/queries/notification";
import { useNotificationStore } from "@/store/notification-store";
import {
  MARK_ALL_NOTIFICATIONS_AS_READ,
  MARK_NOTIFICATION_AS_READ,
} from "@/graphql/mutations/notification";
import { showErrorToast, showSuccessToast } from "../components/Toast";

export function useNotifications() {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const { notifications, setNotifications, markNotificationAsRead } =
    useNotificationStore();

  const { loading: notificationsLoading, error: notificationsError } =
    useQuery<{ notifications: Notifications }>(GET_NOTIFICATIONS, {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        if (data?.notifications) {
          setNotifications(data.notifications);
        }
      },
    });

  const [markAsRead, { loading: markAsReadLoading }] = useMutation(
    MARK_NOTIFICATION_AS_READ,
    {
      onCompleted: (data) => {
        if (data?.markNotificationRead) {
          markNotificationAsRead(data.markNotificationRead.id, true);
          // showSuccessToast("Notification marked as read");
        }
      },
      onError: (error) => {
        showErrorToast(error.message);
      },
    }
  );

  const [markAllAsRead, { loading: markAllAsReadLoading }] = useMutation(
    MARK_ALL_NOTIFICATIONS_AS_READ,
    {
      refetchQueries: [{ query: GET_NOTIFICATIONS }],
      onCompleted: () => {
        showSuccessToast("All notifications marked as read!");
      },
      onError: (error) => {
        showErrorToast(error.message);
      },
    }
  );

  const handleMarkNotificationAsRead = (notificationId: string) => {
    markAsRead({
      variables: { notificationId },
    });
  };

  const handleMarkAllNotificationsAsRead = () => {
    markAllAsRead();
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      handleMarkNotificationAsRead(notification?.id as string);
    }
  };

  const handleBackToNotifications = () => {
    setSelectedNotification(null);
  };

  const unreadCount = notifications?.filter((n) => !n?.isRead).length || 0;

  return {
    notifications,
    selectedNotification,
    unreadCount,
    notificationsLoading,
    notificationsError,
    markAsReadLoading,
    markAllAsReadLoading,
    handleNotificationClick,
    handleBackToNotifications,
    handleMarkNotificationAsRead,
    handleMarkAllNotificationsAsRead,
  };
}
