import type { MetadataRoute } from "next";
import { getSecureHeaders } from "@/lib/auth";

const BASE_URL = "https://terrasdegaia.pt";
const API_URL = process.env.WORDPRESS_API_URL;

// Static pages with their priority and change frequency
const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
  { url: `${BASE_URL}/live`, lastModified: new Date(), changeFrequency: "always", priority: 0.9 },
  { url: `${BASE_URL}/gaia-play`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/programacao`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/desporto`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/revista`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/sobre-nos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/vira-parceiro`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  { url: `${BASE_URL}/centro-de-ajuda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  { url: `${BASE_URL}/termos-de-utilizacao`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  { url: `${BASE_URL}/politica-de-privacidade`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
];

async function getPostUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/posts?per_page=100&fields=slug,modified&orderby=modified&order=desc`, {
      headers: getSecureHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const posts: { slug: string; modified: string }[] = await res.json();
    return posts.map((p) => ({
      url: `${BASE_URL}/post/${p.slug}`,
      lastModified: new Date(p.modified),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

async function getCategoryUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/categories?per_page=100&fields=slug&hide_empty=true`, {
      headers: getSecureHeaders(),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const cats: { slug: string }[] = await res.json();
    return cats
      .filter((c) => c.slug !== "uncategorized")
      .map((c) => ({
        url: `${BASE_URL}/categoria/${c.slug}`,
        changeFrequency: "daily",
        priority: 0.6,
      }));
  } catch {
    return [];
  }
}

async function getProgramUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/programas-tv?per_page=100&fields=slug,modified`, {
      headers: getSecureHeaders(),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const programs: { slug: string; modified: string }[] = await res.json();
    return programs.map((p) => ({
      url: `${BASE_URL}/gaia-play/${p.slug}`,
      lastModified: new Date(p.modified),
      changeFrequency: "monthly",
      priority: 0.5,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, programs] = await Promise.all([
    getPostUrls(),
    getCategoryUrls(),
    getProgramUrls(),
  ]);

  return [...STATIC_PAGES, ...posts, ...categories, ...programs];
}
