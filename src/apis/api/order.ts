import api from "@/config/axios";
import {
  CreateOrderBodyType,
  CreateOrderErrorType,
  CreateOrderResType,
  GetOrderByUserIdErrorType,
  GetOrderByUserIdResType,
  GetOrderDetailErrorType,
  GetOrderDetailResType,
  UpdateStatusOrderBodyType,
  UpdateStatusOrderErrorType,
  UpdateStatusOrderResType,
} from "@/types/order";
import { AxiosError } from "axios";

export const getOrderByUserId = async (
  id: string,
  status: string,
): Promise<GetOrderByUserIdResType> => {
  try {
    const response = await api.get<GetOrderByUserIdResType>(
      `/orders/user/${id}`,
      {
        params: {
          status,
        },
      },
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<GetOrderByUserIdErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const getOrderDetail = async (
  id: string,
): Promise<GetOrderDetailResType> => {
  try {
    const response = await api.get<GetOrderDetailResType>(`/orders/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<GetOrderDetailErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const addOrderApi = async (
  body: CreateOrderBodyType,
): Promise<CreateOrderResType> => {
  try {
    const response = await api.post<CreateOrderResType>("/orders", body);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<CreateOrderErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const updateStatusOrderApi = async (
  id: string,
  body: UpdateStatusOrderBodyType,
): Promise<UpdateStatusOrderResType> => {
  try {
    const response = await api.put<UpdateStatusOrderResType>(
      `/orders/status/${id}`,
      body,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<UpdateStatusOrderErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};
