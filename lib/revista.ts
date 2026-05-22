import { getWordPressAuthHeaders } from './auth';
import { getOrSetCached, createCacheKey } from './memory-cache';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL;

export interface Revista {
  id: number;
  title: { rendered: string };
  slug: string;
  excerpt?: { rendered: string };
  featured_media: number;
  featured_media_url?: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
  };
  acf: {
    url_jornal?: string; // PDF uploaded to WordPress media library (ACF field)
    data_publicacao?: string; // Publication date
  };
}

/**
 * Get all revistas
 * Cached 1 hour, memory cache 30 seconds
 */
export async function getRevistas(): Promise<Revista[]> {
  const cacheKey = createCacheKey('wp-revistas');

  return getOrSetCached(cacheKey, async () => {
    try {
      const res = await fetch(`${API_URL}/revista?_embed&per_page=100`, {
        headers: getWordPressAuthHeaders(),
        next: { revalidate: 3600 }, // Cache 1 hour
      });

      if (!res.ok) {
        console.error('Failed to fetch revistas:', res.statusText);
        return [];
      }

      const revistas = await res.json();
      
      // Enhance with featured image URLs
      return revistas.map((revista: Revista) => ({
        ...revista,
        featured_media_url: revista._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      }));
    } catch (error) {
      console.error('Error fetching revistas:', error);
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
      const res = await fetch(`${API_URL}/revista?slug=${slug}&_embed`, {
        headers: getWordPressAuthHeaders(),
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        console.error('Failed to fetch revista:', res.statusText);
        return null;
      }

      const revistas = await res.json();
      if (revistas.length === 0) return null;

      const revista = revistas[0];
      return {
        ...revista,
        featured_media_url: revista._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      };
    } catch (error) {
      console.error('Error fetching revista by slug:', error);
      return null;
    }
  }, 30000); // Memory cache: 30 seconds
}
