'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Category } from '@harlowe/shared';
import AppShell from '@/components/AppShell';
import ProductForm from '@/components/ProductForm';
import { api, ApiError } from '@/lib/api';

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listCategories()
      .then(setCategories)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Failed to load categories'));
  }, []);

  return (
    <AppShell>
      <div className="mb-6">
        <Link href="/products" className="text-[13px] text-muted hover:text-ink">← Products</Link>
        <h1 className="mt-1 text-[22px] font-semibold tracking-tight">New product</h1>
      </div>

      {error && <p role="alert" className="card border-accent/30 bg-accent-soft text-[13px] text-accent">{error}</p>}
      {!categories && !error && <p className="text-[14px] text-muted">Loading…</p>}
      {categories && <ProductForm categories={categories} />}
    </AppShell>
  );
}
