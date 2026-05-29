import { enrichPosts } from "./post-enricher";
import { getSecureHeaders } from "./auth";
import { getOrSetCached, createCacheKey } from "./memory-cache";
import { wpLogger, programasLogger } from "./logger";

const API_URL = process.env.WORDPRESS_API_URL;

export async function getPosts() {
  const cacheKey = createCacheKey('wp-posts');
  
  return getOrSetCached(cacheKey, async () => {
    try {
      const res = await fetch(`${API_URL}/posts?_embed`, {
        headers: getSecureHeaders(),
        next: { revalidate: 300 } // ISR: 5 minutes
      });

      if (!res.ok) {
        wpLogger.error(`getPosts failed with status ${res.status}`);
        return [];
      }
      
      const posts = await res.json();
      return enrichPosts(posts);
    } catch (error) {
      wpLogger.error("Erro em getPosts:", error);
      return [];
    }
  }, 30000); // Memory cache: 30 seconds (prevent thundering herd)
}

export async function getPostBySlug(slug: string) {
  const cacheKey = createCacheKey('wp-post', { slug });

  return getOrSetCached(cacheKey, async () => {
    try {
      const res = await fetch(`${API_URL}/posts?slug=${slug}&_embed`, {
        headers: getSecureHeaders(),
        next: { revalidate: 300 } 
      });

      if (!res.ok) {
        throw new Error("Falha ao obter o artigo.");
      }

      const posts = await res.json();
      const post = posts[0] || null;

      if (post) {
        // Try to fetch post meta separately (needed for td_post_video, etc.)
        // Uses context=edit — requires edit_posts capability on the application password
        try {
          const metaRes = await fetch(
            `${API_URL}/posts/${post.id}?context=edit&_fields=id,meta,format`,
            { headers: getSecureHeaders(), next: { revalidate: 300 } }
          );
          if (metaRes.ok) {
            const metaData = await metaRes.json();
            if (metaData.meta) post.meta = metaData.meta;
            if (metaData.format) post.format = metaData.format;
          } else {
            wpLogger.warn(
              `[video-meta] context=edit fetch returned ${metaRes.status} for post ${post.id}. ` +
              `Grant edit_posts to the app password, or add to functions.php: ` +
              `register_post_meta('post','td_post_video',['show_in_rest'=>true,'single'=>true,'type'=>'string']);`
            );
          }
        } catch {
          // network error — extractVideoUrl will fall back to content scanning
        }

        // Debug: log what video-related data the API returned
        wpLogger.info(`[video-meta] post "${post.slug}" | format="${post.format}" | ` +
          `meta keys=[${Object.keys(post.meta ?? {}).join(', ') || 'none'}] | ` +
          `content length=${(post.content?.rendered ?? '').length}`
        );

        post.author_name = await extractAuthorName(post);
        post.category = extractCategory(post);
        
        // Fetch related posts from same category
        const categories = extractCategories(post);
        if (categories.length > 0) {
          const categorySlug = categories[0].slug;
          wpLogger.debug("Fetching related posts for category:", categorySlug);
          
          const relatedRes = await fetch(
            `${API_URL}/posts?category_slug=${categorySlug}&_embed&per_page=6`,
            { 
              headers: getSecureHeaders(),
              next: { revalidate: 300 } // Keep related posts fresh
            }
          );
          
          if (relatedRes.ok) {
            const relatedPostsData = await relatedRes.json();
            post.relatedPosts = await enrichPosts(relatedPostsData);
            wpLogger.debug("Related posts fetched:", post.relatedPosts.length);
          }
        }
      }

      return post ? (await enrichPosts([post]))[0] : null;
    } catch (error) {
      wpLogger.error("Erro ao obter o post:", error);
      return null;
    }
  }, 30000); // Memory cache: 30 seconds
}

export async function getLeagueTable() {
  try {
    const res = await fetch(`${API_URL}/leagues?_embed`, {
      next: { revalidate: 300 }
    });

    if (!res.ok) {
      wpLogger.warn("A rota das ligas não foi encontrada. Estado da API:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    wpLogger.error("Erro ao obter a tabela no WP:", error);
    return []; // Retorna um array vazio para não quebrar o .map()
  }
}

export async function getPostsByCategory(categorySlug: string) {
  const { posts } = await getPostsByCategoryPaginated(categorySlug, 1, 12);
  return posts;
}

export async function getPostsByCategoryPaginated(
  categorySlug: string,
  page: number,
  perPage: number,
  options?: { search?: string; orderby?: string; order?: string }
) {
  const cacheKey = createCacheKey('wp-posts-category', {
    categorySlug,
    page,
    perPage,
    search:  options?.search  ?? "",
    orderby: options?.orderby ?? "date",
    order:   options?.order   ?? "desc",
  });

  // Search results are user-driven — shorter cache to avoid stale hits
  const cacheTTL = options?.search ? 10_000 : 30_000;

  return getOrSetCached(cacheKey, async () => {
    try {
      let categoryIds: number[] = [];

      if (categorySlug === 'desporto') {
        const catRes = await fetch(`${API_URL}/categories?slug=${SPORTS_SLUGS.join(',')}&_embed`, {
          headers: getSecureHeaders()
        });
        const categories = await catRes.json();
        categoryIds = categories.map((cat: any) => cat.id);
      } else {
        const catRes = await fetch(`${API_URL}/categories?slug=${categorySlug}`, {
          headers: getSecureHeaders()
        });
        const categories = await catRes.json();
        if (!categories || categories.length === 0) return { posts: [], totalPosts: 0 };
        categoryIds = [categories[0].id];
      }

      const categoryParam = categoryIds.join(',');
      const orderby = options?.orderby ?? 'date';
      const order   = options?.order   ?? 'desc';

      const wpUrl = new URL(`${API_URL}/posts`);
      wpUrl.searchParams.set('categories', categoryParam);
      wpUrl.searchParams.set('_embed', '1');
      wpUrl.searchParams.set('per_page', String(perPage));
      wpUrl.searchParams.set('page', String(page));
      wpUrl.searchParams.set('orderby', orderby);
      wpUrl.searchParams.set('order', order);
      if (options?.search) wpUrl.searchParams.set('search', options.search);

      const res = await fetch(wpUrl.toString(), {
        headers: getSecureHeaders(),
        next: { revalidate: options?.search ? 60 : 300 },
      });

      if (!res.ok) return { posts: [], totalPosts: 0 };

      const totalPosts = parseInt(res.headers.get('X-WP-Total') || '0');
      const posts = await res.json();
      const enriched = await enrichPosts(posts);

      return { posts: enriched, totalPosts };
    } catch (error) {
      wpLogger.error("Erro no fetch paginado:", error);
      return { posts: [], totalPosts: 0 };
    }
  }, cacheTTL);
}

export async function extractAuthorName(post: any): Promise<string> {
  if (post.author_name) {
    return post.author_name;
  }
  
  const author = post._embedded?.['author']?.[0];
  
  // Check if author is valid (not an error) and has a name
  if (author && !author.code && author.name) {
    return author.name;
  }
  
  // Fallback: fetch user by ID if embedded author failed
  if (post.author) {
    return await getUserById(post.author);
  }
  
  return "Redação";
}

export function extractCategory(post: any) {
  const categories = extractCategories(post);
  if (categories.length === 0) return { name: "Notícias", href: "/categoria/noticias" };
  
  // Prioridade: se houver uma categoria de desporto, escolhemos essa como principal
  const sportCat = categories.find(c => SPORTS_SLUGS.includes(c.slug.toLowerCase()));
  return sportCat || categories[0];
}

// Category mapping cache to avoid repeated API calls
const categoryCache = new Map<string, string>();

export const SPORTS_SLUGS = [
  'futebol', 'basquetebol', 'voleibol', 'hoquei', 
  'natacao', 'desporto', 'modalidades', 'trail', 'atletismo'
];

export function getCategoryLink(slug: string): string {
  if (slug === 'desporto') {
    return '/desporto';
  }

  // Verifica se o slug pertence às modalidades de desporto
  const isSport = SPORTS_SLUGS.includes(slug);
  
  if (isSport) {
    return `/desporto/${slug}`;
  }

  // Para todas as outras categorias (ex: Opinião, Atualidade)
  return `/categoria/${slug}`;
}

export function extractCategories(post: any) {
  if (!post._embedded?.['wp:term']) return [];
  return post._embedded['wp:term'][0].map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    href: getCategoryLink(cat.slug)
  }));
}

export async function getCategoryTitleBySlug(slug: string): Promise<string> {
  // Check cache first
  if (categoryCache.has(slug)) {
    return categoryCache.get(slug)!;
  }

  try {
    const res = await fetch(`${API_URL}/categories?slug=${slug}`, {
      headers: getSecureHeaders(),
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!res.ok) {
      categoryCache.set(slug, slug); // Cache the slug as fallback
      return slug;
    }

    const categories = await res.json();
    const title = categories[0]?.name || slug;
    
    categoryCache.set(slug, title);
    return title;
  } catch (error) {
    wpLogger.error("Error fetching category title:", error);
    categoryCache.set(slug, slug); // Cache the slug as fallback
    return slug;
  }
}

// Fetch category info including title and description by slug
export async function getCategoryBySlug(slug: string) {
  const cacheKey = createCacheKey('wp-category', { slug });

  return getOrSetCached(cacheKey, async () => {
    const res = await fetch(`${API_URL}/categories?slug=${slug}`, {
      headers: getSecureHeaders(),
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    return data[0] || null;
  }, 30000);
}

async function getUserById(userId: number): Promise<string> {
  const cacheKey = createCacheKey('wp-user', { userId });

  return getOrSetCached(cacheKey, async () => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        headers: getSecureHeaders(),
        next: { revalidate: 3600 }
      });

      if (!res.ok) return "Redação";

      const user = await res.json();
      return user.name || "Redação";
    } catch (error) {
      wpLogger.error("Erro ao obter usuário:", error);
      return "Redação";
    }
  }, 3600000); // Memory cache: 1 hour for user data
}

export async function getPrograms() {
  const cacheKey = createCacheKey('wp-programs');

  return getOrSetCached(cacheKey, async () => {
    wpLogger.debug("Fetching programs from:", `${API_URL}/programs?_embed`);
    try {
      const res = await fetch(`${API_URL}/programs?_embed`, {
        headers: getSecureHeaders(),
        next: { revalidate: 300 }
      });

      if (!res.ok) {
        wpLogger.warn("Programs endpoint not found. Status:", res.status);
        return [];
      }

      const programs = await res.json();
      wpLogger.debug("Programs fetched:", programs.length);
      return programs;
    } catch (error) {
      wpLogger.error("Error fetching programs:", error);
      return [];
    }
  }, 30000); // Memory cache: 30 seconds
}

function formatACFDate(rawDate: string): string {
  if (!rawDate || rawDate === "Sem data") return "Sem data";

  let day, month, year;

  try {
    // Caso 1: Formato dos teus logs (YYYYMMDD) -> "20260509"
    if (rawDate.length === 8 && !rawDate.includes('/')) {
      year = parseInt(rawDate.substring(0, 4));
      month = parseInt(rawDate.substring(4, 6)) - 1;
      day = parseInt(rawDate.substring(6, 8));
    } 
    // Caso 2: Formato do teu print ACF (j/m/Y) -> "9/5/2026"
    else if (rawDate.includes('/')) {
      const parts = rawDate.split('/');
      day = parseInt(parts[0]);
      month = parseInt(parts[1]) - 1;
      year = parseInt(parts[2]);
    } 
    else {
      return rawDate;
    }

    const dateObj = new Date(year, month, day);
    const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    
    const nomeDia = diasSemana[dateObj.getDay()];
    const diaMes = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}`;

    return `${nomeDia}, ${diaMes}`;
  } catch (e) {
    wpLogger.error("Erro ao processar data:", rawDate);
    return rawDate;
  }
}

export async function getTVGuide() {
  const cacheKey = createCacheKey('wp-tv-guide');

  return getOrSetCached(cacheKey, async () => {
    const cb = new Date().getTime();
    const url = `${API_URL}/programas-tv?_embed&per_page=100&cb=${cb}`;
    const now = new Date()
    
    // console.log("Fetching TV Guide from:", url);

    try {
      const res = await fetch(url, {
        headers: getSecureHeaders(),
        next: { revalidate: 300 } // ISR cache for 5 minutes
      });

      if (!res.ok) throw new Error('Falha ao carregar Guia TV');

      const data = await res.json();

      return data.map((fullProgram: any) => {
      // Extração de campos ACF com fallback
      const hora_inicio = (fullProgram.acf?.hora_inicio || "00:00").substring(0, 5);
      const hora_fim = (fullProgram.acf?.hora_fim || "00:00").substring(0, 5);
      const raw_dia = fullProgram.acf?.dia_da_semana || "00000000";

      // console.log(`Dados: ${fullProgram.title.rendered} - Hora: ${hora_inicio} às ${hora_fim}, Dia: ${raw_dia}, Dia Fomatado: ${formatACFDate(raw_dia)}`);

      return {
        id: fullProgram.id,
        title: fullProgram.title.rendered,
        description: fullProgram.content.rendered,
        time: `${hora_inicio} - ${hora_fim}`,
        hora_inicio: hora_inicio,
        hora_fim: hora_fim,
        sort_date: raw_dia,
        data_completa: formatACFDate(raw_dia),
        color: fullProgram.acf?.cor_tematica || "#00a6f0",
        image: fullProgram._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/mesa-posta.jpg",
        video_url: fullProgram.acf?.video_url || null,
        slug: fullProgram.slug
      };
    })
    .filter((prog: any) => {
      // Filtering out past programs using your existing logic
      const [day, month] = prog.data_completa.split(', ')[1].split('/');
      const [hour, min] = prog.hora_fim.split(':');
      const programEndTime = new Date(now.getFullYear(), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(min));
      return programEndTime > now;
    })
    .sort((a: any, b: any) => {
      // 1. Sort by Date first (e.g., 20260513 comes before 20260528)
      if (a.sort_date !== b.sort_date) {
        return a.sort_date.localeCompare(b.sort_date);
      }
      // 2. If same day, sort by Start Time
      return a.hora_inicio.localeCompare(b.hora_inicio);
    });
    } catch (error) {
      wpLogger.error("Erro em getTVGuide:", error);
      return [];
    }
  }, 30000); // Memory cache: 30 seconds
}

// Helper function to parse temporadas JSON
function parseTemporadas(jsonString: string | undefined) {
  if (!jsonString) return [];
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    wpLogger.error('[parseTemporadas] Error parsing temporadas JSON:', error);
    return [];
  }
}

// Programas CPT (Gaia Play)
export async function getProgramas() {
  const cacheKey = createCacheKey('wp-programas');

  return getOrSetCached(cacheKey, async () => {
    try {
      const res = await fetch(`${API_URL}/programas?per_page=100&_embed`, {
        headers: getSecureHeaders(),
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        programasLogger.error(`[getProgramas] Non-OK response: ${res.status}`);
        return [];
      }

      const programas = await res.json();
      programasLogger.debug(`[getProgramas] Count returned: ${programas.length}`);
      programasLogger.debug(
        `[getProgramas] featured_media IDs: [${programas.map((p: any) => p.featured_media).join(', ')}]`
      );
      programasLogger.debug(
        `[getProgramas] _embed image urls: [${programas.map((p: any) => p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'NONE').join(', ')}]`
      );

      // Step 1: extract image URLs from _embed (fast path)
      let mapped = programas.map((prog: any) => ({
        ...prog,
        featured_image_url: prog._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        temporadas: parseTemporadas(prog.acf?.temporadas),
      }));

      // Step 2: fallback — batch-fetch media for any program _embed didn't resolve
      const missingIds: number[] = mapped
        .filter((p: any) => !p.featured_image_url && typeof p.featured_media === 'number' && p.featured_media > 0)
        .map((p: any) => p.featured_media as number);

      if (missingIds.length > 0) {
        programasLogger.debug(`[getProgramas] _embed missed ${missingIds.length} images — batch-fetching`);
        const mediaRes = await fetch(
          `${API_URL}/media?include=${missingIds.join(',')}&per_page=${missingIds.length}&_fields=id,source_url`,
          { headers: getSecureHeaders() }
        );
        if (mediaRes.ok) {
          const mediaItems = await mediaRes.json();
          const mediaUrlMap: Record<number, string> = {};
          mediaItems.forEach((m: any) => { mediaUrlMap[m.id] = m.source_url; });
          mapped = mapped.map((p: any) => ({
            ...p,
            featured_image_url: p.featured_image_url || mediaUrlMap[p.featured_media] || '',
          }));
        }
      }

      return mapped;
    } catch (error) {
      programasLogger.error('[getProgramas] Error fetching programas:', error);
      return [];
    }
  }, 30000); // Memory cache: 30 seconds
}

export async function getProgramaBySlug(slug: string) {
  const cacheKey = createCacheKey('wp-programa', { slug });

  return getOrSetCached(cacheKey, async () => {
    try {
      const res = await fetch(`${API_URL}/programas?slug=${slug}&_embed`, {
        headers: getSecureHeaders(),
        next: { revalidate: 300 },
      });

      if (!res.ok) return null;

      const data = await res.json();
      const programa = data[0] || null;

      if (!programa) return null;

      // Try _embed first, fall back to direct media fetch
      let featured_image_url: string =
        programa._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

      if (!featured_image_url && programa.featured_media > 0) {
        const mediaRes = await fetch(
          `${API_URL}/media/${programa.featured_media}?_fields=id,source_url`,
          { headers: getSecureHeaders() }
        );
        if (mediaRes.ok) {
          const mediaData = await mediaRes.json();
          featured_image_url = mediaData.source_url || '';
        }
      }

      return {
        ...programa,
        featured_image_url,
        temporadas: parseTemporadas(programa.acf?.temporadas),
      };
    } catch (error) {
      programasLogger.error('[getProgramaBySlug] Error:', error);
      return null;
    }
  }, 30000); // Memory cache: 30 seconds
}

export async function getFeaturedProgramas() {
  const programas = await getProgramas();
  return programas.filter((p: any) => p.acf?.destaque_gaia_play === true);
}

export async function getProgramasByCategory(categorySlug: string) {
  const all = await getProgramas();
  return all.filter((p: any) => {
    const cat: string = p.acf?.categoria_programa || '';
    const slug = cat
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');
    return slug === categorySlug;
  });
}

/**
 * Get all advertisements from WordPress with featured images
 * - Uses ISR (Incremental Static Regeneration) for 30 min CDN cache
 * - Uses memory cache for 30 sec to prevent thundering herd
 * - Extracts featured images from _embed
 */
export async function getAdvertisements() {
  const cacheKey = createCacheKey('wp-advertisements');

  return getOrSetCached(cacheKey, async () => {
    try {
      const res = await fetch(`${API_URL}/advertisement?_embed&per_page=100`, {
        headers: getSecureHeaders(),
        next: { revalidate: 1800 } // ISR: 30 minutes
      });

      if (!res.ok) return [];

      const ads = await res.json();
      
      // Extract featured images - same pattern as posts and programs
      return ads.map((ad: any) => ({
        ...ad,
        featured_image_url: ad._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      }));
    } catch (error) {
      wpLogger.error('[WP] Error fetching advertisements:', error);
      return [];
    }
  }, 30000); // Memory cache: 30 seconds
}