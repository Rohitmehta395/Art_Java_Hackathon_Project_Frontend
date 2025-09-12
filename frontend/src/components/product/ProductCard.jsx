import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../ui/Card";
import Button from "../ui/Button";

const ProductCard = ({ product }) => {
  const { addToCart, toggleFavorite, favorites } = useApp();
  const {
    id,
    name,
    price,
    originalPrice,
    image,
    artisan,
    rating,
    reviewCount,
    inStock,
    isNew,
    discount,
  } = product;

  const isFavorited = favorites.includes(id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <Card hover className="group relative overflow-hidden">
      <Link to={`/product/${id}`}>
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
            <img
              src={image || "/api/placeholder/300/300"}
              alt={name}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {isNew && (
                <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
              {discount && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorited ? "text-red-500 fill-current" : "text-gray-400"
                }`}
              />
            </button>

            {/* Quick Add to Cart */}
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-4 space-y-2">
            {/* Artisan Name */}
            <p className="text-sm text-gray-500">{artisan.name}</p>

            {/* Product Name */}
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
              {name}
            </h3>

            {/* Rating */}
            {rating && (
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">({reviewCount})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center space-x-2">
              <p className="text-lg font-semibold text-gray-900">${price}</p>
              {originalPrice && originalPrice > price && (
                <p className="text-sm text-gray-500 line-through">
                  ${originalPrice}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;
