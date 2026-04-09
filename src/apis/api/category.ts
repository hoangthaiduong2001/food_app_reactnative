import api from "@/config/axios";
import {
  GetAllCategoryErrorType,
  GetAllCategoryType,
  GetCategoryById,
  GetCategoryByIdErrorType,
} from "@/types/category";
import { AxiosError } from "axios";

export const getAllCategory = async (): Promise<GetAllCategoryType[]> => {
  try {
    const response = await api.get<{ data: GetAllCategoryType[] }>(
      "/categories",
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<GetAllCategoryErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const getCategoryById = async (id: string): Promise<GetCategoryById> => {
  try {
    const response = await api.get<{ data: GetCategoryById }>(
      `/categories/${id}`,
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<GetCategoryByIdErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};
