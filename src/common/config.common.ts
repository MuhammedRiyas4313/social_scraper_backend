import * as dotenv from "dotenv";
import { parseEnv, port, z } from "znv";
dotenv.config({ override: true });

dotenv.config({ path: ".env.local", override: true });

export const CONFIG = parseEnv(process.env, {
  // URL: z.string(),
  PORT: port().default(3000),
  MONGOURI: z.string(),
  JWT_ACCESS_TOKEN_SECRET: z.string(),
  NEWS_API_KEY: z.string(),
  TWITTER_API_KEY: z.string(),
  TWITTER_API_KEY_SECRET: z.string(),
  TWITTER_BEARER_TOKEN: z.string(),
  TWITTER_ACCES_TOKEN: z.string(),
  TWITTER_ACCES_TOKEN_SECRET: z.string(),
  REDDIT_CLIENT_ID: z.string(),
  REDDIT_CLIENT_SECRET: z.string(),
  REDIS_HOST: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_PORT: z.number(),
  REDIS_PASSWORD: z.string(),
});
