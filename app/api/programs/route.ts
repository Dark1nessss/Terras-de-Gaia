import { NextResponse } from 'next/server';
import { getProgramas, getProgramaBySlug, getFeaturedProgramas } from '@/lib/wp';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const featured = searchParams.get('featured') === 'true';

    if (slug) {
      const programa = await getProgramaBySlug(slug);
      return NextResponse.json(programa || {});
    }

    if (featured) {
      const programas = await getFeaturedProgramas();
      return NextResponse.json(programas);
    }

    const programas = await getProgramas();
    return NextResponse.json(programas);
  } catch (error) {
    console.error('[API] Programs API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}