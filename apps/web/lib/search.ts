import { productRepo, categoryRepo } from '@/lib/repositories';
import { formatPrice } from '@/lib/schemas';
import type { SearchEntry } from '@/components/overlays/SearchOverlay';

export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const [products, categories] = await Promise.all([
    productRepo.findAll(),
    categoryRepo.findAll(),
  ]);
  const categoryName = new Map(categories.map((c) => [c.slug, c.name]));

  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: categoryName.get(p.categorySlug) ?? p.categorySlug,
    price: formatPrice(p.price),
    image: p.images[0].src,
  }));
}
