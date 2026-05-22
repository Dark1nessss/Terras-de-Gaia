import { getWordPressAuthHeaders } from './auth';
import { adsLogger } from './logger';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL || 'http://localhost:8000/wp-json/wp/v2';

export type AdPosition = 'sidebar' | 'featured' | 'inline' | 'footer' | 'midroll' ;
export type MediaType = 'image' | 'gif' | 'muted_video' | 'unmuted_video';

export interface Advertisement {
  id: number;
  title: { rendered: string };
  featured_media: number;
  featured_media_url?: string;
  acf: {
    posicao_anuncio: AdPosition;
    tipo_de_midia: MediaType;
    data_inicio: string;
    data_fim?: string;
    url_clickthrough?: string;
    video_url?: string; // Direct URL for muted_video / unmuted_video ads
    ativo: boolean;
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
    adsLogger.error('Error fetching media URL:', error);
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
      adsLogger.error('Failed to fetch ads:', res.statusText);
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
          const mediaType = ad.acf?.tipo_de_midia;
          const isVideo = mediaType === 'muted_video' || mediaType === 'unmuted_video';

          if (isVideo) {
            if (ad.acf?.video_url) {
              ad.featured_media_url = ad.acf.video_url;
            }
          } else if (ad.featured_media && !ad.featured_media_url) {
            // Images/GIFs use the WP featured media
            const mediaUrl = await getMediaUrl(ad.featured_media);
            ad.featured_media_url = mediaUrl || undefined;
          }
          return ad;
        })
    );

    return filteredAds;
  } catch (error) {
    adsLogger.error('Error fetching ads:', error);
    return [];
  }
}

/**
 * Get ads by position (e.g., 'sidebar', 'inline', 'featured', 'footer', 'midroll')
 * Filters by position from ACF
 */
export async function getAdsByPosition(position: AdPosition): Promise<Advertisement[]> {
  const allAds = await getAds();
  return allAds.filter((ad) => ad.acf?.posicao_anuncio === position);
}

/**
 * Get mid-roll video ads (unmuted_video type only).
 * These are used as in-video interstitial ads in Gaia Play.
 */
export async function getMidrollAds(): Promise<Advertisement[]> {
  const allAds = await getAds();
  return allAds.filter((ad) => ad.acf?.posicao_anuncio === 'midroll' && ad.acf?.tipo_de_midia === 'unmuted_video');
}


