import { z } from 'zod';
export declare const productImageSchema: z.ZodObject<{
    src: z.ZodString;
    alt: z.ZodString;
    width: z.ZodNumber;
    height: z.ZodNumber;
}, z.core.$strip>;
export declare const CURRENCIES: readonly ["THB", "EUR"];
export declare const currencySchema: z.ZodEnum<{
    THB: "THB";
    EUR: "EUR";
}>;
export declare const priceSchema: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodEnum<{
        THB: "THB";
        EUR: "EUR";
    }>;
    display: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const CHANNELS: readonly ["shopee", "lazada", "tiktok", "line"];
export declare const channelSchema: z.ZodEnum<{
    shopee: "shopee";
    lazada: "lazada";
    tiktok: "tiktok";
    line: "line";
}>;
export declare const purchaseChannelSchema: z.ZodObject<{
    platform: z.ZodEnum<{
        shopee: "shopee";
        lazada: "lazada";
        tiktok: "tiktok";
        line: "line";
    }>;
    url: z.ZodString;
    isPrimary: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const purchaseChannelsSchema: z.ZodDefault<z.ZodArray<z.ZodObject<{
    platform: z.ZodEnum<{
        shopee: "shopee";
        lazada: "lazada";
        tiktok: "tiktok";
        line: "line";
    }>;
    url: z.ZodString;
    isPrimary: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>>>;
export declare const productDetailsSchema: z.ZodObject<{
    composition: z.ZodString;
    care: z.ZodArray<z.ZodString>;
    sizing: z.ZodString;
    origin: z.ZodString;
}, z.core.$strip>;
export declare const productSchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    categorySlug: z.ZodString;
    price: z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodEnum<{
            THB: "THB";
            EUR: "EUR";
        }>;
        display: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    images: z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        alt: z.ZodString;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strip>>;
    description: z.ZodString;
    details: z.ZodObject<{
        composition: z.ZodString;
        care: z.ZodArray<z.ZodString>;
        sizing: z.ZodString;
        origin: z.ZodString;
    }, z.core.$strip>;
    channels: z.ZodDefault<z.ZodArray<z.ZodObject<{
        platform: z.ZodEnum<{
            shopee: "shopee";
            lazada: "lazada";
            tiktok: "tiktok";
            line: "line";
        }>;
        url: z.ZodString;
        isPrimary: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
    inStock: z.ZodBoolean;
    featured: z.ZodBoolean;
    createdAt: z.ZodString;
}, z.core.$strip>;
export declare const categorySchema: z.ZodObject<{
    slug: z.ZodString;
    name: z.ZodString;
    tagline: z.ZodString;
    description: z.ZodString;
    hero: z.ZodString;
    order: z.ZodNumber;
}, z.core.$strip>;
export declare const productCreateSchema: z.ZodObject<{
    price: z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodEnum<{
            THB: "THB";
            EUR: "EUR";
        }>;
        display: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    details: z.ZodObject<{
        composition: z.ZodString;
        care: z.ZodArray<z.ZodString>;
        sizing: z.ZodString;
        origin: z.ZodString;
    }, z.core.$strip>;
    channels: z.ZodDefault<z.ZodArray<z.ZodObject<{
        platform: z.ZodEnum<{
            shopee: "shopee";
            lazada: "lazada";
            tiktok: "tiktok";
            line: "line";
        }>;
        url: z.ZodString;
        isPrimary: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
    slug: z.ZodString;
    name: z.ZodString;
    categorySlug: z.ZodString;
    images: z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        alt: z.ZodString;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strip>>;
    description: z.ZodString;
    inStock: z.ZodBoolean;
    featured: z.ZodBoolean;
}, z.core.$strip>;
/**
 * `.partial()` alone is not enough for `channels`: zod still applies the
 * array's `.default([])` when the key is absent, so a PATCH that never
 * mentions channels would silently wipe every purchase link. Re-declare it
 * without the default so an omitted key stays undefined and Prisma skips it.
 */
export declare const productUpdateSchema: z.ZodObject<{
    price: z.ZodOptional<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodEnum<{
            THB: "THB";
            EUR: "EUR";
        }>;
        display: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    details: z.ZodOptional<z.ZodObject<{
        composition: z.ZodString;
        care: z.ZodArray<z.ZodString>;
        sizing: z.ZodString;
        origin: z.ZodString;
    }, z.core.$strip>>;
    slug: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    categorySlug: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        alt: z.ZodString;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strip>>>;
    description: z.ZodOptional<z.ZodString>;
    inStock: z.ZodOptional<z.ZodBoolean>;
    featured: z.ZodOptional<z.ZodBoolean>;
    channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
        platform: z.ZodEnum<{
            shopee: "shopee";
            lazada: "lazada";
            tiktok: "tiktok";
            line: "line";
        }>;
        url: z.ZodString;
        isPrimary: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
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
