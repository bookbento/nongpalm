import { z } from 'zod';
import productsJson from '@/data/products.json';
import categoriesJson from '@/data/categories.json';
import {
  productSchema,
  categorySchema,
  type Product,
  type Category,
} from '@/lib/schemas';
import {
  NotImplementedError,
  type CategoryRepository,
  type FindAllOptions,
  type ProductRepository,
} from './types';

const products: ReadonlyArray<Product> = Object.freeze(
  z.array(productSchema).parse(productsJson)
);

const categories: ReadonlyArray<Category> = Object.freeze(
  z.array(categorySchema).parse(categoriesJson)
);

const paginate = <T>(arr: ReadonlyArray<T>, opts?: FindAllOptions): T[] => {
  const offset = opts?.offset ?? 0;
  const limit = opts?.limit ?? arr.length;
  return arr.slice(offset, offset + limit);
};

export class JsonProductRepository implements ProductRepository {
  async findAll(opts?: FindAllOptions): Promise<Product[]> {
    return paginate(products, opts);
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return products.find((p) => p.slug === slug) ?? null;
  }

  async findByCategory(categorySlug: string): Promise<Product[]> {
    return products.filter((p) => p.categorySlug === categorySlug);
  }

  async findFeatured(limit?: number): Promise<Product[]> {
    const featured = products.filter((p) => p.featured);
    return limit ? featured.slice(0, limit) : featured;
  }

  async create(): Promise<Product> {
    throw new NotImplementedError('create');
  }

  async update(): Promise<Product> {
    throw new NotImplementedError('update');
  }

  async delete(): Promise<void> {
    throw new NotImplementedError('delete');
  }
}

export class JsonCategoryRepository implements CategoryRepository {
  async findAll(): Promise<Category[]> {
    return [...categories].sort((a, b) => a.order - b.order);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return categories.find((c) => c.slug === slug) ?? null;
  }
}
