# Project Design Direction

This project follows a premium luxury fashion brand aesthetic inspired by modern Gucci-style web experiences.

The website should feel cinematic, elegant, immersive, and high-end.

---

# Core Design Principles

- Minimal but luxurious
- Editorial fashion magazine inspired
- Strong typography hierarchy
- Large visual storytelling sections
- Premium spacing and composition
- Smooth and polished interactions
- High-end animation quality similar to luxury brands and Apple

---

# Visual Style

## Color Palette

Use a clean luxury palette:
- Black
- White
- Warm beige / cream
- Soft gray accents

Avoid overly colorful UI unless specifically requested.

---

## Typography

Typography is extremely important.

Style:
- Elegant
- Editorial
- Luxury fashion magazine feel

Use:
- Large hero typography
- Wide spacing
- Clean readable body text
- Strong contrast between heading and paragraph sizes

Avoid:
- Cartoonish fonts
- Tech startup style typography
- Overly playful UI

---

# Layout Style

The layout should feel immersive and cinematic.

Preferred sections:
- Fullscreen hero sections
- Oversized imagery
- Split layouts
- Editorial grid systems
- Large whitespace usage
- Horizontal image galleries
- Storytelling scroll sections

The website should never feel cramped.

---

# Animation Direction

Animations are a major part of the experience.

All motion should feel:
- Smooth
- Slow
- Elegant
- Premium
- Cinematic

Avoid:
- Bouncy animations
- Fast playful transitions
- Cheap-looking effects

Preferred animation styles:
- Fade-in on scroll
- Smooth image reveal
- Luxury-style parallax
- Smooth horizontal sliding galleries
- Elegant hover transitions
- Cinematic page transitions
- Sticky scrolling sections
- Smooth navbar transitions
- Inertia-like movement

---

# Image Presentation

Images should feel premium and immersive.

Preferred behavior:
- Large fullscreen visuals
- Smooth slideshow transitions
- Cinematic image scaling
- Subtle zoom animations
- Layered image movement
- Interactive gallery sections

Images are one of the main storytelling elements.

---

# UX Direction

The user experience should feel:
- Premium
- Smooth
- Immersive
- Expensive
- Editorial

Scrolling should feel fluid and luxurious.

Every interaction should feel intentional and refined.

---


# SEO & Performance Requirements

SEO is a high priority.

Requirements:

- Use semantic HTML structure

- Proper heading hierarchy (H1 → H2 → H3)

- Server-side rendering where appropriate

- Optimized metadata for every page

- Open Graph and Twitter metadata support

- Dynamic SEO support for scalable pages

- Clean URL structure

- Sitemap generation

- robots.txt support

- Structured data / schema markup when relevant

- Fast loading performance

- Excellent Core Web Vitals

Performance optimization:

- Lazy load non-critical assets

- Optimize animations for GPU acceleration

- Use optimized image delivery

- Avoid layout shift

- Reduce unnecessary re-renders

- Keep bundle sizes optimized

Accessibility:

- Maintain accessibility standards

- Use proper contrast ratios

- Keyboard accessibility support

- Proper aria labels where needed

---

# Important Notes

- Prioritize visual hierarchy and spacing
- Keep UI minimal
- Focus on motion quality
- Maintain responsive behavior across all devices
- Mobile experience must still feel premium
- Avoid generic SaaS-style UI patterns
- Avoid cluttered dashboards unless explicitly requested

The final result should feel closer to a luxury fashion campaign website than a typical corporate website.

---

# Infrastructure & Hosting Plan

Planned production infrastructure (decided, not yet fully implemented):

## Image Storage — Cloudflare R2

- All product/editorial image **files** are stored in **Cloudflare R2** (S3-compatible object storage), served through R2's CDN with a custom domain.
- Chosen because R2 has **zero egress fees**, which suits an image-heavy fashion site with read-heavy traffic.
- **Never store image binaries/base64 in the database.** The DB stores only image **references** (object key/URL) plus metadata (`alt`, `width`, `height`) — keep `width`/`height` to prevent layout shift (CLS).
- Serve optimized formats (**AVIF/WebP**) in multiple sizes via Next.js `<Image>` with `remotePatterns` pointing at the R2 domain. Never serve source-resolution originals.

## Deployment — Railway

- **Railway** hosts the compute: the **NestJS API** (`apps/api`) and the **Next.js web app** (`apps/web`).
- Railway is **not** used to serve image files — that is R2's job.

## Database — Supabase (PostgreSQL)

- Production Postgres is hosted on **Supabase**.
- Prisma connects via `DATABASE_URL` (pooled) and `DIRECT_URL` (direct, for migrations) — the schema already declares both.

## Responsibility split

```
Railway   → NestJS API + Next.js web (compute)
Supabase  → PostgreSQL (data, image references only)
R2        → image files (storage + CDN, free egress)
```