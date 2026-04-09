import api from "@/config/axios";
import { AxiosError } from "axios";
import {
  DeleteReviewBodyType,
  DeleteReviewResType,
  ReviewBodyType,
  ReviewErrorType,
  ReviewResType,
} from "./../../types/review";

export const addReviewApi = async (
  body: ReviewBodyType,
): Promise<ReviewResType> => {
  try {
    const response = await api.post<ReviewResType>("/reviews", body);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ReviewErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const deleteReviewApi = async ({
  reviewId,
  body,
}: {
  reviewId: string;
  body: DeleteReviewBodyType;
}): Promise<DeleteReviewResType> => {
  const response = await api.delete<DeleteReviewResType>(
    `/reviews/${reviewId}`,
    {
      data: body,
    },
  );

  return response.data;
};
