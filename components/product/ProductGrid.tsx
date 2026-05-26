import type { Product } from '@/lib/schemas';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="px-6 md:px-10 py-32">
        <p className="display text-[8vw] md:text-[4vw] leading-[1] text-ink/60 max-w-3xl">
          The drawer for this chapter is currently <em className="display-italic">empty</em>.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16 px-6 md:px-10">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          index={i}
          variant="grid"
          aspect="3/4"
        />
      ))}
    </div>
  );
}
