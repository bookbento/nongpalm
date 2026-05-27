import { JsonCategoryRepository, JsonProductRepository } from './json';
import { HttpCategoryRepository, HttpProductRepository } from './http';
import type { CategoryRepository, ProductRepository } from './types';

// Switch the data source without touching any page code.
// Set DATA_SOURCE=http (with NEXT_PUBLIC_API_URL) to read from the NestJS API.
// Defaults to the bundled JSON so offline builds keep working.
const useHttp = process.env.DATA_SOURCE === 'http';

export const productRepo: ProductRepository = useHttp
  ? new HttpProductRepository()
  : new JsonProductRepository();

export const categoryRepo: CategoryRepository = useHttp
  ? new HttpCategoryRepository()
  : new JsonCategoryRepository();

export type { CategoryRepository, ProductRepository } from './types';
