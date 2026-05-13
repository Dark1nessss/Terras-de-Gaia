# Terras de Gaia - TODO List

## PRIORITY: CRITICAL - Security & Infrastructure

### 1. Fix WordPress Security & Implement Proper Caching
**Goal**: Prevent unauthorized database access, secure authentication

#### 1.1 Authentication & API Protection
- [ ] Verify WP_USER + WP_APP_PASSWORD in .env.local
- [ ] Audit all API calls in /lib/wp.ts - ensure auth headers used everywhere
- [ ] Remove any direct WordPress URLs from frontend components
- [ ] Create API route handlers that wrap WordPress calls (/app/api/*)
- [ ] Ensure no hardcoded credentials anywhere

#### 1.2 Implement ISR Caching Strategy
- [ ] Set revalidate: 180 (3 min) for posts endpoints
- [ ] Set revalidate: 180 (3 min) for programs endpoints
- [ ] Set revalidate: 180 (3 min) for categories endpoints
- [ ] Add Cache-Control headers to API responses
- [ ] Implement stale-while-revalidate strategy

#### 1.3 Rate Limiting
- [ ] Create /lib/rate-limiter.ts utility
- [ ] Implement 10 requests/minute limit on all public API routes
- [ ] Add IP-based tracking for rate limiting
- [ ] Return 429 status for exceeded limits

#### 1.4 API Routes to Create/Secure
- [ ] /app/api/posts/route.ts (with caching + rate limiting)
- [ ] /app/api/programs/route.ts (with caching + rate limiting)
- [ ] /app/api/categories/route.ts (with caching + rate limiting)
- [ ] /app/api/trending/route.ts (with caching + rate limiting)
- [ ] /app/api/ads/route.ts (with caching + rate limiting)

---

## PRIORITY: HIGH - Feature Development

### 2. Create Trending News Section (WordPress ACF)
**Goal**: Display editor-selected trending articles with ACF integration

#### 2.1 WordPress Setup
- [ ] Add ACF field to posts: "Mark as Trending" (checkbox)
- [ ] Configure to limit 5 trending articles at a time
- [ ] Add expiration rule (auto-untrend after 7 days)

#### 2.2 Frontend Implementation
- [ ] Create /lib/trending.ts to fetch trending posts
- [ ] Create /app/api/trending/route.ts endpoint
- [ ] Create components/trending-news.tsx component
- [ ] Add trending section to /app/page.tsx (homepage)
- [ ] Add trending section to /app/noticias/page.tsx (news page)
- [ ] Add "Trending" badge to articles marked as trending

### 3. Add Publicity/Ads to Multiple Pages
**Goal**: Implement advertising sections across all main pages

#### 3.1 WordPress Ads Setup
- [ ] Create WordPress custom post type: 'advertisement'
- [ ] Add ACF fields: position, category, start_date, end_date
- [ ] Add featured image for ad creative

#### 3.2 Frontend Ad Components
- [ ] Create /lib/ads.ts to fetch advertisements
- [ ] Create components/ad-section.tsx (supports sidebar/featured/inline)
- [ ] Create /app/api/ads/route.ts endpoint

#### 3.3 Ad Placement Across Pages
- [ ] Add to homepage (between hero and news feed)
- [ ] Add to /categoria/[slug] (sidebar)
- [ ] Add to /desporto/[slug] (sidebar)
- [ ] Add to /programas/ (sidebar)
- [ ] Add to /gaia-play/ (sidebar)

### 4. Create Fixed Programs System for GaiaPlay
**Goal**: Separate scheduled programs from fixed programs (on-demand episodes)

#### 4.1 WordPress Custom Post Type
- [ ] Create 'fixed_program' custom post type in WordPress
- [ ] Add ACF fields: series, episode_number, video_url, description
- [ ] Add featured image (thumbnail)

#### 4.2 Frontend Components
- [ ] Create /lib/fixed-programs.ts fetch function
- [ ] Create components/fixed-programs-grid.tsx (list view)
- [ ] Create components/fixed-program-card.tsx (card component)
- [ ] Create components/fixed-program-player.tsx (video player with episodes)

#### 4.3 Routes & Pages
- [ ] Create /app/fixed-programs/page.tsx (list all episodes)
- [ ] Create /app/fixed-programs/[slug]/page.tsx (episode details + player)
- [ ] Integrate into existing GaiaPlay section
- [ ] Create /app/api/fixed-programs/route.ts endpoint

---

## PRIORITY: MEDIUM - Content & UX

### 5. Create "Vira Parceiro" Business Contact Page
**Goal**: Professional business partnership page with company details

#### 5.1 Page Structure
- [ ] Create /app/vira-parceiro/page.tsx
- [ ] Hero section - Become a Partner tagline
- [ ] Benefits grid - Why partner with Terras de Gaia
- [ ] Contact form - Company name, email, phone, message
- [ ] Business details section - Location, phone, email, hours
- [ ] FAQ section - Partnership questions

#### 5.2 Features
- [ ] Responsive form with validation
- [ ] Email notification on submission (to admin)
- [ ] Optional: Map showing location
- [ ] Social links (LinkedIn, etc.)
- [ ] Professional styling following newspaper design

### 6. Improve Newspaper Category & Slug Pages
**Goal**: Make category pages and slug pages more distinctive and valuable

#### 6.1 Category Pages (/categoria/[slug])
- [ ] Create category-hero.tsx component (header with description + stats)
- [ ] Add category description from WordPress
- [ ] Display post count and last updated date
- [ ] Show featured/sticky posts at top
- [ ] Create category-filters.tsx for date/popularity filtering
- [ ] Add "Most Read" sidebar widget
- [ ] Display related categories

#### 6.2 Sports Pages (/desporto/[slug])
- [ ] Enhance team/league header section
- [ ] Add latest scores/standings if available
- [ ] Create most-read-widget.tsx for sidebar
- [ ] Show upcoming events/schedule
- [ ] Add team stats sidebar

#### 6.3 Shared Improvements
- [ ] Create "Artigos Relacionados" widget (3-5 related posts)
- [ ] Add category-specific styling/colors
- [ ] Implement category statistics display
- [ ] Add pagination or infinite scroll
- [ ] Cache related posts for 1 hour

---

## PRIORITY: MEDIUM-LOW - Advanced Features

### 7. Digital Newspaper Plugin (PDF to Web)
**Goal**: Convert PDF newspapers into interactive digital format

#### 7.1 WordPress Setup
- [ ] Create 'newspaper' custom post type
- [ ] Add ACF field for PDF upload
- [ ] Add publication date field

#### 7.2 PDF Processing (Choose Implementation)
- [ ] Option A: Use react-pdf library for browser rendering
- [ ] Option B: Server-side conversion (PDF to images via ImageMagick)
- [ ] Option C: Embed PDF viewer (simpler)

#### 7.3 Frontend Components
- [ ] Create components/digital-newspaper.tsx component
- [ ] Add page navigation (prev/next page)
- [ ] Add thumbnail preview panel
- [ ] Add fullscreen option
- [ ] Add download functionality

#### 7.4 Routes
- [ ] Create /app/jornais/ (list newspapers by date)
- [ ] Create /app/jornais/[slug] (view newspaper with PDF viewer)
- [ ] Create /app/api/newspapers/route.ts endpoint

---

## PRIORITY: LOW - Code Quality & Optimization

### 8. Code Quality & Refactoring

#### 8.1 Reusable Components
- [ ] Extract sidebar widget pattern as reusable component
- [ ] Create RelatedPosts component
- [ ] Create PostGrid component variants
- [ ] Standardize breadcrumb usage across pages

#### 8.2 API Organization
- [ ] Document all API endpoints in /lib/api.ts
- [ ] Add error handling & retry logic
- [ ] Implement consistent response format
- [ ] Add request/response logging for debugging

#### 8.3 Testing & Validation
- [ ] Test all pages on mobile viewport
- [ ] Test category pages responsiveness
- [ ] Test sidebar widgets on small screens
- [ ] Verify infinite scroll works with new components
- [ ] Test with slow network (3G simulation)

### 9. Performance Optimizations

- [ ] Optimize all images (use next/image component)
- [ ] Add loading states for async content
- [ ] Implement lazy loading for below-the-fold sections
- [ ] Monitor bundle size and Core Web Vitals
- [ ] Set up performance monitoring/alerts

---

## Implementation Timeline Recommendation

**Week 1**: Security & Caching (Task 1) - CRITICAL
**Week 2**: Trending News (Task 2) - Quick win for engagement
**Week 3**: Fixed Programs (Task 4) - Core feature for GaiaPlay
**Week 4**: Publicity/Ads (Task 3) - Revenue feature
**Week 5**: Category Page Improvements (Task 6) - Better UX
**Week 6**: Vira Parceiro (Task 5) - Business page
**Week 7+**: Digital Newspaper (Task 7) - Complex feature

---

## Notes & Conventions

- All new components follow existing patterns (news.tsx, programs.tsx, test.tsx)
- Use Tailwind CSS + Framer Motion for animations
- Always use TypeScript with strict mode
- WordPress API calls must use getAuthHeaders()
- Apply DRY principle - extract reusable utilities to /lib
- Keep components under 300 lines
- Use ISR caching strategy (revalidate: 180)
- Maintain dark theme (#0a0c10 bg, #00a6f0 accent)
- Document all breaking changes
- Test responsiveness on mobile, tablet, desktop