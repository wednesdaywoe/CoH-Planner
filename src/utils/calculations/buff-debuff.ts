/**
 * Buff/debuff base-rate calculation — the single source of truth for the
 * canonical CoH "10% per scale (buff) / 5% per scale (debuff)" rule.
 *
 * Previously this rule was encoded in two places with two different units
 * (damage.ts returned percentage points via a 5/10 multiplier; powerDisplayUtils
 * returned a fraction via 0.05/0.10 constants — 100x apart). Both now delegate
 * here. To avoid the same-name footgun, the two public wrappers are named by
 * their unit: `calculateBuffDebuffFraction` (this file, fraction) and
 * `calculateBuffDebuffPercent` (damage.ts, percentage points = fraction * 100).
 *
 * NOTE — these only fire on the *table-less fallback* path. Effects that carry a
 * {scale, table} pair (the vast majority) use the binary per-AT named tables
 * (at-tables.ts) directly and never reach here.
 */
import type { NumberOrScaled } from '@/types';
import { getScaleValue } from '@/types';

/** Base value per scale point at modifier 1.0. */
export const BASE_DEBUFF = 0.05; // 5% per scale for debuffs
export const BASE_BUFF = 0.10; //  10% per scale for buffs

export type BuffDebuffCategory = 'buff' | 'debuff';

/**
 * Canonical base-rate formula: scale × base × modifier. Returns a FRACTION
 * (e.g. 0.125 for 12.5%). The caller supplies the already-resolved modifier.
 * Accepts both number (legacy) and ScaledEffect (new format) as input.
 */
export function calculateBuffDebuffFraction(
  scaleOrEffect: NumberOrScaled,
  modifier: number,
  category: BuffDebuffCategory = 'buff'
): number {
  const scale = getScaleValue(scaleOrEffect);
  if (scale === undefined || scale === 0) return 0;
  const base = category === 'debuff' ? BASE_DEBUFF : BASE_BUFF;
  return scale * base * modifier;
}

