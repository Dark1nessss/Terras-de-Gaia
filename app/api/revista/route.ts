import { getRevistas } from '@/lib/revista';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const revistas = await getRevistas();
    return NextResponse.json(revistas);
  } catch (error) {
    console.error('Error in /api/revista:', error);
    return NextResponse.json({ error: 'Failed to fetch revistas' }, { status: 500 });
  }
}
