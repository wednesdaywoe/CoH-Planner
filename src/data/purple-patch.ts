/**
 * Purple Patch - Combat scaling tables for level differences.
 *
 * Table 1: Combat modifiers (damage, debuff strength, mez duration, knockback)
 * Table 2: Base ToHit chance
 *
 * "Above" = you are X levels above the target (fighting lower-level enemies)
 * "Below" = you are X levels below the target (fighting higher-level enemies)
 */

// ============================================
// TABLE 2: Base ToHit by level difference
// ============================================

/** Base ToHit when you are 0-4 levels ABOVE target */
const BASE_TOHIT_ABOVE: number[] = [
  0.75, // +0
  0.80, // +1
  0.85, // +2
  0.90, // +3
  0.95, // +4
];

/** Base ToHit when you are 0-7 levels BELOW target */
const BASE_TOHIT_BELOW: number[] = [
  0.75, // +0
  0.65, // -1
  0.56, // -2
  0.48, // -3
  0.39, // -4
  0.30, // -5
  0.20, // -6
  0.08, // -7
];

// ============================================
// TABLE 1: Combat modifiers by level difference
// ============================================

/** Combat modifier when you are 0-49 levels ABOVE target */
const COMBAT_MOD_ABOVE: number[] = [
  1.00, 1.11, 1.22, 1.33, 1.44, 1.55, 1.66, 1.77, 1.88, 2.00,
  2.10, 2.20, 2.30, 2.40, 2.50, 2.60, 2.70, 2.80, 2.90, 3.00,
  3.10, 3.20, 3.30, 3.40, 3.50, 3.60, 3.70, 3.80, 3.90, 4.00,
  4.10, 4.20, 4.30, 4.40, 4.50, 4.60, 4.70, 4.80, 4.90, 5.00,
  5.10, 5.20, 5.30, 5.40, 5.50, 5.60, 5.70, 5.80, 5.90, 6.00,
];

/** Combat modifier when you are 0-16+ levels BELOW target */
const COMBAT_MOD_BELOW: number[] = [
  1.00, // 0
  0.90, // 1
  0.80, // 2
  0.65, // 3
  0.48, // 4
  0.30, // 5
  0.15, // 6
  0.08, // 7
  0.05, // 8
  0.04, // 9
  0.03, // 10
  0.02, // 11
  0.01, // 12+
];

// ============================================
// LOOKUP FUNCTIONS
// ============================================

/**
 * Get base ToHit chance for a given level difference.
 * @param levelDiff Signed level difference: positive = target is higher, negative = target is lower
 * @returns Base ToHit chance (0.05 to 0.95)
 */
export function getBaseToHit(levelDiff: number): number {
  if (levelDiff <= 0) {
    // You are above or equal to target
    const index = Math.min(-levelDiff, BASE_TOHIT_ABOVE.length - 1);
    return BASE_TOHIT_ABOVE[index];
  }
  // You are below target
  const index = Math.min(levelDiff, BASE_TOHIT_BELOW.length - 1);
  return BASE_TOHIT_BELOW[index];
}

/**
 * Get combat modifier (damage/debuff/mez scaling) for a given level difference.
 * @param levelDiff Signed level difference: positive = target is higher, negative = target is lower
 * @returns Combat modifier multiplier
 */
export function getCombatModifier(levelDiff: number): number {
  if (levelDiff <= 0) {
    // You are above or equal to target — your effects are stronger
    const index = Math.min(-levelDiff, COMBAT_MOD_ABOVE.length - 1);
    return COMBAT_MOD_ABOVE[index];
  }
  // You are below target — your effects are weaker
  const index = Math.min(levelDiff, COMBAT_MOD_BELOW.length - 1);
  return COMBAT_MOD_BELOW[index];
}
