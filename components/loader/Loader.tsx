'use client';

import { useEffect, useState } from 'react';

type Phase = 0 | 1 | 2 | 3;

type LoaderProps = {
  onDone?: () => void;
};

export default function Loader({ onDone }: LoaderProps) {
  const [phase, setPhase] = useState<Phase>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => {
      setPhase(3);
      onDone?.();
    }, 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  if (phase === 3) return null;

  const letters = 'PALMY'.split('');
  const pct = String(Math.min(100, Math.round((phase / 2) * 100))).padStart(3, '0');

  return (
    <div
      className={`fixed inset-0 z-[200] bg-ink text-paper flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 ${
        phase === 2 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="overflow-hidden">
        <div className="display text-[44px] md:text-[68px] tracking-[0.18em] flex">
          {letters.map((l, i) => (
            <span
              key={i}
              className="loader-letter"
              style={{
                animationDelay: `${i * 60}ms`,
                width: l === ' ' ? '0.5em' : 'auto',
              }}
            >
              {l === ' ' ? ' ' : l}
            </span>
          ))}
        </div>
      </div>
      <div
        className="mt-10 w-[220px] h-px bg-paper/40 origin-left"
        style={{
          transform: phase >= 1 ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 900ms cubic-bezier(0.76,0,0.24,1)',
        }}
      />
      <div className="absolute bottom-10 inset-x-0 flex justify-between px-10 ui-label text-paper/60">
        <span>Florence · Est. 1962</span>
        <span className="ui-num">{pct}</span>
      </div>
    </div>
  );
}
