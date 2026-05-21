'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { SEARCH_INDEX, SUGGESTED_TERMS, RECENT_TERMS } from '@/lib/data';

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      const t = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return SEARCH_INDEX.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.cat || '').toLowerCase().includes(term)
    );
  }, [q]);

  const showEmpty = q.trim().length === 0;
  const noResults = !showEmpty && results.length === 0;

  return (
    <div
      className={`fixed inset-0 z-[160] bg-paper text-ink transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        open
          ? 'opacity-100 pointer-events-auto translate-y-0'
          : 'opacity-0 pointer-events-none -translate-y-4'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-10 h-[68px] md:h-[78px] border-b border-ink/10">
        <span className="ui-label">— Search the Maison</span>
        <button onClick={onClose} className="ui-label btn-line">
          Close ✕
        </button>
      </div>

      <div className="px-6 md:px-10 pt-12 md:pt-20">
        <div className="eyebrow text-ink/55 mb-6">What are you looking for?</div>
        <div className="relative flex items-end border-b border-ink/25 focus-within:border-ink transition-colors pb-3">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="A coat, a colour, a season…"
            className="display flex-1 bg-transparent outline-none text-[8vw] md:text-[5.4vw] leading-[1] placeholder:text-ink/25 text-ink"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className="ui-label text-ink/60 btn-line shrink-0 ml-6 pb-3"
            >
              Clear
            </button>
          )}
          <div className="ui-label text-ink/40 shrink-0 ml-6 pb-3 hidden md:block">
            {showEmpty
              ? '↵ to search'
              : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 pt-12 md:pt-16 pb-20 max-h-[calc(100vh-220px)] overflow-y-auto">
        {showEmpty && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-4">
              <div className="eyebrow text-ink/55 mb-6">— Suggested</div>
              <ul className="space-y-3">
                {SUGGESTED_TERMS.map((t, i) => (
                  <li key={t}>
                    <button
                      onClick={() => setQ(t)}
                      className="display text-[28px] md:text-[34px] leading-tight text-ink/85 hover:text-ink transition-colors btn-line"
                    >
                      {i === 1 ? <em className="display-italic">{t}</em> : t}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <div className="eyebrow text-ink/55 mb-6">— Recent</div>
              <ul className="space-y-3 text-[15px] text-ink/75">
                {RECENT_TERMS.map((t) => (
                  <li key={t}>
                    <button onClick={() => setQ(t)} className="btn-line">
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-10 ui-label text-ink/40">
                Press <span className="ui-num text-ink/70">esc</span> to close
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="eyebrow text-ink/55 mb-6">— Featured</div>
              <div className="grid grid-cols-2 gap-5">
                {SEARCH_INDEX.slice(0, 4).map((p) => (
                  <button
                    key={p.id + p.name}
                    onClick={() =>
                      setQ(p.name.split(',')[0].split(' ').slice(0, 2).join(' '))
                    }
                    className="group text-left"
                  >
                    <div className="img-zoom aspect-[3/4] bg-cream overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-3">
                      <div className="eyebrow text-ink/55 text-[10px]">{p.cat}</div>
                      <div className="display text-[15px] mt-1 leading-tight">{p.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {noResults && (
          <div className="max-w-2xl">
            <h3 className="display text-[8vw] md:text-[4.2vw] leading-[1]">
              No pieces match <em className="display-italic">“{q}”</em>.
            </h3>
            <p className="mt-6 text-ink/70 text-[16px] leading-relaxed max-w-md">
              The collection is intentionally small. Try a category —{' '}
              <button className="btn-line" onClick={() => setQ('Outerwear')}>
                Outerwear
              </button>
              ,{' '}
              <button className="btn-line" onClick={() => setQ('Leather')}>
                Leather
              </button>
              ,{' '}
              <button className="btn-line" onClick={() => setQ('Eyewear')}>
                Eyewear
              </button>{' '}
              — or speak with a Personal Shopper.
            </p>
            <a href="#" className="ui-label btn-line inline-block mt-10">
              Write to the Maison →
            </a>
          </div>
        )}

        {!showEmpty && results.length > 0 && (
          <>
            <div className="ui-label text-ink/55 mb-8">
              {results.length} {results.length === 1 ? 'piece' : 'pieces'} in the Maison
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
              {results.map((p, i) => (
                <a
                  key={p.id + '-' + p.name}
                  href="#collection"
                  onClick={onClose}
                  className="group"
                >
                  <div className="img-zoom relative aspect-[3/4] bg-cream overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 ui-label text-paper mix-blend-difference text-[10px]">
                      N° {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="eyebrow text-ink/55 text-[10px] mb-1">{p.cat}</div>
                      <div className="display text-[16px] leading-tight">{p.name}</div>
                    </div>
                    <div className="display ui-num text-[13px] whitespace-nowrap pt-1 text-ink/75">
                      {p.price}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
