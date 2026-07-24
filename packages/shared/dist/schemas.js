"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUpdateSchema = exports.productCreateSchema = exports.categorySchema = exports.productSchema = exports.productDetailsSchema = exports.purchaseChannelsSchema = exports.purchaseChannelSchema = exports.channelSchema = exports.CHANNELS = exports.priceSchema = exports.currencySchema = exports.CURRENCIES = exports.productImageSchema = void 0;
const zod_1 = require("zod");
exports.productImageSchema = zod_1.z.object({
    src: zod_1.z.string().url(),
    alt: zod_1.z.string(),
    width: zod_1.z.number().int().positive(),
    height: zod_1.z.number().int().positive(),
});
exports.CURRENCIES = ['THB', 'EUR'];
exports.currencySchema = zod_1.z.enum(exports.CURRENCIES);
exports.priceSchema = zod_1.z.object({
    amount: zod_1.z.number().nonnegative(),
    currency: exports.currencySchema,
    // Optional manual override. When absent the storefront formats the amount
    // itself (see formatPrice), so a price edited in the admin can never drift
    // from the string shown to the customer.
    display: zod_1.z.string().optional(),
});
exports.CHANNELS = ['shopee', 'lazada', 'tiktok', 'line'];
exports.channelSchema = zod_1.z.enum(exports.CHANNELS);
exports.purchaseChannelSchema = zod_1.z.object({
    platform: exports.channelSchema,
    url: zod_1.z.string().url(),
    isPrimary: zod_1.z.boolean().default(false),
});
/**
 * Ordered list — array position drives display order on the product page.
 * A product may legitimately have no channels yet (drafted before listing),
 * hence the empty default rather than a `.min(1)`.
 */
const purchaseChannelArray = zod_1.z
    .array(exports.purchaseChannelSchema)
    .refine((channels) => new Set(channels.map((c) => c.platform)).size === channels.length, { message: 'Each platform may only be listed once' })
    .refine((channels) => channels.filter((c) => c.isPrimary).length <= 1, {
    message: 'Only one channel can be marked primary',
});
exports.purchaseChannelsSchema = purchaseChannelArray.default([]);
exports.productDetailsSchema = zod_1.z.object({
    composition: zod_1.z.string(),
    care: zod_1.z.array(zod_1.z.string()),
    sizing: zod_1.z.string(),
    origin: zod_1.z.string(),
});
exports.productSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    slug: zod_1.z.string().regex(/^[a-z0-9-]+$/),
    name: zod_1.z.string(),
    categorySlug: zod_1.z.string(),
    price: exports.priceSchema,
    images: zod_1.z.array(exports.productImageSchema).min(1),
    description: zod_1.z.string(),
    details: exports.productDetailsSchema,
    channels: exports.purchaseChannelsSchema,
    inStock: zod_1.z.boolean(),
    featured: zod_1.z.boolean(),
    createdAt: zod_1.z.string().datetime(),
});
exports.categorySchema = zod_1.z.object({
    slug: zod_1.z.string().regex(/^[a-z0-9-]+$/),
    name: zod_1.z.string(),
    tagline: zod_1.z.string(),
    description: zod_1.z.string(),
    hero: zod_1.z.string().url(),
    order: zod_1.z.number().int(),
});
// Admin write payloads. id + createdAt are assigned by the database.
exports.productCreateSchema = exports.productSchema.omit({ id: true, createdAt: true });
/**
 * `.partial()` alone is not enough for `channels`: zod still applies the
 * array's `.default([])` when the key is absent, so a PATCH that never
 * mentions channels would silently wipe every purchase link. Re-declare it
 * without the default so an omitted key stays undefined and Prisma skips it.
 */
exports.productUpdateSchema = exports.productCreateSchema.partial().extend({
    channels: purchaseChannelArray.optional(),
});
