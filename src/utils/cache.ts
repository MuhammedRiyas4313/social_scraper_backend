import { Search } from "models/search.model";

export const getCachedResult = async (key: string): Promise<any> => {
  return Search.findOne({ key }).lean();
};

export const cacheResult = async (key: string, data: any) => {
  await Search.findOneAndUpdate({ key }, { key, data, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, { upsert: true });
};
