const ITEMS = [
  'Florence — Atelier 1962',
  'Hand-finished in Italy',
  'Limited Editions',
  'Worn for Life',
  'A Maison, not a House',
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <section className="py-10 md:py-16 border-y border-ink/15 overflow-hidden bg-paper">
      <div className="flex whitespace-nowrap marquee-track">
        {row.map((t, i) => (
          <span
            key={i}
            className="display text-[8vw] md:text-[6vw] px-10 md:px-16 inline-flex items-center gap-10 md:gap-16"
          >
            {t}
            <span className="display-italic text-ink/40 text-[5vw] md:text-[3.5vw]">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
