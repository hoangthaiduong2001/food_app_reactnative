import {
  GetOrderByUserIdErrorType,
  GetOrderByUserIdResType,
  GetOrderDetailErrorType,
  GetOrderDetailResType,
  UpdateStatusOrderBodyType,
  UpdateStatusOrderErrorType,
  UpdateStatusOrderResType,
} from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrderApi,
  getOrderByUserId,
  getOrderDetail,
  orderAgainApi,
  updateStatusOrderApi,
} from "../api/order";

export const useGetOrderByUserId = ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  return useQuery<GetOrderByUserIdResType, GetOrderByUserIdErrorType>({
    queryKey: ["orders", id, status],
    queryFn: () => getOrderByUserId(id, status),
    enabled: !!id,
  });
};

export const useGetOrderDetail = ({ id }: { id: string }) => {
  return useQuery<GetOrderDetailResType, GetOrderDetailErrorType>({
    queryKey: ["order-detail", id],
    queryFn: () => getOrderDetail(id),
    enabled: !!id,
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrderApi,

    onSuccess: (_, variables) => {
      const userId = variables.userId;

      queryClient.invalidateQueries({
        queryKey: ["create-order", userId],
      });
    },
  });
};

export const useUpdateStatusOrderMutation = () => {
  return useMutation<
    UpdateStatusOrderResType,
    UpdateStatusOrderErrorType,
    { id: string; body: UpdateStatusOrderBodyType }
  >({
    mutationFn: ({ id, body }) => updateStatusOrderApi(id, body),
  });
};

export const useOrderAgainMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderAgainApi,

    onSuccess: (_, variables) => {
      const userId = variables.userId;

      queryClient.invalidateQueries({
        queryKey: ["order-again", userId],
      });
    },
  });
};
