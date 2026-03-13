import api from "@/config/axios";
import { LoginErrorType } from "@/types/auth";
import { RegisterBodyType, RegisterResType } from "@/types/register";
import { AxiosError } from "axios";

export const registerApi = async (
  body: RegisterBodyType,
): Promise<RegisterResType> => {
  try {
    const response = await api.post<RegisterResType>("/auth/signup", body);
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
