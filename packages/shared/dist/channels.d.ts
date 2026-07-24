import type { Channel, PurchaseChannel } from './schemas';
export declare const CHANNEL_LABELS: Record<Channel, string>;
/**
 * The channel a "buy" affordance and the JSON-LD Offer.url should point at:
 * the one flagged primary, else the first in author-defined order.
 * Returns null for products not listed anywhere yet.
 */
export declare function primaryChannel(channels: ReadonlyArray<PurchaseChannel>): PurchaseChannel | null;
/**
 * The remaining channels, in order, with the primary removed — so the product
 * page can render one lead action plus a row of secondary ones.
 */
export declare function secondaryChannels(channels: ReadonlyArray<PurchaseChannel>): PurchaseChannel[];
