import {
  GetProfileErrorType,
  GetProfileResType,
  UpdateProfileBodyType,
  UpdateProfileErrorType,
  UpdateProfileResType,
  UploadImageErrorType,
  UploadImageResType,
} from "@/types/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";
import {
  getProfileApi,
  updateProfileApi,
  uploadImageApi,
} from "../api/profile";

export const useGetProfile = () => {
  return useQuery<GetProfileResType, GetProfileErrorType>({
    queryKey: ["profile"],
    queryFn: getProfileApi,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateProfileResType,
    UpdateProfileErrorType,
    UpdateProfileBodyType
  >({
    mutationFn: (body) => updateProfileApi(body),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUploadImage = () => {
  return useMutation<
    UploadImageResType,
    UploadImageErrorType,
    ImagePickerAsset
  >({
    mutationFn: uploadImageApi,
  });
};
