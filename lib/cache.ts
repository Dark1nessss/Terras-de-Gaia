interface CacheEntry {
  data: any;
  timestamp: number;
  error?: boolean;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let lastRoute = '';

export function getCachedData(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  
  // Skip if error cached
  if (entry.error) {
    cache.delete(key);
    return null;
  }
  
  // Skip if expired
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

export function setCachedData(key: string, data: any, isError = false) {
  cache.set(key, { data, timestamp: Date.now(), error: isError });
}

export function invalidateCache(pattern?: string) {
  if (!pattern) {
    cache.clear();
    return;
  }
  
  // Clear cache entries matching pattern
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}

export function setLastRoute(route: string) {
  if (lastRoute !== route) {
    invalidateCache(); // Clear all cache on route change
    lastRoute = route;
  }
}