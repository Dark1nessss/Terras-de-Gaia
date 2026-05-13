---
schema-version: "1.0"
description: Agent modes and task routing for different development workflows
---

# Multi-Agent Task Routing

## Available Agent Modes

### Feature Dev Agent
When to use: Building new features (pages, components, features from TODO)

Capabilities:
- Create new pages/routes
- Build reusable components
- Implement WordPress integrations
- Add animations and interactivity
- Set up caching strategies

Example Tasks:
- Create a Vira Parceiro business contact page
- Implement trending news section with WordPress ACF
- Build fixed programs feature for GaiaPlay

Not Allowed:
- Changing deployment configurations
- Modifying CI/CD pipelines
- Deleting existing features without explicit approval

### Debug Agent
When to use: Fixing bugs, investigating errors, optimizing performance

Capabilities:
- Debug existing components
- Optimize performance (images, caching, bundling)
- Fix styling issues
- Resolve API errors
- Improve load times

Example Tasks:
- Fix caching issues - posts not updating
- Optimize images on news pages
- Debug infinite scroll not loading more posts

### Refactor Agent
When to use: Improving code quality, removing duplication, restructuring

Capabilities:
- Extract reusable components
- Consolidate utilities
- Improve type safety
- Apply DRY principle
- Modernize deprecated patterns

Example Tasks:
- Consolidate all news-related components
- Extract sidebar widget pattern to reusable component
- Add proper TypeScript types to all API functions

### Security Agent
When to use: Auditing security, implementing authentication, rate limiting

Capabilities:
- Implement rate limiting
- Add request validation
- Secure API routes
- Audit WordPress integration security
- Review authentication strategies

Example Tasks:
- Implement rate limiting on all API routes
- Audit WordPress API security - ensure auth headers always used
- Add validation to contact forms

## Task Priority Levels

### High Priority
```
[Security] Audit all WordPress API calls - ensure WP_APP_PASSWORD is never exposed
[Feature] Implement proper caching to prevent anyone from querying DB directly
[Feature] Create fixed programs system for GaiaPlay episodes
```

### Medium Priority
```
[Feature] Create Vira Parceiro business page with contact details
[Refactor] Consolidate news and category slug pages - reduce duplication
[Feature] Add publicity/advertising sections to main pages like posts have
```

### Low Priority
```
[Refactor] Extract all sidebar widgets to shared component pattern
[Optimization] Implement lazy loading for below-the-fold images
[Feature] Add analytics tracking to featured content
```

## How to Invoke Agent Modes

Use slash commands in Copilot Chat:

```
@feature Create new [feature name]
@debug Fix issue with [component/page]
@refactor Consolidate [feature] components
@security Audit [component] for security issues
```

Or specify in your prompt:
```
Using feature dev mode: Create a [description]...