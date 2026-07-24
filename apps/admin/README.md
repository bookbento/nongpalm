# Nongpalm Admin

Private, no-index internal tool for managing the storefront product catalog.
Runs on **http://localhost:3001**.

## What it does

- Email/password login via Supabase Auth (issues the JWT the API verifies)
- Product CRUD: name, slug, category, description, details, stock/featured flags
- **Price** with currency (THB / EUR) and an optional display override
- **Purchase channels** (Shopee, Lazada, TikTok Shop, LINE) with one primary
- **Image upload** straight to Supabase Storage via a signed URL — stores the
  public URL plus real pixel dimensions (no layout shift on the storefront)

All writes go through the NestJS API (`apps/api`); the browser never touches
Postgres directly. The anon key is the only Supabase credential exposed here.

## Setup

```bash
cp .env.example .env.local
# fill in:
#   NEXT_PUBLIC_SUPABASE_URL      https://vvkemwaelkpgqeqjbujt.supabase.co
#   NEXT_PUBLIC_SUPABASE_ANON_KEY  (Supabase → Project Settings → API → anon public)
#   NEXT_PUBLIC_API_URL            http://localhost:4000
```

Then from the repo root: `pnpm --filter admin dev` (or `pnpm dev` for everything).

A Supabase Auth user must exist to log in — create one in the Supabase
dashboard (Authentication → Users) if there isn't one yet.

## Not yet supported

- **Category management.** The API currently exposes categories read-only, so
  they appear as a dropdown here but can't be created/edited from the admin.
  Add `POST/PATCH/DELETE /categories` to `apps/api` to enable it.
