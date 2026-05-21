'use client';

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const ITEMS = [
  'Womenswear',
  'Menswear',
  'Leather Goods',
  'Eyewear',
  'Footwear',
  'The Archive',
  'Atelier',
];

export default function MenuOverlay({ open, onClose }: MenuOverlayProps) {
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
          {ITEMS.map((t, i) => (
            <li
              key={t}
              className={`display text-[12vw] md:text-[7vw] leading-[1] transition-all duration-700 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 60 + 150}ms` }}
            >
              <a href="#" className="btn-line">
                {i === 1 ? <em className="display-italic">{t}</em> : t}
              </a>
            </li>
          ))}
        </ul>
        <div className="md:col-span-5 md:pt-8">
          <div className="eyebrow text-paper/55 mb-6">— Maison</div>
          <ul className="space-y-3 text-[16px] text-paper/85">
            <li><a className="btn-line" href="#">Our Story</a></li>
            <li><a className="btn-line" href="#">The Journal</a></li>
            <li><a className="btn-line" href="#">Boutiques</a></li>
            <li><a className="btn-line" href="#">Contact</a></li>
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
