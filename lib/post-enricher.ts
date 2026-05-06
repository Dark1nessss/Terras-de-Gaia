import { extractAuthorName, extractCategory } from "@/lib/wp";
import { decodeHtml, stripHtml } from "@/lib/decode-html";

export async function enrichPosts(posts: any[]): Promise<any[]> {
  return Promise.all(posts.map(async (post) => ({
    ...post,
    author_name: await extractAuthorName(post),
    category: extractCategory(post),
    title_clean: decodeHtml(stripHtml(post.title?.rendered || "")),
    excerpt_clean: decodeHtml(stripHtml(post.excerpt?.rendered || "")),
    hasVideo: post._embedded?.['wp:featuredmedia']?.[0]?.media_type === 'video',
    hasFeaturedMedia: !!post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  })));
}