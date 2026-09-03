/**
 * BuildPreviewCard — the compact 1200×630 (OG-image standard) card rasterized
 * into a build's social share-preview image. Distinct from BuildImageCard (the
 * full "Export as Image" poster): fixed size, headline stats only, and a
 * taken-vs-skipped icon row for primary/secondary instead of full power tiles
 * with slotting — not legible at embed size (see
 * streams/BUILD_PREVIEW_IMAGE_PLAN.md, "Decision — image content").
 *
 * Pure and prop-driven, same shape as BuildImageCard: takes the build and the
 * already-computed detailed-totals sections, no calculation of its own.
 */

import { forwardRef } from 'react';
import { DEFAULT_BUILD_NAME } from '@/types/build';
import type { Build } from '@/types/build';
import { getPowerIconPath } from '@/data';
import { resolvePath } from '@/utils/paths';
import type { StatSection } from '@/utils/detailed-totals';
import { getHeadlineStats } from '@/utils/preview-headline-stats';
import { getPreviewPowerRosters, type RosterPick } from '@/utils/build-preview-powers';
import type { SelectedPower } from '@/types/power';

export const PREVIEW_CARD_WIDTH = 1200;
export const PREVIEW_CARD_HEIGHT = 630;

/**
 * Bump this whenever this file's visual template changes (layout, type
 * scale, content shown) — it's how a build's stored `preview_template_version`
 * is judged stale and due for regeneration (see
 * streams/BUILD_PREVIEW_BACKFILL_PLAN.md, PREVBF1). Duplicated in every
 * edge function that writes `preview_template_version`
 * (supabase/functions/share-build, supabase/functions/backfill-preview) —
 * Deno functions can't import frontend TS, so update every copy by hand.
 */
export const CURRENT_PREVIEW_TEMPLATE_VERSION = 1;

interface BuildPreviewCardProps {
  build: Build;
  allStats: StatSection[];
  /** globalBonuses.netEndPerSec — not in `allStats` (computeAllStats scopes to
   *  DETAILED_STATS, which excludes it; see preview-headline-stats.ts). */
  netEndPerSec: number;
}

function StatTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-800/70 border border-slate-700 px-4 py-3 text-center">
      <div className="text-[16px] text-slate-400 uppercase tracking-wide truncate">{label}</div>
      <div className={`text-[30px] font-semibold tabular-nums whitespace-nowrap ${color}`}>{value}</div>
    </div>
  );
}

function RosterIcon({ pick }: { pick: RosterPick }) {
  return (
    <div
      className={`relative shrink-0 ${pick.taken ? '' : 'opacity-25 grayscale'}`}
      title={`${pick.power.name}${pick.taken ? '' : ' (skipped)'}`}
    >
      <img
        src={getPowerIconPath(pick.power.icon)}
        alt=""
        className="w-11 h-11 rounded-lg"
        onError={(e) => {
          (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
        }}
      />
    </div>
  );
}

function ExtraIcon({ power }: { power: SelectedPower }) {
  return (
    <img
      src={getPowerIconPath(power.icon)}
      alt=""
      title={power.name}
      className="w-11 h-11 rounded-lg shrink-0"
      onError={(e) => {
        (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
      }}
    />
  );
}

function RosterRow({ label, picks }: { label: string; picks: RosterPick[] }) {
  if (picks.length === 0) return null;
  return (
    <div className="flex items-center gap-3 mt-2">
      <span className="text-[16px] text-slate-500 uppercase tracking-wide shrink-0 whitespace-nowrap">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {picks.map((pick) => (
          <RosterIcon key={pick.power.internalName} pick={pick} />
        ))}
      </div>
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
  const netEndLabel = `${netEndPerSec >= 0 ? '+' : ''}${netEndPerSec.toFixed(2)}/s`;
  const netEndColor = netEndPerSec < 0 ? 'text-red-400' : 'text-emerald-300';

  return (
    <div
      ref={ref}
      className="bg-gray-950 text-gray-100 p-8 flex flex-col overflow-hidden"
      style={{
        width: PREVIEW_CARD_WIDTH,
        height: PREVIEW_CARD_HEIGHT,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-700 pb-4">
        <div className="min-w-0">
          <div className="text-[46px] font-bold text-slate-50 leading-tight truncate">
            {build.name || DEFAULT_BUILD_NAME}
          </div>
          <div className="text-[24px] text-cyan-300 mt-1">
            {at}
            {combo && <span className="text-slate-400"> — {combo}</span>}
          </div>
        </div>
        <div className="text-right text-[22px] text-slate-300 shrink-0">Level {build.level}</div>
      </div>

      {/* Headline stats — 8 tiles, wraps into 2 rows of 4 so each tile has room to be legible at embed-thumbnail scale */}
      <div className="grid grid-cols-4 gap-3 mt-5">
        {headline.slice(0, 2).map((stat) => (
          <StatTile key={stat.id} label={stat.label} value={stat.format(stat.value)} color={stat.color} />
        ))}
        <StatTile label="Net End" value={netEndLabel} color={netEndColor} />
        {headline.slice(2).map((stat) => (
          <StatTile key={stat.id} label={stat.label} value={stat.format(stat.value)} color={stat.color} />
        ))}
      </div>

      {/* Powers — taken vs skipped for primary/secondary, taken-only for pool/epic */}
      <div className="mt-5 flex-1 min-h-0 overflow-hidden">
        <div className="text-[16px] font-semibold text-slate-400 uppercase tracking-wide">Powers Taken</div>
        <RosterRow label={pri ?? 'Primary'} picks={rosters.primary} />
        <RosterRow label={sec ?? 'Secondary'} picks={rosters.secondary} />
        {rosters.extras.length > 0 && (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[16px] text-slate-500 uppercase tracking-wide shrink-0 whitespace-nowrap">Pool/Epic</span>
            <div className="flex flex-wrap gap-1.5">
              {rosters.extras.map((power) => (
                <ExtraIcon key={`${power.powerSet}:${power.internalName}`} power={power} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[16px] text-slate-500">
        <span>coh-sidekick.com</span>
        <span className="opacity-70">faded icon = skipped power</span>
      </div>
    </div>
  );
});
