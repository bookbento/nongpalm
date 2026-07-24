'use client';

import {
  categorySchema,
  productSchema,
  type Category,
  type Product,
  type ProductCreateInput,
  type ProductUpdateInput,
} from '@harlowe/shared';
import { z } from 'zod';
import { API_URL } from './env';
import { supabase } from './supabase';

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: { total: number; limit: number; offset: number };
}

export interface SignedUpload {
  path: string;
  token: string;
  signedUrl: string;
  publicUrl: string;
}

/** Thrown for any non-2xx API response, carrying the server's message + status. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  init: RequestInit,
  schema: z.ZodType<T>,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      accept: 'application/json',
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...(await authHeader()),
      ...init.headers,
    },
    cache: 'no-store',
  });

  let envelope: ApiEnvelope<unknown>;
  try {
    envelope = (await res.json()) as ApiEnvelope<unknown>;
  } catch {
    throw new ApiError(`${res.status} ${res.statusText}`, res.status);
  }

  if (!res.ok || !envelope.success) {
    throw new ApiError(
      envelope.error ?? `${res.status} ${res.statusText}`,
      res.status,
    );
  }

  return schema.parse(envelope.data);
}

const productArray = z.array(productSchema);
const categoryArray = z.array(categorySchema);

export const api = {
  async listProducts(): Promise<Product[]> {
    // Ask for the full catalog; the admin list is small and unpaginated.
    return request('/products?limit=200', { method: 'GET' }, productArray);
  },

  async getProduct(slug: string): Promise<Product> {
    return request(`/products/${slug}`, { method: 'GET' }, productSchema);
  },

  async createProduct(input: ProductCreateInput): Promise<Product> {
    return request(
      '/products',
      { method: 'POST', body: JSON.stringify(input) },
      productSchema,
    );
  },

  async updateProduct(id: string, patch: ProductUpdateInput): Promise<Product> {
    return request(
      `/products/${id}`,
      { method: 'PATCH', body: JSON.stringify(patch) },
      productSchema,
    );
  },

  async deleteProduct(id: string): Promise<void> {
    await request(
      `/products/${id}`,
      { method: 'DELETE' },
      z.object({ id: z.string() }),
    );
  },

  async listCategories(): Promise<Category[]> {
    return request('/categories', { method: 'GET' }, categoryArray);
  },

  async signImageUpload(filename: string): Promise<SignedUpload> {
    return request(
      '/products/images/sign',
      { method: 'POST', body: JSON.stringify({ filename }) },
      z.object({
        path: z.string(),
        token: z.string(),
        signedUrl: z.string(),
        publicUrl: z.string(),
      }),
    );
  },
};
