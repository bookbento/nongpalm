'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProductImage } from '@/lib/schemas';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = images.length;
  const goTo = useCallback(
    (i: number) => setActive(((i % total) + total) % total),
    [total]
  );
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Escape' && zoomed) setZoomed(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, zoomed]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const current = images[active];

  return (
    <>
      <section
        aria-roledescription="carousel"
        aria-label={`${productName} images`}
        className="relative"
      >
        <div
          className="relative aspect-[3/4] md:aspect-[4/5] bg-cream overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setZoomed(true)}
              aria-hidden={i !== active}
              tabIndex={i === active ? 0 : -1}
              className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.22,0.61,0.36,1)] cursor-zoom-in ${
                i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label={`Zoom image ${i + 1} of ${total}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
                priority={i === 0}
              />
            </button>
          ))}

          <div className="absolute top-4 left-4 ui-label text-paper mix-blend-difference">
            {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 text-paper mix-blend-difference ui-label hover:scale-110 transition-transform"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 text-paper mix-blend-difference ui-label hover:scale-110 transition-transform"
          >
            →
          </button>
        </div>

        <div className="mt-6 flex gap-3 md:gap-4">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[3/4] w-20 md:w-24 bg-cream overflow-hidden border transition-colors ${
                i === active ? 'border-ink' : 'border-transparent hover:border-ink/30'
              }`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${productName} — enlarged image`}
        className={`fixed inset-0 z-[200] bg-ink/95 transition-opacity duration-500 ${
          zoomed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setZoomed(false)}
      >
        <button
          type="button"
          onClick={() => setZoomed(false)}
          className="absolute top-6 right-6 ui-label text-paper btn-line"
          aria-label="Close enlarged image"
        >
          Close ✕
        </button>
        {zoomed && current && (
          <div className="absolute inset-8 md:inset-16">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        )}
      </div>
    </>
  );
}
