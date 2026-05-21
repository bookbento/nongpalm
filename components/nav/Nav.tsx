'use client';

import Link from 'next/link';
import { useScrollDir } from '@/lib/hooks';

interface NavProps {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  variant?: 'over-hero' | 'solid';
}

export default function Nav({ onOpenMenu, onOpenSearch, variant = 'over-hero' }: NavProps) {
  const { hidden, scrolled } = useScrollDir();

  const isSolid = variant === 'solid' || scrolled;

  return (
    <header
      className={`nav-shell fixed top-0 inset-x-0 z-[100] ${
        hidden ? 'nav-hidden' : ''
      } ${
        isSolid
          ? 'bg-paper/90 backdrop-blur-md text-ink border-b border-ink/10'
          : 'bg-transparent text-paper border-b border-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-10 h-[68px] md:h-[78px]">
        <div className="flex items-center gap-8 md:gap-10">
          <button onClick={onOpenMenu} className="ui-label flex items-center gap-3 btn-line">
            Menu
          </button>
          <Link href="/collections" className="ui-label hidden md:inline btn-line">
            Collections
          </Link>
          <Link href="/#atelier" className="ui-label hidden md:inline btn-line">
            Atelier
          </Link>
        </div>

        <Link
          href="/"
          className="display tracking-[0.22em] text-[18px] md:text-[22px] absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          NONGPALM
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          <button onClick={onOpenSearch} className="ui-label hidden md:inline btn-line">
            Search
          </button>
          <button className="ui-label hidden md:inline btn-line">Account</button>
          <button className="ui-label btn-line flex items-center gap-2">
            Bag <span className="ui-num text-[11px]">(2)</span>
          </button>
        </div>
      </div>
    </header>
  );
}
