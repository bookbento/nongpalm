import Image from 'next/image';
import type { Category } from '@/lib/schemas';

interface CategoryHeroProps {
  category: Category;
  productCount: number;
  index?: number;
}

export default function CategoryHero({ category, productCount, index = 0 }: CategoryHeroProps) {
  const chapter = `Chapter ${romanize(category.order)}`;
  return (
    <section className="relative h-[80vh] md:h-[92vh] overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 ken-burns">
        <Image
          src={category.hero}
          alt={`${category.name} — ${category.tagline}`}
          fill
          sizes="100vw"
          priority={index === 0}
          className="object-cover opacity-80"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/60" />

      <div className="relative h-full flex flex-col justify-end px-6 md:px-10 pb-16 md:pb-24">
        <div className="reveal max-w-5xl">
          <div className="eyebrow text-paper/70 mb-6">— {chapter}</div>
          <h1 className="display text-[16vw] md:text-[9.5vw] leading-[0.9]">
            {category.name.split(' ').map((word, i, arr) =>
              i === arr.length - 1 ? (
                <em key={word} className="display-italic">
                  {word}
                </em>
              ) : (
                <span key={word}>{word} </span>
              )
            )}
          </h1>
          <div className="mt-8 md:mt-10 flex items-end justify-between gap-10">
            <p className="ui-label text-paper/85 max-w-md leading-loose">{category.tagline}</p>
            <div className="ui-label text-paper/60 ui-num shrink-0 hidden md:block">
              {String(productCount).padStart(2, '0')} pieces
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function romanize(n: number): string {
  const map: Record<number, string> = {
    1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X',
  };
  return map[n] ?? String(n);
}
