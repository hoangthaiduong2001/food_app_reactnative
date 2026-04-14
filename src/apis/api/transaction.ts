import api from "@/config/axios";
import {
  GetTransactionHistoryErrorType,
  GetTransactionHistoryResType,
  GetTransactionRecentErrorType,
  GetTransactionRecentResType,
} from "@/types/transaction";
import { AxiosError } from "axios";

export const getTransactionRecent = async (
  id: string,
): Promise<GetTransactionRecentResType> => {
  try {
    const response = await api.get<GetTransactionRecentResType>(
      `/transaction/recent/${id}`,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<GetTransactionRecentErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const getTransactionHistory = async (
  id: string,
  cursor?: string,
): Promise<GetTransactionHistoryResType> => {
  try {
    const response = await api.get<GetTransactionHistoryResType>(
      `/transaction/history/${id}`,
      {
        params: {
          cursor,
          limit: 5,
        },
      },
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<GetTransactionHistoryErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};
