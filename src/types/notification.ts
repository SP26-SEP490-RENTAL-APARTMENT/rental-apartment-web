export interface Notification {
  notificationId: string;
  type: string
  title: string;
  message: string;
  referenceId: string;
  referenceType: string;
  isRead: boolean;
  readAt: string
  createdAt: string;
}