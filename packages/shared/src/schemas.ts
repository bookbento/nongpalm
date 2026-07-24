import { z } from 'zod';

export const productImageSchema = z.object({
  src: z.string().url(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const CURRENCIES = ['THB', 'EUR'] as const;

export const currencySchema = z.enum(CURRENCIES);

export const priceSchema = z.object({
  amount: z.number().nonnegative(),
  currency: currencySchema,
  // Optional manual override. When absent the storefront formats the amount
  // itself (see formatPrice), so a price edited in the admin can never drift
  // from the string shown to the customer.
  display: z.string().optional(),
});

export const CHANNELS = ['shopee', 'lazada', 'tiktok', 'line'] as const;

export const channelSchema = z.enum(CHANNELS);

export const purchaseChannelSchema = z.object({
  platform: channelSchema,
  url: z.string().url(),
  isPrimary: z.boolean().default(false),
});

/**
 * Ordered list — array position drives display order on the product page.
 * A product may legitimately have no channels yet (drafted before listing),
 * hence the empty default rather than a `.min(1)`.
 */
const purchaseChannelArray = z
  .array(purchaseChannelSchema)
  .refine(
    (channels) => new Set(channels.map((c) => c.platform)).size === channels.length,
    { message: 'Each platform may only be listed once' },
  )
  .refine((channels) => channels.filter((c) => c.isPrimary).length <= 1, {
    message: 'Only one channel can be marked primary',
  });

export const purchaseChannelsSchema = purchaseChannelArray.default([]);

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
  channels: purchaseChannelsSchema,
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

/**
 * `.partial()` alone is not enough for `channels`: zod still applies the
 * array's `.default([])` when the key is absent, so a PATCH that never
 * mentions channels would silently wipe every purchase link. Re-declare it
 * without the default so an omitted key stays undefined and Prisma skips it.
 */
export const productUpdateSchema = productCreateSchema.partial().extend({
  channels: purchaseChannelArray.optional(),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export type ProductImage = z.infer<typeof productImageSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type Channel = z.infer<typeof channelSchema>;
export type PurchaseChannel = z.infer<typeof purchaseChannelSchema>;
export type ProductPrice = z.infer<typeof priceSchema>;
export type ProductDetails = z.infer<typeof productDetailsSchema>;
export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;
