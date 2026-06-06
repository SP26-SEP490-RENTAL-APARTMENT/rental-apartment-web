export interface Notification {
  notificationId: string;
  type: string
  title: string;
  titleVi: string;
  message: string;
  messageVi: string;
  referenceId: string;
  referenceType: string;
  isRead: boolean;
  readAt: string
  createdAt: string;
}