import { NextRequest, NextResponse } from 'next/server';
import { getPlaylistVideos } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playlistId, pageToken } = body;

    if (!playlistId) {
      return NextResponse.json(
        { error: 'Playlist ID is required' },
        { status: 400 }
      );
    }

    const result = await getPlaylistVideos(playlistId, pageToken, 20);

    return NextResponse.json({
      videos: result.videos,
      nextPageToken: result.nextPageToken,
    });
  } catch (error) {
    console.error('[YOUTUBE API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlist videos' },
      { status: 500 }
    );
  }
}
