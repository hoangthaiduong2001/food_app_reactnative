export interface GetProductsTopRatingResType {
  id: string;
  title: string;
  desc: string;
  img: string;
  averageRating: number;
}

export interface GetProductsTopRatingError {
  message: string;
}
