// frontend/src/services/productService.js
import api, { apiEndpoints } from "./api";

export const productService = {
  async createProduct(artisanId, productData) {
    try {
      // Note: Backend endpoint expects artisanId in path but controller shows it should be in body or path
      // Adjusting based on the controller structure
      const response = await api.post(
        `/v1/products/artisan/${artisanId}`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Create product error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create product"
      );
    }
  },

  async getProducts(params = {}) {
    try {
      const response = await api.get(apiEndpoints.products.list, { params });
      return response.data;
    } catch (error) {
      console.error("Get products error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(apiEndpoints.products.detail(id));
      return response.data;
    } catch (error) {
      console.error("Get product error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  },

  async getProductsByArtisan(artisanId, params = {}) {
    try {
      const response = await api.get(
        apiEndpoints.products.byArtisan(artisanId),
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Get artisan products error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch artisan products"
      );
    }
  },

  async searchProducts(filters = {}) {
    try {
      const response = await api.get(apiEndpoints.products.search, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Search products error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to search products"
      );
    }
  },

  async updateProduct(id, data) {
    try {
      const response = await api.put(apiEndpoints.products.update(id), data);
      return response.data;
    } catch (error) {
      console.error("Update product error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update product"
      );
    }
  },

  async deleteProduct(id) {
    try {
      const response = await api.delete(apiEndpoints.products.detail(id));
      return response.data;
    } catch (error) {
      console.error("Delete product error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  },
};
