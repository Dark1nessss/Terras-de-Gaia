import { getWordPressAuthHeaders } from './auth';
import { getOrSetCached, createCacheKey, deleteCached } from './memory-cache';
import { revistaLogger } from './logger';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL;

/** ACF "File" field returns a URL string or a full attachment object depending on field settings */
type AcfFileField = string | { url: string; filename?: string; mime_type?: string; [key: string]: unknown };

type WpMediaSize = { source_url: string; width?: number; height?: number };
type WpAttachment = {
  id: number;
  source_url: string;
  mime_type: string;
  media_details?: { sizes?: { large?: WpMediaSize; medium?: WpMediaSize; full?: WpMediaSize; thumbnail?: WpMediaSize } };
};

export interface Revista {
  id: number;
  title: { rendered: string };
  slug: string;
  excerpt?: { rendered: string };
  featured_media: number;
  featured_media_url?: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    /** WordPress wraps each link's result-set in an array, so this is Array<Array<WpAttachment>> */
    'wp:attachment'?: Array<WpAttachment[] | WpAttachment>;
  };
  acf?: {
    url_jornal?: AcfFileField; // PDF — ACF File field (string URL or attachment object)
    data_publicacao?: string;  // Publication date
  };
}

/** Normalise ACF File field to a plain URL string */
export function extractPdfUrl(value: AcfFileField | undefined | null): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value || null;
  if (typeof value === 'object' && typeof value.url === 'string') return value.url || null;
  return null;
}

/** Return the first PDF media attachment embedded in a revista (_embed response) */
function getPdfAttachment(revista: Revista): WpAttachment | null {
  const raw = revista._embedded?.['wp:attachment'];
  if (!raw?.length) return null;
  // WordPress nests each link's result-set: [[att1, att2], ...]
  const flat: WpAttachment[] = raw.flatMap(item => Array.isArray(item) ? item : [item as WpAttachment]);
  return flat.find(a => a.mime_type === 'application/pdf') ?? null;
}

/**
 * Get the PDF URL for a revista.
 * Priority: ACF url_jornal → embedded wp:attachment PDF
 */
export function getPdfUrlFromRevista(revista: Revista): string | null {
  const acfUrl = extractPdfUrl(revista.acf?.url_jornal);
  if (acfUrl) return acfUrl;
  return getPdfAttachment(revista)?.source_url ?? null;
}

/**
 * WordPress generates a JPEG preview of the first PDF page when Imagick is
 * available: `original-name-pdf.jpg` in the same uploads directory.
 */
async function resolvePdfCoverUrl(pdfUrl: string): Promise<string | null> {
  try {
    const parsed = new URL(pdfUrl);
    if (!parsed.pathname.toLowerCase().endsWith('.pdf')) return null;
    const jpgUrl = `${parsed.origin}${parsed.pathname.replace(/\.pdf$/i, '-pdf.jpg')}`;
    const check = await fetch(jpgUrl, { method: 'HEAD' });
    return check.ok ? jpgUrl : null;
  } catch {
    return null;
  }
}

/**
 * Priority for cover image:
 * 1. Embedded WordPress featured image (manually curated)
 * 2. WordPress-generated PDF thumbnail from embedded attachment (large or medium size)
 * 3. WordPress-generated PDF thumbnail derived from PDF URL via HEAD check
 * 4. Empty string → component shows placeholder
 */
async function resolveRevistaImage(revista: Revista): Promise<string> {
  const embedded = revista._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  if (embedded) return embedded;

  // Use pre-generated PDF cover thumbnail from wp:attachment if embedded
  const pdfAttachment = getPdfAttachment(revista);
  if (pdfAttachment) {
    const sizes = pdfAttachment.media_details?.sizes;
    const coverUrl = sizes?.large?.source_url ?? sizes?.medium?.source_url ?? sizes?.full?.source_url;
    if (coverUrl) return coverUrl;
  }

  // Fallback: derive cover from ACF PDF URL via WordPress naming convention
  const pdfUrl = getPdfUrlFromRevista(revista);
  if (pdfUrl) {
    const pdfCover = await resolvePdfCoverUrl(pdfUrl);
    if (pdfCover) return pdfCover;
  }

  return '';
}

/**
 * Get all revistas
 * Cached 1 hour, memory cache 30 seconds
 */
export async function getRevistas(): Promise<Revista[]> {
  const cacheKey = createCacheKey('wp-revistas');

  return getOrSetCached(cacheKey, async () => {
    try {
      const res = await fetch(`${API_URL}/newspapper?_embed&per_page=100`, {
        headers: getWordPressAuthHeaders(),
        cache: 'no-store',
      });

      if (!res.ok) {
        revistaLogger.error('Failed to fetch revistas:', res.statusText);
        return [];
      }

      const revistas = await res.json();

      revistaLogger.info(`[getRevistas] fetched ${revistas.length} entries`);

      // Enhance with cover image: featured media → PDF attachment thumbnail → empty
      return Promise.all(
        revistas.map(async (revista: Revista) => ({
          ...revista,
          featured_media_url: await resolveRevistaImage(revista),
        }))
      );
    } catch (error) {
      revistaLogger.error('Error fetching revistas:', error);
      return [];
    }
  }, 30000); // Memory cache: 30 seconds
}

/**
 * Get single revista by slug
 */
export async function getRevistaBySlug(slug: string): Promise<Revista | null> {
  const cacheKey = createCacheKey('wp-revista', { slug });

  return getOrSetCached(cacheKey, async () => {
    try {
      const res = await fetch(`${API_URL}/newspapper?slug=${slug}&_embed`, {
        headers: getWordPressAuthHeaders(),
        cache: 'no-store',
      });

      if (!res.ok) {
        revistaLogger.error('Failed to fetch revista:', res.statusText);
        return null;
      }

      const revistas = await res.json();
      if (revistas.length === 0) return null;

      const revista = revistas[0];

      return {
        ...revista,
        featured_media_url: await resolveRevistaImage(revista),
      };
    } catch (error) {
      revistaLogger.error('Error fetching revista by slug:', error);
      return null;
    }
  }, 30000); // Memory cache: 30 seconds
}

/** Bust both memory-cache entries so the next request fetches fresh data from WordPress */
export function invalidateRevistaCache(slug?: string): void {
  deleteCached(createCacheKey('wp-revistas'));
  if (slug) deleteCached(createCacheKey('wp-revista', { slug }));
}
