'use client';

import Link from 'next/link';

interface MenuItem {
  label: string;
  href: string;
}

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
  categories: { slug: string; name: string }[];
}

const SECONDARY: MenuItem[] = [
  { label: 'Our Story', href: '/#atelier' },
  { label: 'The Journal', href: '#' },
  { label: 'Boutiques', href: '#' },
  { label: 'Contact', href: '#' },
];

export default function MenuOverlay({ open, onClose, categories }: MenuOverlayProps) {
  const items: MenuItem[] = [
    { label: 'All Collections', href: '/collections' },
    ...categories.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })),
    { label: 'Atelier', href: '/#atelier' },
  ];

  return (
    <div
      className={`fixed inset-0 z-[150] bg-ink text-paper transition-opacity duration-700 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-10 h-[68px] md:h-[78px]">
        <span className="ui-label">Index</span>
        <button onClick={onClose} className="ui-label btn-line">
          Close ✕
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 px-6 md:px-10 pt-12 md:pt-20">
        <ul className="md:col-span-7 space-y-3 md:space-y-5">
          {items.map((item, i) => (
            <li
              key={item.label}
              className={`display text-[12vw] md:text-[7vw] leading-[1] transition-all duration-700 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 60 + 150}ms` }}
            >
              <Link href={item.href} onClick={onClose} className="btn-line">
                {i === 1 ? <em className="display-italic">{item.label}</em> : item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="md:col-span-5 md:pt-8">
          <div className="eyebrow text-paper/55 mb-6">— NONGPALM</div>
          <ul className="space-y-3 text-[16px] text-paper/85">
            {SECONDARY.map((item) => (
              <li key={item.label}>
                <Link className="btn-line" href={item.href} onClick={onClose}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 ui-label text-paper/55">
            Firenze · Paris · Milano · Kyoto
            <br />
            New York · London · Seoul
          </div>
        </div>
      </div>
    </div>
  );
}
