# Terras de Gaia - TODO List

## 1. Improve Slug Pages (Categories & Sports)

### 1.1 Enhance Category/Sports Detail Pages
- [ ] Add rich metadata display (post count, last updated date)
- [ ] Improve header section with category description/banner
- [ ] Add category-specific styling/colors
- [ ] Display category statistics (views, articles this month)
- [ ] Implement category filters (by date, popularity, etc.)

### 1.2 Add Page Details
- [ ] Show featured/sticky posts at top
- [ ] Add "Most Read" section per category
- [ ] Display trending posts in category
- [ ] Add category feed refresh indicator
- [ ] Show last update timestamp

### 1.3 Sidebar: Similar News Section
- [ ] Create "Artigos Relacionados" widget on left sidebar
- [ ] Pull posts from same category (exclude current)
- [ ] Show 3-5 recent related posts
- [ ] Add thumbnail + title + date for each
- [ ] Link each related post to its page
- [ ] Use post enricher to get clean data
- [ ] Cache related posts for 1 hour

## 2. Programs Page & WordPress Integration

### 2.1 Create Programs Page
- [ ] Add `/programas` or `/programs` route
- [ ] Create `app/programas/page.tsx`
- [ ] Add breadcrumb navigation
- [ ] Display program grid/list layout
- [ ] Add program filters (by category, time, etc.)

### 2.2 WordPress Programs Section
- [ ] Fetch programs from WordPress REST API
- [ ] Create post enricher for programs
- [ ] Display program videos (if available)
- [ ] Add program schedule/times
- [ ] Link to program details page
- [ ] Cache programs for 1 hour (180s)

### 2.3 Programs Videos Integration
- [ ] Add video player component if videos exist
- [ ] Handle featured media as video embeds
- [ ] Add video download/sharing options
- [ ] Create `app/programas/[slug]/page.tsx` for program details
- [ ] Display episode list for each program
- [ ] Add comments/discussion section

## 3. Code Quality & Optimization

### 3.1 Reusable Components
- [ ] Extract sidebar widget pattern as component
- [ ] Create RelatedPosts component for reuse
- [ ] Create PostGrid component variant for programs
- [ ] Standardize breadcrumb usage across pages

### 3.2 API Routes
- [ ] Create `/api/programs` endpoint with rate limiting
- [ ] Create `/api/programs/[slug]` for details
- [ ] Add program caching at API level
- [ ] Add error handling & retries

### 3.3 Testing
- [ ] Test category pages on mobile
- [ ] Test programs page responsiveness
- [ ] Test sidebar widgets on small screens
- [ ] Verify infinite scroll works with new components

## 4. Performance & UX

- [ ] Optimize images for programs section
- [ ] Add loading states for program videos
- [ ] Implement lazy loading for related posts
- [ ] Monitor page load times
- [ ] Test with slow network speeds

---

## Priority Order
1. **High**: Similar news sidebar (adds user engagement)
2. **High**: Programs page + WordPress integration
3. **Medium**: Enhance category page details
4. **Medium**: Code organization & reusable components
5. **Low**: Performance optimizations & testing

## Notes
- Keep using existing infinite scroll pattern for programs
- Reuse LoadingSpinner component
- Use post enricher pattern for programs data
- Apply rate limiting to all new API endpoints (10 req/min for programs)
- Client-side cache: 5min TTL
- Server-side cache: disabled (force-dynamic pages)