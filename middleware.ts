import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited, getClientIp, getRateLimitInfo } from '@/lib/rate-limit';

const PROTECTED_API_ROUTES = [
  '/api/posts',
  '/api/category',
  '/api/categories',
  '/api/programs',
  '/api/desporto',
  '/api/ads',
];

const INTERNAL_ROUTES = [
  '/api/internal/',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  // Only protect API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const clientIp = getClientIp(request);

  // Allow internal routes (server-to-server only)
  if (INTERNAL_ROUTES.some((route) => pathname.startsWith(route))) {
    // Verify request comes from server (check for internal header)
    const internalToken = request.headers.get('x-internal-token');
    const expectedToken = process.env.INTERNAL_API_TOKEN;

    if (!expectedToken || internalToken !== expectedToken) {
      console.warn(`[SECURITY] Unauthorized internal request from ${clientIp} to ${pathname}`);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  // Rate limit protected API routes
  if (PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route))) {
    const isLimited = isRateLimited(clientIp, 'api_public');

    if (isLimited) {
      const info = getRateLimitInfo(clientIp, 'api_public');
      console.warn(`[RATE LIMIT] IP ${clientIp} exceeded limit on ${pathname}`);

      return NextResponse.json(
        { error: 'Too many requests. Maximum 10 requests per minute.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(info.resetTime).toISOString(),
            'Retry-After': String(Math.ceil((info.resetTime - Date.now()) / 1000)),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    const info = getRateLimitInfo(clientIp, 'api_public');
    response.headers.set('X-RateLimit-Limit', '10');
    response.headers.set('X-RateLimit-Remaining', String(info.remaining));
    response.headers.set('X-RateLimit-Reset', new Date(info.resetTime).toISOString());

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
