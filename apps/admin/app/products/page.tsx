'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  CHANNEL_LABELS,
  formatPrice,
  type Product,
} from '@harlowe/shared';
import AppShell from '@/components/AppShell';
import { api, ApiError } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setProducts(await api.listProducts());
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load products');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onDelete = async (product: Product) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    setDeletingId(product.id);
    setError(null);
    try {
      await api.deleteProduct(product.id);
      setProducts((prev) => prev?.filter((p) => p.id !== product.id) ?? null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Products</h1>
          <p className="mt-0.5 text-[13px] text-muted">
            {products ? `${products.length} items` : 'Loading…'}
          </p>
        </div>
        <Link href="/products/new" className="btn-primary">+ New product</Link>
      </div>

      {error && <p role="alert" className="card mb-4 border-accent/30 bg-accent-soft text-[13px] text-accent">{error}</p>}

      {products && products.length === 0 && (
        <div className="card text-center text-[14px] text-muted">
          No products yet. <Link href="/products/new" className="text-accent underline">Create the first one.</Link>
        </div>
      )}

      {products && products.length > 0 && (
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.id} className="card flex items-center gap-4 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[0]?.src}
                alt={product.images[0]?.alt ?? ''}
                className="h-14 w-14 shrink-0 rounded-lg object-cover bg-line"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[14.5px] font-medium">{product.name}</span>
                  {product.featured && <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">Featured</span>}
                  {!product.inStock && <span className="rounded bg-line px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">Out</span>}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-muted">
                  <span className="font-mono">{product.slug}</span>
                  <span>·</span>
                  <span>{formatPrice(product.price)}</span>
                  {product.channels.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{product.channels.map((c) => CHANNEL_LABELS[c.platform]).join(', ')}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link href={`/products/${product.slug}`} className="btn-ghost">Edit</Link>
                <button
                  className="btn-danger"
                  disabled={deletingId === product.id}
                  onClick={() => onDelete(product)}
                >
                  {deletingId === product.id ? '…' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
