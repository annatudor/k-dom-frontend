// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from "react";
import { useSignalR } from "@/context/SignalRContext";
import { useAuth } from "@/context/AuthContext";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "@/api/notification";
import type { NotificationReadDto } from "@/types/Notification";

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  const {
    notifications: liveNotifications,
    unreadCount: liveUnreadCount,
    markAsRead: signalRMarkAsRead,
    markAllAsRead: signalRMarkAllAsRead,
  } = useSignalR();
  const [notifications, setNotifications] = useState<NotificationReadDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load initial notifications
  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);

      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load notifications on mount and auth change
  useEffect(() => {
    loadNotifications();
  }, [isAuthenticated, loadNotifications]);

  // Merge live notifications with existing ones
  useEffect(() => {
    if (liveNotifications.length > 0) {
      setNotifications((prev) => {
        const merged = [...liveNotifications];

        // Add existing notifications that aren't already in live notifications
        prev.forEach((existing) => {
          if (!liveNotifications.some((live) => live.id === existing.id)) {
            merged.push(existing);
          }
        });

        // Sort by creation date
        return merged.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setUnreadCount(liveUnreadCount);
    }
  }, [liveNotifications, liveUnreadCount]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );

      // Update SignalR context
      signalRMarkAsRead(notificationId);

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      // Update SignalR context
      signalRMarkAllAsRead();

      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);

      // Remove from local state
      setNotifications((prev) => {
        const notification = prev.find((n) => n.id === notificationId);
        const filtered = prev.filter((n) => n.id !== notificationId);

        // If the deleted notification was unread, decrease count
        if (notification && !notification.isRead) {
          setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
        }

        return filtered;
      });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getFilteredNotifications = (type: "user" | "system") => {
    const systemTypes = [
      "SystemMessage",
      "BulkModerationCompleted",
      "ModerationReminder",
    ];

    if (type === "system") {
      return notifications.filter((n) => systemTypes.includes(n.type));
    } else {
      return notifications.filter((n) => !systemTypes.includes(n.type));
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    getFilteredNotifications,
  };
};
