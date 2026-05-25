/**
 * lib/bunny.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Bunny.net Stream API client.
 *
 * Environment variables
 * ─────────────────────
 * Server-side only (never exposed to the browser):
 *   BUNNY_LIVESTREAM_LIBRARY_ID     numeric library ID of the live library
 *   BUNNY_LIVESTREAM_API_KEY        per-library API key (private)
 *   BUNNY_LIVESTREAM_VIDEO_ID       UUID of the live stream video in the library
 *                                   (set this once you create a live stream in Bunny)
 *
 *   BUNNY_STREAM_LIBRARY_ID         numeric library ID for programs/VOD
 *   BUNNY_STREAM_API_KEY            per-library API key (private)
 *
 * Client-safe (NEXT_PUBLIC_* — library IDs are not secrets):
 *   NEXT_PUBLIC_BUNNY_LIVESTREAM_LIBRARY_ID
 *   NEXT_PUBLIC_BUNNY_LIVESTREAM_VIDEO_ID    (set when live streaming is configured)
 *   NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID
 *
 * Authentication: every request sends `AccessKey: <api-key>` header.
 * API base:  https://video.bunnycdn.com
 * Embed URL: https://player.mediadelivery.net/embed/{libraryId}/{videoId}
 *
 * NOTE: Bunny livestream is NOT yet configured. The live page falls back to
 * the YouTube/TV-guide approach until BUNNY_LIVESTREAM_VIDEO_ID is set.
 */

const STREAM_API_BASE = 'https://video.bunnycdn.com';
// Legacy player base — use iframe.mediadelivery.net (legacy) or player.mediadelivery.net (new).
// The library is currently set to legacy player in the Bunny dashboard.
const EMBED_BASE = 'https://iframe.mediadelivery.net/embed';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BunnyVideo {
  videoLibraryId: number;
  guid: string;
  title: string;
  dateUploaded: string;
  views: number;
  /**
   * 0 = created   1 = uploaded     2 = processing
   * 3 = transcoding  4 = finished  5 = error  6 = uploadFailed
   */
  status: number;
  framerate: number;
  width: number;
  height: number;
  /** Duration in seconds */
  length: number;
  thumbnailFileName: string;
  collectionId?: string;
}

export interface BunnyVideoList {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  items: BunnyVideo[];
}

// ─── Embed URL helpers ────────────────────────────────────────────────────────

/**
 * Build a Bunny Stream embed URL for a VOD video.
 *
 * Safe to call client-side — falls back to NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID.
 * Pass `libraryId` explicitly when calling from a server context that has the
 * non-public BUNNY_STREAM_LIBRARY_ID available.
 */
export function buildBunnyVodEmbedUrl(
  videoId: string,
  libraryId?: string | number,
): string {
  const libId = String(
    libraryId ?? process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID ?? '',
  );
  return `${EMBED_BASE}/${libId}/${videoId}`;
}

/**
 * Build a Bunny Stream embed URL for the live broadcast.
 *
 * Safe to call client-side — falls back to NEXT_PUBLIC_BUNNY_LIVESTREAM_* vars.
 * Returns null when the live stream video ID is not yet configured.
 */
export function buildBunnyLiveEmbedUrl(
  videoId?: string,
  libraryId?: string | number,
): string | null {
  const libId = String(
    libraryId ?? process.env.NEXT_PUBLIC_BUNNY_LIVESTREAM_LIBRARY_ID ?? '',
  );
  const vidId =
    videoId ?? process.env.NEXT_PUBLIC_BUNNY_LIVESTREAM_VIDEO_ID ?? '';
  if (!libId || !vidId) return null;
  return `${EMBED_BASE}/${libId}/${vidId}`;
}

/**
 * Parse a Bunny Stream URL (either /embed/ or /play/ path) and return
 * its library / video IDs, or null.
 *
 * Accepts:
 *   https://iframe.mediadelivery.net/embed/{libraryId}/{videoId}  (legacy player)
 *   https://player.mediadelivery.net/embed/{libraryId}/{videoId}  (new player)
 *   https://player.mediadelivery.net/play/{libraryId}/{videoId}
 */
export function parseBunnyEmbedUrl(
  url: string,
): { libraryId: string; videoId: string } | null {
  if (!url) return null;
  const m = url.match(
    /(?:iframe|player)\.mediadelivery\.net\/(?:embed|play)\/(\d+)\/([a-f0-9-]{36})/i,
  );
  if (!m) return null;
  return { libraryId: m[1], videoId: m[2] };
}

/**
 * Normalise a Bunny Stream URL to the /embed/ form required by iframes.
 * Converts /play/ URLs to /embed/. Returns null if not a Bunny URL.
 */
export function toBunnyEmbedUrl(url: string): string | null {
  const parsed = parseBunnyEmbedUrl(url);
  if (!parsed) return null;
  return `${EMBED_BASE}/${parsed.libraryId}/${parsed.videoId}`;
}

/**
 * Return true if the URL is a Bunny Stream URL (embed or play).
 */
export function isBunnyEmbedUrl(url: string): boolean {
  return parseBunnyEmbedUrl(url) !== null;
}

/**
 * Build the server-side livestream embed URL using non-public env vars.
 * Returns undefined when BUNNY_LIVESTREAM_VIDEO_ID is not yet configured.
 */
export function buildServerLivestreamEmbedUrl(): string | undefined {
  const libraryId =
    process.env.BUNNY_LIVESTREAM_LIBRARY_ID ??
    process.env.NEXT_PUBLIC_BUNNY_LIVESTREAM_LIBRARY_ID;
  const videoId =
    process.env.BUNNY_LIVESTREAM_VIDEO_ID ??
    process.env.NEXT_PUBLIC_BUNNY_LIVESTREAM_VIDEO_ID;
  if (!libraryId || !videoId) return undefined;
  return `${EMBED_BASE}/${libraryId}/${videoId}`;
}

// ─── Server-side API ──────────────────────────────────────────────────────────

/**
 * List videos from the programs / VOD library.
 *
 * SERVER-SIDE ONLY — requires BUNNY_STREAM_LIBRARY_ID + BUNNY_STREAM_API_KEY.
 */
export async function listBunnyVideos(options?: {
  page?: number;
  itemsPerPage?: number;
  collectionId?: string;
  search?: string;
}): Promise<BunnyVideoList> {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = process.env.BUNNY_STREAM_API_KEY;
  if (!libraryId || !apiKey) {
    throw new Error('[bunny] BUNNY_STREAM_LIBRARY_ID / BUNNY_STREAM_API_KEY not set');
  }

  const params = new URLSearchParams();
  if (options?.page) params.set('page', String(options.page));
  if (options?.itemsPerPage) params.set('itemsPerPage', String(options.itemsPerPage));
  if (options?.collectionId) params.set('collectionId', options.collectionId);
  if (options?.search) params.set('search', options.search);

  const res = await fetch(
    `${STREAM_API_BASE}/library/${libraryId}/videos?${params}`,
    {
      headers: { AccessKey: apiKey },
      // Cache in Next.js data cache for 1 hour — Bunny library lists change infrequently
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) throw new Error(`[bunny] List videos failed: ${res.status}`);
  return res.json() as Promise<BunnyVideoList>;
}

/**
 * Get a single video from the programs / VOD library.
 *
 * SERVER-SIDE ONLY — requires BUNNY_STREAM_LIBRARY_ID + BUNNY_STREAM_API_KEY.
 */
export async function getBunnyVideo(videoId: string): Promise<BunnyVideo> {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = process.env.BUNNY_STREAM_API_KEY;
  if (!libraryId || !apiKey) {
    throw new Error('[bunny] BUNNY_STREAM_LIBRARY_ID / BUNNY_STREAM_API_KEY not set');
  }

  const res = await fetch(
    `${STREAM_API_BASE}/library/${libraryId}/videos/${videoId}`,
    {
      headers: { AccessKey: apiKey },
      // Cache per-video metadata for 1 hour — titles/status rarely change
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) throw new Error(`[bunny] Get video failed: ${res.status}`);
  return res.json() as Promise<BunnyVideo>;
}

/**
 * Get the thumbnail URL for a Bunny video.
 *
 * Uses BUNNY_CDN_HOSTNAME (or NEXT_PUBLIC_BUNNY_CDN_HOSTNAME) from your
 * Bunny library → Pull Zone → Hostname, e.g. "vz-xxxxxxx.b-cdn.net".
 * Falls back to the mediadelivery.net path if the env var is not set.
 */
export function getBunnyThumbnailUrl(
  videoId: string,
  thumbnailFileName = 'thumbnail.jpg',
): string {
  const cdnHost =
    process.env.BUNNY_CDN_HOSTNAME ??
    process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME;
  if (cdnHost) {
    return `https://${cdnHost}/${videoId}/${thumbnailFileName}`;
  }
  // Fallback: mediadelivery.net thumbnail endpoint
  const libId =
    process.env.BUNNY_STREAM_LIBRARY_ID ??
    process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID ?? '';
  return `https://vz-${libId}.b-cdn.net/${videoId}/${thumbnailFileName}`;
}
