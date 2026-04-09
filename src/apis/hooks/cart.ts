import {
  GetCartById,
  GetCartByIdErrorType,
  UpdateCartBodyType,
  UpdateCartErrorType,
  UpdateCartResType,
} from "@/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCartApi, getCartById, updateCartApi } from "../api/cart";

export const useGetCartById = ({ id }: { id: string }) => {
  return useQuery<GetCartById, GetCartByIdErrorType>({
    queryKey: ["cart-id", id],
    queryFn: () => getCartById(id),
    enabled: !!id,
  });
};

export const useAddCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartApi,

    onSuccess: (_, variables) => {
      const userId = variables.userId;

      queryClient.invalidateQueries({
        queryKey: ["cart-id", userId],
      });
    },
  });
};

export const useUpdateCartMutation = () => {
  return useMutation<
    UpdateCartResType,
    UpdateCartErrorType,
    UpdateCartBodyType
  >({
    mutationFn: updateCartApi,
  });
};
