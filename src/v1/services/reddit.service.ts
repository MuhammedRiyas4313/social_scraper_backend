import axios from "axios";
import { CONFIG } from "common/config.common";
import { cacheResult, getCachedResult } from "utils/cache";

export const scrapeReddit = async (keyword: string, timeframe: string) => {
  const cacheKey = `reddit:${keyword}:${timeframe}`;
  
  try {
    // Check cache first
    const cached = await getCachedResult(cacheKey);
    if (cached) return cached;

    // 1. First get an access token
    const authResponse = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      new URLSearchParams({
        grant_type: 'client_credentials'
      }),
      {
        auth: {
          username: CONFIG.REDDIT_CLIENT_ID,
          password: CONFIG.REDDIT_CLIENT_SECRET
        },
        headers: {
          'User-Agent': 'web app/1.0 by riyas'
        }
      }
    );

    const accessToken = authResponse.data.access_token;

    // 2. Now search Reddit
    const { after } = getTimeframeParams(timeframe);
    const response = await axios.get(
      `https://oauth.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&t=${after}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'web app/1.0 by riyas'
        }
      }
    );

    const posts = response.data.data.children.map((child: any) => {
      const post = child.data;
      return {
        id: post.id,
        title: post.title,
        content: post.selftext,
        author: post.author,
        url: `https://reddit.com${post.permalink}`,
        upvotes: post.score,
        comments: post.num_comments,
        created_at: new Date(post.created_utc * 1000),
        platform: "reddit",
      };
    });

    await cacheResult(cacheKey, posts);
    return posts;
  } catch (error: any) {
    console.error("Reddit scrape error:", error.response?.data || error.message);
    throw new Error("Failed to fetch Reddit data");
  }
};

function getTimeframeParams(timeframe: string) {
  return {
    after: timeframe === "24h" ? "day" : timeframe === "7d" ? "week" : "month"
  };
}