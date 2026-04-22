/**
 * Hide — OVERRIDES LAYER
 *
 * `allowedSetCategories` restored: the binary parser is currently emitting a
 * corrupted boostset_cats string for Hide (e.g. "olumnEndgame.NictusFX"),
 * which the converter drops. The actual game allows Defense IO sets.
 * Remove this override once the parser bug is fixed.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  allowedSetCategories: ['Defense Sets'],
};
