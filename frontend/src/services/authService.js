import api, { apiEndpoints } from "./api";

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post(apiEndpoints.auth.login, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  async register(userData) {
    try {
      const response = await api.post(apiEndpoints.auth.register, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  async logout() {
    try {
      await api.post(apiEndpoints.auth.logout);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
    }
  },

  async validateToken(token) {
    try {
      const response = await api.get(apiEndpoints.auth.validate, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error("Token validation failed");
    }
  },
};
