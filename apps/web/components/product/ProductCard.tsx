import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, type Product } from '@/lib/schemas';

type Variant = 'rail' | 'grid' | 'feature';

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: Variant;
  aspect?: '3/4' | '4/5' | '1/1';
}

const widthClass: Record<Variant, string> = {
  rail: 'shrink-0 w-[78vw] md:w-[34vw] lg:w-[26vw]',
  grid: 'w-full',
  feature: 'w-full',
};

const aspectClass: Record<NonNullable<ProductCardProps['aspect']>, string> = {
  '3/4': 'aspect-[3/4]',
  '4/5': 'aspect-[4/5]',
  '1/1': 'aspect-square',
};

export default function ProductCard({
  product,
  index = 0,
  variant = 'grid',
  aspect = '3/4',
}: ProductCardProps) {
  const cover = product.images[0];
  const titleSize =
    variant === 'feature'
      ? 'text-[22px] md:text-[26px]'
      : 'text-[18px] md:text-[20px]';

  return (
    <article
      className={`reveal group ${widthClass[variant]}`}
      style={{ transitionDelay: `${(index % 8) * 60}ms` }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="block"
        aria-label={`View ${product.name}`}
      >
        <div className={`img-zoom relative ${aspectClass[aspect]} bg-cream overflow-hidden`}>
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 26vw, (min-width: 768px) 34vw, 78vw"
            className="object-cover"
            priority={variant === 'feature' && index === 0}
          />
          <div className="absolute top-4 left-4 ui-label text-paper mix-blend-difference">
            N° {String(index + 1).padStart(2, '0')}
          </div>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <div className="eyebrow text-ink/55 mb-1">{product.categorySlug.replace(/-/g, ' ')}</div>
            <div className={`display ${titleSize} leading-tight`}>{product.name}</div>
          </div>
          <div className="display ui-num text-[15px] whitespace-nowrap pt-1 text-ink/75">
            {formatPrice(product.price)}
          </div>
        </div>
      </Link>
    </article>
  );
}
