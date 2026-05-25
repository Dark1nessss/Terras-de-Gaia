import { NextResponse } from 'next/server';
import { getProgramas, getProgramaBySlug, getFeaturedProgramas } from '@/lib/wp';
import { programasLogger } from '@/lib/logger';

// Allow Next.js data cache — revalidate every 5 minutes
export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const featured = searchParams.get('featured') === 'true';

    if (slug) {
      const programa = await getProgramaBySlug(slug);
      return NextResponse.json(programa || {}, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
      });
    }

    if (featured) {
      const programas = await getFeaturedProgramas();
      return NextResponse.json(programas, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
      });
    }

    const programas = await getProgramas();
    return NextResponse.json(programas, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  } catch (error) {
    programasLogger.error('[API] Programs API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}