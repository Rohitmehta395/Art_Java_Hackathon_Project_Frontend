import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Users, Shield, Truck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import ProductGrid from "../components/product/ProductGrid";
import ArtisanCard from "../components/artisan/ArtisanCard";
import AIRecommendations from "../components/ai/AIRecommendations";
import ChatBot from "../components/ai/ChatBot";
import { useAPI } from "../hooks/useAPI";

const Home = () => {
  const { user } = useAuth();

  // Fetch featured data
  const { data: featuredProducts, loading: productsLoading } =
    useAPI("/products/featured");
  const { data: featuredArtisans, loading: artisansLoading } =
    useAPI("/artisans/featured");

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Discovery",
      description:
        "Find perfect products with our intelligent recommendation system that learns your preferences.",
    },
    {
      icon: Users,
      title: "Global Artisan Network",
      description:
        "Connect with talented craftspeople from around the world and support their unique creations.",
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description:
        "Every product is verified for authenticity and quality by our expert team.",
    },
    {
      icon: Truck,
      title: "Secure Delivery",
      description:
        "Fast, reliable shipping with full tracking and insurance on every order.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Verified Artisans" },
    { number: "50+", label: "Countries" },
    { number: "99%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Discover
                  <span className="text-primary-600"> Unique </span>
                  Handcrafted
                  <span className="text-accent-600"> Treasures</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with skilled artisans worldwide and find one-of-a-kind
                  products tailored to your style with AI-powered
                  recommendations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/marketplace">
                    Explore Marketplace
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/artisans">Meet Artisans</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/api/placeholder/600/500"
                  alt="Artisan crafting"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-8 w-8 text-primary-600" />
                    <div>
                      <div className="font-semibold">AI Powered</div>
                      <div className="text-sm text-gray-600">
                        Smart Discovery
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute top-10 -left-10 w-20 h-20 bg-accent-200 rounded-full opacity-50" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-200 rounded-full opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      {user && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AIRecommendations userId={user.id} />
        </section>
      )}

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose CraftAI Connect?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of artisan marketplace with intelligent
            features designed to connect you with perfect handcrafted products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-600 mt-2">
              Handpicked by our AI and community
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/marketplace">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid
          products={featuredProducts?.products || []}
          loading={productsLoading}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        />
      </section>

      {/* Featured Artisans */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Artisans
              </h2>
              <p className="text-gray-600 mt-2">
                Meet the creators behind amazing products
              </p>
            </div>
            <Button variant="secondary" asChild>
              <Link to="/artisans">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!artisansLoading &&
              featuredArtisans?.artisans
                ?.slice(0, 3)
                .map((artisan) => (
                  <ArtisanCard key={artisan.id} artisan={artisan} />
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who have discovered unique
            treasures through our AI-powered marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Browse Products
            </Button>
            <Button
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Become an Artisan
            </Button>
          </div>
        </div>
      </section>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Home;
