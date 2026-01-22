# XACT.LU - Comprehensive Code Audit Checklist

## Executive Summary
Full code audit completed. Found **47 issues** across security, performance, accessibility, SEO, and bugs.

---

## CRITICAL ISSUES (Fix Immediately)

### Security
- [ ] **API: No authentication on `/api/user/messages` POST** - Anyone can spam property owners
- [ ] **API: No password strength validation in registration** - Accepts single character passwords
- [ ] **API: Email enumeration vulnerability** - "Email already registered" reveals user existence
- [ ] **API: No input validation on listing creation** - Accepts any data without validation
- [ ] **API: File upload MIME type bypass** - Only checks MIME, not file signatures
- [ ] **Auth: No account lockout mechanism** - Unlimited login attempts allowed
- [ ] **Auth: Timing attack vulnerability** - Can determine if email exists by response time
- [ ] **Auth: No rate limiting** - Brute force attacks possible on all auth endpoints

### Bugs (Fixed)
- [x] **Homepage: Featured properties not showing on first load** - Fixed with animation key change

---

## HIGH PRIORITY ISSUES

### Security
- [ ] **Middleware: No rate limiting on protected routes**
- [ ] **Upload: User ID used directly in file path without sanitization**
- [ ] **Translate API: No rate limiting, could exhaust daily quota**
- [ ] **next.config.ts: Wildcard `*.supabase.co` allows any Supabase project**

### Performance
- [ ] **All pages are client components** - Cannot use Server Components for faster initial load
- [ ] **No pagination on user favorites, listings, messages APIs**
- [ ] **Property detail API: Missing cache headers**
- [ ] **N+1 query pattern in property detail (similar properties)**

### SEO (Major Impact)
- [ ] **No metadata exports on any public page** - All pages are "use client"
- [ ] **No structured data (JSON-LD)** for property listings
- [ ] **Root layout: Static `lang="en"`** - Should be dynamic based on locale
- [ ] **Missing Open Graph and Twitter metadata**

---

## MEDIUM PRIORITY ISSUES

### Accessibility
- [ ] **All dropdowns: Missing keyboard navigation** (Header, Language Switcher)
- [ ] **All dropdowns: Missing ARIA attributes** (`aria-expanded`, `aria-haspopup`)
- [ ] **Form inputs: Use placeholder instead of visible labels** (Contact, Property Detail)
- [ ] **Gallery modal: Missing `role="dialog"` and `aria-modal="true"`**
- [ ] **Footer: Social links lack accessible names** (only SVG icons)
- [ ] **FavoriteButton: Missing `aria-pressed` for toggle state**
- [ ] **Cookie consent: Custom toggles lack proper ARIA roles**
- [ ] **Card component: `h3` used unconditionally, may break heading hierarchy**

### Performance
- [ ] **Header: 518 lines, should be split into smaller components**
- [ ] **Header: Memoized handlers defined but inline functions used instead**
- [ ] **Homepage: `[...Array(3)]` creates new array on every render**
- [ ] **Properties page: Double fetch on load** (URL params applied after initial fetch)
- [ ] **About page: Multiple `useScroll` hooks could be consolidated**
- [ ] **Estimate page: Memory leak - `URL.createObjectURL` never revoked**
- [ ] **Utils: `Intl.NumberFormat` created on every call** - Should cache formatters

### Code Quality
- [ ] **package.json: Prisma version mismatch** - adapter v7 vs client v5
- [ ] **package.json: Build tools in production dependencies** (autoprefixer, postcss, prisma CLI)
- [ ] **Register API: TypeScript `as any` cast masking type issues**
- [ ] **Listings API: Slug uniqueness logic is flawed** - May create collisions

### Missing Error Handling
- [ ] **No global error boundary** in root layout
- [ ] **Cookie consent: No try-catch for localStorage access**
- [ ] **Prisma: No graceful shutdown handling**
- [ ] **Upload API: No cleanup of orphaned files on partial failure**

---

## LOW PRIORITY ISSUES

### Polish
- [ ] **Property detail: Uses browser `alert()` for clipboard** - Should use toast
- [ ] **Contact page: Form only logs to console** - No backend submission
- [ ] **Estimate page: Form only logs to console** - No backend submission
- [ ] **Footer: Social links use `href="#"`** - Should be real URLs
- [ ] **Stats API: `satisfiedClients: "98%"` is hardcoded** - Not from real data

### Code Organization
- [ ] **Animation variants scattered across files** - Should centralize
- [ ] **Multiple components missing `memo` wrapper** (Footer, LanguageSwitcher, CookieConsent)
- [ ] **Card components missing `forwardRef`**

### Documentation
- [ ] **No README with setup instructions**
- [ ] **No API documentation**
- [ ] **No environment variables documentation**

---

## MISSING FEATURES

### Essential
- [ ] **User dashboard: Update listings endpoint** (PATCH/PUT)
- [ ] **User dashboard: Delete listings endpoint**
- [ ] **Messages: Mark as read endpoint**
- [ ] **Messages: Delete endpoint**
- [ ] **Email verification flow** - Users can login without verifying
- [ ] **Password reset flow**
- [ ] **404 page**
- [ ] **500 error page**

### Nice to Have
- [ ] **Property comparison feature**
- [ ] **Saved searches with notifications**
- [ ] **Property views/analytics**
- [ ] **Agent profiles page**
- [ ] **Blog/News section**
- [ ] **Sitemap.xml generation**
- [ ] **robots.txt**

---

## QUICK WINS (Easy to Fix)

1. Add `aria-label` to icon-only buttons/links
2. Add `aria-hidden="true"` to decorative SVGs
3. Cache `Intl.NumberFormat` instances in utils.ts
4. Add try-catch around localStorage in cookie consent
5. Add password minimum length validation (8+ chars)
6. Add cache headers to property detail API
7. Fix the hardcoded `lang="en"` to use locale
8. Move animation variants to shared constants file
9. Add `memo` to Footer component
10. Revoke object URLs in estimate page cleanup

---

## RECOMMENDED PRIORITY ORDER

### Phase 1: Security (This Week)
1. Add authentication to messages POST endpoint
2. Add password strength validation
3. Fix email enumeration (generic error message)
4. Add rate limiting middleware
5. Add input validation library (Zod)

### Phase 2: SEO & Performance (Next Week)
1. Convert key pages to Server Components or add generateMetadata
2. Add structured data for properties
3. Fix locale in html lang attribute
4. Add pagination to list endpoints
5. Add cache headers where missing

### Phase 3: Accessibility (Following Week)
1. Add keyboard navigation to dropdowns
2. Add proper ARIA attributes
3. Replace placeholder-only inputs with visible labels
4. Add proper roles to modal/dialog components

### Phase 4: Polish & Features
1. Add missing CRUD endpoints
2. Add email verification
3. Add password reset
4. Add error pages
5. Implement toast notifications

---

## FILES THAT NEED MOST ATTENTION

1. `/src/app/api/auth/register/route.ts` - Security issues
2. `/src/app/api/user/messages/route.ts` - No auth on POST
3. `/src/app/api/user/listings/route.ts` - No validation
4. `/src/components/layout/header.tsx` - Too large, perf issues
5. `/src/app/(main)/page.tsx` - SEO, needs server component
6. `/src/app/(main)/properties/[slug]/page.tsx` - SEO, accessibility
7. `/src/lib/auth.ts` - Security hardening needed

---

*Generated: January 2026*
*Auditor: Claude*
