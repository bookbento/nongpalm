'use client';

import { useEffect, useRef } from 'react';
import { ATELIER_IMAGE } from '@/lib/data';

export default function Atelier() {
  const ref = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      const img = imgRef.current;
      if (!el || !img) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2 - vh / 2;
      const t = -center * 0.18;
      img.style.transform = `translate3d(0, ${t}px, 0) scale(1.18)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={ref}
      id="atelier"
      className="relative h-[120vh] md:h-[140vh] overflow-hidden bg-ink text-paper"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={ATELIER_IMAGE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scale(1.18)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/10 to-ink/70" />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex justify-between px-6 md:px-10 pt-28 md:pt-32 eyebrow text-paper/80">
            <span>— The Atelier</span>
            <span className="hidden md:inline">N° 014 · Via dei Servi, Firenze</span>
          </div>

          <div className="flex-1 flex items-center px-6 md:px-10">
            <div className="reveal max-w-4xl">
              <h2 className="display text-[14vw] md:text-[8vw] leading-[0.92] text-paper">
                Crafted by
                <br />
                hand. <em className="display-italic">Worn</em>
                <br />
                for life.
              </h2>
            </div>
          </div>

          <div className="px-6 md:px-10 pb-16 md:pb-20 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <p className="reveal md:col-span-5 text-paper/85 text-[16px] leading-[1.7] max-w-md">
              Eleven artisans, two cutters, one master tailor. We do not make more than the room can finish. Garments leave the atelier with a hand-written number and the initials of the seamstress who closed the last seam.
            </p>
            <div className="reveal md:col-span-3 md:col-start-7">
              <div className="display text-[44px] md:text-[56px] ui-num leading-none">62</div>
              <div className="ui-label text-paper/70 mt-2">Years in continuous practice</div>
            </div>
            <div className="reveal md:col-span-3">
              <a href="#" className="ui-label text-paper btn-line">
                Visit the Atelier →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
