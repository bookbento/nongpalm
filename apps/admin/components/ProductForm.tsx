'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  CURRENCIES,
  formatPrice,
  productCreateSchema,
  type Category,
  type Currency,
  type Product,
  type ProductImage,
  type PurchaseChannel,
} from '@harlowe/shared';
import { api, ApiError } from '@/lib/api';
import { slugify } from '@/lib/slug';
import ImageUploader from './ImageUploader';
import ChannelEditor from './ChannelEditor';

interface ProductFormProps {
  categories: Category[];
  product?: Product; // present => edit mode
}

// Local draft mirrors the product but keeps numeric/list fields as editable
// strings; it is normalized into the schema shape only on submit.
interface Draft {
  name: string;
  slug: string;
  slugTouched: boolean;
  categorySlug: string;
  amount: string;
  currency: Currency;
  display: string;
  description: string;
  composition: string;
  care: string; // one item per line
  sizing: string;
  origin: string;
  images: ProductImage[];
  channels: PurchaseChannel[];
  inStock: boolean;
  featured: boolean;
}

function toDraft(product: Product | undefined, categories: Category[]): Draft {
  if (!product) {
    return {
      name: '', slug: '', slugTouched: false,
      categorySlug: categories[0]?.slug ?? '',
      amount: '', currency: 'THB', display: '',
      description: '', composition: '', care: '', sizing: '', origin: '',
      images: [], channels: [], inStock: true, featured: false,
    };
  }
  return {
    name: product.name,
    slug: product.slug,
    slugTouched: true,
    categorySlug: product.categorySlug,
    amount: String(product.price.amount),
    currency: product.price.currency,
    display: product.price.display ?? '',
    description: product.description,
    composition: product.details.composition,
    care: product.details.care.join('\n'),
    sizing: product.details.sizing,
    origin: product.details.origin,
    images: product.images,
    channels: product.channels,
    inStock: product.inStock,
    featured: product.featured,
  };
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [draft, setDraft] = useState<Draft>(() => toDraft(product, categories));
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  // Auto-derive the slug from the name until the user edits it by hand.
  const onNameChange = (name: string) =>
    setDraft((d) => ({
      ...d,
      name,
      slug: d.slugTouched ? d.slug : slugify(name),
    }));

  const pricePreview = useMemo(() => {
    const amount = Number(draft.amount);
    if (!Number.isFinite(amount)) return null;
    return formatPrice({
      amount,
      currency: draft.currency,
      display: draft.display.trim() || undefined,
    });
  }, [draft.amount, draft.currency, draft.display]);

  const buildInput = () => ({
    slug: draft.slug.trim(),
    name: draft.name.trim(),
    categorySlug: draft.categorySlug,
    price: {
      amount: Number(draft.amount),
      currency: draft.currency,
      ...(draft.display.trim() ? { display: draft.display.trim() } : {}),
    },
    images: draft.images,
    description: draft.description.trim(),
    details: {
      composition: draft.composition.trim(),
      care: draft.care.split('\n').map((s) => s.trim()).filter(Boolean),
      sizing: draft.sizing.trim(),
      origin: draft.origin.trim(),
    },
    channels: draft.channels,
    inStock: draft.inStock,
    featured: draft.featured,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const parsed = productCreateSchema.safeParse(buildInput());
    if (!parsed.success) {
      setErrors(parsed.error.issues.map((i) => `${i.path.join('.') || 'form'}: ${i.message}`));
      return;
    }

    setSaving(true);
    try {
      if (product) {
        await api.updateProduct(product.id, parsed.data);
      } else {
        await api.createProduct(parsed.data);
      }
      router.push('/products');
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Save failed';
      setErrors([msg]);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="card space-y-4 md:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="field-label">Name</label>
              <input id="name" className="input" value={draft.name}
                onChange={(e) => onNameChange(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="slug" className="field-label">Slug</label>
              <input id="slug" className="input font-mono text-[13px]" value={draft.slug}
                onChange={(e) => setDraft((d) => ({ ...d, slug: slugify(e.target.value), slugTouched: true }))}
                required />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="field-label">Category</label>
            <select id="category" className="input" value={draft.categorySlug}
              onChange={(e) => set('categorySlug', e.target.value)} required>
              {categories.length === 0 && <option value="">No categories</option>}
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="field-label">Description</label>
            <textarea id="description" className="input min-h-24" value={draft.description}
              onChange={(e) => set('description', e.target.value)} required />
          </div>
        </div>

        {/* Pricing */}
        <div className="card space-y-4">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">Price</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label htmlFor="amount" className="field-label">Amount</label>
              <input id="amount" className="input" type="number" min="0" step="0.01"
                value={draft.amount} onChange={(e) => set('amount', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="currency" className="field-label">Currency</label>
              <select id="currency" className="input" value={draft.currency}
                onChange={(e) => set('currency', e.target.value as Currency)}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="display" className="field-label">Display override (optional)</label>
            <input id="display" className="input" placeholder="e.g. From ฿2,400"
              value={draft.display} onChange={(e) => set('display', e.target.value)} />
            {pricePreview && (
              <p className="mt-1.5 text-[12px] text-muted">Shows as <span className="text-ink font-medium">{pricePreview}</span></p>
            )}
          </div>
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 text-[13.5px]">
              <input type="checkbox" checked={draft.inStock} onChange={(e) => set('inStock', e.target.checked)} />
              In stock
            </label>
            <label className="flex items-center gap-2 text-[13.5px]">
              <input type="checkbox" checked={draft.featured} onChange={(e) => set('featured', e.target.checked)} />
              Featured
            </label>
          </div>
        </div>

        {/* Details */}
        <div className="card space-y-4">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">Details</h2>
          <div>
            <label htmlFor="composition" className="field-label">Composition</label>
            <input id="composition" className="input" value={draft.composition}
              onChange={(e) => set('composition', e.target.value)} required />
          </div>
          <div>
            <label htmlFor="care" className="field-label">Care (one per line)</label>
            <textarea id="care" className="input min-h-20" value={draft.care}
              onChange={(e) => set('care', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sizing" className="field-label">Sizing</label>
              <input id="sizing" className="input" value={draft.sizing}
                onChange={(e) => set('sizing', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="origin" className="field-label">Origin</label>
              <input id="origin" className="input" value={draft.origin}
                onChange={(e) => set('origin', e.target.value)} required />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card space-y-3 md:col-span-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">Images</h2>
          <p className="text-[12px] text-muted">First image is the cover. At least one is required.</p>
          <ImageUploader images={draft.images} altFallback={draft.name}
            onChange={(images) => set('images', images)} />
        </div>

        {/* Channels */}
        <div className="card space-y-3 md:col-span-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">Where to buy</h2>
          <p className="text-[12px] text-muted">The primary channel becomes the main “Shop on …” button on the storefront.</p>
          <ChannelEditor channels={draft.channels} onChange={(channels) => set('channels', channels)} />
        </div>
      </div>

      {errors.length > 0 && (
        <ul role="alert" className="card border-accent/30 bg-accent-soft space-y-1 text-[13px] text-accent">
          {errors.map((err, i) => <li key={i}>· {err}</li>)}
        </ul>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
        </button>
        <button type="button" className="btn-ghost" onClick={() => router.push('/products')}>
          Cancel
        </button>
      </div>
    </form>
  );
}
