import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categoryRepo, productRepo } from '@/lib/repositories';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildSearchIndex } from '@/lib/search';
import SiteChrome from '@/components/layout/SiteChrome';
import Footer from '@/components/footer/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CategoryHero from '@/components/category/CategoryHero';
import ProductGrid from '@/components/product/ProductGrid';
import JsonLd from '@/components/ui/JsonLd';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = await categoryRepo.findAll();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await categoryRepo.findBySlug(slug);
  if (!category) return {};

  const products = await productRepo.findByCategory(slug);
  const firstImage = products[0]?.images[0];
  const ogImage = firstImage?.src ?? category.hero;
  const title = `${category.name} — ${SITE_NAME}`;
  const description = `${category.tagline}. ${category.description}`;

  return {
    title,
    description,
    alternates: { canonical: `/collections/${category.slug}` },
    openGraph: {
      title,
      description,
      url: `/collections/${category.slug}`,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1600,
          height: 2000,
          alt: `${category.name} — ${category.tagline}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = await categoryRepo.findBySlug(slug);
  if (!category) notFound();

  const [products, allCategories] = await Promise.all([
    productRepo.findByCategory(slug),
    categoryRepo.findAll(),
  ]);
  const searchIndex = await buildSearchIndex();
  const navCategories = allCategories.map((c) => ({ slug: c.slug, name: c.name }));

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `${SITE_URL}/collections/${category.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    hasPart: products.map((p) => ({
      '@type': 'Product',
      name: p.name,
      url: `${SITE_URL}/products/${p.slug}`,
      image: p.images[0].src,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Nongpalm', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Collections', item: `${SITE_URL}/collections` },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `${SITE_URL}/collections/${category.slug}`,
      },
    ],
  };

  return (
    <SiteChrome navVariant="over-hero" searchIndex={searchIndex} categories={navCategories}>
      <JsonLd data={[collectionJsonLd, breadcrumbJsonLd]} />
      <main className="bg-paper text-ink min-h-screen">
        <CategoryHero category={category} productCount={products.length} />
        <Breadcrumb
          items={[
            { label: 'Nongpalm', href: '/' },
            { label: 'Collections', href: '/collections' },
            { label: category.name },
          ]}
        />

        <section className="px-6 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28 max-w-4xl">
          <div className="reveal">
            <div className="eyebrow text-ink/60 mb-6">— On this chapter</div>
            <p className="display text-[7vw] md:text-[3.4vw] leading-[1.1] text-ink/90 max-w-3xl">
              {category.description}
            </p>
          </div>
        </section>

        <section className="pb-32 md:pb-48">
          <ProductGrid products={products} />
        </section>

        <Footer />
      </main>
    </SiteChrome>
  );
}
