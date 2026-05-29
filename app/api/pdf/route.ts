import { NextRequest, NextResponse } from 'next/server';
import { getWordPressAuthHeaders } from '@/lib/auth';

const ALLOWED_DOMAIN = 'terrasdegaia.pt';

// Derive the actual CMS hostname from the API URL env var (e.g. cms.terrasdegaia.pt).
// PDF media uploaded when WP was on the main domain still have old URLs — we rewrite
// any wp-content fetch to the real CMS host so Vercel is never the upstream.
function getCmsHostname(): string {
  const apiUrl = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
  try { return new URL(apiUrl).hostname; } catch { return `cms.${ALLOWED_DOMAIN}`; }
}

export const dynamic = 'force-dynamic';

/**
 * Proxy PDF files from WordPress to bypass CORS restrictions.
 * Only allows requests to terrasdegaia.pt or any subdomain (e.g. cms.terrasdegaia.pt).
 * Old ACF media URLs that still point to the main domain are silently rewritten to the CMS host.
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

  // SSRF guard: only proxy from terrasdegaia.pt or subdomains (e.g. cms.terrasdegaia.pt)
  const isAllowed =
    parsed.hostname === ALLOWED_DOMAIN ||
    parsed.hostname.endsWith(`.${ALLOWED_DOMAIN}`);

  if (!isAllowed) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
  }

  // Only allow HTTPS
  if (parsed.protocol !== 'https:') {
    return NextResponse.json({ error: 'Only HTTPS URLs are allowed' }, { status: 403 });
  }

  // Rewrite main-domain wp-content URLs to the actual CMS host.
  // Old PDF uploads reference terrasdegaia.pt (frontend/Vercel) but the files
  // actually live on the CMS subdomain.
  if (parsed.hostname === ALLOWED_DOMAIN && parsed.pathname.startsWith('/wp-content/')) {
    parsed.hostname = getCmsHostname();
  }

  const fetchUrl = parsed.toString();

  try {
    const wpAuth = getWordPressAuthHeaders();
    const upstream = await fetch(fetchUrl, {
      cache: 'no-store',
      headers: {
        ...(wpAuth.Authorization ? { Authorization: wpAuth.Authorization } : {}),
        'User-Agent': 'Mozilla/5.0 (compatible; TerrasDeGaia/1.0)',
      },
    });

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
      'Cache-Control': 'public, max-age=86400',
    });
    if (contentLength) headers.set('Content-Length', contentLength);

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 502 });
  }
}
