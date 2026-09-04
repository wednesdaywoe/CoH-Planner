/**
 * BuildPreviewCard — the compact 1200×800 card rasterized
 * into a build's social share-preview image. Distinct from BuildImageCard (the
 * full "Export as Image" poster): fixed size, headline stats only, and each
 * power reduced to its icon plus its slotted enhancements — no power names, no
 * enhancement names, no per-slot values, none of which survive embed scale
 * (see streams/BUILD_PREVIEW_IMAGE_PLAN.md, "Decision — image content").
 *
 * Slotting is here so the embed can be read as a filter, not just a teaser:
 * without it there is no way to tell an SO build from a purpled-out one, or
 * what a build spent its slots on, without opening it.
 *
 * Everything here is sized against a ~400px render, not the 1200px source:
 * Discord scales the og:image to roughly a third of its width in a desktop
 * channel, so a 20px label is 6px on screen. Two rounds of this template
 * shipped type that was fine at full res and unreadable in the embed.
 *
 * 800 tall rather than the 1.91:1 (1200×630) OG convention: Discord fits an
 * embed image to a fixed width and lets it run taller, so height past 630 is
 * free room that costs no legibility. Past roughly 4:3 it starts fitting to
 * HEIGHT instead and the card renders narrower — which shrinks the type — so
 * 800 leaves headroom under that turn. The wider web still assumes 1.91:1:
 * a platform that crops to it (Twitter/X's summary_large_image) will trim the
 * title and footer bands. Discord is what this card is for.
 *
 * Pure and prop-driven, same shape as BuildImageCard: takes the build and the
 * already-computed detailed-totals sections, no calculation of its own.
 */

import { forwardRef } from 'react';
import { DEFAULT_BUILD_NAME } from '@/types/build';
import type { Build } from '@/types/build';
import { getPowerIconPath } from '@/data';
import { resolvePath } from '@/utils/paths';
import type { StatSection, StatRow } from '@/utils/detailed-totals';
import type { StatValue } from '@/data/stat-definitions';
import { getHeadlineStats } from '@/utils/preview-headline-stats';
import { getPreviewPowerRosters } from '@/utils/build-preview-powers';
import type { SelectedPower } from '@/types/power';
import type { Enhancement } from '@/types/enhancement';
import { SlottedEnhancementIcon } from '@/components/powers/SlottedEnhancementIcon';

export const PREVIEW_CARD_WIDTH = 1200;
export const PREVIEW_CARD_HEIGHT = 800;

/**
 * Bump this whenever this file's visual template changes (layout, type
 * scale, content shown) — it's how a build's stored `preview_template_version`
 * is judged stale and due for regeneration (see
 * streams/BUILD_PREVIEW_BACKFILL_PLAN.md, PREVBF1). Duplicated in every
 * edge function that writes `preview_template_version`
 * (supabase/functions/share-build, supabase/functions/backfill-preview) —
 * Deno functions can't import frontend TS, so update every copy by hand.
 */
export const CURRENT_PREVIEW_TEMPLATE_VERSION = 5;

/**
 * Preview-only value formatting, by stat id, where the dashboard's own format
 * is too long for a tile at this scale. Reads the same `stat.value` the
 * dashboard does — this picks a shorter rendering of that number, it does not
 * recompute it.
 *
 * `regeneration` is here because its dashboard format is `12.24/s (+128%)`,
 * which overruns the tile and spills into its neighbour (found live in a posted
 * Discord embed). The per-second figure is the one worth reading at embed size.
 */
const PREVIEW_VALUE_FORMAT: Record<string, (v: StatValue) => string> = {
  regeneration: (v) =>
    typeof v === 'object' && v !== null && 'perSec' in v
      ? `${(v as { perSec: number }).perSec.toFixed(2)}/s`
      : String(v),
};

function formatStat(stat: StatRow): string {
  return (PREVIEW_VALUE_FORMAT[stat.id] ?? stat.format)(stat.value);
}

interface BuildPreviewCardProps {
  build: Build;
  allStats: StatSection[];
  /** globalBonuses.netEndPerSec — not in `allStats` (computeAllStats scopes to
   *  DETAILED_STATS, which excludes it; see preview-headline-stats.ts). */
  netEndPerSec: number;
}

function StatTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-800/70 border border-slate-700 px-2 py-1.5 text-center">
      <div className="text-[24px] text-slate-400 uppercase tracking-wide truncate leading-tight">{label}</div>
      <div className={`text-[44px] font-semibold tabular-nums truncate leading-tight ${color}`}>{value}</div>
    </div>
  );
}

const SLOT_ICON_PX = 30;
const POWER_COLUMN_PX = 96;

/**
 * One power: its icon above its slotted enhancements, three across. 30px is
 * the enhancement art's NATIVE size (the files under public/img/Enhancements
 * are 30x30), so drawing them larger only upscales — and costs row height that
 * turns into a NARROWER render once the card passes Discord's height fit,
 * shrinking the very icons it was meant to enlarge. At a ~400px embed these
 * land near 10 display px: legible as "six slots, roughly these colours", not
 * as a specific enhancement.
 */
function PowerColumn({ power }: { power: SelectedPower }) {
  const slots: (Enhancement | null)[] = power.slots ?? [];
  return (
    <div className="flex flex-col items-center gap-1 shrink-0" style={{ width: POWER_COLUMN_PX }}>
      <img
        src={getPowerIconPath(power.icon)}
        alt=""
        title={power.name}
        className="w-16 h-16 rounded-lg"
        onError={(e) => {
          (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
        }}
      />
      {slots.length > 0 && (
        <div className="flex flex-wrap justify-center gap-[3px]" style={{ width: POWER_COLUMN_PX }}>
          {slots.map((slot, i) =>
            slot ? (
              <SlottedEnhancementIcon key={i} enhancement={slot} size={SLOT_ICON_PX} />
            ) : (
              <span
                key={i}
                className="inline-block rounded-full border border-slate-700 bg-slate-800"
                style={{ width: SLOT_ICON_PX, height: SLOT_ICON_PX }}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

export const BuildPreviewCard = forwardRef<HTMLDivElement, BuildPreviewCardProps>(function BuildPreviewCard(
  { build, allStats, netEndPerSec },
  ref,
) {
  const at = build.archetype?.name || 'Unknown AT';
  const pri = build.primary?.name;
  const sec = build.secondary?.name;
  const combo = [pri, sec].filter(Boolean).join(' / ');
  const headline = getHeadlineStats(allStats);
  const rosters = getPreviewPowerRosters(build);
  // Taken powers, still grouped by source — but read off the build rather than
  // the roster helper, because a roster entry is a `Power` and carries no
  // slots. Each group starts its own row, so the grouping stays visible without
  // the label column v4 used: labels cost 260px of every row, which a slotted
  // column grid can't spare, and the header already names both sets in order.
  const groups: SelectedPower[][] = [
    build.primary?.powers ?? [],
    build.secondary?.powers ?? [],
    rosters.extras,
  ].filter((g) => g.length > 0);
  const netEndLabel = `${netEndPerSec >= 0 ? '+' : ''}${netEndPerSec.toFixed(2)}/s`;
  const netEndColor = netEndPerSec < 0 ? 'text-red-400' : 'text-emerald-300';

  return (
    <div
      ref={ref}
      className="bg-gray-950 text-gray-100 p-7 flex flex-col overflow-hidden"
      style={{
        width: PREVIEW_CARD_WIDTH,
        height: PREVIEW_CARD_HEIGHT,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-700 pb-3">
        <div className="min-w-0">
          <div className="text-[52px] font-bold text-slate-50 leading-tight truncate">
            {build.name || DEFAULT_BUILD_NAME}
          </div>
          <div className="text-[28px] text-cyan-300 mt-1">
            {at}
            {combo && <span className="text-slate-400"> — {combo}</span>}
          </div>
        </div>
        <div className="text-right text-[26px] text-slate-300 shrink-0">Level {build.level}</div>
      </div>

      {/* Headline stats — ONE row of 6, not two rows of 8. The slot grid needs
          ~413px and the 2x4 grid cost 190px for numbers that fit on one line;
          collapsing it buys back what slotting spends, so the card stays at
          800 tall — a height Discord is already known to render at full width.
          The two resistance tiles are what the row can't hold; they're the
          least differentiating of the eight. */}
      <div className="grid grid-cols-6 gap-3 mt-3">
        {headline.slice(0, 2).map((stat) => (
          <StatTile key={stat.id} label={stat.label} value={formatStat(stat)} color={stat.color} />
        ))}
        <StatTile label="Net End" value={netEndLabel} color={netEndColor} />
        {headline.slice(2, 5).map((stat) => (
          <StatTile key={stat.id} label={stat.label} value={formatStat(stat)} color={stat.color} />
        ))}
      </div>

      {/* Powers taken, with slotting. One row per source group, so the grouping
          reads off the row breaks. A group with more powers than a row holds
          wraps within itself; a build with more rows than fit is clipped by
          overflow-hidden rather than pushing the footer off the card. */}
      <div className="mt-3 flex-1 min-h-0 overflow-hidden flex flex-col justify-evenly gap-2">
        {groups.map((group, gi) => (
          <div key={gi} className="flex flex-wrap gap-2">
            {group.map((power) => (
              <PowerColumn key={`${power.powerSet}:${power.internalName}`} power={power} />
            ))}
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-800 text-[20px] text-slate-500">
        coh-sidekick.com
      </div>
    </div>
  );
});
