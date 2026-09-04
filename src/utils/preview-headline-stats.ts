/**
 * Picks the handful of stat rows the share-preview card shows out of the full
 * detailed-totals model (`computeAllStats`), by canonical stat id — so the
 * card reads the same source of truth as the dashboard and the Export-as-Image
 * poster instead of re-deriving any number itself.
 *
 * Down to three from v5's seven: the five defense/resistance ids that used to
 * be here moved to the bar matrix (`preview-defres-bars.ts`), which shows all
 * nineteen of them instead of the two that fit in a tile. What is left is the
 * set with no useful ceiling to draw a bar against, so a number is the only
 * rendering — plus Recharge, which the tile row previously had no room for.
 */

import type { StatSection, StatRow } from '@/utils/detailed-totals';

// 'netend' (Net End) is deliberately NOT here: computeAllStats() is scoped to
// DETAILED_STATS, which excludes it on purpose (it's a dashboard-tile-only
// stat, computed from globalBonuses.netEndPerSec instead — see
// BuildPreviewCard's separate `netEndPerSec` prop).
const HEADLINE_STAT_IDS = [
  'health',
  'regeneration',
  'recharge',
] as const;

export type HeadlineStatId = (typeof HEADLINE_STAT_IDS)[number];

/** One row per id present in `allStats`, in `HEADLINE_STAT_IDS` order. A stat
 *  missing from the computed sections (shouldn't happen for these ids, but a
 *  future STAT_DEFINITIONS edit could rename one) is simply omitted rather
 *  than shown as a fabricated zero. */
export function getHeadlineStats(allStats: StatSection[]): StatRow[] {
  const byId = new Map<string, StatRow>();
  for (const section of allStats) {
    for (const stat of section.stats) byId.set(stat.id, stat);
  }
  return HEADLINE_STAT_IDS.map((id) => byId.get(id)).filter((s): s is StatRow => s != null);
}
