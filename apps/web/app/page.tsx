import { categoryRepo, productRepo } from '@/lib/repositories';
import { buildSearchIndex } from '@/lib/search';
import SiteChrome from '@/components/layout/SiteChrome';
import Hero from '@/components/hero/Hero';
import Marquee from '@/components/marquee/Marquee';
import Collection from '@/components/collection/Collection';
import Atelier from '@/components/atelier/Atelier';
import Footer from '@/components/footer/Footer';

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    productRepo.findFeatured(6),
    categoryRepo.findAll(),
  ]);
  const searchIndex = await buildSearchIndex();
  const navCategories = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <SiteChrome
      navVariant="over-hero"
      withLoader
      searchIndex={searchIndex}
      categories={navCategories}
    >
      <main>
        <Hero />
        <Marquee />
        <Collection products={featured} />
        <Atelier />
      </main>
      <Footer />
    </SiteChrome>
  );
}
