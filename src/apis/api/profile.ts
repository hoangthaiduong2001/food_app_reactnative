import api from "@/config/axios";
import {
  GetProfileErrorType,
  GetProfileResType,
  UpdateProfileBodyType,
  UpdateProfileErrorType,
  UpdateProfileResType,
  UploadImageErrorType,
  UploadImageResType,
} from "@/types/profile";
import { AxiosError } from "axios";
import { ImagePickerAsset } from "expo-image-picker";

export const getProfileApi = async (): Promise<GetProfileResType> => {
  try {
    const response = await api.get<GetProfileResType>("/profile");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<GetProfileErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const updateProfileApi = async (
  body: UpdateProfileBodyType,
): Promise<UpdateProfileResType> => {
  try {
    const response = await api.put<UpdateProfileResType>("/profile", body);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<UpdateProfileErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const uploadImageApi = async (
  file: ImagePickerAsset,
): Promise<UploadImageResType> => {
  try {
    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      name: file.fileName || "image.jpg",
      type: file.mimeType || "image/jpeg",
    } as unknown as Blob);

    const response = await api.post<UploadImageResType>(
      "/upload/images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<UploadImageErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};
