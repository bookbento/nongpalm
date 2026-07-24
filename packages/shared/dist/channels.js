"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHANNEL_LABELS = void 0;
exports.primaryChannel = primaryChannel;
exports.secondaryChannels = secondaryChannels;
exports.CHANNEL_LABELS = {
    shopee: 'Shopee',
    lazada: 'Lazada',
    tiktok: 'TikTok Shop',
    line: 'LINE',
};
/**
 * The channel a "buy" affordance and the JSON-LD Offer.url should point at:
 * the one flagged primary, else the first in author-defined order.
 * Returns null for products not listed anywhere yet.
 */
function primaryChannel(channels) {
    return channels.find((c) => c.isPrimary) ?? channels[0] ?? null;
}
/**
 * The remaining channels, in order, with the primary removed — so the product
 * page can render one lead action plus a row of secondary ones.
 */
function secondaryChannels(channels) {
    const primary = primaryChannel(channels);
    return channels.filter((c) => c !== primary);
}
