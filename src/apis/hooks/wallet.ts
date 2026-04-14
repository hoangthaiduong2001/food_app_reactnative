import {
  GetBalanceWalletErrorType,
  GetBalanceWalletResType,
} from "@/types/wallet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWalletApi,
  getBalance,
  paymentWithWalletApi,
  topupWalletApi,
} from "../api/wallet";

export const useGetBalance = ({ id }: { id: string }) => {
  return useQuery<GetBalanceWalletResType, GetBalanceWalletErrorType>({
    queryKey: ["balance-id", id],
    queryFn: () => getBalance(id),
    enabled: !!id,
  });
};

export const useCreateWalletMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWalletApi,

    onSuccess: (_, variables) => {
      const userId = variables.userId;

      queryClient.invalidateQueries({
        queryKey: ["create-wallet", userId],
      });
    },
  });
};

export const useTopupWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: topupWalletApi,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["wallet-balance", variables.userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["transaction-history", variables.userId],
      });
    },
  });
};

export const usePaymentWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentWithWalletApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-id"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-history"] });
    },
  });
};
