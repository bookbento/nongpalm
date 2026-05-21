import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categoryRepo, productRepo } from '@/lib/repositories';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildSearchIndex } from '@/lib/search';
import SiteChrome from '@/components/layout/SiteChrome';
import Footer from '@/components/footer/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGallery from '@/components/product/ProductGallery';
import ShareButton from '@/components/product/ShareButton';
import RelatedRail from '@/components/product/RelatedRail';
import JsonLd from '@/components/ui/JsonLd';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await productRepo.findAll();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepo.findBySlug(slug);
  if (!product) return {};

  const category = await categoryRepo.findBySlug(product.categorySlug);
  const title = `${product.name} — ${SITE_NAME}`;
  const description = product.description;
  const image = product.images[0];

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `/products/${product.slug}`,
      type: 'website',
      images: [
        {
          url: image.src,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.src],
    },
    other: category
      ? { 'product:category': category.name }
      : {},
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await productRepo.findBySlug(slug);
  if (!product) notFound();

  const [category, allCategories, related] = await Promise.all([
    categoryRepo.findBySlug(product.categorySlug),
    categoryRepo.findAll(),
    productRepo.findByCategory(product.categorySlug),
  ]);
  const searchIndex = await buildSearchIndex();
  const navCategories = allCategories.map((c) => ({ slug: c.slug, name: c.name }));
  const relatedFiltered = related.filter((p) => p.id !== product.id).slice(0, 6);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    category: category?.name ?? product.categorySlug,
    image: product.images.map((img) => img.src),
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: product.price.currency,
      price: product.price.amount,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Nongpalm', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Collections', item: `${SITE_URL}/collections` },
      ...(category
        ? [{
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: `${SITE_URL}/collections/${category.slug}`,
        }]
        : []),
      {
        '@type': 'ListItem',
        position: category ? 4 : 3,
        name: product.name,
        item: `${SITE_URL}/products/${product.slug}`,
      },
    ],
  };

  return (
    <SiteChrome navVariant="solid" searchIndex={searchIndex} categories={navCategories}>
      <JsonLd data={[productJsonLd, breadcrumbJsonLd]} />
      <main className="bg-paper text-ink min-h-screen pt-[68px] md:pt-[78px]">
        <Breadcrumb
          items={[
            { label: 'Nongpalm', href: '/' },
            { label: 'Collections', href: '/collections' },
            ...(category ? [{ label: category.name, href: `/collections/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        <section className="px-6 md:px-10 pt-12 md:pt-16 pb-20 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7">
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            <aside className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
              {category && (
                <div className="eyebrow text-ink/60 mb-6">
                  — {category.name}
                </div>
              )}
              <h1 className="display text-[10vw] md:text-[6vw] lg:text-[4.4vw] leading-[0.95]">
                {product.name.split(',').map((part, i, arr) =>
                  i === 0 ? (
                    <span key={i}>{part}{i < arr.length - 1 && ','}</span>
                  ) : (
                    <em key={i} className="display-italic">{part}</em>
                  )
                )}
              </h1>

              <div className="mt-8 flex items-baseline gap-6">
                <div className="display ui-num text-[28px] md:text-[32px]">
                  {product.price.display}
                </div>
                <span
                  className={`ui-label ${product.inStock ? 'text-ink/65' : 'text-oxblood'
                    }`}
                >
                  {product.inStock ? 'Available' : 'On request'}
                </span>
              </div>

              <p className="mt-10 text-[16px] leading-[1.7] text-ink/80 max-w-md">
                {product.description}
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
                <button
                  type="button"
                  className="ui-label bg-ink text-paper px-8 py-4 hover:bg-ink/85 transition-colors"
                >
                  Add to Bag
                </button>
                <ShareButton
                  url={`/products/${product.slug}`}
                  title={`${product.name} — ${SITE_NAME}`}
                  text={product.description}
                />
              </div>

              <dl className="mt-16 space-y-8 border-t border-ink/15 pt-10">
                <div>
                  <dt className="eyebrow text-ink/55 mb-2">— Composition</dt>
                  <dd className="text-[15px] leading-[1.7] text-ink/85">{product.details.composition}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink/55 mb-2">— Care</dt>
                  <dd>
                    <ul className="text-[15px] leading-[1.7] text-ink/85 space-y-1">
                      {product.details.care.map((c) => (
                        <li key={c}>· {c}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink/55 mb-2">— Sizing</dt>
                  <dd className="text-[15px] leading-[1.7] text-ink/85">{product.details.sizing}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink/55 mb-2">— Origin</dt>
                  <dd className="text-[15px] leading-[1.7] text-ink/85">{product.details.origin}</dd>
                </div>
              </dl>

              {category && (
                <Link
                  href={`/collections/${category.slug}`}
                  className="ui-label btn-line inline-block mt-12"
                >
                  ← Back to {category.name}
                </Link>
              )}
            </aside>
          </div>
        </section>

        {relatedFiltered.length > 0 && category && (
          <RelatedRail
            products={relatedFiltered}
            eyebrow={`— Also from ${category.name}`}
            heading="From the same chapter"
            ctaHref={`/collections/${category.slug}`}
            ctaLabel="View chapter →"
          />
        )}

        <Footer />
      </main>
    </SiteChrome>
  );
}
