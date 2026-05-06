interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getCachedData(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

export function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearCache() {
  cache.clear();
}