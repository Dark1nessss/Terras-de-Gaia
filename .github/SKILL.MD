---
schema-version: "1.0"
name: wordpress-integration-security
description: WordPress API integration with proper authentication, caching, and security
applicableScenarios: ["data-fetching", "api-integration", "security-implementation"]
---

# WordPress Integration & Security Skill

## Problem Statement

The project uses WordPress as a backend via CPanel, but needs to:
1. Always use authentication (WP_USER + WP_APP_PASSWORD)
2. Implement proper caching to prevent unnecessary queries
3. Prevent unauthorized direct database access
4. Rate limit API requests

## Solution Pattern

### Step 1: Verify Authentication Setup

Check if environment variables are configured:

```typescript
// lib/wp.ts
const WP_USER = process.env.WP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!WP_USER || !WP_APP_PASSWORD) {
  throw new Error('Missing WordPress authentication credentials');
}
```

### Step 2: Create Base Auth Function

```typescript
function getAuthHeaders(): Record<string, string> {
  const credentials = `${WP_USER}:${WP_APP_PASSWORD}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');
  return { 'Authorization': `Basic ${base64Credentials}` };
}
```

### Step 3: Implement Caching Strategy

Server-side ISR (Incremental Static Regeneration):

```typescript
export async function getPosts() {
  const res = await fetch(`${API_URL}/posts?_embed`, {
    headers: getAuthHeaders(),
    next: { revalidate: 180 } // Cache for 3 minutes
  });
  return res.json();
}
```

### Step 4: Rate Limiting on API Routes

```typescript
// app/api/posts/route.ts
import { RateLimiter } from '@/lib/rate-limiter';

const limiter = new RateLimiter(10, 60000); // 10 requests per minute

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!limiter.allowRequest(ip)) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  const posts = await getPosts();
  return Response.json(posts);
}
```

### Step 5: Public API Route (Cached, Auth-Protected)

```typescript
// app/api/posts/route.ts
export const revalidate = 180; // ISR: 3 minutes

export async function GET() {
  try {
    const posts = await getPosts();
    return Response.json(posts, {
      headers: {
        'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
```

### Step 6: Prevent Direct Database Access

Do NOT expose raw WordPress URLs:

Bad pattern - exposes WordPress to frontend:
```typescript
const data = await fetch('https://yourdomain.com/wp-json/wp/v2/posts');
```

Good pattern - frontend calls Next.js API:
```typescript
const data = await fetch('/api/posts');
```

## Implementation Checklist

- [ ] WP_USER and WP_APP_PASSWORD set in .env.local
- [ ] All WordPress API calls use getAuthHeaders()
- [ ] ISR cache set to revalidate: 180 (3 min) for posts/programs
- [ ] API routes implement rate limiting
- [ ] Public API returns Cache-Control headers
- [ ] No hardcoded WordPress URLs in frontend components
- [ ] Environment variables never logged or exposed
- [ ] Rate limiter utility created in /lib

## Security Best Practices

1. Never expose credentials: Use environment variables only, never hardcode
2. Always authenticate: Every WordPress API request must use auth headers
3. Cache aggressively: Reduce load on WordPress backend
4. Rate limit: Prevent abuse of API routes
5. Validate input: Sanitize all user inputs before sending to WordPress
6. Monitor access: Log failed authentication attempts

## Example: Adding a New Cached Endpoint

```typescript
// lib/wp.ts
export async function getPrograms() {
  const res = await fetch(`${API_URL}/program?_embed`, {
    headers: getAuthHeaders(),
    next: { revalidate: 180 }
  });
  if (!res.ok) throw new Error('Failed to fetch programs');
  return enrichPosts(await res.json());
}

// app/api/programs/route.ts
export const revalidate = 180;

export async function GET() {
  const programs = await getPrograms();
  return Response.json(programs, {
    headers: { 'Cache-Control': 'public, s-maxage=180' }
  });
}