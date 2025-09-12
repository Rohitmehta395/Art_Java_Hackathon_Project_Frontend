import React, { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Button from "../ui/Button";
import Card from "../ui/Card";

const ProductDetail = ({ product, relatedProducts }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleFavorite, favorites } = useApp();

  const {
    id,
    name,
    price,
    originalPrice,
    images,
    description,
    artisan,
    specifications,
    materials,
    dimensions,
    rating,
    reviewCount,
    inStock,
    stockCount,
    shipping,
    reviews,
  } = product;

  const isFavorited = favorites.includes(id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
            <img
              src={images?.[selectedImage] || "/api/placeholder/600/600"}
              alt={name}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Image Thumbnails */}
          {images && images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg bg-gray-200 ${
                    selectedImage === index ? "ring-2 ring-primary-500" : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`${name} ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <p className="text-sm text-gray-500 mb-2">By {artisan.name}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {rating} ({reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <p className="text-3xl font-bold text-gray-900">${price}</p>
              {originalPrice && originalPrice > price && (
                <>
                  <p className="text-xl text-gray-500 line-through">
                    ${originalPrice}
                  </p>
                  <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                    Save ${(originalPrice - price).toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>

          {/* Specifications */}
          {specifications && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-3">
                <label htmlFor="quantity" className="font-medium text-gray-900">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {[...Array(Math.min(10, stockCount))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {stockCount <= 10 && (
                <p className="text-sm text-orange-600">
                  Only {stockCount} left in stock
                </p>
              )}
            </div>

            <div className="flex space-x-4 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>

              <Button
                onClick={() => toggleFavorite(id)}
                variant={isFavorited ? "accent" : "secondary"}
                className="px-4"
              >
                <Heart
                  className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`}
                />
              </Button>

              <Button
                onClick={handleShare}
                variant="secondary"
                className="px-4"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-500">Orders over $50</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-500">SSL encrypted</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-500">30-day policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Artisan Info */}
          <Card>
            <div className="flex items-center space-x-4">
              <img
                src={artisan.profileImage || "/api/placeholder/60/60"}
                alt={artisan.name}
                className="w-15 h-15 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{artisan.name}</h4>
                <p className="text-sm text-gray-600">{artisan.location}</p>
                <p className="text-sm text-gray-500">
                  {artisan.followerCount} followers
                </p>
              </div>
              <Button variant="secondary" size="sm">
                View Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      {reviews && reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Customer Reviews
          </h2>
          <div className="space-y-6">
            {reviews.slice(0, 3).map((review) => (
              <Card key={review.id}>
                <div className="flex items-start space-x-4">
                  <img
                    src={review.userAvatar || "/api/placeholder/40/40"}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{review.userName}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
