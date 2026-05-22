import { extractAuthorName, extractCategory, extractCategories, SPORTS_SLUGS } from "@/lib/wp";
import { decodeHtml, stripHtml } from "@/lib/decode-html";
import { extractVideoUrl } from "@/lib/video";

export async function enrichPosts(posts: any[]): Promise<any[]> {
  return Promise.all(posts.map(async (post) => {
    const categories = extractCategories(post);
    
    // Verifica se alguma das categorias do post pertence à lista de desporto
    const isSportContent = categories.some(cat => 
      SPORTS_SLUGS.includes(cat.slug.toLowerCase())
    );

    const videoUrl = extractVideoUrl(post);

    return {
    ...post,
    author_name: await extractAuthorName(post),
    category: extractCategory(post),
    categories: categories,
    isSportContent: isSportContent,
    title_clean: decodeHtml(stripHtml(post.title?.rendered || "")),
    excerpt_clean: decodeHtml(stripHtml(post.excerpt?.rendered || "")),
    videoUrl,
    hasVideo: !!videoUrl,
    hasFeaturedMedia: !!post._embedded?.['wp:featuredmedia']?.[0]?.source_url
    };
  }));
}