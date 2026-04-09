export interface IProductCart {
  productId: string;
  productName: string;
  quantity: number;
  img: string;
  unitPrice: number;
  totalPrice: number;
}

export interface ICart {
  id: string;
  userId: string;
  username: string;
  products: IProductCart[];
}

export interface GetCartById {
  message: string;
  data: ICart;
}

export interface AddCartResType {
  message: string;
}

export interface UpdateCartResType {
  message: string;
}

export interface DeleteCartResType {
  message: string;
}

export interface AddCartBodyType {
  userId: string;
  productId: string;
  quantity?: number;
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

export interface GetCartByIdErrorType {
  message: string;
}

export interface AddCartErrorType {
  message: string;
}

export interface UpdateCartErrorType {
  message: string;
}

export interface DeleteCartErrorType {
  message: string;
}
