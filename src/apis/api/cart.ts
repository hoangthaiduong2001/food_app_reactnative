import api from "@/config/axios";
import {
  AddCartBodyType,
  AddCartErrorType,
  AddCartResType,
  GetCartById,
  GetCartByIdErrorType,
  UpdateCartBodyType,
  UpdateCartResType,
} from "@/types/cart";
import { AxiosError } from "axios";

export const getCartById = async (id: string): Promise<GetCartById> => {
  try {
    const response = await api.get<GetCartById>(`/carts/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<GetCartByIdErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const addCartApi = async (
  body: AddCartBodyType,
): Promise<AddCartResType> => {
  try {
    const response = await api.post<AddCartResType>("/carts", body);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AddCartErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const updateCartApi = async (
  body: UpdateCartBodyType,
): Promise<UpdateCartResType> => {
  try {
    const response = await api.put<UpdateCartResType>("/carts", body);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<UpdateCartResType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};
