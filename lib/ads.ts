import { getSecureHeaders } from './auth';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL || 'http://localhost:8000/wp-json/wp/v2';

export interface Advertisement {
  id: number;
  title: { rendered: string };
  image_ad?: string;
  acf: {
    posicao_anuncio: string; // Position + Format combined (e.g., 'sidebar_square', 'featured_wide')
    image_ad?: string; // Image URL from ACF
    tipo_de_midia: 'image' | 'gif' | 'muted_video';
    data_inicio?: string; // Start date
    data_fim?: string; // End date
    url_clickthrough?: string; // Click destination
    ativo: boolean; // Active status
  };
}

/**
 * Get all active advertisements
 */
export async function getAds(): Promise<Advertisement[]> {
  try {
    const res = await fetch(`${API_URL}/advertisement?per_page=100`, {
      headers: getSecureHeaders(),
      next: { revalidate: 1800 }, // Cache 30 minutes
    });

    if (!res.ok) {
      console.error('Failed to fetch ads:', res.statusText);
      return [];
    }

    const ads = await res.json();
    const now = new Date();

    // Filter: active + within date range
    return ads.filter((ad: Advertisement) => {
      if (!ad.acf?.ativo) return false;

      const startDate = ad.acf.data_inicio ? new Date(ad.acf.data_inicio) : null;
      const endDate = ad.acf.data_fim ? new Date(ad.acf.data_fim) : null;

      if (startDate && now < startDate) return false;
      if (endDate && now > endDate) return false;

      return true;
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
}

/**
 * Get ads by position (e.g., 'sidebar_square', 'featured_wide')
 */
export async function getAdsByPosition(position: string): Promise<Advertisement[]> {
  const allAds = await getAds();
  return allAds.filter((ad) => ad.acf?.posicao_anuncio === position);
}

/**
 * Get single ad by ID
 */
export async function getAdById(id: number): Promise<Advertisement | null> {
  try {
    const res = await fetch(`${API_URL}/advertisement/${id}`, {
      headers: getSecureHeaders(),
      next: { revalidate: 1800 },
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
