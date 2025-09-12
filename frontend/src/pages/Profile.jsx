import React, { useState } from "react";
import {
  User,
  Settings,
  Heart,
  ShoppingBag,
  Bell,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAPI } from "../hooks/useAPI";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ProductGrid from "../components/product/ProductGrid";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();

  const { data: favorites, loading: favoritesLoading } =
    useAPI("/users/favorites");
  const { data: orders, loading: ordersLoading } = useAPI("/users/orders");
  const { data: profile, loading: profileLoading } = useAPI("/users/profile");

  const tabs = [
    { id: "overview", name: "Overview", icon: User },
    { id: "orders", name: "Orders", icon: ShoppingBag },
    { id: "favorites", name: "Favorites", icon: Heart },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          Please log in to view your profile.
        </p>
        <Button>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg p-8 mb-8">
        <div className="flex items-center space-x-6">
          <img
            src={user.avatar || "/api/placeholder/100/100"}
            alt={user.name}
            className="w-20 h-20 rounded-full border-4 border-white/20"
          />
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-white/80">{user.email}</p>
            <p className="text-white/60 text-sm">
              Member since {new Date(user.joinedAt).getFullYear()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <div className="text-center">
                    <ShoppingBag className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {orders?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                </Card>

                <Card>
                  <div className="text-center">
                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {favorites?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Favorites</div>
                  </div>
                </Card>

                <Card>
                  <div className="text-center">
                    <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      ${profile?.totalSpent || "0"}
                    </div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                {ordersLoading ? (
                  <LoadingSpinner />
                ) : orders?.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">Order #{order.id}</h4>
                          <p className="text-sm text-gray-600">
                            {order.items} items • {order.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${order.total}</div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No orders yet</p>
                )}
              </Card>
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4">
                  Profile Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Location
                    </label>
                    <p className="text-gray-900">
                      {profile?.location || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Phone
                    </label>
                    <p className="text-gray-900">
                      {profile?.phone || "Not specified"}
                    </p>
                  </div>
                </div>
                <Button variant="secondary" className="w-full mt-4">
                  Edit Profile
                </Button>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Notifications</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Alerts</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Marketing Updates</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <Card>
            <h3 className="text-lg font-semibold mb-6">Order History</h3>
            {ordersLoading ? (
              <LoadingSpinner />
            ) : orders?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.items} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button size="sm" variant="ghost">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </Card>
        )}

        {activeTab === "favorites" && (
          <div>
            <h3 className="text-lg font-semibold mb-6">Your Favorites</h3>
            {favoritesLoading ? (
              <LoadingSpinner />
            ) : favorites?.length > 0 ? (
              <ProductGrid products={favorites} />
            ) : (
              <Card>
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No favorites yet</p>
                  <Button className="mt-4">Browse Products</Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <Button variant="secondary">Change Password</Button>
                <Button variant="secondary">Update Email</Button>
                <Button variant="secondary">Privacy Settings</Button>
                <Button variant="danger" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Order Updates</h4>
                    <p className="text-sm text-gray-600">
                      Get notified about your order status
                    </p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Products</h4>
                    <p className="text-sm text-gray-600">
                      Notifications about new products from followed artisans
                    </p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Promotions</h4>
                    <p className="text-sm text-gray-600">
                      Special offers and promotions
                    </p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <Button variant="danger">Delete Account</Button>
                <p className="text-sm text-gray-600">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
