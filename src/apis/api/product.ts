import api from "@/config/axios";
import {
  GetProductsTopRatingError,
  GetProductsTopRatingResType,
} from "@/types/product";
import { AxiosError } from "axios";

export const getTopRatingProduct = async (): Promise<
  GetProductsTopRatingResType[]
> => {
  try {
    const response = await api.get<GetProductsTopRatingResType[]>(
      "/products/topRating",
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<GetProductsTopRatingError>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};
