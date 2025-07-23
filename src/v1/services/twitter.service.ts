import { CONFIG } from "common/config.common";
import { TwitterApi } from "twitter-api-v2";
import { cacheResult, getCachedResult } from "utils/cache";

interface Tweet {
  id: string;
  text: string;
  author: string;
  url: string;
  likes: number;
  retweets: number;
  timestamp: Date;
  platform: "twitter";
}

export const scrapeTwitter = async (
  keyword: string,
  timeframe: string
): Promise<Tweet[]> => {
  const cacheKey = `twitter:${keyword}:${timeframe}`;

  try {
    // Check cache first
    const cached = await getCachedResult(cacheKey);
    if (cached) return cached;

    // Initialize client
    // const client = new TwitterApi(CONFIG.TWITTER_BEARER_TOKEN);
    const client = new TwitterApi({
      appKey: CONFIG.TWITTER_API_KEY,
      appSecret: CONFIG.TWITTER_API_KEY_SECRET,
      accessToken: CONFIG.TWITTER_ACCES_TOKEN,
      accessSecret: CONFIG.TWITTER_ACCES_TOKEN_SECRET,
    });
    
    const readOnlyClient = client.readOnly;

    // Calculate timeframe
    const startDate = new Date();
    startDate.setDate(
      startDate.getDate() -
        (timeframe === "24h" ? 1 : timeframe === "7d" ? 7 : 30)
    );

    // API Request
    const response = await readOnlyClient.v2.search(keyword, {
      max_results: 100,
      start_time: startDate.toISOString(),
      expansions: ["author_id"],
      "tweet.fields": ["created_at", "public_metrics", "text"],
      "user.fields": ["username"],
    });

    // Transform data
    const tweets = response.data.data.map((tweet) => ({
      id: tweet.id,
      text: tweet.text,
      author:
        response.includes?.users?.find((u) => u.id === tweet.author_id)
          ?.username || "unknown",
      url: `https://twitter.com/i/status/${tweet.id}`,
      likes: tweet.public_metrics?.like_count || 0,
      retweets: tweet.public_metrics?.retweet_count || 0,
      timestamp: new Date(tweet.created_at!),
      platform: "twitter" as const,
    }));

    await cacheResult(cacheKey, tweets);
    return tweets;
  } catch (error) {
    console.error("Twitter API error:", error);
    throw new Error(
      `Twitter scrape failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
