import { getPostsByCategoryPaginated } from "@/lib/wp";

export const dynamic = 'force-dynamic';

const requestCounts = new Map<string, { count: number; reset: number }>();

function getRateLimit(ip: string) {
  const now = Date.now();
  const data = requestCounts.get(ip) || { count: 0, reset: now + 60000 };
  
  if (now > data.reset) {
    data.count = 0;
    data.reset = now + 60000; // Reset every 60 seconds
  }
  
  requestCounts.set(ip, data);
  return data;
}

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = getRateLimit(ip);
    
    // Max 30 requests per minute per IP
    if (rateLimit.count > 30) {
      return Response.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
    
    rateLimit.count++;

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = 12;
    const maxPages = 50; // Prevent deep pagination abuse

    if (!slug || page > maxPages) {
      return Response.json(
        { error: 'Missing slug parameter' },
        { status: 400 }
      );
    }

    const { posts, totalPosts } = await getPostsByCategoryPaginated(slug, page, perPage);
    
    const hasMore = (page * perPage) < totalPosts;

    return Response.json(
      { posts, hasMore, total: totalPosts, page },
      { 
        headers: { 
          'Cache-Control': 'public, max-age=180', // 180s cache
          'Revalidate': '180'
        }
      }
    );
  } catch (error) {
    console.error('Category API error:', error);
    return Response.json(
      { error: 'Failed to fetch posts', retry: true },
      { status: 500 }
    );
  }
}