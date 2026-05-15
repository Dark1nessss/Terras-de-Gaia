/**
 * YouTube API Helper Functions
 * Fetches playlist videos from YouTube Data API v3
 */

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

interface PlaylistResponse {
  videos: YouTubeVideo[];
  nextPageToken?: string;
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Fetch videos from a YouTube playlist with pagination support
 * @param playlistId - The YouTube playlist ID
 * @param pageToken - Optional pagination token for next page
 * @param maxResults - Number of videos to fetch (default: 20, max: 50)
 */
export async function getPlaylistVideos(
  playlistId: string,
  pageToken?: string,
  maxResults: number = 20
): Promise<PlaylistResponse> {
  if (!YOUTUBE_API_KEY) {
    console.error('[YOUTUBE] API Key not configured');
    return { videos: [] };
  }

  try {
    const params = new URLSearchParams({
      key: YOUTUBE_API_KEY,
      playlistId,
      part: 'snippet,contentDetails',
      maxResults: Math.min(maxResults, 50).toString(),
      fields: 'items(snippet(title,description,publishedAt,thumbnails),contentDetails(videoId)),nextPageToken',
    });

    if (pageToken) {
      params.append('pageToken', pageToken);
    }

    const response = await fetch(
      `${BASE_URL}/playlistItems?${params.toString()}`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours - minimize API quota usage
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data: any = await response.json();

    const videos: YouTubeVideo[] = (data.items || []).map((item: any) => {
      const snippet = item.snippet;
      const videoId = item.contentDetails.videoId;

      return {
        id: videoId,
        title: snippet.title,
        description: snippet.description,
        thumbnail: snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url,
        publishedAt: snippet.publishedAt,
      };
    });

    return {
      videos,
      nextPageToken: data.nextPageToken,
    };
  } catch (error) {
    console.error('[YOUTUBE] Playlist fetch error:', error);
    return { videos: [] };
  }
}

/**
 * Get a single video for display
 */
export async function getVideoDetails(videoId: string) {
  if (!YOUTUBE_API_KEY) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      key: YOUTUBE_API_KEY,
      id: videoId,
      part: 'snippet',
      fields: 'items(snippet(title,description,publishedAt))',
    });

    const response = await fetch(
      `${BASE_URL}/videos?${params.toString()}`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) return null;

    const data: any = await response.json();
    const item = data.items?.[0];

    if (!item) return null;

    return {
      id: videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
    };
  } catch (error) {
    console.error('[YOUTUBE] Video details fetch error:', error);
    return null;
  }
}
