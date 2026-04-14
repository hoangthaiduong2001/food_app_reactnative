export interface ITransaction {
  id: string;
  type: "topup" | "payment" | "refund";
  amount: number;
  status: "pending" | "success" | "failed";
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetTransactionRecentResType {
  message: string;
  data: ITransaction[];
}

export interface GetTransactionHistoryResType {
  message: string;
  data: ITransaction[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface GetTransactionRecentErrorType {
  message: string;
}

export interface GetTransactionHistoryErrorType {
  message: string;
}
