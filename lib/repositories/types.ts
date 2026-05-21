import type { Product, Category } from '@/lib/schemas';

export interface FindAllOptions {
  limit?: number;
  offset?: number;
}

export interface ProductRepository {
  findAll(opts?: FindAllOptions): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  findByCategory(categorySlug: string): Promise<Product[]>;
  findFeatured(limit?: number): Promise<Product[]>;
  create(input: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
  update(id: string, patch: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findBySlug(slug: string): Promise<Category | null>;
}

export class NotImplementedError extends Error {
  constructor(operation: string) {
    super(`${operation} is not implemented by this repository. A write-capable backend is required for admin features.`);
    this.name = 'NotImplementedError';
  }
}
