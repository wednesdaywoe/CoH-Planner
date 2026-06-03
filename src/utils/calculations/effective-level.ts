/**
 * Effective combat level + incarnate exemplar suppression.
 *
 * Kept in its own tiny module (not character-totals.ts) so UI components can
 * import the helpers without pulling in the heavyweight calculation system.
 */

/**
 * Combat level below which ALL incarnate abilities (Alpha/Judgement/Interface/
 * Destiny/Lore/Hybrid/Genesis) turn off when exemplared. Genesis is the one slot
 * that grants a replacement "exemplar power" below this line.
 */
export const INCARNATE_MIN_LEVEL = 45;

/**
 * The effective combat level a build operates at, accounting for exemplaring.
 * When not exemplared, this is just the build level.
 */
export function getEffectiveLevel(
  buildLevel: number,
  exemplarMode: boolean,
  exemplarLevel?: number,
): number {
  return exemplarMode ? (exemplarLevel ?? buildLevel) : buildLevel;
}

/**
 * True when incarnate abilities are suppressed (effective level < 45). In game,
 * incarnates simply stop functioning below 45 — they aren't scaled down.
 */
export function areIncarnatesSuppressed(effectiveLevel: number): boolean {
  return effectiveLevel < INCARNATE_MIN_LEVEL;
}
