const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL;

export async function getPosts() {
  const res = await fetch(`${API_URL}/posts?_embed`);
  next: { revalidate: 180 }; // Revalidate the data every 180 seconds/3 minutes
    if (!res.ok){
      throw new Error('Failed to fetch posts');
    }
  return res.json();
}

export async function getPostBySlug(slug: string) {
  const res = await fetch(`${API_URL}/posts?slug=${slug}&_embed`);
  next: { revalidate: 180 }; // Revalidate the data every 180 seconds/3 minutes
    if (!res.ok){
      throw new Error('Failed to fetch post');
    }
  const posts = await res.json();
  return posts.length > 0 ? posts[0] : null;
}

export async function getLeagueTable() {
  const res = await fetch(`${API_URL}/leagues?_embed`);
  return res.json();
}