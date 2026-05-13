# SECURITY & CACHING SETUP GUIDE

## 1. Environment Variables (.env.local)

Add these to your `.env.local` file:

```bash
# WordPress API
WORDPRESS_API_URL=https://terrasdeGaia.pt/wp-json

# WordPress Authentication (create in WordPress: Settings > Application Passwords)
WP_USER=terras_de_gaia
WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx

# Internal API Token (protect server-to-server requests)
# Generate: openssl rand -base64 32
INTERNAL_API_TOKEN=your_32_character_random_token_here
```

## 2. WordPress Configuration

### A. Restrict REST API Access (via .htaccess or nginx)

**For .htaccess Hosting:**
1. Copy `.htaccess-wordpress` to your WordPress root directory
2. Replace `YOUR_SERVER_IP` with your Next.js server's IP
3. Test with: `curl -i https://terrasdeGaia.pt/wp-json/wp/v2/posts` (should return 403)

**For Nginx:**
```nginx
server {
  server_name terrasdeGaia.pt;

  # Restrict REST API to server IP only
  location ~ ^/wp-json/ {
    allow 127.0.0.1;              # localhost (development)
    allow YOUR_NEXTJS_SERVER_IP;   # production server
    deny all;
  }

  # Restrict admin access
  location ~ ^/wp-admin/ {
    allow YOUR_NEXTJS_SERVER_IP;
    deny all;
  }

  # ... rest of config
}
```

### B. Create WordPress Application Password

1. Go to WordPress Admin → Users → Your User
2. Scroll to "Application Passwords"
3. Create new password with name "Terras de Gaia Server"
4. Copy the generated password to `WP_APP_PASSWORD` in `.env.local`

### C. Disable REST API for Unauthenticated Users (Optional Extra Security)

Add to `wp-config.php`:
```php
// Disable REST API for non-authenticated users
add_filter('rest_authentication_errors', function($result) {
  if (!is_user_logged_in()) {
    return new WP_Error('rest_not_authenticated', 'REST API requires authentication', ['status' => 401]);
  }
  return $result;
});
```

## 3. How It Works

```
Request Flow with Security:

Browser Request
    ↓
Next.js Server
├─ Rate Limit Check (10 req/min per IP)
├─ In-Memory Cache (30s dedup)
├─ ISR Cache (60-3600s)
├─ Auth Header (Basic + WP_APP_PASSWORD)
└─ → WordPress API (only if needed)
    ↓
Response with Cache Headers
    ↓
Browser (cached via ISR)
```

## 4. Testing

### Test Rate Limiting
```bash
# Rapid requests should get 429 after 10 requests
for i in {1..15}; do curl -i https://yourdomain.com/api/posts; done
```

### Test WordPress API Protection
```bash
# Without auth - should fail (403 or 401)
curl https://terrasdeGaia.pt/wp-json/wp/v2/posts

# With Basic Auth - should work (your server only)
curl -u "terras_de_gaia:xxxx xxxx xxxx xxxx" \
  https://terrasdeGaia.pt/wp-json/wp/v2/posts
```

### Test Internal API Token
```bash
# Without token - should fail
curl https://yourdomain.com/api/internal/refresh-cache

# With token - should work
curl -H "X-Internal-Token: $INTERNAL_API_TOKEN" \
  https://yourdomain.com/api/internal/refresh-cache
```

## 5. Monitoring & Logging

Check for security issues:
- Rate limit violations: `console.warn('[RATE LIMIT]'...)`
- Auth failures: `console.warn('[SECURITY]'...)`
- Missing env vars: `console.warn('[SECURITY WARNINGS]'...)`

In production, send these to your monitoring service (Sentry, DataDog, etc.)

## 6. Cache Invalidation

When content changes in WordPress:

**Option A: Manual (via API)**
```bash
curl -H "X-Internal-Token: $INTERNAL_API_TOKEN" \
  -X POST https://yourdomain.com/api/internal/refresh-cache
```

**Option B: ISR Revalidation (automatic)**
- Posts cache for 180s
- Ads cache for 3600s
- After time expires, next request refreshes

**Option C: On-Demand Revalidation**
- Add webhook in WordPress to trigger revalidation
- When post is published/updated, call revalidatePath()

## 7. Production Checklist

- [ ] Set `INTERNAL_API_TOKEN` to 32+ random characters
- [ ] Configure `.htaccess` or nginx with server IP restrictions
- [ ] Create WordPress Application Password
- [ ] Test REST API is blocked from outside
- [ ] Enable HTTPS everywhere
- [ ] Set up monitoring for rate limit violations
- [ ] Test with `NODE_ENV=production`
- [ ] Review environment variables are secure (not in git)
