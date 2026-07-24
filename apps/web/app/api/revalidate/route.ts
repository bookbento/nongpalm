import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * On-demand revalidation hook. The admin (or a Supabase DB webhook) calls this
 * after a product write so the storefront updates immediately instead of
 * waiting out the 300s ISR window in the HTTP repository.
 *
 * Auth: a shared secret in the `x-revalidate-secret` header. When
 * REVALIDATE_SECRET is unset the route is disabled (503) rather than open.
 *
 * Body (all optional): { slug?: string; categorySlug?: string }
 * Always revalidates home + collections; also the specific product/collection
 * pages when their identifiers are provided.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { success: false, error: 'Revalidation is not configured' },
      { status: 503 },
    );
  }

  if (request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  let body: { slug?: unknown; categorySlug?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    // Empty/invalid body is fine — fall back to revalidating the index pages.
  }

  const revalidated: string[] = [];
  const revalidate = (path: string) => {
    revalidatePath(path);
    revalidated.push(path);
  };

  revalidate('/');
  revalidate('/collections');

  if (typeof body.slug === 'string' && body.slug) {
    revalidate(`/products/${body.slug}`);
  }
  if (typeof body.categorySlug === 'string' && body.categorySlug) {
    revalidate(`/collections/${body.categorySlug}`);
  }

  return NextResponse.json({ success: true, revalidated });
}
