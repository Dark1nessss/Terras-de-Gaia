import { getWordPressAuthHeaders } from './auth';
import { getOrSetCached, createCacheKey, deleteCached } from './memory-cache';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL;

export interface Stat {
  id: number;
  title: { rendered: string };
  acf?: {
    /** The displayed number/value, e.g. "100k+", "30+", "6.6k+" */
    stat_value?: string;
    /** Short label shown below the number, e.g. "Visualizações mensais" */
    stat_label?: string;
    /** Manual sort order */
    stat_order?: number;
  };
}

/** Hardcoded fallback used if WP fetch fails */
export const STATS_FALLBACK: Array<{ number: string; label: string }> = [
  { number: "100k+", label: "Visualizações mensais" },
  { number: "80k+",  label: "Utilizadores mensais" },
  { number: "30+",   label: "Parcerias ativas" },
  { number: "7.5k+", label: "Seguidores" },
];

export async function getStats(): Promise<Stat[]> {
  const cacheKey = createCacheKey('wp-stats');

  return getOrSetCached(cacheKey, async () => {
    try {
      const res = await fetch(`${API_URL}/estatisticas?per_page=20`, {
        headers: getWordPressAuthHeaders(),
        cache: 'no-store',
      });

      if (!res.ok) {
        console.error('[getStats] Failed to fetch stats:', res.statusText);
        return [];
      }

      const data: Stat[] = await res.json();
      return data;
    } catch (error) {
      console.error('[getStats] Error:', error);
      return [];
    }
  }, 86400); // 24h TTL — stats change infrequently; flush with DELETE /api/stats
}

export function invalidateStatsCache() {
  deleteCached(createCacheKey('wp-stats'));
}
