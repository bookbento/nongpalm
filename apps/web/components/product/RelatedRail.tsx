import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, type Product } from '@/lib/schemas';

interface RelatedRailProps {
  products: Product[];
  eyebrow?: string;
  heading?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export default function RelatedRail({
  products,
  eyebrow = '— Also from this chapter',
  heading,
  ctaHref,
  ctaLabel = 'View all →',
}: RelatedRailProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-24 md:py-32 border-t border-ink/10">
      <div className="px-6 md:px-10 mb-12 md:mb-16 flex items-end justify-between gap-10">
        <div className="reveal">
          <div className="eyebrow text-ink/60 mb-4">{eyebrow}</div>
          {heading && (
            <h2 className="display text-[8vw] md:text-[3.6vw] leading-[0.95]">
              {heading}
            </h2>
          )}
        </div>
        {ctaHref && (
          <Link href={ctaHref} className="ui-label btn-line whitespace-nowrap">
            {ctaLabel}
          </Link>
        )}
      </div>

      <div className="flex gap-6 md:gap-10 overflow-x-auto px-6 md:px-10 pb-2 snap-x">
        {products.map((product, i) => {
          const cover = product.images[0];
          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="reveal shrink-0 w-[72vw] md:w-[28vw] lg:w-[22vw] snap-start"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="img-zoom relative aspect-[3/4] bg-cream overflow-hidden">
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 28vw, 72vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <div className="eyebrow text-ink/55 mb-1">
                    {product.categorySlug.replace(/-/g, ' ')}
                  </div>
                  <div className="display text-[17px] leading-tight">{product.name}</div>
                </div>
                <div className="display ui-num text-[13px] whitespace-nowrap pt-1 text-ink/70">
                  {formatPrice(product.price)}
                </div>
              </div>
            </Link>
          );
        })}
        <div className="shrink-0 w-10" />
      </div>
    </section>
  );
}
