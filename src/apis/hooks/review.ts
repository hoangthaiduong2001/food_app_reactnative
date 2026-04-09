import {
  DeleteReviewBodyType,
  DeleteReviewErrorType,
  DeleteReviewResType,
  ReviewBodyType,
  ReviewErrorType,
  ReviewResType,
} from "@/types/review";
import { useMutation } from "@tanstack/react-query";
import { addReviewApi, deleteReviewApi } from "../api/review";

type DeleteReviewVariables = {
  reviewId: string;
  body: DeleteReviewBodyType;
};

export const useAddReviewMutation = () => {
  return useMutation<ReviewResType, ReviewErrorType, ReviewBodyType>({
    mutationFn: addReviewApi,
  });
};

export const useDeleteReviewMutation = () => {
  return useMutation<
    DeleteReviewResType,
    DeleteReviewErrorType,
    DeleteReviewVariables
  >({
    mutationFn: deleteReviewApi,
  });
};
