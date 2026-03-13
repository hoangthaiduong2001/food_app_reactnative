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
  VerifyOtpBodyType,
  VerifyOtpErrorType,
  VerifyOtpResType,
} from "@/types/auth";

import { useMutation } from "@tanstack/react-query";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import {
  forgotPasswordApi,
  loginApi,
  loginGoogleApi,
  logoutApi,
  resetPasswordApi,
  verifyOtpApi,
} from "../api/auth";

export const useLoginMutation = () => {
  return useMutation<LoginResType, LoginErrorType, LoginBodyType>({
    mutationFn: loginApi,
  });
};

export const useLogoutMutation = () => {
  return useMutation<LogoutResType, LogoutErrorType, LogoutBodyType>({
    mutationFn: logoutApi,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation<
    ForgotPasswordResType,
    ForgotPasswordErrorType,
    ForgotPasswordBodyType
  >({
    mutationFn: forgotPasswordApi,
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation<VerifyOtpResType, VerifyOtpErrorType, VerifyOtpBodyType>({
    mutationFn: verifyOtpApi,
  });
};

export const useGoogleLoginMutation = () => {
  return useMutation<
    LoginGoogleResType,
    LoginGoogleErrorType,
    LoginGoogleBodyType
  >({
    mutationFn: loginGoogleApi,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation<
    ResetPasswordResType,
    ResetPasswordErrorType,
    ResetPasswordBodyType
  >({
    mutationFn: resetPasswordApi,
  });
};

export const useGoogleLogin = (onSuccess: (idToken: string) => void) => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS!,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB!,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID!,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      if (id_token) {
        onSuccess(id_token);
      }
    }
  }, [response]);

  return {
    request,
    promptAsync,
  };
};
