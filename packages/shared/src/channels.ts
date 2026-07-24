import type { Channel, PurchaseChannel } from './schemas';

export const CHANNEL_LABELS: Record<Channel, string> = {
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
export function primaryChannel(
  channels: ReadonlyArray<PurchaseChannel>,
): PurchaseChannel | null {
  return channels.find((c) => c.isPrimary) ?? channels[0] ?? null;
}

/**
 * The remaining channels, in order, with the primary removed — so the product
 * page can render one lead action plus a row of secondary ones.
 */
export function secondaryChannels(
  channels: ReadonlyArray<PurchaseChannel>,
): PurchaseChannel[] {
  const primary = primaryChannel(channels);
  return channels.filter((c) => c !== primary);
}
