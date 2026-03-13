import {
  GetProductsTopRatingError,
  GetProductsTopRatingResType,
} from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { getTopRatingProduct } from "../api/product";

export const useGetProductsTopRating = () => {
  return useQuery<GetProductsTopRatingResType[], GetProductsTopRatingError>({
    queryKey: ["products-top-rating"],
    queryFn: getTopRatingProduct,
  });
};
