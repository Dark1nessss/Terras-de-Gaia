import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTNAME = 'terrasdegaia.pt';

export const dynamic = 'force-dynamic';

/**
 * Proxy PDF files from WordPress to bypass CORS restrictions.
 * Only allows requests to the configured WordPress domain.
 * Usage: /api/pdf?url=https://terrasdegaia.pt/wp-content/uploads/...
 */
export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid url parameter' }, { status: 400 });
  }

  // SSRF guard: only proxy from the allowed WordPress hostname
  if (parsed.hostname !== ALLOWED_HOSTNAME) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
  }

  // Only allow HTTPS
  if (parsed.protocol !== 'https:') {
    return NextResponse.json({ error: 'Only HTTPS URLs are allowed' }, { status: 403 });
  }

  try {
    const upstream = await fetch(rawUrl, { cache: 'no-store' });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream responded with ${upstream.status}` },
        { status: upstream.status }
      );
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/pdf';
    const contentLength = upstream.headers.get('content-length');

    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    });
    if (contentLength) headers.set('Content-Length', contentLength);

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 502 });
  }
}
