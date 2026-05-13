import { NextRequest, NextResponse } from 'next/server';
import { getAdsByPosition } from '@/lib/ads';

// Rate limiting: store IP -> request count + timestamp
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_REQUESTS = 10; // 10 requests
const RATE_LIMIT_WINDOW = 60000; // per minute

function getRateLimitKey(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : 
             request.headers.get('x-real-ip') || 
             'unknown';
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(key);

  if (!limit) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  // Reset if window expired
  if (now > limit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  // Increment count
  limit.count++;
  return limit.count <= RATE_LIMIT_REQUESTS;
}

/**
 * GET /api/ads
 * Fetch advertisements for a specific position and category
 * 
 * Query params:
 * - position: 'sidebar' | 'featured' | 'inline' (required)
 * - category: string (optional)
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many requests. Maximum 10 requests per minute.' },
        { status: 429 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position') as 'sidebar' | 'featured' | 'inline' | null;
    const category = searchParams.get('category') || undefined;

    // Validate position
    if (!position || !['sidebar', 'featured', 'inline'].includes(position)) {
      return NextResponse.json(
        { error: 'Invalid position. Must be one of: sidebar, featured, inline' },
        { status: 400 }
      );
    }

    // Fetch ads
    const ads = await getAdsByPosition(position, category);

    // Cache for 1 hour on CDN
    const response = NextResponse.json({ ads, count: ads.length });
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return response;
  } catch (error) {
    console.error('Error in /api/ads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ads/click
 * Track ad clicks for analytics
 * 
 * Body:
 * - adId: number (required)
 * - position: string (required)
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting for click tracking
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { adId, position } = body;

    if (!adId || !position) {
      return NextResponse.json(
        { error: 'Missing required fields: adId, position' },
        { status: 400 }
      );
    }

    // Log click event (in production, save to database)
    console.log(`[AD CLICK] ID: ${adId}, Position: ${position}, IP: ${getRateLimitKey(request)}, Time: ${new Date().toISOString()}`);

    return NextResponse.json(
      { success: true, message: 'Click tracked' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error tracking ad click:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
