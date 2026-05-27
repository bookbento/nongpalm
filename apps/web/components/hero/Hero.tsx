'use client';

import { useEffect, useState } from 'react';
import { HERO_SLIDES } from '@/lib/data';

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const total = HERO_SLIDES.length;

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % total);
    }, 6500);
    return () => clearInterval(t);
  }, [total]);

  const go = (n: number) => setIdx(((n % total) + total) % total);
  const slide = HERO_SLIDES[idx];

  return (
    <section
      id="top"
      className="relative h-[100svh] w-full overflow-hidden bg-ink text-paper"
    >
      {/* Slides */}
      {HERO_SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-[1600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`${s.id}-${i === idx}`}
              src={s.image}
              alt=""
              className={`w-full h-full object-cover ${i === idx ? 'ken-burns' : ''}`}
              style={{ transform: 'scale(1.08)' }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/10 to-ink/60" />
        </div>
      ))}

      {/* Top eyebrow */}
      <div className="relative z-10 pt-[110px] md:pt-[130px] px-6 md:px-10 flex items-start justify-between text-paper">
        <div className="eyebrow opacity-80">Autumn / Winter 2026 — Lookbook</div>
        <div className="eyebrow opacity-80 hidden md:block">Filmed at Villa Necchi, Milano</div>
      </div>

      {/* Centered headline */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-[18vh] md:pb-[14vh] px-6 md:px-10">
        <div className="eyebrow text-paper/80 mb-6">— {slide.chapter}</div>
        <div
          key={slide.id}
          className="hero-title is-in display text-paper text-[20vw] md:text-[14vw] leading-[0.88]"
        >
          {slide.headline.map((w, i) => (
            <div key={i} className="word">
              <span style={{ transitionDelay: `${i * 120 + 200}ms` }}>
                {i === 1 ? <em className="display-italic">{w}</em> : w}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8 md:mt-10 flex items-end justify-between">
          <div className="max-w-md">
            <p className="display-italic text-paper/90 text-[18px] md:text-[22px] leading-snug">
              {slide.subline}.
            </p>
            <a
              href="#collection"
              className="ui-label inline-block mt-6 text-paper btn-line"
            >
              Discover the Collection →
            </a>
          </div>
          <div className="hidden md:flex items-end gap-10 text-paper/90">
            <button onClick={() => go(idx - 1)} className="ui-label btn-line">
              Prev
            </button>
            <div className="display text-[28px] flex items-baseline gap-3">
              <span>{String(idx + 1).padStart(2, '0')}</span>
              <span className="text-paper/40 text-[16px]">/</span>
              <span className="text-paper/40 text-[16px]">{String(total).padStart(2, '0')}</span>
            </div>
            <button onClick={() => go(idx + 1)} className="ui-label btn-line">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Side rail */}
      {/* <div className="hidden md:flex absolute z-10 left-10 top-1/2 -translate-y-1/2 flex-col gap-4">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i)}
            className="group flex items-center gap-3"
          >
            <span
              className={`block h-px transition-all duration-700 ${
                i === idx ? 'w-12 bg-paper' : 'w-6 bg-paper/40 group-hover:bg-paper/80'
              }`}
            />
            <span
              className={`ui-num text-[12px] transition-opacity duration-500 ${
                i === idx ? 'text-paper opacity-100' : 'opacity-50 text-paper'
              }`}
            >
              0{i + 1}
            </span>
          </button>
        ))}
      </div> */}

      {/* Scroll cue */}
      <div className="absolute z-10 bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-paper/80">
        <span className="eyebrow">Scroll</span>
        <span className="block w-px h-10 bg-paper/40 origin-top animate-pulse" />
      </div>
    </section>
  );
}
