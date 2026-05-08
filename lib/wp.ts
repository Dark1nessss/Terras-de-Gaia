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
  console.log("getPosts - Embedded author data (first post):", posts[0]?._embedded?.['author']);

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
  console.log("Fetching posts by category:", `${API_URL}/posts?category_slug=${categorySlug}&_embed`);
  const res = await fetch(`${API_URL}/posts?category_slug=${categorySlug}&_embed`, {
    headers: getAuthHeaders(),
    next: { revalidate: 180 }
  });
  
  if (!res.ok) throw new Error('Failed to fetch category posts');

  const posts = await res.json();
  
  console.log("getPostsByCategory - Embedded author data (first post):", posts[0]?._embedded?.['author']);

  return await enrichPosts(posts);
}

export async function getPostsByCategoryPaginated(categorySlug: string, page: number = 1, perPage: number = 10) {
  console.log(`Fetching posts by category (${categorySlug}) - Page ${page}, Per Page: ${perPage}`);
  const res = await fetch(
    `${API_URL}/posts?category_slug=${categorySlug}&_embed&page=${page}&per_page=${perPage}`,
    {
      headers: getAuthHeaders(),
      next: { revalidate: 180 }
    }
  );
  
  if (!res.ok) throw new Error('Failed to fetch category posts');

  const posts = await res.json();
  const totalPosts = parseInt(res.headers.get('x-wp-total') || '0', 10);
  const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
  const enrichedPosts = await enrichPosts(posts);

  return {
    posts: enrichedPosts,
    totalPages,
    totalPosts,
    currentPage: page
  };
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
  const categoryTerm = post._embedded?.['wp:term']?.[0]?.[0];
  
  return {
    name: categoryTerm?.name || "Futebol",
    slug: categoryTerm?.slug || "futebol"
  };
}

export function extractCategories(post: any): Array<{ name: string; slug: string }> {
  const categoryTerms = post._embedded?.['wp:term']?.[0] || [];
  
  return categoryTerms.map((cat: any) => ({
    name: cat.name || "Categoria",
    slug: cat.slug || "categoria"
  }));
}

// Category mapping cache to avoid repeated API calls
const categoryCache = new Map<string, string>();

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
export async function getCategoryBySlug(slug: string): Promise<{ name: string; slug: string; description: string } | null> {
  try {
    const res = await fetch(`${API_URL}/categories?slug=${slug}`, {
      headers: getAuthHeaders(),
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!res.ok) return null;

    const categories = await res.json();
    if (categories.length === 0) return null;

    const cat = categories[0];
    return {
      name: cat.name || "",
      slug: cat.slug || slug,
      description: cat.description || ""
    };
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
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