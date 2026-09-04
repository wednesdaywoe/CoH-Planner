/**
 * The defense/resistance bar matrix shown on the share-preview card, read out
 * of the same `computeAllStats` sections the dashboard uses.
 *
 * Why bars rather than the tiles v5 used: a four-character number needs ~26px
 * of source type to survive the ~3x downscale Discord applies to an og:image,
 * so eight tiles was the most the card could carry and it still had to drop
 * both resistance rows. A bar carries its value in LENGTH, which stays legible
 * at 14px tall, so all nineteen def/res values fit in less card than six tiles
 * spent on six. Content density was always the lever here (see
 * streams/BUILD_PREVIEW_IMAGE_PLAN.md, "Third round") — this is the first
 * change that adds values instead of trading them away.
 *
 * Nothing is computed here. Value and ceiling both come off the StatRow.
 */

import type { StatSection, StatRow } from '@/utils/detailed-totals';
import type { StatCap } from '@/data/core/stat-caps';

export interface DefResBar {
  id: string;
  /** One-character type label, derived from the stat's own label rather than
   *  spelled out here — Smashing/Lethal/Fire/Cold/Energy/Negative/Psionic/Toxic
   *  and Melee/Ranged/AoE all have distinct initials, so the derivation is
   *  lossless and no CoH vocabulary is duplicated into this file. */
  letter: string;
  /** Full label, for the title attribute — the card has no room to print it. */
  label: string;
  /** Percentage points. */
  value: number;
  cap: StatCap;
}

export interface DefResMatrix {
  /** The eight typed defenses (`def_*`). */
  typedDefense: DefResBar[];
  /** The three positional defenses (`defense_melee|ranged|aoe`). */
  positionalDefense: DefResBar[];
  /** The eight damage resistances (`res_*`). */
  resistance: DefResBar[];
}

/** A row becomes a bar only if it has both a numeric value and a ceiling to
 *  scale that value against. A bar with no denominator would be decoration. */
function toBar(stat: StatRow): DefResBar | null {
  const value = Number(stat.value);
  if (!Number.isFinite(value) || !stat.cap) return null;
  return { id: stat.id, letter: stat.label.charAt(0), label: stat.label, value, cap: stat.cap };
}

export function getDefResMatrix(allStats: StatSection[]): DefResMatrix {
  const bars: DefResBar[] = [];
  for (const section of allStats) {
    for (const stat of section.stats) {
      const bar = toBar(stat);
      if (bar) bars.push(bar);
    }
  }
  // Split on the id prefixes the stat model already uses to mean these three
  // families — the same distinction `statCapFor` makes.
  return {
    typedDefense: bars.filter((b) => b.id.startsWith('def_')),
    positionalDefense: bars.filter((b) => b.id.startsWith('defense_')),
    resistance: bars.filter((b) => b.id.startsWith('res_')),
  };
}

/**
 * How much of the bar's track a value fills, and whether it ran past a
 * softcap.
 *
 * A soft-capped bar draws its track wider than the cap by `SOFT_OVERFLOW` and
 * puts a tick at the cap, because defense past the softcap is real and
 * load-bearing (see `stat-caps.ts`) — rendering 45% and 63% melee as the same
 * full bar would make the card lie about the stat this audience reads first.
 * A hard cap needs none of that: the engine already clamped the total, so the
 * track ends exactly at the ceiling.
 */
export const SOFT_OVERFLOW = 1.4;

export interface BarGeometry {
  /** 0..1 of the drawn track. */
  fill: number;
  /** 0..1 position of the cap tick, or null when the cap IS the track's end. */
  tick: number | null;
  /** True once a soft cap has been met or passed. */
  atCap: boolean;
}

export function barGeometry(bar: DefResBar): BarGeometry {
  const soft = bar.cap.kind === 'soft';
  const trackMax = bar.cap.value * (soft ? SOFT_OVERFLOW : 1);
  return {
    fill: trackMax > 0 ? Math.min(1, Math.max(0, bar.value / trackMax)) : 0,
    tick: soft ? 1 / SOFT_OVERFLOW : null,
    atCap: bar.value >= bar.cap.value,
  };
}
