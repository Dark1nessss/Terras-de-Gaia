import { NextResponse } from 'next/server';
import { getProgramas, getProgramaBySlug, getFeaturedProgramas } from '@/lib/wp';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const featured = searchParams.get('featured') === 'true';

    if (slug) {
      console.log('[API] Fetching single program by slug:', slug);
      const programa = await getProgramaBySlug(slug);
      console.log('[API] Program result:', programa ? `Found - ${programa.title?.rendered}` : 'Not found');
      return NextResponse.json(programa || {});
    }

    if (featured) {
      console.log('[API] Fetching featured programs');
      const programas = await getFeaturedProgramas();
      console.log('[API] Featured programs count:', programas.length);
      return NextResponse.json(programas);
    }

    console.log('[API] Fetching all programs');
    const programas = await getProgramas();
    console.log('[API] All programs count:', programas.length);
    return NextResponse.json(programas);
  } catch (error) {
    console.error('[API] Programs API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}