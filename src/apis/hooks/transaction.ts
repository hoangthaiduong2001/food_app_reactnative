import {
  GetTransactionHistoryErrorType,
  GetTransactionHistoryResType,
  GetTransactionRecentErrorType,
  GetTransactionRecentResType,
} from "@/types/transaction";
import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  getTransactionHistory,
  getTransactionRecent,
} from "../api/transaction";

export const useGetTransactionRecent = ({ id }: { id: string }) => {
  return useQuery<GetTransactionRecentResType, GetTransactionRecentErrorType>({
    queryKey: ["transaction-id", id],
    queryFn: () => getTransactionRecent(id),
    enabled: !!id,
  });
};

export const useGetTransactionHistory = ({ id }: { id: string }) => {
  return useInfiniteQuery<
    GetTransactionHistoryResType,
    GetTransactionHistoryErrorType,
    InfiniteData<GetTransactionHistoryResType>,
    [string, string],
    string | undefined
  >({
    queryKey: ["transaction-history", id],

    queryFn: ({ pageParam }) => getTransactionHistory(id, pageParam),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },

    enabled: !!id,
  });
};
