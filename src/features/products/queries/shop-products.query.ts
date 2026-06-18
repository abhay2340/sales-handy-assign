import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { productApi } from "../api/shop-products.api";
import {
  type ProductsResponse,
  type Product,
} from "../types/product.model";

const PAGE_SIZE = 20;

export function useShopProducts(
  categoryParam?: string | null,
  searchParam?: string | null,
) {
  return useQuery<ProductsResponse>({
    queryKey: ["shop-products", categoryParam, searchParam],
    queryFn: () => {
      if (searchParam) {
        return productApi.searchProducts(searchParam);
      }
      if (categoryParam) {
        return productApi.getProductsByCategory(categoryParam);
      }
      return productApi.getProducts(12);
    },
  });
}

export function useAllProductsInfinite() {
  return useInfiniteQuery<ProductsResponse>({
    queryKey: ["all-products-infinite"],
    queryFn: ({ pageParam }) =>
      productApi.getAllProducts((pageParam as number) ?? 0, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });
}

export function useDashboardProducts() {
  return useQuery<ProductsResponse>({
    queryKey: ["dashboard-products"],
    queryFn: () => productApi.getProducts(100),
  });
}

export function useProductDetails(id: string | number) {
  return useQuery<Product>({
    queryKey: ["product-details", id],
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
  });
}
