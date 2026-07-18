/**
 * Pure display-layer suppression for the per-stat over-cap mute feature.
 *
 * These operate on the shared `breakdown` map (the same canonical Rule-of-5
 * accounting every warning surface reads). They NEVER change a total — a muted
 * stat's sources are simply skipped when deciding whether to WARN. See
 * `Build.mutedOverCapStats` and `toCanonicalStatKey` in set-bonus-groups.ts.
 */
import type { DashboardStatBreakdown } from '@/utils/calculations';
import { isOverCapMuted, statKeyToLabel } from '@/data/set-bonus-groups';
import { formatBonusValue } from '@/utils/set-bonus-format';

/** A specific Rule-of-5-capped bonus a power contributes (label + formatted value). */
export interface CappedBonusReason {
  label: string;
  /** Pre-formatted value with sign + unit, e.g. "+10%". */
  display: string;
}

/**
 * Pure core of `useOffendingPowerReasons`: `power.name` → its distinct
 * Rule-of-5-capped bonuses, with muted stats dropped. A power keeps a ring iff
 * it still has ≥1 non-muted capped reason.
 */
export function computeOffendingPowerReasons(
  breakdown: Map<string, DashboardStatBreakdown>,
  enabled: boolean,
  muted: readonly string[],
): Map<string, CappedBonusReason[]> {
  const reasons = new Map<string, CappedBonusReason[]>();
  if (!enabled) return reasons;
  for (const [statKey, stat] of breakdown.entries()) {
    if (isOverCapMuted(statKey, muted)) continue; // display-only: warning suppressed
    const byValue = new Map<string, { capped: boolean; powerNames: string[] }>();
    for (const source of stat.sources) {
      if (!source.powerName) continue;
      const key = source.value.toFixed(2);
      const entry = byValue.get(key);
      if (entry) {
        entry.powerNames.push(source.powerName);
        if (source.capped) entry.capped = true;
      } else {
        byValue.set(key, { capped: !!source.capped, powerNames: [source.powerName] });
      }
    }
    for (const [valueKey, entry] of byValue.entries()) {
      if (!entry.capped) continue;
      const reason: CappedBonusReason = {
        label: statKeyToLabel(statKey),
        display: `+${formatBonusValue(Number(valueKey))}%`,
      };
      for (const name of entry.powerNames) {
        const list = reasons.get(name);
        if (list) {
          if (!list.some((r) => r.label === reason.label && r.display === reason.display)) list.push(reason);
        } else {
          reasons.set(name, [reason]);
        }
      }
    }
  }
  return reasons;
}

/** Count of Rule-of-5-capped breakdown sources whose stat is NOT muted (banner). */
export function countUnmutedCappedSources(
  breakdown: Map<string, DashboardStatBreakdown>,
  muted: readonly string[],
): number {
  let n = 0;
  for (const [statKey, stat] of breakdown.entries()) {
    if (isOverCapMuted(statKey, muted)) continue;
    for (const source of stat.sources) if (source.capped) n++;
  }
  return n;
}
