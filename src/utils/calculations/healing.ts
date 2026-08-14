/**
 * Healing-from-damage extraction.
 *
 * Some powers store their self/ally heal in the `damage` field as a
 * `{ type: 'Heal', scale, table }` entry (Life Drain, Reconstruction, Inner Will,
 * DNA Siphon, Restore Essence, …) rather than in `effects.healing`. This is the
 * single source of truth for pulling that out — it was previously duplicated in
 * InfoPanel, PowerInfoTooltip, and CompareSlottingModal.
 */

/** A heal sourced from a power's `damage` field. */
export interface HealingFromDamage {
  /** Total base heal scale (all same-table Heal entries summed). */
  scale: number;
  table?: string;
  /** Portion of `scale` flagged IgnoreStrength — NOT boosted by Healing enh or
   *  global +Heal. Some powers (DNA Siphon, Rebuild DNA, Inner Will) pair an
   *  enhanceable heal with an unenhanceable one; the calc enhances only
   *  `scale - unenhancedScale`. Absent when the whole heal is enhanceable. */
  unenhancedScale?: number;
}

import { dotTickCount } from './damage';

type DamageEntry = { type?: string; scale: number; table?: string; ignoreStrength?: boolean; duration?: number; tickRate?: number };

/**
 * Extract a power's heal from its `damage` field (a single `type: 'Heal'` object
 * or an array of entries). Sums the same-table Heal entries — a power can carry an
 * enhanceable heal AND an IgnoreStrength one — tracking the unenhanceable portion.
 * Returns undefined when there's no heal entry.
 */
export function extractHealingFromDamage(damage: unknown): HealingFromDamage | undefined {
  if (!damage) return undefined;

  const heals: DamageEntry[] = Array.isArray(damage)
    ? (damage as DamageEntry[]).filter((e) => e?.type === 'Heal')
    : (typeof damage === 'object' && 'type' in (damage as object) && (damage as { type: string }).type === 'Heal'
        ? [damage as DamageEntry]
        : []);
  if (!heals.length) return undefined;

  // Combine only entries that share the first heal's table (mixing tables would be
  // unitless-incorrect; the both-portions powers are all single-table in practice).
  const table = heals[0].table;
  let scale = 0;
  let unenhancedScale = 0;
  for (const e of heals) {
    if (typeof e.scale !== 'number' || e.table !== table) continue;
    const ticks = (e.duration && e.tickRate && e.duration > 0 && e.tickRate > 0)
      ? dotTickCount(e.duration, e.tickRate)
      : 1;
    scale += e.scale * ticks;
    if (e.ignoreStrength) unenhancedScale += e.scale * ticks;
  }
  if (scale === 0 && unenhancedScale === 0) return undefined;

  return {
    scale,
    table,
    ...(unenhancedScale ? { unenhancedScale } : {}),
  };
}
