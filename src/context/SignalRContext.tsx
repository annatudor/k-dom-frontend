// src/context/SignalRContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./AuthContext";
import type { NotificationReadDto } from "@/types/Notification";

interface SignalRContextType {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  notifications: NotificationReadDto[];
  unreadCount: number;
  addNotification: (notification: NotificationReadDto) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}

const SignalRContext = createContext<SignalRContextType | null>(null);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, isAuthenticated } = useAuth();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationReadDto[]>([]);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (connectionRef.current) {
        connectionRef.current.stop();
        setConnection(null);
        setIsConnected(false);
      }
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `${import.meta.env.VITE_API_URL?.replace(
          "/api",
          ""
        )}/hub/notifications`,
        {
          accessTokenFactory: () => token,
        }
      )
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("SignalR Connected");
        setIsConnected(true);
      })
      .catch((err) => {
        console.error("SignalR Connection Error: ", err);
        setIsConnected(false);
      });

    newConnection.on(
      "ReceiveNotification",
      (data: Partial<NotificationReadDto>) => {
        console.log("Received notification:", data);

        const notification: NotificationReadDto = {
          id: Date.now().toString(), // Temporary ID until we get the real one
          type: data.type!,
          message: data.message!,
          isRead: false,
          createdAt: data.createdAt || new Date().toISOString(),
          triggeredByUsername: data.triggeredByUsername,
          targetType: data.targetType,
          targetId: data.targetId,
        };

        setNotifications((prev) => [notification, ...prev]);
      }
    );

    newConnection.onclose(() => {
      console.log("SignalR Disconnected");
      setIsConnected(false);
    });

    newConnection.onreconnected(() => {
      console.log("SignalR Reconnected");
      setIsConnected(true);
    });

    setConnection(newConnection);
    connectionRef.current = newConnection;

    return () => {
      newConnection.stop();
    };
  }, [isAuthenticated, token]);

  const addNotification = (notification: NotificationReadDto) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const value = {
    connection,
    isConnected,
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
  };

  return (
    <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalR must be used within a SignalRProvider");
  }
  return context;
};
