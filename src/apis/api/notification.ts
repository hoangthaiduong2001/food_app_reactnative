import api from "@/config/axios";
import {
  BasicResType,
  ErrorType,
  GetNotificationsResType,
  GetUnreadCountResType,
  MarkAsReadResType,
} from "@/types/notification";
import { AxiosError } from "axios";

export const getNotificationsApi = async (params: {
  page?: number;
  limit?: number;
}): Promise<GetNotificationsResType> => {
  try {
    const res = await api.get("/notification", { params });
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const getUnreadCountApi = async (): Promise<GetUnreadCountResType> => {
  try {
    const res = await api.get("/notification/unread-count");
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const markAsReadApi = async (id: string): Promise<MarkAsReadResType> => {
  try {
    const res = await api.patch(`/notification/${id}/read`);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const markAllAsReadApi = async (): Promise<BasicResType> => {
  try {
    const res = await api.patch("/notification/read-all");
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};
