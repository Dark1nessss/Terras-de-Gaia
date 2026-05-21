import { getTVGuide } from '@/lib/wp';
import { NextResponse } from 'next/server';

export const revalidate = 300;

export async function GET() {
  try {
    const programs = await getTVGuide();
    return NextResponse.json(programs, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
