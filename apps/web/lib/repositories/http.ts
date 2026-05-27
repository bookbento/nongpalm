import { z } from 'zod';
import {
  productSchema,
  categorySchema,
  type Product,
  type Category,
} from '@/lib/schemas';
import {
  type CategoryRepository,
  type FindAllOptions,
  type ProductRepository,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function apiGet<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { accept: 'application/json' },
    // Storefront data is largely static; revalidate periodically rather than per request.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`API GET ${path} failed: ${res.status} ${res.statusText}`);
  }

  const envelope = (await res.json()) as ApiEnvelope<unknown>;
  if (!envelope.success || envelope.data === undefined) {
    throw new Error(envelope.error ?? `API GET ${path} returned no data`);
  }

  return schema.parse(envelope.data);
}

async function apiGetNullable<T>(
  path: string,
  schema: z.ZodType<T>,
): Promise<T | null> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { accept: 'application/json' },
    next: { revalidate: 300 },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API GET ${path} failed: ${res.status} ${res.statusText}`);
  }

  const envelope = (await res.json()) as ApiEnvelope<unknown>;
  if (!envelope.success || envelope.data === undefined) return null;
  return schema.parse(envelope.data);
}

const productArray = z.array(productSchema);
const categoryArray = z.array(categorySchema);

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export class HttpProductRepository implements ProductRepository {
  async findAll(opts?: FindAllOptions): Promise<Product[]> {
    const query = buildQuery({ limit: opts?.limit, offset: opts?.offset });
    return apiGet(`/products${query}`, productArray);
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return apiGetNullable(`/products/${encodeURIComponent(slug)}`, productSchema);
  }

  async findByCategory(categorySlug: string): Promise<Product[]> {
    return apiGet(`/products${buildQuery({ category: categorySlug })}`, productArray);
  }

  async findFeatured(limit?: number): Promise<Product[]> {
    return apiGet(`/products${buildQuery({ featured: 'true', limit })}`, productArray);
  }

  async create(): Promise<Product> {
    throw new Error('create() is performed by the admin client, not the storefront repository.');
  }

  async update(): Promise<Product> {
    throw new Error('update() is performed by the admin client, not the storefront repository.');
  }

  async delete(): Promise<void> {
    throw new Error('delete() is performed by the admin client, not the storefront repository.');
  }
}

export class HttpCategoryRepository implements CategoryRepository {
  async findAll(): Promise<Category[]> {
    return apiGet('/categories', categoryArray);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return apiGetNullable(`/categories/${encodeURIComponent(slug)}`, categorySchema);
  }
}
