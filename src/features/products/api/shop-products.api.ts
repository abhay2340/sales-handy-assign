import { http } from "@/shared/api";
import { type ProductsResponse, type Product } from "../types/product.model";

const BASE_URL =
  import.meta.env.VITE_PRODUCTS_API_URL || "https://dummyjson.com/products";

export const productApi = {
  getProductById: (id: string | number) => {
    return http.get<Product>(`${BASE_URL}/${id}`);
  },

  getProducts: (limit = 12) => {
    return http.get<ProductsResponse>(`${BASE_URL}?limit=${limit}`);
  },

  getAllProducts: (skip: number, limit = 20) => {
    return http.get<ProductsResponse>(
      `${BASE_URL}?skip=${skip}&limit=${limit}`,
    );
  },

  getProductsByCategory: (category: string) => {
    return http.get<ProductsResponse>(`${BASE_URL}/category/${category}`);
  },

  searchProducts: (query: string) => {
    return http.get<ProductsResponse>(`${BASE_URL}/search?q=${query}`);
  },
};
