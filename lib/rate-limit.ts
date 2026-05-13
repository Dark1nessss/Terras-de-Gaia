/**
 * Rate Limiting Implementation
 * Uses sliding window algorithm with in-memory storage
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  timestamps: number[]; // For sliding window
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const LIMITS = {
  api_public: { requests: 10, window: 60000 }, // 10 req/min for public API
  api_auth: { requests: 100, window: 60000 }, // 100 req/min for authenticated
  wordpress: { requests: 50, window: 60000 }, // 50 req/min for WordPress calls
};

export type LimitType = keyof typeof LIMITS;

function getClientKey(ip: string, type: LimitType): string {
  return `${type}:${ip}`;
}

export function isRateLimited(ip: string, type: LimitType = 'api_public'): boolean {
  const key = getClientKey(ip, type);
  const limit = LIMITS[type];
  const now = Date.now();

  const entry = rateLimitMap.get(key);

  // Initialize or reset if window expired
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + limit.window,
      timestamps: [now],
    });
    return false;
  }

  // Remove old timestamps outside the window
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < limit.window);

  // Check if limit exceeded
  if (entry.timestamps.length >= limit.requests) {
    return true;
  }

  // Add new timestamp
  entry.timestamps.push(now);
  entry.count++;

  return false;
}

export function getRateLimitInfo(ip: string, type: LimitType = 'api_public') {
  const key = getClientKey(ip, type);
  const entry = rateLimitMap.get(key);
  const limit = LIMITS[type];

  if (!entry) {
    return {
      remaining: limit.requests,
      limit: limit.requests,
      resetTime: Date.now() + limit.window,
    };
  }

  return {
    remaining: Math.max(0, limit.requests - entry.timestamps.length),
    limit: limit.requests,
    resetTime: entry.resetTime,
  };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor
    ? forwardedFor.split(',')[0].trim()
    : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

// Cleanup old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 300000); // 5 minutes
