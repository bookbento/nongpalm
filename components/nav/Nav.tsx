'use client';

import { useScrollDir } from '@/lib/hooks';

type NavProps = {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
};

export default function Nav({ onOpenMenu, onOpenSearch }: NavProps) {
  const { hidden, scrolled } = useScrollDir();

  return (
    <header
      className={`nav-shell fixed top-0 inset-x-0 z-[100] ${
        hidden ? 'nav-hidden' : ''
      } ${
        scrolled
          ? 'bg-paper/90 backdrop-blur-md text-ink border-b border-ink/10'
          : 'bg-transparent text-paper border-b border-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-10 h-[68px] md:h-[78px]">
        <div className="flex items-center gap-8 md:gap-10">
          <button onClick={onOpenMenu} className="ui-label flex items-center gap-3 btn-line">

            Menu
          </button>
          <a href="#collection" className="ui-label hidden md:inline btn-line">
            Collection
          </a>
          <a href="#atelier" className="ui-label hidden md:inline btn-line">
            Atelier
          </a>
        </div>

        <a
          href="#top"
          className="display tracking-[0.22em] text-[18px] md:text-[22px] absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          NONGPALM
        </a>

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
