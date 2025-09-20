import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(
      `API Response: ${response.status} ${response.config.url}`,
      response.data
    );
    return response;
  },
  async (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      // Try to refresh token first
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const response = await api.post(apiEndpoints.auth.refreshToken, {
            token: refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          // Retry original request
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const apiEndpoints = {
  // Auth endpoints - Updated to match backend
  auth: {
    login: "/v1/auth/signIn",
    register: "/v1/auth/signUp",
    refreshToken: "/v1/auth/refreshToken",
    validate: "/v1/auth/validate",
  },

  // OTT endpoints
  ott: {
    send: "/v1/ott/sent",
    login: "/v1/ott/login",
  },

  // Artisan endpoints - Updated to match backend
  artisans: {
    list: "/artisans",
    detail: (id) => `/artisans/${id}`,
    create: "/artisans",
    update: (id) => `/artisans/${id}`,
    search: "/artisans",
    enhanceProfile: (id) => `/artisans/${id}/enhance-profile`,
  },

  // Product endpoints - Updated to match backend
  products: {
    list: "/v1/products",
    detail: (id) => `/v1/products/${id}`,
    create: "/v1/products",
    update: (id) => `/v1/products/${id}`,
    search: "/v1/products",
    byArtisan: (artisanId) => `/v1/products/artisan/${artisanId}`,
  },

  // AI endpoints - Updated to match backend
  ai: {
    generateStory: (artisanId) => `/v1/AI/artisans/${artisanId}/stories`,
    getStories: (artisanId) => `/v1/AI/artisans/${artisanId}/stories`,
    recommendations: "/v1/ai/recommendations",
    search: "/v1/ai/search",
    chat: "/v1/ai/chat",
  },
};

export default api;
