import { IUser } from "./user";

export interface LoginBodyType {
  username: string;
  password: string;
}

export interface LogoutBodyType {
  refreshToken: string;
}

export interface ForgotPasswordBodyType {
  email: string;
}

export interface VerifyOtpBodyType extends ForgotPasswordBodyType {
  otp: string;
}

export interface ResetPasswordBodyType extends VerifyOtpBodyType {
  newPassword: string;
}

export interface LoginGoogleBodyType {
  idToken: string;
}

export interface LoginResType {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export type LoginGoogleResType = LoginResType;

export interface LogoutResType {
  message: string;
}

export interface ForgotPasswordResType {
  message: string;
}

export interface VerifyOtpResType {
  message: string;
}

export interface ResetPasswordResType {
  message: string;
}

export interface LoginErrorType {
  message: string;
  field: keyof LoginBodyType;
}

export interface LogoutErrorType {
  message: string;
}

export interface ForgotPasswordErrorType {
  message: string;
}

export interface VerifyOtpErrorType {
  message: string;
}

export interface ResetPasswordErrorType {
  message: string;
}

export interface LoginGoogleErrorType {
  message: string;
}
