import api, { apiEndpoints } from "./api";

export const authService = {
  async login(credentials) {
    try {
      console.log("Attempting login with:", {
        username: credentials.email || credentials.username,
      });

      const response = await api.post(apiEndpoints.auth.login, {
        username: credentials.email || credentials.username,
        password: credentials.password,
      });

      console.log("Login response:", response.data);

      const { accessToken, refreshToken } = response.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  async register(userData) {
    try {
      console.log("Attempting registration with:", userData);

      const response = await api.post(apiEndpoints.auth.register, userData);

      console.log("Registration response:", response.data);

      const { accessToken, refreshToken } = response.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post(apiEndpoints.auth.refreshToken, {
        token: refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      return response.data;
    } catch (error) {
      console.error("Token refresh error:", error);
      this.logout();
      throw error;
    }
  },

  async logout() {
    try {
      // No backend logout endpoint defined, so just clean local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  async validateToken() {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return false;
      }

      // For now, just check if token exists
      // You can implement a backend validation endpoint later
      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  },

  // OTT (One Time Token) / Magic Link methods
  async sendMagicLink(username) {
    try {
      const response = await api.post(apiEndpoints.ott.send, null, {
        params: { username },
      });
      return response.data;
    } catch (error) {
      console.error("Magic link send error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to send magic link"
      );
    }
  },

  async loginWithMagicLink(token) {
    try {
      const response = await api.post(apiEndpoints.ott.login, null, {
        params: { token },
      });

      const { accessToken, refreshToken } = response.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      return response.data;
    } catch (error) {
      console.error("Magic link login error:", error);
      throw new Error(
        error.response?.data?.message || "Magic link login failed"
      );
    }
  },

  // Helper methods
  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  },

  getToken() {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  },
};
