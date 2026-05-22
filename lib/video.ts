/**
 * lib/video.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all video handling.
 * Used by: post-enricher, post-video-player, live-player, minplayer.
 *
 * Supported sources (in priority order inside extractVideoUrl):
 *  1. ACF fields  (video_url, url_video, featured_video)
 *  2. WordPress post.meta — tagDiv td_post_video + generic scan
 *  3. YouTube URL anywhere in post.content.rendered
 *  4. Native WordPress video attachment (featured media)
 *  5. (future) VPS / direct mp4 — already handled as "direct" type
 */

import { logger } from './logger';

const videoLogger = logger.getSubLogger({ name: 'video' });

export type VideoType = 'youtube' | 'direct' | null;

const DIRECT_VIDEO_EXT = /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i;

// ─── Parsing helpers ──────────────────────────────────────────────────────────

/**
 * Parse a YouTube video ID from any common URL format or a bare 11-char ID.
 * Returns null if not a recognisable YouTube reference.
 */
export function parseYouTubeId(url: string): string | null {
  if (!url) return null;
  // Bare 11-character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  const m = url.match(
    /(?:v=|youtu\.be\/|\/embed\/|\/live\/|\/shorts\/|\/v\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

/** Convert a YouTube URL / ID to a canonical embed URL, or null. */
export function buildYouTubeEmbedUrl(idOrUrl: string): string | null {
  const id = parseYouTubeId(idOrUrl);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/** True when the URL points to a direct video file (mp4, webm, …). */
export function isDirectVideoUrl(url: string): boolean {
  return DIRECT_VIDEO_EXT.test(url);
}

/**
 * Convert any video URL to an embed-ready URL:
 *  • YouTube     → https://www.youtube.com/embed/{id}
 *  • Direct file → returned unchanged
 *  • Unknown     → null
 */
export function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  const yt = buildYouTubeEmbedUrl(url);
  if (yt) return yt;
  if (isDirectVideoUrl(url)) return url;
  return null;
}

/** Classify an already-embed-converted URL so the player knows what to render. */
export function detectVideoType(url: string): VideoType {
  if (url.includes('youtube.com/embed/')) return 'youtube';
  if (DIRECT_VIDEO_EXT.test(url)) return 'direct';
  return null;
}

// ─── WordPress post extraction ────────────────────────────────────────────────

/**
 * Known post-meta field names across common themes / plugins.
 * tagDiv Newspaper stores the URL in `td_post_video`.
 */
const VIDEO_META_KEYS = [
  'td_post_video',       // tagDiv Newspaper theme  ← most common
  '_td_post_video',
  'video_url',           // generic ACF / custom field
  'url_video',
  'featured_video',
  'featured_video_url',
  'post_video_url',
  '_video_url',
];

/** YouTube URL patterns to search for inside rendered post content. */
const YT_CONTENT_PATTERNS: RegExp[] = [
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,   // <iframe src="...embed/ID">
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,             // shortlink
  /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/, // watch URL
  /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,       // old-style embed
];

/**
 * Find the first playable video URL inside a WordPress post object.
 *
 * Returns an embed-ready URL (YouTube embed or direct mp4/webm URL), or null.
 * Works regardless of where the editor placed the video.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractVideoUrl(post: any): string | null {

  // 1. ACF fields ─────────────────────────────────────────────────────────────
  for (const key of ['video_url', 'url_video', 'featured_video']) {
    const raw: unknown = post.acf?.[key];
    if (raw && typeof raw === 'string') {
      const embed = toEmbedUrl(raw);
      if (embed) {
        videoLogger.debug(`[${post.slug}] found via ACF.${key}: ${embed}`);
        return embed;
      }
    }
  }

  // 2. WordPress post.meta ─────────────────────────────────────────────────────
  const meta: unknown = post.meta;
  if (meta && typeof meta === 'object' && meta !== null) {
    const metaObj = meta as Record<string, unknown>;

    // Check known keys first (most specific → least specific)
    for (const key of VIDEO_META_KEYS) {
      const val = metaObj[key];
      if (val && typeof val === 'string' && val.length > 5) {
        const embed = toEmbedUrl(val);
        if (embed) {
          videoLogger.debug(`[${post.slug}] found via meta.${key}: ${embed}`);
          return embed;
        }
      }
    }

    // Fallback: scan any key that contains "video" (catches custom/unknown names)
    for (const [key, val] of Object.entries(metaObj)) {
      if (
        key.toLowerCase().includes('video') &&
        typeof val === 'string' &&
        val.length > 5
      ) {
        const embed = toEmbedUrl(val);
        if (embed) {
          videoLogger.debug(`[${post.slug}] found via meta scan key "${key}": ${embed}`);
          return embed;
        }
      }
    }
  }

  // 3. YouTube URL anywhere in rendered content ────────────────────────────────
  const content: string = post.content?.rendered ?? '';
  for (const pattern of YT_CONTENT_PATTERNS) {
    const m = content.match(pattern);
    if (m) {
      const url = `https://www.youtube.com/embed/${m[1]}`;
      videoLogger.debug(`[${post.slug}] found via content pattern /${pattern.source}/: ${url}`);
      return url;
    }
  }

  // 4. Native WordPress video attachment (featured media) ──────────────────────
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  if (
    featuredMedia?.media_type === 'video' &&
    typeof featuredMedia.source_url === 'string'
  ) {
    videoLogger.debug(`[${post.slug}] found via featured media: ${featuredMedia.source_url}`);
    return featuredMedia.source_url;
  }

  // Nothing found — log a warning for video-format posts
  if (post.format === 'video') {
    const metaKeys = (meta && typeof meta === 'object')
      ? Object.keys(meta as Record<string, unknown>)
      : [];
    videoLogger.warn(
      `[${post.slug}] format=video but no URL found. ` +
      `meta keys: [${metaKeys.join(', ') || 'none'}]. ` +
      `Fix: add to WordPress functions.php → ` +
      `register_post_meta('post','td_post_video',['show_in_rest'=>true,'single'=>true,'type'=>'string']);`
    );
  }

  return null;
}
