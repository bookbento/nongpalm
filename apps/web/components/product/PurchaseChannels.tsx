import {
  CHANNEL_LABELS,
  primaryChannel,
  secondaryChannels,
  type PurchaseChannel,
} from '@/lib/schemas';

interface PurchaseChannelsProps {
  channels: ReadonlyArray<PurchaseChannel>;
  productName: string;
}

// Outbound links to marketplaces: nofollow+sponsored keeps link equity in,
// noopener/noreferrer is the standard safety pair for target=_blank.
const REL = 'noopener noreferrer nofollow sponsored';

function ariaLabel(channel: PurchaseChannel, productName: string): string {
  return `Buy ${productName} on ${CHANNEL_LABELS[channel.platform]} (opens in a new tab)`;
}

export default function PurchaseChannels({
  channels,
  productName,
}: PurchaseChannelsProps) {
  const primary = primaryChannel(channels);

  // Not listed anywhere yet — offer the boutique enquiry affordance instead of
  // a dead "Add to Bag". This keeps the page honest for drafted pieces.
  if (!primary) {
    return (
      <span className="ui-label text-ink/55 py-4 inline-block">
        Enquire for availability
      </span>
    );
  }

  const secondary = secondaryChannels(channels);

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
      <a
        href={primary.url}
        target="_blank"
        rel={REL}
        aria-label={ariaLabel(primary, productName)}
        className="ui-label bg-ink text-paper px-8 py-4 transition-colors hover:bg-oxblood"
      >
        Shop on {CHANNEL_LABELS[primary.platform]}
      </a>

      {secondary.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {secondary.map((channel) => (
            <a
              key={channel.platform}
              href={channel.url}
              target="_blank"
              rel={REL}
              aria-label={ariaLabel(channel, productName)}
              className="ui-label btn-line text-ink/75 hover:text-ink"
            >
              {CHANNEL_LABELS[channel.platform]} →
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
