import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const apiEndpoints = {
  // Auth endpoints
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    validate: "/auth/validate",
  },

  // User endpoints
  users: {
    profile: "/users/profile",
    update: "/users/update",
  },

  // Artisan endpoints
  artisans: {
    list: "/artisans",
    detail: (id) => `/artisans/${id}`,
    create: "/artisans",
    update: (id) => `/artisans/${id}`,
    search: "/artisans/search",
  },

  // Product endpoints
  products: {
    list: "/products",
    detail: (id) => `/products/${id}`,
    create: "/products",
    update: (id) => `/products/${id}`,
    search: "/products/search",
    byArtisan: (artisanId) => `/artisans/${artisanId}/products`,
  },

  // AI endpoints
  ai: {
    recommendations: "/ai/recommendations",
    search: "/ai/search",
    chat: "/ai/chat",
  },
};

export default api;
