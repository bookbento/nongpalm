import { JsonCategoryRepository, JsonProductRepository } from './json';
import type { CategoryRepository, ProductRepository } from './types';

export const productRepo: ProductRepository = new JsonProductRepository();
export const categoryRepo: CategoryRepository = new JsonCategoryRepository();

export type { CategoryRepository, ProductRepository } from './types';
