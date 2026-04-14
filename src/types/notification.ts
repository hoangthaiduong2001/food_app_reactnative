export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface GetNotificationsResType {
  message: string;
  data: NotificationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface GetUnreadCountResType {
  message: string;
  data: number;
}

export interface MarkAsReadResType {
  message: string;
  data: NotificationItem;
}

export interface BasicResType {
  message: string;
}

export interface ErrorType {
  message: string;
}
