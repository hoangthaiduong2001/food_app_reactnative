import api from "@/config/axios";
import {
  GetAllProductsErrorType,
  GetAllProductsResType,
  GetProductByIdErrorType,
  GetProductByIdType,
  GetProductsTopRatingError,
  GetProductsTopRatingResType,
  SearchProductItemType,
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

export const getAllProduct = async ({
  pageParam = 0,
}: {
  pageParam?: number;
}): Promise<{
  data: GetAllProductsResType[];
  hasMore: boolean;
}> => {
  try {
    const response = await api.get<{
      data: GetAllProductsResType[];
      total: number;
      hasMore: boolean;
    }>("/products", {
      params: {
        limit: 4,
        offset: pageParam,
      },
    });

    return {
      data: response.data.data,
      hasMore: response.data.hasMore,
    };
  } catch (error) {
    const axiosError = error as AxiosError<GetAllProductsErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const getProductById = async (
  id: string,
): Promise<GetProductByIdType> => {
  try {
    const response = await api.get<{ data: GetProductByIdType }>(
      `/products/${id}`,
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<GetProductByIdErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const searchProduct = async (
  query: string,
): Promise<SearchProductItemType[]> => {
  try {
    const response = await api.get<{ data: SearchProductItemType[] }>(
      `/products/search`,
      {
        params: { q: query },
      },
    );

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};
