import { CONFIG } from "common/config.common";
import { createClient } from "redis";

// Connect to Redis Cloud
export const redis = createClient({
  username: CONFIG.REDIS_USERNAME,
  password: CONFIG.REDIS_PASSWORD,
  socket: {
    host: CONFIG.REDIS_HOST,
    port: CONFIG.REDIS_PORT,
  },
});

export const connectRedis = async () => await redis.connect();

redis.on("error", (err) => console.log("Redis Client Error", err));
redis.on("ready", () => console.log("Redis Connected: "));

/**
 * Get cached result from Redis
 */
export const getCachedResult = async (key: string): Promise<any | null> => {
  const cached = await redis.get(key);
  if (cached) console.log("RETURNED CACHED DATA");
  return cached ? JSON.parse(cached) : null;
};

/**
 * Set data in Redis cache
 */
export const cacheResult = async (key: string, data: any): Promise<void> => {
  await redis.set(key, JSON.stringify(data));
};
