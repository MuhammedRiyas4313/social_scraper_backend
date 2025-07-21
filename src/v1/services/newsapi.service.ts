import axios from "axios";
import { CONFIG } from "common/config.common";
import { cacheResult, getCachedResult } from "utils/cache";

/**
 * Scrapes news articles using NewsAPI
 * @param {string} keyword - Search term
 * @param {string} timeframe - '24h', '7d', or '30d'
 * @returns {Promise<Array>} Array of news articles
 */
export const scrapeNews = async (keyword: any, timeframe: any) => {
  try {
    if (!CONFIG.NEWS_API_KEY) {
      throw new Error("NewsAPI key not configured");
    }

    const cacheKey = `twitter:${keyword}:${timeframe}`;

    const cached = await getCachedResult(cacheKey);
    if (cached) return cached?.data;

    const fromDate = getFromDate(timeframe);
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      keyword
    )}&from=${fromDate}&sortBy=popularity&apiKey=${CONFIG.NEWS_API_KEY}`;

    const response = await axios.get(url);

    const data = response.data.articles.map((article: any) => ({
      id: article.url.hashCode(), // Simple hash for ID
      title: article.title,
      content: article.description || article.content,
      author: article.author || article.source.name,
      url: article.url,
      published_at: new Date(article.publishedAt),
      image_url: article.urlToImage,
      platform: "news",
    }));

    await cacheResult(cacheKey, data);
    return data;
  } catch (error: any) {
    console.error("News scrape error:", error.message);
    throw new Error(error.response?.data?.message || "News API failure");
  }
};

// Helper to calculate 'from' date for NewsAPI
function getFromDate(timeframe: any) {
  const date = new Date();
  if (timeframe === "24h") date.setDate(date.getDate() - 1);
  if (timeframe === "7d") date.setDate(date.getDate() - 7);
  if (timeframe === "30d") date.setDate(date.getDate() - 30);
  return date.toISOString().split("T")[0];
}

// Simple string hashing for generating IDs
String.prototype.hashCode = function () {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    hash = (hash << 5) - hash + this.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(16);
};
