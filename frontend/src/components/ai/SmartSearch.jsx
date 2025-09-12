import React, { useState, useEffect } from "react";
import { Search, Sparkles, Filter, X } from "lucide-react";
import { useAI } from "../../hooks/useAI";
import { useApp } from "../../context/AppContext";
import Button from "../ui/Button";
import LoadingSpinner from "../common/LoadingSpinner";

const SmartSearch = ({ onResults, onClose }) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const { smartSearch, loading } = useAI();
  const { searchQuery } = useApp();

  const searchSuggestions = [
    "Handmade ceramic vases with blue patterns",
    "Eco-friendly wooden jewelry boxes",
    "Custom leather wallets for men",
    "Vintage-style embroidered textiles",
    "Modern abstract canvas paintings",
    "Artisan-made silver earrings",
    "Hand-carved wooden sculptures",
    "Natural fiber rugs and carpets",
  ];

  useEffect(() => {
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Generate smart suggestions based on current query
    if (query.length > 2) {
      const filteredSuggestions = searchSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    try {
      const results = await smartSearch(searchQuery, filters);

      if (onResults) {
        onResults({
          query: searchQuery,
          results: results.results || [],
          suggestions: results.suggestions || [],
          filters: results.appliedFilters || {},
        });
      }
    } catch (error) {
      console.error("Smart search error:", error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const advancedFilters = [
    {
      key: "category",
      label: "Category",
      options: ["Jewelry", "Home Decor", "Art", "Clothing", "Accessories"],
    },
    {
      key: "priceRange",
      label: "Price Range",
      options: ["Under $25", "$25-$50", "$50-$100", "$100-$200", "Over $200"],
    },
    {
      key: "materials",
      label: "Materials",
      options: ["Wood", "Metal", "Ceramic", "Textile", "Leather", "Glass"],
    },
    {
      key: "style",
      label: "Style",
      options: [
        "Modern",
        "Vintage",
        "Rustic",
        "Minimalist",
        "Traditional",
        "Abstract",
      ],
    },
  ];

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey] === value ? "" : value,
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Smart Search</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe what you're looking for in detail..."
          className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
        />
      </div>

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="block text-left text-sm text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded border border-primary-200 transition-colors w-full"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsAdvanced(!isAdvanced)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
        </button>

        <div className="flex space-x-2">
          <Button
            onClick={() => handleSearch()}
            disabled={!query.trim() || loading}
            className="px-6"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="white" className="mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Smart Search
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isAdvanced && (
        <div className="border-t pt-4 space-y-4">
          <h4 className="font-medium text-gray-900">Refine Your Search</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advancedFilters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
                <div className="space-y-1">
                  {filter.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleFilterChange(filter.key, option)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded border transition-colors ${
                        filters[filter.key] === option
                          ? "bg-primary-100 border-primary-300 text-primary-800"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {Object.keys(filters).some((key) => filters[key]) && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Active Filters:
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(
              ([key, value]) =>
                value && (
                  <span
                    key={key}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                  >
                    {value}
                    <button
                      onClick={() => handleFilterChange(key, value)}
                      className="ml-2 hover:text-primary-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
