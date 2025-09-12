import React from "react";
import { useParams } from "react-router-dom";
import { useAPI } from "../hooks/useAPI";
import ProductDetail from "../components/product/ProductDetail";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ProductDetails = () => {
  const { id } = useParams();

  const {
    data: product,
    loading: productLoading,
    error: productError,
  } = useAPI(`/products/${id}`);
  const { data: relatedProducts, loading: relatedLoading } = useAPI(
    `/products/${id}/related`
  );

  if (productLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading product details..." />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600">
          The product you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <ProductDetail
      product={product}
      relatedProducts={relatedProducts?.products || []}
      relatedLoading={relatedLoading}
    />
  );
};

export default ProductDetails;
