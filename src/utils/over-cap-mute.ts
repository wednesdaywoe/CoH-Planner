/**
 * Pure display-layer suppression for the per-stat over-cap mute feature.
 *
 * These operate on the shared `breakdown` map (the same canonical Rule-of-5
 * accounting every warning surface reads). They NEVER change a total — a muted
 * stat's sources are simply skipped when deciding whether to WARN. See
 * `Build.mutedOverCapStats` and `toCanonicalStatKey` in set-bonus-groups.ts.
 */
import type { DashboardStatBreakdown, StatSource } from '@/utils/calculations';
import { isOverCapMuted, statKeyToLabel } from '@/data/set-bonus-groups';
import { formatBonusValue } from '@/utils/set-bonus-format';

/** A specific Rule-of-5-capped bonus a power contributes (label + formatted value). */
export interface CappedBonusReason {
  label: string;
  /** Pre-formatted value with sign + unit, e.g. "+10%". */
  display: string;
}

/**
 * Which Rule-of-5 pool a breakdown source's `capped` verdict was decided in, or `null`
 * for a source kind no cap applies to.
 *
 * Set bonuses and always-on proc globals are counted in INDEPENDENT pools — the engine
 * keeps a `ProcTracking` beside the set-bonus tracking (`coh_math::procs`), because the
 * game caps a unique IO's global separately from set bonuses. So six LotG +7.5% Recharge
 * globals cap among themselves and leave a Basilisk's Gaze +7.5% Recharge set bonus
 * untouched. A source's `(stat, value)` therefore does NOT identify its bucket: the pool
 * is the missing axis, and without it the two 7.5% Recharge pools merged and the sixth
 * LotG's overflow flagged the Basilisk's Gaze power as offending.
 *
 * A `Record` rather than a switch so a new `StatSource['type']` breaks the build here
 * instead of silently defaulting into someone's pool (CLAUDE.md Rule 1).
 */
const CAP_POOL: Record<StatSource['type'], string | null> = {
  'set-bonus': 'set-bonus',
  proc: 'proc',
  // Not Rule-of-5 tracked: these can neither cap a bucket nor be rejected by one, so they
  // must never join a bucket and inherit its ring.
  'active-power': null,
  inherent: null,
  enhancement: null,
  accolade: null,
  incarnate: null,
};

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
    // One entry per Rule-of-5 bucket: (pool, 2-dp value), the same granularity the pool
    // that made the `capped` call counted at.
    const buckets = new Map<string, { capped: boolean; valueKey: string; powerNames: string[] }>();
    for (const source of stat.sources) {
      if (!source.powerName) continue;
      const pool = CAP_POOL[source.type];
      if (!pool) continue;
      const valueKey = source.value.toFixed(2);
      const key = `${pool}|${valueKey}`;
      const entry = buckets.get(key);
      if (entry) {
        entry.powerNames.push(source.powerName);
        if (source.capped) entry.capped = true;
      } else {
        buckets.set(key, { capped: !!source.capped, valueKey, powerNames: [source.powerName] });
      }
    }
    for (const entry of buckets.values()) {
      if (!entry.capped) continue;
      const reason: CappedBonusReason = {
        label: statKeyToLabel(statKey),
        display: `+${formatBonusValue(Number(entry.valueKey))}%`,
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
