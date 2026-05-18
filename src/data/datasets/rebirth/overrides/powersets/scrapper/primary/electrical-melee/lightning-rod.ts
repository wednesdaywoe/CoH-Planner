/**
 * Lightning Rod — OVERRIDES LAYER
 *
 * See HC sibling for rationale. Binary reports targetType "Dead Teammate"
 * from the teleport mechanic and summons PL_StaticObject (no damage data)
 * instead of the AT-specific pet.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  targetType: 'Foe',
  effects: {
    summon: {
      isPseudoPet: false,
      entity: 'Pets_Lightning_Rod_Scrapper',
      displayName: 'Lightning Rod',
      duration: 1,
    },
  },
};
