import React, { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useAI } from "../../hooks/useAI";
import ProductCard from "../product/ProductCard";
import LoadingSpinner from "../common/LoadingSpinner";
import Button from "../ui/Button";

const AIRecommendations = ({ userId, preferences = {} }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();
  const { getRecommendations, loading, error } = useAI();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const result = await getRecommendations(userId || user?.id, preferences);
      setRecommendations(result.recommendations || []);
    };

    if (userId || user?.id) {
      fetchRecommendations();
    }
  }, [userId, user?.id, preferences, getRecommendations]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-8">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">
            AI is analyzing your preferences...
          </p>
        </div>
      </div>
    );
  }

  if (error || !recommendations.length) {
    return (
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-8">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI Recommendations
          </h3>
          <p className="text-gray-600 mb-4">
            Browse more products to get personalized recommendations!
          </p>
          <Button>Explore Products</Button>
        </div>
      </div>
    );
  }

  const displayedRecommendations = showAll
    ? recommendations
    : recommendations.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-6 w-6 text-primary-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Recommended for You
            </h2>
            <p className="text-gray-600">
              Personalized picks based on your interests and browsing history
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedRecommendations.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} />

            {/* AI Badge */}
            <div className="absolute top-2 left-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>AI Pick</span>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {recommendations.length > 4 && (
        <div className="text-center">
          <Button onClick={() => setShowAll(!showAll)} variant="secondary">
            {showAll ? "Show Less" : `Show ${recommendations.length - 4} More`}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Recommendation Explanation */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          Why these recommendations?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
            <span>Based on your browsing history</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
            <span>Similar to your favorites</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Trending in your interests</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
