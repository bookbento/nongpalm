'use client';

import {
  CHANNELS,
  CHANNEL_LABELS,
  type Channel,
  type PurchaseChannel,
} from '@harlowe/shared';

interface ChannelEditorProps {
  channels: PurchaseChannel[];
  onChange: (channels: PurchaseChannel[]) => void;
}

/**
 * Edits the ordered purchase-channel list. Exactly one channel may be primary
 * (the "Shop on …" button + the JSON-LD Offer.url); marking one primary clears
 * the others. Platforms already added are removed from the "add" options so the
 * one-per-platform rule can't be violated in the UI.
 */
export default function ChannelEditor({ channels, onChange }: ChannelEditorProps) {
  const used = new Set(channels.map((c) => c.platform));
  const available = CHANNELS.filter((p) => !used.has(p));

  const add = (platform: Channel) => {
    onChange([
      ...channels,
      { platform, url: '', isPrimary: channels.length === 0 },
    ]);
  };

  const update = (index: number, patch: Partial<PurchaseChannel>) => {
    onChange(channels.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const setPrimary = (index: number) => {
    onChange(channels.map((c, i) => ({ ...c, isPrimary: i === index })));
  };

  const remove = (index: number) => {
    const next = channels.filter((_, i) => i !== index);
    // Keep a primary if any channels remain and none is flagged.
    if (next.length > 0 && !next.some((c) => c.isPrimary)) {
      next[0] = { ...next[0], isPrimary: true };
    }
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {channels.length > 0 && (
        <ul className="space-y-2">
          {channels.map((channel, i) => (
            <li
              key={channel.platform}
              className="flex flex-wrap items-center gap-2.5 rounded-lg border border-line bg-surface p-2.5"
            >
              <span className="w-24 shrink-0 text-[13px] font-medium">
                {CHANNEL_LABELS[channel.platform]}
              </span>
              <input
                className="input min-w-0 flex-1 py-1.5 text-[13px]"
                type="url"
                inputMode="url"
                placeholder="https://…"
                value={channel.url}
                onChange={(e) => update(i, { url: e.target.value })}
              />
              <label className="flex shrink-0 items-center gap-1.5 text-[12px] text-muted">
                <input
                  type="radio"
                  name="primary-channel"
                  checked={channel.isPrimary}
                  onChange={() => setPrimary(i)}
                />
                Primary
              </label>
              <button
                type="button"
                className="btn-danger shrink-0 px-2 py-1.5"
                onClick={() => remove(i)}
                aria-label={`Remove ${CHANNEL_LABELS[channel.platform]}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {available.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {available.map((platform) => (
            <button
              key={platform}
              type="button"
              className="btn-ghost text-[12.5px]"
              onClick={() => add(platform)}
            >
              + {CHANNEL_LABELS[platform]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
