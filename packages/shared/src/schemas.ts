import { z } from 'zod';

export const productImageSchema = z.object({
  src: z.string().url(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const priceSchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.literal('EUR'),
  display: z.string(),
});

export const productDetailsSchema = z.object({
  composition: z.string(),
  care: z.array(z.string()),
  sizing: z.string(),
  origin: z.string(),
});

export const productSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  categorySlug: z.string(),
  price: priceSchema,
  images: z.array(productImageSchema).min(1),
  description: z.string(),
  details: productDetailsSchema,
  inStock: z.boolean(),
  featured: z.boolean(),
  createdAt: z.string().datetime(),
});

export const categorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  hero: z.string().url(),
  order: z.number().int(),
});

// Admin write payloads. id + createdAt are assigned by the database.
export const productCreateSchema = productSchema.omit({ id: true, createdAt: true });
export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export type ProductImage = z.infer<typeof productImageSchema>;
export type ProductPrice = z.infer<typeof priceSchema>;
export type ProductDetails = z.infer<typeof productDetailsSchema>;
export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;
