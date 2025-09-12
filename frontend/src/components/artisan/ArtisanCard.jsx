import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Users } from "lucide-react";
import Card from "../ui/Card";

const ArtisanCard = ({ artisan }) => {
  const {
    id,
    name,
    bio,
    profileImage,
    location,
    rating,
    totalReviews,
    specialties,
    followerCount,
    productCount,
  } = artisan;

  return (
    <Card hover className="max-w-sm">
      <Link to={`/artisan/${id}`}>
        <div className="flex flex-col">
          {/* Profile Image */}
          <div className="relative mb-4">
            <img
              src={profileImage || "/api/placeholder/300/200"}
              alt={name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>

          {/* Artisan Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{bio}</p>

            {/* Location */}
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{location}</span>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-1 mb-3">
              {specialties?.slice(0, 3).map((specialty, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-md"
                >
                  {specialty}
                </span>
              ))}
              {specialties?.length > 3 && (
                <span className="text-gray-500 text-xs">
                  +{specialties.length - 3} more
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{followerCount} followers</span>
                </div>
                <div>
                  <span>{productCount} products</span>
                </div>
              </div>
              <span className="text-xs">({totalReviews} reviews)</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ArtisanCard;
