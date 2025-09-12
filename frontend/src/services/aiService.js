import api, { apiEndpoints } from "./api";

export const aiService = {
  async getRecommendations(userId, preferences = {}) {
    try {
      const response = await api.post(apiEndpoints.ai.recommendations, {
        userId,
        preferences,
      });
      return response.data;
    } catch (error) {
      console.error("AI recommendations error:", error);
      return { recommendations: [] };
    }
  },

  async smartSearch(query, filters = {}) {
    try {
      const response = await api.post(apiEndpoints.ai.search, {
        query,
        filters,
      });
      return response.data;
    } catch (error) {
      console.error("AI search error:", error);
      return { results: [] };
    }
  },

  async chatWithAI(message, conversationId = null) {
    try {
      const response = await api.post(apiEndpoints.ai.chat, {
        message,
        conversationId,
      });
      return response.data;
    } catch (error) {
      console.error("AI chat error:", error);
      return {
        response: "Sorry, I could not process your request.",
        error: true,
      };
    }
  },
};
