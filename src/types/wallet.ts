export interface CreateWalletBodyType {
  userId: string;
  pin: string;
}

export interface TopupWalletBodyType {
  userId: string;
  amount: number;
  pin: string;
}

export interface PaymentWalletBodyType {
  userId: string;
  pin: string;
  payload: {
    address: string;
    phone: string;
    name: string;
    paymentMethod: "wallet" | "cod";
    description?: string;
    shippingFee: number;
    products: {
      productId: string;
      quantity: number;
    }[];
  };
}
export interface GetBalanceWalletResType {
  message: string;
  data: {
    balance: number;
  };
}

export interface TopupWalletResType {
  message: string;
}

export interface CreateWalletResType {
  message: string;
}

export interface PaymentWalletResType {
  message: string;
}

export interface CreateWalletErrorType {
  message: string;
}

export interface GetBalanceWalletErrorType {
  message: string;
}

export interface TopupWalletErrorType {
  message: string;
}

export interface PaymentWalletErrorType {
  message: string;
}
