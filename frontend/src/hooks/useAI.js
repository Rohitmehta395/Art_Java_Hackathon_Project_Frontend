import { useState } from "react";
import { aiService } from "../services/aiService";

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRecommendations = async (userId, preferences) => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.getRecommendations(userId, preferences);
      return result;
    } catch (err) {
      setError(err.message);
      return { recommendations: [] };
    } finally {
      setLoading(false);
    }
  };

  const smartSearch = async (query, filters) => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.smartSearch(query, filters);
      return result;
    } catch (err) {
      setError(err.message);
      return { results: [] };
    } finally {
      setLoading(false);
    }
  };

  const chatWithAI = async (message, conversationId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.chatWithAI(message, conversationId);
      return result;
    } catch (err) {
      setError(err.message);
      return {
        response: "Sorry, I could not process your request.",
        error: true,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    getRecommendations,
    smartSearch,
    chatWithAI,
    loading,
    error,
  };
};
