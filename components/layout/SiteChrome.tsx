'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/nav/Nav';
import MenuOverlay from '@/components/overlays/MenuOverlay';
import SearchOverlay, { type SearchEntry } from '@/components/overlays/SearchOverlay';
import Loader from '@/components/loader/Loader';
import { useReveal } from '@/lib/hooks';

interface SiteChromeProps {
  children: React.ReactNode;
  searchIndex: SearchEntry[];
  categories: { slug: string; name: string }[];
  navVariant?: 'over-hero' | 'solid';
  withLoader?: boolean;
}

export default function SiteChrome({
  children,
  searchIndex,
  categories,
  navVariant = 'solid',
  withLoader = false,
}: SiteChromeProps) {
  const [ready, setReady] = useState(!withLoader);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useReveal();

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : '';
  }, [menuOpen, searchOpen]);

  return (
    <>
      {withLoader && <Loader onDone={() => setReady(true)} />}
      <div
        className={`transition-opacity duration-1000 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Nav
          variant={navVariant}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />
        <MenuOverlay
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          categories={categories}
        />
        <SearchOverlay
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          index={searchIndex}
        />
        {children}
      </div>
    </>
  );
}
