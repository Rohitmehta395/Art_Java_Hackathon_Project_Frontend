import React, { useState, useEffect } from "react";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAPI } from "../hooks/useAPI";
import { useApp } from "../context/AppContext";
import ProductGrid from "../components/product/ProductGrid";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    materials: searchParams.get("materials") || "",
    rating: searchParams.get("rating") || "",
    inStock: searchParams.has("inStock"),
  });

  const { searchQuery } = useApp();
  const search = searchParams.get("search") || searchQuery || "";

  // Build API URL with filters
  const buildApiUrl = () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (filters.category) params.append("category", filters.category);
    if (filters.priceMin) params.append("priceMin", filters.priceMin);
    if (filters.priceMax) params.append("priceMax", filters.priceMax);
    if (filters.materials) params.append("materials", filters.materials);
    if (filters.rating) params.append("rating", filters.rating);
    if (filters.inStock) params.append("inStock", "true");
    params.append("sort", sortBy);

    return `/products/search?${params.toString()}`;
  };

  const { data: searchResults, loading, refetch } = useAPI(buildApiUrl());

  useEffect(() => {
    refetch();
  }, [filters, sortBy, search, refetch]);

  const categories = [
    "All Categories",
    "Jewelry",
    "Home Decor",
    "Art & Collectibles",
    "Clothing",
    "Accessories",
    "Furniture",
    "Pottery & Ceramics",
    "Textiles",
    "Woodwork",
  ];

  const materials = [
    "Wood",
    "Metal",
    "Ceramic",
    "Textile",
    "Leather",
    "Glass",
    "Stone",
    "Paper",
    "Plastic",
    "Mixed Media",
  ];

  const priceRanges = [
    { label: "Under $25", min: "", max: "25" },
    { label: "$25 - $50", min: "25", max: "50" },
    { label: "$50 - $100", min: "50", max: "100" },
    { label: "$100 - $200", min: "100", max: "200" },
    { label: "Over $200", min: "200", max: "" },
  ];

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest First" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(filterKey, value);
    } else {
      params.delete(filterKey);
    }
    setSearchParams(params);
  };

  const handlePriceRangeSelect = (range) => {
    handleFilterChange("priceMin", range.min);
    handleFilterChange("priceMax", range.max);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      priceMin: "",
      priceMax: "",
      materials: "",
      rating: "",
      inStock: false,
    });
    setSearchParams({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
            {search && (
              <p className="text-gray-600 mt-1">
                Search results for "{search}"
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-primary-600 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-primary-600 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Filters Toggle */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="secondary"
              className="relative"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`lg:w-64 space-y-6 ${
            showFilters ? "block" : "hidden lg:block"
          }`}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category === "All Categories" ? "" : category}
                        checked={
                          filters.category ===
                          (category === "All Categories" ? "" : category)
                        }
                        onChange={(e) =>
                          handleFilterChange("category", e.target.value)
                        }
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handlePriceRangeSelect(range)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded border transition-colors ${
                        filters.priceMin === range.min &&
                        filters.priceMax === range.max
                          ? "bg-primary-100 border-primary-300 text-primary-800"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>

                {/* Custom Price Range */}
                <div className="mt-4 space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) =>
                        handleFilterChange("priceMin", e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) =>
                        handleFilterChange("priceMax", e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Materials</h4>
                <select
                  value={filters.materials}
                  onChange={(e) =>
                    handleFilterChange("materials", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Materials</option>
                  {materials.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Minimum Rating
                </h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating.toString()}
                        onChange={(e) =>
                          handleFilterChange("rating", e.target.value)
                        }
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {rating}+ Stars
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) =>
                      handleFilterChange("inStock", e.target.checked)
                    }
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    In Stock Only
                  </span>
                </label>
              </div>
            </div>
          </Card>
        </aside>

        {/* Results */}
        <main className="flex-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Finding products..." />
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {searchResults?.total || 0} products found
                  {search && ` for "${search}"`}
                </p>
              </div>

              {/* Products Grid */}
              <ProductGrid
                products={searchResults?.products || []}
                loading={loading}
                columns={
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }
              />

              {/* Pagination */}
              {searchResults?.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex space-x-2">
                    {Array.from(
                      { length: searchResults.totalPages },
                      (_, i) => (
                        <button
                          key={i + 1}
                          className={`px-4 py-2 rounded-lg ${
                            searchResults.currentPage === i + 1
                              ? "bg-primary-600 text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Marketplace;
