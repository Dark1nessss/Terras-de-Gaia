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

export async function getPosts() {
  console.log("Fetching posts from:", `${API_URL}/posts?_embed`);
  
  const res = await fetch(`${API_URL}/posts?_embed`, {
    headers: getAuthHeaders(),
    next: { revalidate: 180 } // Revalidate the data every 180 seconds/3 minutes
  });

  console.log("getPosts Response Status:", res.status);

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  const posts = await res.json();
  
  // Log a sample of the embedded author data for inspection
  // console.log("getPosts - Embedded author data (first post):", posts[0]?._embedded?.['author']);

  return enrichPosts(posts);
}

export async function getPostBySlug(slug: string) {
  try {
    console.log("Fetching post by slug:", `${API_URL}/posts?slug=${slug}&_embed`);
    const res = await fetch(`${API_URL}/posts?slug=${slug}&_embed`, {
      headers: getAuthHeaders(),
      next: { revalidate: 180 } 
    });

    console.log("getPostBySlug Response Status:", res.status);

    if (!res.ok) {
      throw new Error("Falha ao obter o artigo.");
    }

    const posts = await res.json();
    const post = posts[0] || null;

    if (post) {
      console.log("Post _embedded object:", post._embedded);
      
      post.author_name = await extractAuthorName(post);
      post.category = extractCategory(post);
      
      // Fetch related posts from same category
      const categories = extractCategories(post);
      if (categories.length > 0) {
        const categorySlug = categories[0].slug;
        console.log("Fetching related posts for category:", categorySlug);
        
        const relatedRes = await fetch(
          `${API_URL}/posts?category_slug=${categorySlug}&_embed&per_page=6`,
          { 
            headers: getAuthHeaders(),
            next: { revalidate: 180 } // Every 3 minutes to keep related posts fresh
          }
        );
        
        if (relatedRes.ok) {
          const relatedPostsData = await relatedRes.json();
          post.relatedPosts = await enrichPosts(relatedPostsData);
          console.log("Related posts fetched:", post.relatedPosts.length);
        }
      }
    }

    return post ? (await enrichPosts([post]))[0] : null;
  } catch (error) {
    console.error("Erro ao obter o post:", error);
    return null;
  }
}

export async function getLeagueTable() {
  try {
    console.log("Fetching league table from:", `${API_URL}/leagues?_embed`);
    const res = await fetch(`${API_URL}/leagues?_embed`, {
      next: { revalidate: 180 }
    });

    if (!res.ok) {
      console.warn("A rota das ligas não foi encontrada. Estado da API:", res.status);
      return []; // Retorna um array vazio em vez de um erro fatal
    }

    return await res.json();
  } catch (error) {
    console.error("Erro ao obter a tabela no WP:", error);
    return []; // Retorna um array vazio para não quebrar o .map()
  }
}

export async function getPostsByCategory(categorySlug: string) {
  const { posts } = await getPostsByCategoryPaginated(categorySlug, 1, 12);
  return posts;
}

export async function getPostsByCategoryPaginated(categorySlug: string, page = 1, perPage = 12) {
  try {
    let categoryIds: number[] = [];

    if (categorySlug === 'desporto') {
      const catRes = await fetch(`${API_URL}/categories?slug=${SPORTS_SLUGS.join(',')}&_embed`, {
        headers: getAuthHeaders()
      });
      const categories = await catRes.json();
      categoryIds = categories.map((cat: any) => cat.id);
    } else {
      const catRes = await fetch(`${API_URL}/categories?slug=${categorySlug}`, {
        headers: getAuthHeaders()
      });
      const categories = await catRes.json();
      if (!categories || categories.length === 0) return { posts: [], totalPosts: 0 };
      categoryIds = [categories[0].id];
    }

    const categoryParam = categoryIds.join(',');

    const res = await fetch(
      `${API_URL}/posts?categories=${categoryParam}&_embed&per_page=${perPage}&page=${page}&orderby=date&order=desc`,
      { 
        headers: getAuthHeaders(),
        next: { revalidate: 180 } 
      }
    );

    if (!res.ok) return { posts: [], totalPosts: 0 };
    
    const totalPosts = parseInt(res.headers.get('X-WP-Total') || '0');
    const posts = await res.json();
    const enriched = await enrichPosts(posts);

    return { posts: enriched, totalPosts };
  } catch (error) {
    console.error("Erro no fetch paginado:", error);
    return { posts: [], totalPosts: 0 };
  }
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
      headers: getAuthHeaders(),
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
    console.error("Error fetching category title:", error);
    categoryCache.set(slug, slug); // Cache the slug as fallback
    return slug;
  }
}

// Fetch category info including title and description by slug
export async function getCategoryBySlug(slug: string) {
  const res = await fetch(`${API_URL}/categories?slug=${slug}`);
  const data = await res.json();
  return data[0] || null;
}

async function getUserById(userId: number): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      headers: getAuthHeaders(),
      next: { revalidate: 3600 }
    });

    if (!res.ok) return "Redação";

    const user = await res.json();
    return user.name || "Redação";
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return "Redação";
  }
}

export async function getPrograms() {
  console.log("Fetching programs from:", `${API_URL}/programs?_embed`);
  try {
    const res = await fetch(`${API_URL}/programs?_embed`, {
      headers: getAuthHeaders(),
      next: { revalidate: 180 }
    });

    if (!res.ok) {
      console.warn("Programs endpoint not found. Status:", res.status);
      return [];
    }

    const programs = await res.json();
    console.log("Programs fetched:", programs.length);
    return programs;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
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
    console.error("Erro ao processar data:", rawDate);
    return rawDate;
  }
}

export async function getTVGuide() {
  const cb = new Date().getTime();
  const url = `${API_URL}/programas-tv?_embed&per_page=100&cb=${cb}`;
  const now = new Date()
  
  console.log("Fetching TV Guide from:", url);

  try {
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });

    if (!res.ok) throw new Error('Falha ao carregar Guia TV');

    const data = await res.json();

    return data.map((fullProgram: any) => {
      // Extração de campos ACF com fallback
      const hora_inicio = (fullProgram.acf?.hora_inicio || "00:00").substring(0, 5);
      const hora_fim = (fullProgram.acf?.hora_fim || "00:00").substring(0, 5);
      const raw_dia = fullProgram.acf?.dia_da_semana || "00000000";

      console.log(`Dados: ${fullProgram.title.rendered} - Hora: ${hora_inicio} às ${hora_fim}, Dia: ${raw_dia}, Dia Fomatado: ${formatACFDate(raw_dia)}`);

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
    console.error("Erro em getTVGuide:", error);
    return [];
  }
}