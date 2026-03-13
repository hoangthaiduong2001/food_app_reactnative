import api from "@/config/axios";
import {
  ForgotPasswordBodyType,
  ForgotPasswordErrorType,
  ForgotPasswordResType,
  LoginBodyType,
  LoginErrorType,
  LoginGoogleBodyType,
  LoginGoogleErrorType,
  LoginGoogleResType,
  LoginResType,
  LogoutBodyType,
  LogoutErrorType,
  LogoutResType,
  ResetPasswordBodyType,
  ResetPasswordErrorType,
  ResetPasswordResType,
} from "@/types/auth";
import { AxiosError } from "axios";

export const loginApi = async (body: LoginBodyType): Promise<LoginResType> => {
  try {
    const response = await api.post<LoginResType>("/auth/login", body);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<LoginErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const logoutApi = async (
  body: LogoutBodyType,
): Promise<LogoutResType> => {
  try {
    const response = await api.post<LogoutResType>("/auth/logout", body);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<LogoutErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const forgotPasswordApi = async (
  body: ForgotPasswordBodyType,
): Promise<ForgotPasswordResType> => {
  try {
    const response = await api.post<ForgotPasswordResType>(
      "/auth/forgotPassword",
      body,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ForgotPasswordErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const verifyOtpApi = async (
  body: ForgotPasswordBodyType,
): Promise<ForgotPasswordResType> => {
  try {
    const response = await api.post<ForgotPasswordResType>(
      "/auth/verifyOtp",
      body,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ForgotPasswordErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const resetPasswordApi = async (
  body: ResetPasswordBodyType,
): Promise<ResetPasswordResType> => {
  try {
    const response = await api.post<ResetPasswordResType>(
      "/auth/resetPassword",
      body,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ResetPasswordErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const loginGoogleApi = async (
  body: LoginGoogleBodyType,
): Promise<LoginGoogleResType> => {
  try {
    const response = await api.post<LoginGoogleResType>("/auth/google", body);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<LoginGoogleErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};
