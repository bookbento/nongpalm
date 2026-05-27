"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUpdateSchema = exports.productCreateSchema = exports.categorySchema = exports.productSchema = exports.productDetailsSchema = exports.priceSchema = exports.productImageSchema = void 0;
const zod_1 = require("zod");
exports.productImageSchema = zod_1.z.object({
    src: zod_1.z.string().url(),
    alt: zod_1.z.string(),
    width: zod_1.z.number().int().positive(),
    height: zod_1.z.number().int().positive(),
});
exports.priceSchema = zod_1.z.object({
    amount: zod_1.z.number().nonnegative(),
    currency: zod_1.z.literal('EUR'),
    display: zod_1.z.string(),
});
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
exports.productUpdateSchema = exports.productCreateSchema.partial();
