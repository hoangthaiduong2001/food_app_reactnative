export interface ReviewResType {
  message: string;
}

export interface DeleteReviewResType {
  message: string;
}

export interface ReviewBodyType {
  productId: string;
  userId: string;
  content: string;
  rating: number;
}

export interface DeleteReviewBodyType {
  userId: string;
}

export interface ReviewErrorType {
  message: string;
}

export interface DeleteReviewErrorType {
  message: string;
}
