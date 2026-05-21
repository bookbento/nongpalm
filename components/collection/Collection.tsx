'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Product } from '@/lib/schemas';

interface CollectionProps {
  products: Product[];
}

export default function Collection({ products }: CollectionProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onScroll = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  const scrollBy = (dir: number) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.7), behavior: 'smooth' });
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    const md = (e: MouseEvent | TouchEvent) => {
      down = true;
      startX = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
      startLeft = el.scrollLeft;
    };
    const mm = (e: MouseEvent | TouchEvent) => {
      if (!down) return;
      const x = 'touches' in e ? e.touches?.[0]?.pageX : (e as MouseEvent).pageX;
      if (x == null) return;
      el.scrollLeft = startLeft - (x - startX);
    };
    const mu = () => {
      down = false;
    };
    el.addEventListener('mousedown', md as EventListener);
    el.addEventListener('mousemove', mm as EventListener);
    window.addEventListener('mouseup', mu);
    return () => {
      el.removeEventListener('mousedown', md as EventListener);
      el.removeEventListener('mousemove', mm as EventListener);
      window.removeEventListener('mouseup', mu);
    };
  }, []);

  return (
    <section id="collection" className="py-24 md:py-36 bg-paper">
      <div className="px-6 md:px-10 mb-16 md:mb-24 flex items-end justify-between gap-10">
        <div className="reveal max-w-2xl">
          <div className="eyebrow text-ink/60 mb-6">— The Edit · A/W 2026</div>
          <h2 className="display text-[12vw] md:text-[7.5vw] leading-[0.9]">
            Objects of <em className="display-italic">slow</em>
            <br />
            consequence.
          </h2>
        </div>
        <div className="reveal hidden md:block max-w-xs ui-label text-ink/70 leading-loose">
          Each piece is finished by a single hand in our Florentine atelier, and signed inside the lining.
        </div>
      </div>

      <div
        ref={railRef}
        onScroll={onScroll}
        className="h-snap drag-cursor flex gap-6 md:gap-10 overflow-x-auto px-6 md:px-10 pb-2 select-none"
      >
        {products.map((p, i) => {
          const cover = p.images[0];
          return (
            <article
              key={p.id}
              className="reveal shrink-0 w-[78vw] md:w-[34vw] lg:w-[26vw]"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <Link href={`/products/${p.slug}`} className="block group">
                <div className="img-zoom relative aspect-[3/4] bg-cream overflow-hidden">
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(min-width: 1024px) 26vw, (min-width: 768px) 34vw, 78vw"
                    className="object-cover"
                    draggable={false}
                  />
                  <div className="absolute top-4 left-4 ui-label text-paper mix-blend-difference">
                    N° {String(i + 1).padStart(2, '0')}
                  </div>
                  <span className="absolute bottom-4 right-4 ui-label text-paper bg-ink/40 backdrop-blur-sm px-4 py-2 group-hover:bg-ink transition-colors duration-500">
                    View
                  </span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="eyebrow text-ink/55 mb-1">
                      {p.categorySlug.replace(/-/g, ' ')}
                    </div>
                    <div className="display text-[20px] md:text-[22px] leading-tight">{p.name}</div>
                  </div>
                  <div className="display ui-num text-[16px] whitespace-nowrap pt-1">
                    {p.price.display}
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
        <div className="shrink-0 w-10" />
      </div>

      <div className="px-6 md:px-10 mt-12 flex items-center gap-8">
        <button onClick={() => scrollBy(-1)} className="ui-label btn-line">
          ← Prev
        </button>
        <div className="flex-1 h-px bg-ink/15 relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 h-px bg-ink transition-[width] duration-300"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
        <button onClick={() => scrollBy(1)} className="ui-label btn-line">
          Next →
        </button>
        <Link href="/collections" className="ui-label btn-line hidden md:inline">
          View All →
        </Link>
      </div>
    </section>
  );
}
