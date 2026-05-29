import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const dynamic = 'force-dynamic';

/**
 * GET /api/youtube-stats?id=VIDEO_ID&type=live|vod
 *
 * type=live → { viewers: number | null }  — concurrentViewers (poll every ~7s)
 * type=vod  → { views: number | null }    — total viewCount   (poll every ~7min)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const videoId = searchParams.get('id');
  const type = searchParams.get('type'); // 'live' or 'vod'

  if (!videoId || (type !== 'live' && type !== 'vod')) {
    return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 });
  }

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YouTube API not configured' }, { status: 503 });
  }

  try {
    const part = type === 'live' ? 'liveStreamingDetails' : 'statistics';
    const fields =
      type === 'live'
        ? 'items(liveStreamingDetails(concurrentViewers))'
        : 'items(statistics(viewCount))';

    const params = new URLSearchParams({ key: YOUTUBE_API_KEY, id: videoId, part, fields });
    const res = await fetch(`${BASE_URL}/videos?${params.toString()}`, { cache: 'no-store' });

    if (!res.ok) {
      return NextResponse.json({ error: 'YouTube API error' }, { status: res.status });
    }

    const data = await res.json();
    const item = data.items?.[0];

    if (type === 'live') {
      const viewers = item?.liveStreamingDetails?.concurrentViewers ?? null;
      return NextResponse.json({ viewers: viewers != null ? Number(viewers) : null });
    }

    const views = item?.statistics?.viewCount ?? null;
    return NextResponse.json({ views: views != null ? Number(views) : null });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
