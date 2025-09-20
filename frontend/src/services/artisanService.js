// frontend/src/services/artisanService.js
import api, { apiEndpoints } from "./api";

export const artisanService = {
  async createArtisan(artisanData) {
    try {
      const response = await api.post(
        apiEndpoints.artisans.create,
        artisanData
      );
      return response.data;
    } catch (error) {
      console.error("Create artisan error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create artisan"
      );
    }
  },

  async getArtisans(params = {}) {
    try {
      const response = await api.get(apiEndpoints.artisans.list, { params });
      return response.data;
    } catch (error) {
      console.error("Get artisans error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch artisans"
      );
    }
  },

  async getArtisanById(id) {
    try {
      const response = await api.get(apiEndpoints.artisans.detail(id));
      return response.data;
    } catch (error) {
      console.error("Get artisan error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch artisan"
      );
    }
  },

  async searchArtisans(query, filters = {}) {
    try {
      const params = {
        query,
        ...filters,
      };
      const response = await api.get(apiEndpoints.artisans.search, { params });
      return response.data;
    } catch (error) {
      console.error("Search artisans error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to search artisans"
      );
    }
  },

  async enhanceArtisanProfile(id) {
    try {
      const response = await api.post(apiEndpoints.artisans.enhanceProfile(id));
      return response.data;
    } catch (error) {
      console.error("Enhance profile error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to enhance profile"
      );
    }
  },

  async updateArtisan(id, data) {
    try {
      const response = await api.put(apiEndpoints.artisans.update(id), data);
      return response.data;
    } catch (error) {
      console.error("Update artisan error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update artisan"
      );
    }
  },
};
