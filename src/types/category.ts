export interface ProductCategoryType {
  id: string;
  title: string;
  price: number;
  discount: number;
  desc: string;
  img: string;
}

export interface GetAllCategoryType {
  id: string;
  name: string;
  status: string;
}

export interface GetCategoryById {
  id: string;
  name: string;
  products: ProductCategoryType[];
  status: string;
}

export interface GetAllCategoryErrorType {
  message: string;
}

export interface GetCategoryByIdErrorType {
  message: string;
}
