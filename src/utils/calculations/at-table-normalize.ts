/**
 * AT-table name/id normalization helpers.
 *
 * Extracted from the retired at-effects.ts scaled-effect engine (DEAD-1) —
 * these two pure string helpers were its only live exports (consumed by
 * damage.ts for AT-table lookups).
 */

/**
 * Normalize a table name from power data to match AT_TABLES keys.
 * Examples: "Ranged_Debuff_ToHit" → "ranged_debuff_tohit", "Melee-Buff" → "melee_buff".
 */
export function normalizeTableName(tableName: string): string {
  return tableName.toLowerCase().replace(/-/g, '_');
}

/**
 * Normalize an archetype ID for AT_TABLES lookup.
 * Handles formats like "defender", "arachnos_soldier" → "arachnos-soldier".
 */
export function normalizeArchetypeId(archetypeId: string): string {
  return archetypeId.toLowerCase().replace(/_/g, '-');
}
