import { AdPosition, getAdsByPosition, getMidrollAds } from '@/lib/ads';
import { NextRequest, NextResponse } from 'next/server';

const requestCounts = new Map<string, { count: number; reset: number }>();

function getRateLimit(ip: string) {
  const now = Date.now();
  const data = requestCounts.get(ip) || { count: 0, reset: now + 60000 };

  if (now > data.reset) {
    data.count = 0;
    data.reset = now + 60000; // Reset every 60 seconds
  }

  requestCounts.set(ip, data);
  return data;
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = getRateLimit(ip);

    // Max 50 requests per minute per IP
    if (rateLimit.count > 50) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    rateLimit.count++;

    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const type = searchParams.get('type');

    // Mid-roll ads: type: unmuted_video + position: midroll (server-side filtering for performance)
    if (type === 'unmuted_video' || position === 'midroll') {
      const ads = await getMidrollAds();
      return NextResponse.json(
        { ads, count: ads.length },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
          },
        }
      );
    }

    if (!position) {
      return NextResponse.json(
        { error: 'Position query parameter is required' },
        { status: 400 }
      );
    }

    // Fetch ads for this position (server-side filtering happens in getAdsByPosition)
    const ads = await getAdsByPosition(position as AdPosition);

    return NextResponse.json(
      { ads, count: ads.length },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('Ads API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ads' },
      { status: 500 }
    );
  }
}
