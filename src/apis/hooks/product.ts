import {
  GetProductsTopRatingError,
  GetProductsTopRatingResType,
} from "@/types/product";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getAllProduct,
  getProductById,
  getTopRatingProduct,
  searchProduct,
} from "../api/product";

export const useGetProductsTopRating = () => {
  return useQuery<GetProductsTopRatingResType[], GetProductsTopRatingError>({
    queryKey: ["products-top-rating"],
    queryFn: getTopRatingProduct,
  });
};

export const useGetAllProducts = () => {
  return useInfiniteQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length * 4;
    },
  });
};

export const useGetProductById = ({ id }: { id?: string }) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as string),
    enabled: !!id,
  });
};

export const useSearchProduct = (query: string) => {
  return useQuery({
    queryKey: ["search-product", query],
    queryFn: () => searchProduct(query),
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
};
