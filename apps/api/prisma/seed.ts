import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { categorySchema, productSchema } from '@harlowe/shared';
import { z } from 'zod';

const prisma = new PrismaClient();

const DATA_DIR = join(__dirname, '..', '..', 'web', 'data');

function loadJson(file: string): unknown {
  return JSON.parse(readFileSync(join(DATA_DIR, file), 'utf-8'));
}

async function main(): Promise<void> {
  const categories = z.array(categorySchema).parse(loadJson('categories.json'));
  const products = z.array(productSchema).parse(loadJson('products.json'));

  // Categories first — products reference category slugs via FK.
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  await prisma.product.createMany({
    data: products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      categorySlug: p.categorySlug,
      price: p.price,
      images: p.images,
      description: p.description,
      details: p.details,
      inStock: p.inStock,
      featured: p.featured,
      createdAt: new Date(p.createdAt),
    })),
    skipDuplicates: true,
  });

  const [categoryCount, productCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
  ]);

  console.log(`Seeded ${categoryCount} categories and ${productCount} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
