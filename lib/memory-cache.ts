/**
 * In-Memory Cache with TTL
 * Used for deduplicating parallel requests and reducing database hits
 * ISR handles long-term caching
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();

/**
 * Get cached value if not expired
 */
export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);

  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Set cache with TTL
 */
export function setCached<T>(key: string, data: T, ttlMs: number = 30000): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Delete specific cache entry
 */
export function deleteCached(key: string): void {
  cache.delete(key);
}

/**
 * Clear all cache (useful for testing or manual refresh)
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get or set cache with async function
 * Prevents thundering herd when multiple requests ask for same data
 */
export async function getOrSetCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMs: number = 30000
): Promise<T> {
  // Check if already cached
  const cached = getCached<T>(key);
  if (cached) return cached;

  // Fetch fresh data
  const data = await fetchFn();

  // Cache it
  setCached(key, data, ttlMs);

  return data;
}

/**
 * Create cache key from query parameters
 */
export function createCacheKey(endpoint: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return `cache:${endpoint}`;
  }

  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');

  return `cache:${endpoint}?${sortedParams}`;
}

// Cleanup expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key);
    }
  }
}, 600000); // 10 minutes
