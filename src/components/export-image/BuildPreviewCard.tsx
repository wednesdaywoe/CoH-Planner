/**
 * BuildPreviewCard — the compact 1200×800 card rasterized
 * into a build's social share-preview image. Distinct from BuildImageCard (the
 * full "Export as Image" poster): fixed size, headline stats only, and a bare
 * grid of taken-power icons instead of full power tiles with slotting — not
 * legible at embed size (see streams/BUILD_PREVIEW_IMAGE_PLAN.md, "Decision —
 * image content").
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
import type { Power } from '@/types/power';

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
export const CURRENT_PREVIEW_TEMPLATE_VERSION = 4;

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
    <div className="min-w-0 rounded-xl bg-slate-800/70 border border-slate-700 px-3 py-1.5 text-center">
      <div className="text-[26px] text-slate-400 uppercase tracking-wide truncate leading-tight">{label}</div>
      <div className={`text-[52px] font-semibold tabular-nums truncate leading-tight ${color}`}>{value}</div>
    </div>
  );
}

function PowerIcon({ power }: { power: Power }) {
  return (
    <img
      src={getPowerIconPath(power.icon)}
      alt=""
      title={power.name}
      className="w-[70px] h-[70px] rounded-lg shrink-0"
      onError={(e) => {
        (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
      }}
    />
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
  // Taken powers only, grouped by where they came from. The skipped-and-faded
  // roster slots the v2 template showed stay gone: at embed width they were
  // indistinguishable mush, and the fade that carried their whole meaning was
  // invisible. Grouping came back with the extra height — v3 ran them together
  // unlabelled because 630 had no room for a label column.
  const groups: { label: string; powers: Power[] }[] = [
    { label: pri ?? 'Primary', powers: rosters.primary.filter((p) => p.taken).map((p) => p.power) },
    { label: sec ?? 'Secondary', powers: rosters.secondary.filter((p) => p.taken).map((p) => p.power) },
    { label: 'Pool / Epic', powers: rosters.extras },
  ].filter((g) => g.powers.length > 0);
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

      {/* Headline stats — 8 tiles, 2 rows of 4. At 1200px source each tile is
          ~285px, which survives the ~3x downscale a Discord embed applies. */}
      <div className="grid grid-cols-4 gap-3 mt-3">
        {headline.slice(0, 2).map((stat) => (
          <StatTile key={stat.id} label={stat.label} value={formatStat(stat)} color={stat.color} />
        ))}
        <StatTile label="Net End" value={netEndLabel} color={netEndColor} />
        {headline.slice(2).map((stat) => (
          <StatTile key={stat.id} label={stat.label} value={formatStat(stat)} color={stat.color} />
        ))}
      </div>

      {/* Powers taken — one labelled row per source. The label column is fixed
          so the icon runs line up across rows; a set with more picks than one
          run holds wraps within its own row rather than into the next set's.
          justify-evenly rather than a top-packed stack: how many rows there are
          and how many runs each takes varies by build, and spreading the slack
          keeps a 2-row build from leaving a dead band above the footer. */}
      <div className="mt-4 flex-1 min-h-0 overflow-hidden flex flex-col justify-evenly gap-3">
        {groups.map((group) => (
          <div key={group.label} className="grid grid-cols-[260px_1fr] items-center gap-4">
            <div className="text-[24px] text-slate-400 uppercase tracking-wide truncate">{group.label}</div>
            <div className="flex flex-wrap gap-2">
              {group.powers.map((power) => (
                <PowerIcon key={power.internalName} power={power} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-800 text-[20px] text-slate-500">
        coh-sidekick.com
      </div>
    </div>
  );
});
