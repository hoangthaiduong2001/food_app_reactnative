import { IUser } from "./user";

export interface RegisterBodyType {
  username: string;
  phone: string;
  address: string;
  email: string;
  password: string;
}

export interface RegisterResType {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface RegisterErrorType {
  message: string;
  field: keyof RegisterBodyType;
}
