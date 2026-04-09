export interface IOrder {
  id: string;
  deliveryStatus: string;
  address: string;
  paymentMethod: "cod" | "wallet";
  totalPrice: number;
  name: string;
}

export interface IProductOrder {
  id: string;
  title: string;
  price: number;
  discount: number;
  img: string;
  quantity: number;
}

export interface IOrderDetail {
  id: string;
  name: string;
  phone: string;
  address: string;
  deliveryStatus: "waiting" | "received" | "cancelled";
  paymentMethod: "cod" | "wallet";
  paymentStatus: "unpaid" | "paid";
  description: "string";
  shippingFee: number;
  totalPrice: number;
  products: IProductOrder[];
  createdAt: string;
}

export interface GetOrderByUserIdResType {
  message: string;
  data: IOrder[];
}

export interface GetOrderDetailResType {
  message: string;
  data: IOrderDetail;
}

export interface UpdateCartResType {
  message: string;
}

export interface DeleteCartResType {
  message: string;
}

export interface CreateOrderBodyType {
  userId: string;
  address: string;
  products: { productId: string; quantity: number }[];
  phone: string;
  name: string;
  paymentMethod: "cod" | "wallet";
  description: string;
  shippingFee: number;
}

export interface UpdateStatusOrderBodyType {
  deliveryStatus: "waiting" | "received" | "cancelled";
}

export interface UpdateCartBodyType {
  userId: string;
  productId: string;
  quantity: number;
}

export interface DeleteCartBodyType {
  userId: string;
  productId: string;
}

export interface GetOrderByUserIdErrorType {
  message: string;
}

export interface GetOrderDetailErrorType {
  message: string;
}

export interface AddCartErrorType {
  message: string;
}

export interface CreateOrderResType {
  message: string;
}

export interface UpdateStatusOrderResType {
  message: string;
}

export interface CreateOrderErrorType {
  message: string;
}

export interface UpdateStatusOrderErrorType {
  message: string;
}

export interface DeleteCartErrorType {
  message: string;
}
