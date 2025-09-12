import React from "react";
import { useParams } from "react-router-dom";
import { useAPI } from "../hooks/useAPI";
import ArtisanProfile from "../components/artisan/ArtisanProfile";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ArtisanDetails = () => {
  const { id } = useParams();

  const {
    data: artisan,
    loading: artisanLoading,
    error: artisanError,
  } = useAPI(`/artisans/${id}`);
  const { data: products, loading: productsLoading } = useAPI(
    `/artisans/${id}/products`
  );

  if (artisanLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading artisan profile..." />
      </div>
    );
  }

  if (artisanError || !artisan) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Artisan Not Found
        </h1>
        <p className="text-gray-600">
          The artisan you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <ArtisanProfile
      artisan={artisan}
      products={products?.products || []}
      loading={productsLoading}
    />
  );
};

export default ArtisanDetails;
