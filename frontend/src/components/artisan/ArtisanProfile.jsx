import React, { useState } from "react";
import { MapPin, Star, Users, Mail, Phone, Globe, Heart } from "lucide-react";
import Button from "../ui/Button";
import ProductGrid from "../product/ProductGrid";

const ArtisanProfile = ({ artisan, products }) => {
  const [activeTab, setActiveTab] = useState("products");
  const [isFollowing, setIsFollowing] = useState(false);

  const {
    id,
    name,
    bio,
    profileImage,
    coverImage,
    location,
    rating,
    totalReviews,
    specialties,
    followerCount,
    productCount,
    joinedDate,
    contact,
    socialMedia,
    achievements,
  } = artisan;

  const tabs = [
    { id: "products", name: "Products", count: productCount },
    { id: "about", name: "About" },
    { id: "reviews", name: "Reviews", count: totalReviews },
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow/unfollow API call
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg overflow-hidden mb-8">
        {coverImage && (
          <img
            src={coverImage}
            alt={`${name}'s cover`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      {/* Profile Header */}
      <div className="relative -mt-32 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={profileImage || "/api/placeholder/150/150"}
              alt={name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
            <p className="text-gray-600 mb-4 max-w-2xl">{bio}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{location}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                <span>
                  {rating} ({totalReviews} reviews)
                </span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{followerCount} followers</span>
              </div>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 mb-6">
              {specialties?.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleFollow}
              variant={isFollowing ? "secondary" : "primary"}
              className="min-w-[120px]"
            >
              {isFollowing ? (
                <>
                  <Heart className="h-4 w-4 mr-2 fill-current" />
                  Following
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  Follow
                </>
              )}
            </Button>
            <Button variant="secondary">
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
              {tab.count && (
                <span className="ml-2 py-0.5 px-2 bg-gray-100 text-gray-900 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "products" && <ProductGrid products={products} />}

        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">About {name}</h3>
                <p className="text-gray-700 leading-relaxed">{bio}</p>
              </div>

              {achievements && achievements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Achievements</h3>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                          <Star className="h-4 w-4 text-accent-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {contact?.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{contact.email}</span>
                    </div>
                  )}
                  {contact?.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                  )}
                  {contact?.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a
                        href={contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline"
                      >
                        {contact.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Member Since</h3>
                <p className="text-gray-600">{joinedDate}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h3 className="text-lg font-semibold mb-6">Customer Reviews</h3>
            {/* TODO: Implement reviews component */}
            <p className="text-gray-600">Reviews component coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanProfile;
