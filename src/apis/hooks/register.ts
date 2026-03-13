import {
  RegisterBodyType,
  RegisterErrorType,
  RegisterResType,
} from "@/types/register";
import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../api/register";

export const useRegisterMutation = () => {
  return useMutation<RegisterResType, RegisterErrorType, RegisterBodyType>({
    mutationFn: registerApi,
  });
};
