'use client';

import { useEffect, useState } from 'react';
import Loader from '@/components/loader/Loader';
import Nav from '@/components/nav/Nav';
import Hero from '@/components/hero/Hero';
import Marquee from '@/components/marquee/Marquee';
import Collection from '@/components/collection/Collection';
import Atelier from '@/components/atelier/Atelier';
import Footer from '@/components/footer/Footer';
import MenuOverlay from '@/components/overlays/MenuOverlay';
import SearchOverlay from '@/components/overlays/SearchOverlay';
import { useReveal } from '@/lib/hooks';

export default function Page() {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useReveal();

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : '';
  }, [menuOpen, searchOpen]);

  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <div
        className={`transition-opacity duration-1000 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Nav
          onOpenMenu={() => setMenuOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
        <main>
          <Hero />
          <Marquee />
          <Collection />
          <Atelier />
        </main>
        <Footer />
      </div>
    </>
  );
}
