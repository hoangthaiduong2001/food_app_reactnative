import {
  GetAllCategoryErrorType,
  GetAllCategoryType,
  GetCategoryById,
  GetCategoryByIdErrorType,
} from "@/types/category";
import { useQuery } from "@tanstack/react-query";
import { getAllCategory, getCategoryById } from "../api/category";

export const useGetAllCategory = () => {
  return useQuery<GetAllCategoryType[], GetAllCategoryErrorType>({
    queryKey: ["categories"],
    queryFn: getAllCategory,
  });
};

export const useGetCategoryById = (
  { id }: { id: string },
  options?: { enabled?: boolean },
) => {
  return useQuery<GetCategoryById, GetCategoryByIdErrorType>({
    queryKey: ["category-id", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id && id !== "all" && options?.enabled !== false,
  });
};
