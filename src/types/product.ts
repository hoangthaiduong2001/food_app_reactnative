export interface GetProductsTopRatingResType {
  id: string;
  title: string;
  desc: string;
  img: string;
  averageRating: number;
}

export interface ProductType {
  id: string;
  title: string;
  price: number;
  desc: string;
  img: string;
}

export interface GetAllProductsResType extends ProductType {}

export interface ReviewProductType {
  id: string;
  userId: string;
  username: string;
  rating: number;
  content: string;
  img: string;
}

export interface GetProductByIdType {
  id: string;
  title: string;
  price: number;
  discount: number;
  desc: string;
  img: string;
  averageRating: number;
  totalReviews: number;
  reviews: ReviewProductType[];
}

export type SearchProductItemType = {
  id: string;
  title: string;
  img: string;
  price: number;
};

export interface GetProductsTopRatingError {
  message: string;
}

export interface GetAllProductsErrorType {
  message: string;
}

export interface GetProductByIdErrorType {
  message: string;
}
