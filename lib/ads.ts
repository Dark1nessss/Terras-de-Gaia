import { getWordPressAuthHeaders } from './auth';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL || 'http://localhost:8000/wp-json/wp/v2';

export type AdPosition = 'sidebar' | 'featured' | 'inline' | 'footer';
export type MediaType = 'image' | 'gif' | 'muted_video';

export interface Advertisement {
  id: number;
  title: { rendered: string };
  featured_media: number;
  featured_media_url?: string;
  acf: {
    posicao_anuncio: AdPosition; // Position (sidebar, inline, featured, footer)
    tipo_de_midia: MediaType; // Media type (required)
    data_inicio: string; // Start date (required)
    data_fim?: string; // End date (optional)
    url_clickthrough?: string; // Click destination
    ativo: boolean; // Active status (required)
  };
}

/**
 * Fetch featured media URL from WordPress
 */
async function getMediaUrl(mediaId: number): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/media/${mediaId}`, {
      headers: getWordPressAuthHeaders(),
      next: { revalidate: 3600 }, // Media URLs don't change often
    });

    if (!res.ok) return null;
    const media = await res.json();
    return media.source_url || null;
  } catch (error) {
    console.error('Error fetching media URL:', error);
    return null;
  }
}

/**
 * Get all active advertisements
 * Cached for 24 hours with ISR revalidation
 */
export async function getAds(): Promise<Advertisement[]> {
  try {
    const res = await fetch(`${API_URL}/advertisement?per_page=100&_embed`, {
      headers: getWordPressAuthHeaders(),
      next: { revalidate: 300 }, // Cache 5 minutes
    });

    if (!res.ok) {
      console.error('Failed to fetch ads:', res.statusText);
      return [];
    }

    const ads = await res.json();
    const now = new Date();

    // Filter: active + within date range + fetch media URLs
    const filteredAds = await Promise.all(
      ads
        .filter((ad: Advertisement) => {
          if (!ad.acf?.ativo) return false;

          const startDate = ad.acf.data_inicio ? new Date(ad.acf.data_inicio) : null;
          const endDate = ad.acf.data_fim ? new Date(ad.acf.data_fim) : null;

          if (startDate && now < startDate) return false;
          if (endDate && now > endDate) return false;

          return true;
        })
        .map(async (ad: Advertisement) => {
          // Fetch featured media URL if featured_media ID exists
          if (ad.featured_media && !ad.featured_media_url) {
            const mediaUrl = await getMediaUrl(ad.featured_media);
            ad.featured_media_url = mediaUrl || undefined;
          }
          return ad;
        })
    );

    return filteredAds;
  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
}

/**
 * Get ads by position (e.g., 'sidebar', 'inline', 'featured', 'footer')
 * Filters by position from ACF
 */
export async function getAdsByPosition(position: AdPosition): Promise<Advertisement[]> {
  const allAds = await getAds();
  return allAds.filter((ad) => ad.acf?.posicao_anuncio === position);
}

/**
 * Get single ad by ID
 */
export async function getAdById(id: number): Promise<Advertisement | null> {
  try {
    const res = await fetch(`${API_URL}/advertisement/${id}`, {
      headers: getWordPressAuthHeaders(),
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching ad:', error);
    return null;
  }
}

/**
 * Get ads grouped by position for rotating galleries
 */
export async function getAdsByPositionGrouped(): Promise<Record<string, Advertisement[]>> {
  const allAds = await getAds();
  return allAds.reduce(
    (acc, ad) => {
      const pos = ad.acf?.posicao_anuncio || 'unknown';
      if (!acc[pos]) acc[pos] = [];
      acc[pos].push(ad);
      return acc;
    },
    {} as Record<string, Advertisement[]>
  );
}
