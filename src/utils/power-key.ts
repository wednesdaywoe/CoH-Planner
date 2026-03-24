/**
 * Power Key Utility
 *
 * Generates unique identifiers for powers in a build.
 *
 * Problem: `internalName` is NOT unique across categories.
 * For example, "Conserve_Power" is used by both Energize (secondary)
 * and Superior Conditioning (epic pool).
 *
 * Solution: Use `"category:internalName"` as the unique key.
 * This is always unique because within a single category (primary,
 * secondary, pools, epic, inherent), internalNames are unique.
 */

export type PowerCategory = 'primary' | 'secondary' | 'pool' | 'epic' | 'inherent';

/**
 * Create a unique power key from category and internalName.
 * Format: "category:internalName" (e.g., "secondary:Conserve_Power")
 */
export function powerKey(category: PowerCategory, internalName: string): string {
  return `${category}:${internalName}`;
}

/**
 * Parse a power key back into its parts.
 * Returns null if the key doesn't have the expected format.
 */
export function parsePowerKey(key: string): { category: PowerCategory; internalName: string } | null {
  const colonIndex = key.indexOf(':');
  if (colonIndex === -1) return null;
  const category = key.substring(0, colonIndex) as PowerCategory;
  const internalName = key.substring(colonIndex + 1);
  if (!['primary', 'secondary', 'pool', 'epic', 'inherent'].includes(category)) return null;
  return { category, internalName };
}
