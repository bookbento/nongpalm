'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import type { Category, Product } from '@harlowe/shared';
import AppShell from '@/components/AppShell';
import ProductForm from '@/components/ProductForm';
import { api, ApiError } from '@/lib/api';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function EditProductPage({ params }: PageProps) {
  const { slug } = use(params);
  const [data, setData] = useState<{ product: Product; categories: Category[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getProduct(slug), api.listCategories()])
      .then(([product, categories]) => setData({ product, categories }))
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Failed to load product'));
  }, [slug]);

  return (
    <AppShell>
      <div className="mb-6">
        <Link href="/products" className="text-[13px] text-muted hover:text-ink">← Products</Link>
        <h1 className="mt-1 text-[22px] font-semibold tracking-tight">
          {data ? `Edit · ${data.product.name}` : 'Edit product'}
        </h1>
      </div>

      {error && <p role="alert" className="card border-accent/30 bg-accent-soft text-[13px] text-accent">{error}</p>}
      {!data && !error && <p className="text-[14px] text-muted">Loading…</p>}
      {data && <ProductForm categories={data.categories} product={data.product} />}
    </AppShell>
  );
}
