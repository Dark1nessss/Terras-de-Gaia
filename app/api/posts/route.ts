import { getPostsByCategoryPaginated } from "@/lib/wp";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = getRateLimit(ip);
    
    // Max 30 requests per minute per IP
    if (rateLimit.count > 30) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
    
    rateLimit.count++;

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || 'date_desc';
    const perPage = 12;
    const maxPages = 50; // Prevent deep pagination abuse

    if (!slug || page > maxPages) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const SORT_MAP: Record<string, { orderby: string; order: string }> = {
      date_desc: { orderby: 'date',  order: 'desc' },
      date_asc:  { orderby: 'date',  order: 'asc'  },
      title_asc: { orderby: 'title', order: 'asc'  },
    };
    const { orderby, order } = SORT_MAP[sort] ?? SORT_MAP.date_desc;

    const { posts, totalPosts } = await getPostsByCategoryPaginated(slug, page, perPage, {
      search,
      orderby,
      order,
    });
    const hasMore = (page * perPage) < totalPosts;

    return NextResponse.json({
      posts,
      hasMore,
      total: totalPosts,
      page,
    });
  } catch (error) {
    console.error('Category API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}