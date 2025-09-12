export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VALIDATE: "/auth/validate",
  },
  USERS: {
    PROFILE: "/users/profile",
    FAVORITES: "/users/favorites",
    ORDERS: "/users/orders",
  },
  PRODUCTS: {
    LIST: "/products",
    SEARCH: "/products/search",
    FEATURED: "/products/featured",
    CATEGORIES: "/products/categories",
  },
  ARTISANS: {
    LIST: "/artisans",
    SEARCH: "/artisans/search",
    FEATURED: "/artisans/featured",
  },
  AI: {
    RECOMMENDATIONS: "/ai/recommendations",
    SEARCH: "/ai/search",
    CHAT: "/ai/chat",
  },
};

export const PRODUCT_CATEGORIES = [
  "Jewelry",
  "Home Decor",
  "Art & Collectibles",
  "Clothing",
  "Accessories",
  "Furniture",
  "Pottery & Ceramics",
  "Textiles",
  "Woodwork",
  "Metalwork",
  "Glassware",
  "Leather Goods",
];

export const MATERIALS = [
  "Wood",
  "Metal",
  "Ceramic",
  "Textile",
  "Leather",
  "Glass",
  "Stone",
  "Paper",
  "Plastic",
  "Mixed Media",
  "Organic",
  "Recycled",
];

export const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: null },
];

export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "Name A-Z" },
];

export const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

export const USER_ROLES = {
  CUSTOMER: "customer",
  ARTISAN: "artisan",
  ADMIN: "admin",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_FILES: 10,
};

export const COLORS = {
  PRIMARY: "#0ea5e9",
  ACCENT: "#eab308",
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
  INFO: "#3b82f6",
};
