---
schema-version: "1.0"
name: feature-development-guide
description: Detailed guide for implementing the feature backlog items
---

# Feature Development Guide - Priority Tasks

## Task 1: Fix WordPress Security & Implement Proper Caching (HIGH)

Goal: Prevent unauthorized database access and reduce load on WordPress backend

Tasks:
1. Verify WP_USER + WP_APP_PASSWORD in .env.local
2. Audit all API calls in /lib/wp.ts - ensure auth headers used
3. Create /app/api/ route handlers that wrap WordPress calls
4. Implement ISR caching (revalidate: 180)
5. Add rate limiting utility to /lib
6. Remove any direct WordPress URLs from frontend components

Reference:
- See SKILL.md: wordpress-integration-security
- Pattern: lib/wp.ts → app/api/*/route.ts → components

Testing:
- Try accessing WordPress API directly - should get 401 Unauthorized
- Verify posts load correctly through /api/posts
- Check Network tab: posts should be cached for 3+ minutes

Files to Create/Modify:
- /lib/rate-limiter.ts (new)
- /app/api/posts/route.ts (new)
- /app/api/programs/route.ts (new)
- /app/api/categories/route.ts (new)
- /lib/wp.ts (verify auth)

---

## Task 2: Add Publicity/Ads to Main Pages (HIGH)

Goal: Implement advertising sections similar to posts, across multiple pages

Where to add:
- Homepage (between hero and news feed)
- Category pages (sidebar)
- Program pages (sidebar)
- Sports pages (sidebar)

Pattern:
```typescript
// components/ad-section.tsx
interface AdProps {
  position: 'sidebar' | 'featured' | 'inline';
  category?: string;
}

export function AdSection({ position, category }: AdProps) {
  // Fetch from WordPress custom post type 'advertisement'
}
```

Data Source Options:
- Create WordPress custom post type for ads
- Use ACF (Advanced Custom Fields) for manual ad placement
- Create /api/ads endpoint

Reference Components:
- components/news.tsx (featured section pattern)
- components/sidebar-widget.tsx (sidebar pattern)

Testing:
- Ads display correctly on all page sizes
- Ads don't break layout or SEO
- Ad links track clicks (optional analytics)

---

## Task 3: Create Fixed Programs System for GaiaPlay (HIGH)

Goal: Separate "scheduled programs" from "fixed programs" (episodes for GaiaPlay)

Key Difference:
- Scheduled Programs: Live TV, recurring shows (current system)
- Fixed Programs: Pre-recorded episodes, series for on-demand viewing

Implementation:
1. Create new WordPress custom post type: fixed_program
2. Create /lib/fixed-programs.ts with fetch function
3. Create /app/fixed-programs/ route
4. Create components:
   - fixed-programs-grid.tsx (list view)
   - fixed-program-card.tsx (individual card)
   - fixed-program-player.tsx (video player with episodes)

Data Structure (WordPress):
```json
{
  "id": 123,
  "title": "Episode Title",
  "series": "Show Name",
  "thumbnail": "...",
  "video_url": "...",
  "episodes": [
    { "number": 1, "title": "Ep 1", "url": "..." },
    { "number": 2, "title": "Ep 2", "url": "..." }
  ]
}
```

Reference:
- Pattern: programs.tsx (scheduled programs)
- Video player: minplayer.tsx

Pages to Create:
- /app/fixed-programs/page.tsx (list all episodes)
- /app/fixed-programs/[slug]/page.tsx (episode details + player)

---

## Task 4: Digital Newspaper Plugin (MEDIUM)

Goal: Receive PDF files and convert to digital newspaper format with pages

Requirements:
1. Upload PDF to WordPress
2. Parse PDF pages
3. Display as flipbook/digital paper
4. Add navigation (prev/next page, thumbnails)

Implementation Options:
- Option A: Use PDF.js library for rendering
- Option B: Convert PDFs to images server-side (via WordPress plugin)
- Option C: Embed PDF viewer (simpler but less featured)

Component Structure:
```typescript
// components/digital-newspaper.tsx
interface NewspaperProps {
  pdfUrl: string;
  title: string;
  date: string;
}

export function DigitalNewspaper({ pdfUrl, title, date }: NewspaperProps) {
  // Render PDF with page navigation
}
```

Pages:
- /app/jornais/ (list newspapers by date)
- /app/jornais/[slug] (view newspaper with PDF viewer)

Technology:
- react-pdf or pdf.js (library)
- Optional: ImageMagick via WordPress for PDF→Image conversion

---

## Task 5: Vira Parceiro Business Contact Page (MEDIUM)

Goal: Create professional business partnership contact page with business details

Content Sections:
1. Hero - Become a Partner tagline
2. Benefits - Why partner with us (grid)
3. Contact Form - Company name, email, phone, message
4. Business Details - Location, phone, email, hours
5. FAQ - Partnership questions

Pattern:
- Use hero.tsx for hero section
- Create form component (similar to page.tsx)
- Add company info section

Pages:
- /app/vira-parceiro/page.tsx (new page)

Features:
- Responsive form with validation
- Email notification on submission
- Optional: Map showing location
- Social links (LinkedIn, etc.)

---

## Task 6: Improve Category & Slug Pages (MEDIUM)

Goal: Make category and slug pages less similar, more valuable

Current Issues:
- Both show only news feeds
- Minimal differentiation
- Low engagement/retention

Improvements for /categoria/[slug]:
1. Category header with description + stats
2. Featured posts (sticky/pinned)
3. News grid (instead of just feed)
4. Most Read sidebar
5. Category-specific filters (date, popularity)
6. Related categories

Improvements for /desporto/[slug] (Sports):
1. Team/league header
2. Latest game scores/standings
3. Article grid
4. Stats sidebar
5. Upcoming events/schedule

Components to Create/Modify:
- category-hero.tsx (new - category header)
- category-filters.tsx (new - filter UI)
- most-read-widget.tsx (new - sidebar)
- Modify page.tsx
- Modify page.tsx

Data Needed from WordPress:
- Category description (add to WordPress category)
- Featured posts ACF field
- Post view count/analytics

---

## Task 7: Trending News Section with WordPress ACF (LOW)

Goal: Display editor-selected trending articles on homepage

Implementation:
1. Add ACF field to WordPress articles: Mark as Trending
2. Create /api/trending endpoint
3. Display on homepage and category pages
4. Show Trending badge on articles

Component:
```typescript
// components/trending-news.tsx
export function TrendingNews() {
  // Fetch trending posts from /api/trending
  // Display in featured section
}
```

ACF Setup (WordPress):
- Add checkbox field to posts: Is Trending?
- Limit to 5 trending articles at a time
- Set expiration (auto-untrend after 7 days)

Pages:
- Add section to page.tsx (homepage)
- Add section to /app/noticias/page.tsx (news page)

---

## Implementation Order Recommendation

1. Week 1: Security + Caching (Task 1)
2. Week 2: Trending News (Task 7) - quick win for homepage
3. Week 3: Fixed Programs (Task 3) - core feature
4. Week 4: Publicity/Ads (Task 2) - revenue feature
5. Week 5: Improve Category Pages (Task 6) - engagement boost
6. Week 6: Vira Parceiro (Task 5) - business page
7. Week 7+: Digital Newspaper (Task 4) - complex feature

Each task should trigger corresponding Agent Mode:
- Use @feature for implementation
- Use @debug if issues arise
- Use @security for auth/validation
- Use @refactor after feature complete