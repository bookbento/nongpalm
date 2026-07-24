import type { ProductPrice } from './schemas';
/**
 * Single source of truth for every price string in the storefront and admin.
 * An explicit `display` wins so editorial pricing ("On request", "From ฿2,400")
 * stays possible; otherwise the amount is formatted from its currency.
 * Whole amounts drop the decimals — "฿1,290" reads better than "฿1,290.00".
 */
export declare function formatPrice(price: ProductPrice): string;
