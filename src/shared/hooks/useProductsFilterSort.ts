import { useState, useMemo } from "react";
import type { Product } from "@/features/products/types/product.model";

/**
 * Custom hook to abstract searching, filtering, and sorting logic for a list of products.
 * Returns state variables, actions to update state, reset function, and computed filtered items.
 */
export function useProductsFilterSort(products: Product[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter (local inline search)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Price range filter
    if (minPrice !== "") {
      const minVal = parseFloat(minPrice);
      if (!isNaN(minVal)) {
        result = result.filter((p) => p.price >= minVal);
      }
    }
    if (maxPrice !== "") {
      const maxVal = parseFloat(maxPrice);
      if (!isNaN(maxVal)) {
        result = result.filter((p) => p.price <= maxVal);
      }
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "title-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [
    products,
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
  ]);

  const isFiltered =
    selectedCategory !== "all" ||
    sortBy !== "featured" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    minRating > 0 ||
    searchQuery !== "";

  const resetFilters = () => {
    setSelectedCategory("all");
    setSortBy("featured");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSearchQuery("");
  };

  return {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    isFiltered,
    resetFilters,
  };
}
