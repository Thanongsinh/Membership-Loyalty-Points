import api from "@/lib/api";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data: any;
  createdAt: string;
}

export async function getNotifications(unreadOnly = false): Promise<Notification[]> {
  const { data } = await api.get<Notification[]>(`/notifications${unreadOnly ? "?unread=true" : ""}`);
  return data;
}

export async function getUnreadCount(): Promise<number> {
  const { data } = await api.get<{ count: number }>("/notifications/unread-count");
  return data.count;
}

export async function markAsRead(id: string) {
  const { data } = await api.patch<Notification>(`/notifications/${id}/read`);
  return data;
}

export async function markAllAsRead() {
  await api.patch("/notifications/read-all");
}

export async function deleteNotification(id: string) {
  await api.delete(`/notifications/${id}`);
}
