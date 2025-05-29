import API from "./axios";
import type {
  NotificationCreateDto,
  NotificationReadDto,
} from "../types/Notification";

//  Creează notificare
export const createNotification = async (
  data: NotificationCreateDto
): Promise<void> => {
  await API.post("/notifications", data);
};

//  Obține toate notificările userului
export const getNotifications = async (): Promise<NotificationReadDto[]> => {
  const res = await API.get("/notifications");
  return res.data;
};

//  Obține notificări necitite
export const getUnreadNotifications = async (): Promise<
  NotificationReadDto[]
> => {
  const res = await API.get("/notifications/unread");
  return res.data;
};

// Număr notificări necitite
export const getUnreadCount = async (): Promise<number> => {
  const res = await API.get("/notifications/unread-count");
  return res.data.unreadCount;
};

//  Marchează o notificare ca citită
export const markAsRead = async (id: string): Promise<void> => {
  await API.patch(`/notifications/${id}/mark-as-read`);
};

//  Marchează toate ca citite
export const markAllAsRead = async (): Promise<void> => {
  await API.patch("/notifications/mark-all-as-read");
};

//  Șterge notificare
export const deleteNotification = async (id: string): Promise<void> => {
  await API.delete(`/notifications/${id}`);
};
