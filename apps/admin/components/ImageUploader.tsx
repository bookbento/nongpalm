'use client';

import { useRef, useState } from 'react';
import type { ProductImage } from '@harlowe/shared';
import { uploadProductImage } from '@/lib/upload';

interface ImageUploaderProps {
  images: ProductImage[];
  altFallback: string;
  onChange: (images: ProductImage[]) => void;
}

/**
 * Ordered image list. First image is the hero/cover everywhere on the
 * storefront, so order matters — hence the move controls. Uploads go straight
 * to Supabase Storage via a signed URL; only the resulting public URL + real
 * dimensions are stored on the product.
 */
export default function ImageUploader({
  images,
  altFallback,
  onChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded: ProductImage[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadProductImage(file, altFallback));
      }
      onChange([...images, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const updateAlt = (index: number, alt: string) => {
    onChange(images.map((img, i) => (i === index ? { ...img, alt } : img)));
  };

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <ul className="space-y-2">
          {images.map((img, i) => (
            <li
              key={img.src}
              className="flex items-center gap-3 rounded-lg border border-line bg-surface p-2.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="h-14 w-14 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <input
                  className="input py-1.5 text-[13px]"
                  value={img.alt}
                  placeholder="Alt text"
                  onChange={(e) => updateAlt(i, e.target.value)}
                />
                <div className="mt-1 text-[11px] text-muted">
                  {i === 0 ? 'Cover · ' : ''}
                  {img.width}×{img.height}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" className="btn-ghost px-2 py-1.5" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" className="btn-ghost px-2 py-1.5" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label="Move down">↓</button>
                <button type="button" className="btn-danger px-2 py-1.5" onClick={() => remove(i)} aria-label="Remove">✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        className="btn-ghost"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? 'Uploading…' : '+ Add images'}
      </button>

      {error && <p role="alert" className="text-[13px] text-accent">{error}</p>}
    </div>
  );
}
