import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useAPI } from "../hooks/useAPI";
import ArtisanDashboard from "../components/artisan/ArtisanDashboard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Button from "../components/ui/Button"; // ADD THIS LINE

const Dashboard = () => {
  const { user } = useAuth();

  const { data: artisan, loading: artisanLoading } = useAPI("/artisans/me");
  const { data: stats, loading: statsLoading } = useAPI("/artisans/me/stats");
  const { data: products, loading: productsLoading } = useAPI(
    "/artisans/me/products"
  );
  const { data: orders, loading: ordersLoading } = useAPI(
    "/artisans/me/orders"
  );

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          Please log in to view your dashboard.
        </p>
        <Button>Sign In</Button>
      </div>
    );
  }

  if (artisanLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Artisan Profile Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          You need to create an artisan profile to access the dashboard.
        </p>
        <Button>Create Artisan Profile</Button>
      </div>
    );
  }

  return (
    <ArtisanDashboard
      artisan={artisan}
      stats={stats}
      products={products?.products || []}
      orders={orders?.orders || []}
    />
  );
};

export default Dashboard;
