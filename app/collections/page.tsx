import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { categoryRepo, productRepo } from '@/lib/repositories';
import { SITE_NAME } from '@/lib/site';
import SiteChrome from '@/components/layout/SiteChrome';
import Footer from '@/components/footer/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { buildSearchIndex } from '@/lib/search';

export const metadata: Metadata = {
  title: `Collections — ${SITE_NAME}`,
  description:
    'Six chapters of the Maison: outerwear, ready-to-wear, leather goods, footwear, eyewear, and accessories. Each finished by a single hand in our Florentine atelier.',
  alternates: { canonical: '/collections' },
  openGraph: {
    title: `Collections — ${SITE_NAME}`,
    description: 'Six chapters of the Maison — finished by a single hand.',
    url: '/collections',
    type: 'website',
  },
};

export default async function CollectionsPage() {
  const categories = await categoryRepo.findAll();
  const allProducts = await productRepo.findAll();
  const counts = new Map<string, number>();
  for (const p of allProducts) {
    counts.set(p.categorySlug, (counts.get(p.categorySlug) ?? 0) + 1);
  }

  const searchIndex = await buildSearchIndex();
  const navCategories = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <>
      <SiteChrome
        navVariant="solid"
        searchIndex={searchIndex}
        categories={navCategories}
      >
        <main className="bg-paper text-ink min-h-screen pt-[68px] md:pt-[78px]">
          <Breadcrumb items={[{ label: 'Maison', href: '/' }, { label: 'Collections' }]} />

          <header className="px-6 md:px-10 pt-16 md:pt-24 pb-16 md:pb-24 max-w-5xl">
            <div className="eyebrow text-ink/60 mb-6">— Six chapters · A/W 2026</div>
            <h1 className="display text-[14vw] md:text-[7vw] leading-[0.9]">
              The <em className="display-italic">Collections</em>
            </h1>
            <p className="mt-8 ui-label text-ink/70 leading-loose max-w-xl">
              Each chapter is finished by a single hand in our Florentine atelier, and signed inside the lining.
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-12 gap-x-6 md:gap-x-10 gap-y-20 md:gap-y-32 px-6 md:px-10 pb-24 md:pb-36">
            {categories.map((category, i) => {
              const count = counts.get(category.slug) ?? 0;
              const span = i % 3 === 0 ? 'md:col-span-7' : i % 3 === 1 ? 'md:col-span-5' : 'md:col-span-6';
              const offset =
                i % 3 === 1 ? 'md:mt-24' : i % 3 === 2 ? 'md:mt-12' : '';
              return (
                <Link
                  key={category.slug}
                  href={`/collections/${category.slug}`}
                  className={`reveal group ${span} ${offset}`}
                  style={{ transitionDelay: `${(i % 6) * 60}ms` }}
                >
                  <div className="img-zoom relative aspect-[4/5] bg-cream overflow-hidden">
                    <Image
                      src={category.hero}
                      alt={`${category.name} — ${category.tagline}`}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 ui-label text-paper mix-blend-difference">
                      Chapter {String(category.order).padStart(2, '0')}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-ink/70 to-transparent">
                      <div className="display text-paper text-[7vw] md:text-[3.6vw] leading-[0.95]">
                        {category.name}
                      </div>
                      <div className="mt-2 ui-label text-paper/80">
                        {String(count).padStart(2, '0')} pieces
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/75">
                    {category.tagline}
                  </p>
                </Link>
              );
            })}
          </section>

          <Footer />
        </main>
      </SiteChrome>
    </>
  );
}
