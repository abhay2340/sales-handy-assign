import { useState } from "react";
import { SlidersHorizontal, Check } from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "smartphones", label: "Smartphones" },
  { value: "laptops", label: "Laptops" },
  { value: "fragrances", label: "Fragrances" },
  { value: "skincare", label: "Skincare" },
  { value: "groceries", label: "Groceries" },
  { value: "home-decoration", label: "Home Decoration" },
  { value: "furniture", label: "Furniture" },
  { value: "sunglasses", label: "Sunglasses" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "title-asc", label: "Name: A to Z" },
];

export interface FilterState {
  category: string;
  sortBy: string;
  minPrice: string;
  maxPrice: string;
  minRating: number;
  searchQuery: string;
}

export interface ProductsFilterOptionsProps {
  selectedCategory: string;
  sortBy: string;
  minPrice: string;
  maxPrice: string;
  minRating: number;
  searchQuery: string;
  onApply: (filters: FilterState) => void;
}

export function ProductsFilterOptions({
  selectedCategory,
  sortBy,
  minPrice,
  maxPrice,
  minRating,
  searchQuery,
  onApply,
}: ProductsFilterOptionsProps) {
  // Local state initialized with current active values
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [localMinRating, setLocalMinRating] = useState(minRating);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleReset = () => {
    setLocalCategory("all");
    setLocalSortBy("featured");
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setLocalMinRating(0);
    setLocalSearchQuery("");
  };

  const handleApply = () => {
    onApply({
      category: localCategory,
      sortBy: localSortBy,
      minPrice: localMinPrice,
      maxPrice: localMaxPrice,
      minRating: localMinRating,
      searchQuery: localSearchQuery,
    });
  };

  const isLocalFiltered =
    localCategory !== "all" ||
    localSortBy !== "featured" ||
    localMinPrice !== "" ||
    localMaxPrice !== "" ||
    localMinRating > 0 ||
    localSearchQuery !== "";

  return (
    <div className="filter-options-content">
      {/* Category Filter */}
      <div className="filter-group-vertical">
        <label htmlFor="modal-category-select" className="filter-label">
          Category
        </label>
        <select
          id="modal-category-select"
          value={localCategory}
          onChange={(e) => setLocalCategory(e.target.value)}
          className="filter-select"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Inline Search */}
      <div className="filter-group-vertical">
        <label htmlFor="modal-search-filter" className="filter-label">
          Filter by Name
        </label>
        <input
          id="modal-search-filter"
          type="text"
          placeholder="Type to filter..."
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Price Range Filter */}
      <div className="filter-group-vertical">
        <span className="filter-label">Price Range ($)</span>
        <div className="price-inputs-row">
          <input
            type="number"
            placeholder="Min"
            value={localMinPrice}
            onChange={(e) => setLocalMinPrice(e.target.value)}
            className="filter-input"
            aria-label="Minimum price"
            min="0"
          />
          <span className="price-separator">to</span>
          <input
            type="number"
            placeholder="Max"
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
            className="filter-input"
            aria-label="Maximum price"
            min="0"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="filter-group-vertical">
        <label htmlFor="modal-rating-select" className="filter-label">
          Minimum Rating
        </label>
        <select
          id="modal-rating-select"
          value={localMinRating}
          onChange={(e) => setLocalMinRating(Number(e.target.value))}
          className="filter-select"
        >
          <option value="0">All Ratings</option>
          <option value="4.5">4.5+ ★ Stars</option>
          <option value="4.0">4.0+ ★ Stars</option>
          <option value="3.5">3.5+ ★ Stars</option>
          <option value="3.0">3.0+ ★ Stars</option>
        </select>
      </div>

      {/* Sort Options */}
      <div className="filter-group-vertical">
        <label htmlFor="modal-sort-select" className="filter-label">
          Sort By
        </label>
        <select
          id="modal-sort-select"
          value={localSortBy}
          onChange={(e) => setLocalSortBy(e.target.value)}
          className="filter-select"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="modal-actions-row">
        {isLocalFiltered && (
          <button
            onClick={handleReset}
            className="filter-reset-btn"
            aria-label="Reset all filters"
            style={{ flex: 1 }}
          >
            <SlidersHorizontal size={14} />
            Reset
          </button>
        )}
        <button
          onClick={handleApply}
          className="modal-apply-btn"
          aria-label="Apply filters"
          style={{ flex: isLocalFiltered ? 1.5 : 1 }}
        >
          <Check size={14} />
          Apply Filters
        </button>
      </div>
    </div>
  );
}
