import { getStats, invalidateStatsCache } from '@/lib/stats';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in /api/stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

/** Force-flush the memory cache: DELETE /api/stats */
export async function DELETE() {
  invalidateStatsCache();
  return NextResponse.json({ ok: true, message: 'Stats cache cleared' });
}
