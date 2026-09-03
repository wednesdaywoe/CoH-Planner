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

interface BuildPreviewCardProps {
  build: Build;
  allStats: StatSection[];
  /** globalBonuses.netEndPerSec — not in `allStats` (computeAllStats scopes to
   *  DETAILED_STATS, which excludes it; see preview-headline-stats.ts). */
  netEndPerSec: number;
}

function StatTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex-1 min-w-0 rounded-lg bg-slate-800/70 border border-slate-700 px-3 py-2 text-center">
      <div className="text-[11px] text-slate-400 uppercase tracking-wide truncate">{label}</div>
      <div className={`text-[20px] font-semibold tabular-nums ${color}`}>{value}</div>
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
        className="w-8 h-8 rounded"
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
      className="w-8 h-8 rounded shrink-0"
      onError={(e) => {
        (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
      }}
    />
  );
}

function RosterRow({ label, picks }: { label: string; picks: RosterPick[] }) {
  if (picks.length === 0) return null;
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <span className="text-[10px] text-slate-500 uppercase tracking-wide w-14 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-1">
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
      className="bg-gray-950 text-gray-100 p-6 flex flex-col overflow-hidden"
      style={{
        width: PREVIEW_CARD_WIDTH,
        height: PREVIEW_CARD_HEIGHT,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-700 pb-3">
        <div className="min-w-0">
          <div className="text-[28px] font-bold text-slate-50 leading-tight truncate">
            {build.name || DEFAULT_BUILD_NAME}
          </div>
          <div className="text-[16px] text-cyan-300 mt-1">
            {at}
            {combo && <span className="text-slate-400"> — {combo}</span>}
          </div>
        </div>
        <div className="text-right text-[15px] text-slate-300 shrink-0">Level {build.level}</div>
      </div>

      {/* Headline stats */}
      <div className="flex gap-2 mt-4">
        {headline.slice(0, 2).map((stat) => (
          <StatTile key={stat.id} label={stat.label} value={stat.format(stat.value)} color={stat.color} />
        ))}
        <StatTile label="Net End" value={netEndLabel} color={netEndColor} />
        {headline.slice(2).map((stat) => (
          <StatTile key={stat.id} label={stat.label} value={stat.format(stat.value)} color={stat.color} />
        ))}
      </div>

      {/* Powers — taken vs skipped for primary/secondary, taken-only for pool/epic */}
      <div className="mt-4 flex-1 min-h-0 overflow-hidden">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Powers Taken</div>
        <RosterRow label={pri ?? 'Primary'} picks={rosters.primary} />
        <RosterRow label={sec ?? 'Secondary'} picks={rosters.secondary} />
        {rosters.extras.length > 0 && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide w-14 shrink-0">Pool/Epic</span>
            <div className="flex flex-wrap gap-1">
              {rosters.extras.map((power) => (
                <ExtraIcon key={`${power.powerSet}:${power.internalName}`} power={power} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
        <span>coh-sidekick.com</span>
        <span className="opacity-70">faded icon = skipped power</span>
      </div>
    </div>
  );
});
