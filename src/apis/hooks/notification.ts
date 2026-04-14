import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationsApi,
  getUnreadCountApi,
  markAllAsReadApi,
  markAsReadApi,
} from "../api/notification";

export const useGetNotifications = (params: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotificationsApi(params),
  });
};

export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: ["notification-unread"],
    queryFn: getUnreadCountApi,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-unread"] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-unread"] });
    },
  });
};
