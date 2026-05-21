import type { Product } from '@/lib/schemas';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

const layoutSlots: Array<{
  span: string;
  aspect: '3/4' | '4/5' | '1/1';
  offsetY?: string;
}> = [
  { span: 'md:col-span-7', aspect: '4/5' },
  { span: 'md:col-span-5', aspect: '3/4', offsetY: 'md:mt-32' },
  { span: 'md:col-span-5', aspect: '3/4' },
  { span: 'md:col-span-7', aspect: '4/5', offsetY: 'md:mt-16' },
  { span: 'md:col-span-6', aspect: '1/1' },
  { span: 'md:col-span-6', aspect: '4/5', offsetY: 'md:mt-24' },
];

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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 md:gap-x-10 gap-y-20 md:gap-y-32 px-6 md:px-10">
      {products.map((product, i) => {
        const slot = layoutSlots[i % layoutSlots.length];
        return (
          <div key={product.id} className={`${slot.span} ${slot.offsetY ?? ''}`}>
            <ProductCard
              product={product}
              index={i}
              variant="grid"
              aspect={slot.aspect}
            />
          </div>
        );
      })}
    </div>
  );
}
