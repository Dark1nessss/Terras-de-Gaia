import { enrichPosts } from "./post-enricher";

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL;
const WP_USER = process.env.WP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

function getAuthHeaders() {
  if (WP_USER && WP_APP_PASSWORD) {
    const credentials = `${WP_USER}:${WP_APP_PASSWORD}`;
    const base64Credentials = Buffer.from(credentials).toString('base64');
    return {
      'Authorization': `Basic ${base64Credentials}`,
    };
  }
  return {};
}

export interface Advertisement {
  id: number;
  title: string;
  rendered?: string;
  slug: string;
  featured_image_url?: string;
  acf?: {
    position?: 'sidebar' | 'featured' | 'inline';
    category?: string;
    start_date?: string;
    end_date?: string;
    clickthrough_url?: string;
  };
  _embedded?: {
    'wp:featuredmedia': Array<{
      source_url: string;
      alt_text?: string;
      media_details?: {
        width: number;
        height: number;
      };
    }>;
  };
}

/**
 * Fetch all active advertisements
 * Filters by date range if available in ACF
 */
export async function getAds(position?: string) {
  try {
    const query = new URLSearchParams({
      per_page: '100',
      _embed: 'true',
    });

    if (position) {
      // If your WordPress has ACF filtering capability
      query.append('meta_query[0][key]', 'position');
      query.append('meta_query[0][value]', position);
    }

    console.log(`Fetching advertisements from: ${API_URL}/advertisement?${query}`);

    const res = await fetch(`${API_URL}/advertisement?${query}`, {
      headers: getAuthHeaders(),
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    console.log('getAds Response Status:', res.status);

    if (!res.ok) {
      console.error('Failed to fetch advertisements:', res.statusText);
      return [];
    }

    const ads = await res.json();
    
    // Filter by date range if ACF data available
    const now = new Date();
    const activeAds = ads.filter((ad: Advertisement) => {
      if (!ad.acf) return true;
      
      const startDate = ad.acf.start_date ? new Date(ad.acf.start_date) : null;
      const endDate = ad.acf.end_date ? new Date(ad.acf.end_date) : null;
      
      if (startDate && now < startDate) return false;
      if (endDate && now > endDate) return false;
      
      return true;
    });

    return enrichAds(activeAds);
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    return [];
  }
}

/**
 * Fetch a single advertisement by slug
 */
export async function getAdBySlug(slug: string): Promise<Advertisement | null> {
  try {
    const res = await fetch(`${API_URL}/advertisement?slug=${slug}&_embed`, {
      headers: getAuthHeaders(),
      next: { revalidate: 3600 }
    });

    if (!res.ok) return null;

    const ads = await res.json();
    return enrichAds(ads)[0] ?? null;
  } catch (error) {
    console.error('Error fetching advertisement:', error);
    return null;
  }
}

/**
 * Enrich advertisement data with featured image
 */
function enrichAds(ads: Advertisement[]): Advertisement[] {
  return ads.map((ad) => ({
    ...ad,
    featured_image_url: ad._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
  }));
}

/**
 * Get advertisements for a specific position and category
 */
export async function getAdsByPosition(
  position: 'sidebar' | 'featured' | 'inline',
  category?: string
): Promise<Advertisement[]> {
  try {
    const ads = await getAds();
    
    return ads.filter((ad) => {
      // Filter by position
      if (ad.acf?.position && ad.acf.position !== position) {
        return false;
      }
      
      // Filter by category if specified
      if (category && ad.acf?.category && ad.acf.category !== category) {
        return false;
      }
      
      return true;
    });
  } catch (error) {
    console.error('Error filtering advertisements:', error);
    return [];
  }
}

/**
 * Track ad click for analytics
 * Call this when user clicks an ad
 */
export async function trackAdClick(adId: number, position: 'sidebar' | 'featured' | 'inline') {
  try {
    await fetch('/api/ads/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId, position }),
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.debug('Failed to track ad click:', error);
  }
}
