import { useState, useEffect, useRef, useCallback } from "react";
import { useAllProductsInfinite } from "@/features/products/queries/shop-products.query";
import { ProductCard } from "@/features/products/components/ProductCard";
import { SlidersHorizontal } from "lucide-react";
import { useProductsFilterSort } from "@/shared/hooks/useProductsFilterSort";
import { Modal } from "@/shared/components/Modal";
import { ProductsFilterOptions, type FilterState } from "@/features/products/components/ProductsFilterOptions";

export function AllProducts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useAllProductsInfinite();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  // Delegate filter & sort state and logic to the custom hook
  const {
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
  } = useProductsFilterSort(allProducts);

  const handleResetFilters = resetFilters;

  // Sentinel element observed by IntersectionObserver to trigger next page
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      // Only auto-trigger more pages if user is NOT filtering to prevent viewport-based loop conditions on sparse lists
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && !isFiltered) {
        void fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, isFiltered],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="shop-home-container">
      <div className="all-products-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 className="all-products-title">All Products</h1>
          {total > 0 && (
            <span className="all-products-count">{total} products available</span>
          )}
        </div>
        
        {/* Trigger Button to Open the Filter & Sort Modal */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="filter-reset-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            height: "42px",
            padding: "0 18px",
            borderRadius: "10px",
            background: isFiltered ? "color-mix(in srgb, var(--color-primary) 8%, var(--color-surface))" : "var(--color-surface)",
            borderColor: isFiltered ? "var(--color-primary)" : "var(--color-border)",
            color: isFiltered ? "var(--color-primary)" : "var(--shop-text-secondary)",
          }}
          aria-label="Open filter and sort menu"
        >
          <SlidersHorizontal size={15} />
          <span>Filter & Sort</span>
          {isFiltered && (
            <span
              style={{
                background: "var(--color-primary)",
                color: "#ffffff",
                borderRadius: "50%",
                width: "8px",
                height: "8px",
                display: "inline-block",
                marginLeft: "2px"
              }}
            />
          )}
        </button>
      </div>

      {/* Portal Modal container */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter & Sort Products"
      >
        <ProductsFilterOptions
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          minPrice={minPrice}
          maxPrice={maxPrice}
          minRating={minRating}
          searchQuery={searchQuery}
          onApply={(filters: FilterState) => {
            setSelectedCategory(filters.category);
            setSortBy(filters.sortBy);
            setMinPrice(filters.minPrice);
            setMaxPrice(filters.maxPrice);
            setMinRating(filters.minRating);
            setSearchQuery(filters.searchQuery);
            setIsFilterModalOpen(false);
          }}
        />
      </Modal>

      {isError && !isLoading && (
        <div className="shop-no-results">
          <p>Could not load products. Please check your connection.</p>
          <button
            className="all-products-retry-btn"
            onClick={() => void refetch()}
          >
            Try Again
          </button>
        </div>
      )}

      {isLoading && (
        <div className="products-grid">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="product-card shimmer-card" />
          ))}
        </div>
      )}

      {!isLoading && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="shop-no-results">
              <p>No products match your selected filters.</p>
              {isFiltered && (
                <button
                  className="all-products-retry-btn"
                  onClick={handleResetFilters}
                  style={{ marginTop: "16px" }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Infinite scroll sentinel — only active when NOT filtering */}
          {!isFiltered && (
            <div ref={sentinelRef} className="all-products-sentinel">
              {isFetchingNextPage && (
                <div className="all-products-loading-more">
                  <div className="shop-spinner" />
                  <span>Loading more products…</span>
                </div>
              )}
              {!hasNextPage && filteredProducts.length > 0 && (
                <p className="all-products-end">
                  You&apos;ve reached the end — {filteredProducts.length} products shown
                </p>
              )}
            </div>
          )}

          {/* Manual Load More button — active ONLY when filtering and more pages exist */}
          {isFiltered && hasNextPage && (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <button
                className="filter-reset-btn"
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "44px",
                  padding: "0 24px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {isFetchingNextPage ? (
                  <>
                    <div className="shop-spinner" style={{ width: "16px", height: "16px", borderWidth: "2px", margin: 0 }} />
                    <span>Searching more items...</span>
                  </>
                ) : (
                  <span>Load More Products to Filter</span>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
