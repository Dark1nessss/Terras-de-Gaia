import { getRevistas, invalidateRevistaCache } from '@/lib/revista';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const revistas = await getRevistas();
    return NextResponse.json(revistas);
  } catch (error) {
    console.error('Error in /api/newspapper:', error);
    return NextResponse.json({ error: 'Failed to fetch revistas' }, { status: 500 });
  }
}

/** Force-flush the memory cache: DELETE /api/revista */
export async function DELETE() {
  invalidateRevistaCache();
  return NextResponse.json({ ok: true, message: 'Revista cache cleared' });
}
