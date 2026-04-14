import api from "@/config/axios";
import {
  CreateWalletBodyType,
  CreateWalletErrorType,
  CreateWalletResType,
  GetBalanceWalletErrorType,
  GetBalanceWalletResType,
  PaymentWalletBodyType,
  PaymentWalletErrorType,
  PaymentWalletResType,
  TopupWalletBodyType,
  TopupWalletErrorType,
  TopupWalletResType,
} from "@/types/wallet";
import { AxiosError } from "axios";

export const getBalance = async (
  id: string,
): Promise<GetBalanceWalletResType> => {
  try {
    const response = await api.get<GetBalanceWalletResType>(
      `/wallet/balance/${id}`,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<GetBalanceWalletErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const createWalletApi = async (
  body: CreateWalletBodyType,
): Promise<CreateWalletResType> => {
  try {
    const response = await api.post<CreateWalletResType>("/wallet", body);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<CreateWalletErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const topupWalletApi = async (
  body: TopupWalletBodyType,
): Promise<TopupWalletResType> => {
  try {
    const response = await api.post<TopupWalletResType>("/wallet/topup", body);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<TopupWalletErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const paymentWithWalletApi = async (
  body: PaymentWalletBodyType,
): Promise<PaymentWalletResType> => {
  try {
    const response = await api.post<PaymentWalletResType>(
      "/wallet/payment",
      body,
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<PaymentWalletErrorType>;

    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};
