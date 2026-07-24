"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPrice = formatPrice;
/**
 * Locale drives symbol placement and digit grouping, not the currency itself.
 * Kept per-currency so a THB price reads "฿1,290" the way a Thai customer
 * expects while a EUR price still reads "€1,290".
 */
const LOCALE_BY_CURRENCY = {
    THB: 'th-TH',
    EUR: 'en-IE',
};
const formatterCache = new Map();
function getFormatter(currency, fractionDigits) {
    const key = `${currency}:${fractionDigits}`;
    const cached = formatterCache.get(key);
    if (cached)
        return cached;
    const formatter = new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency], {
        style: 'currency',
        currency,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    });
    formatterCache.set(key, formatter);
    return formatter;
}
/**
 * Single source of truth for every price string in the storefront and admin.
 * An explicit `display` wins so editorial pricing ("On request", "From ฿2,400")
 * stays possible; otherwise the amount is formatted from its currency.
 * Whole amounts drop the decimals — "฿1,290" reads better than "฿1,290.00".
 */
function formatPrice(price) {
    if (price.display)
        return price.display;
    const fractionDigits = Number.isInteger(price.amount) ? 0 : 2;
    return getFormatter(price.currency, fractionDigits).format(price.amount);
}
