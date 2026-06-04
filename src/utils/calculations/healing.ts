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
  scale: number;
  table?: string;
  /** From the AttribMod's IgnoreStrength flag — this heal is NOT boosted by
   *  Healing enhancement or global +Heal. */
  ignoreStrength?: boolean;
}

type DamageEntry = { type?: string; scale: number; table?: string; ignoreStrength?: boolean };

/**
 * Extract the `type: 'Heal'` entry from a power's `damage` field (a single object
 * or an array of entries). Returns undefined when there's no heal entry.
 */
export function extractHealingFromDamage(damage: unknown): HealingFromDamage | undefined {
  if (!damage) return undefined;

  let entry: DamageEntry | undefined;
  if (!Array.isArray(damage) && typeof damage === 'object' && 'type' in (damage as object) && (damage as { type: string }).type === 'Heal') {
    entry = damage as DamageEntry;
  } else if (Array.isArray(damage)) {
    entry = (damage as DamageEntry[]).find((e) => e?.type === 'Heal');
  }

  if (!entry || typeof entry.scale !== 'number') return undefined;
  return {
    scale: entry.scale,
    table: entry.table,
    ...(entry.ignoreStrength ? { ignoreStrength: true } : {}),
  };
}
