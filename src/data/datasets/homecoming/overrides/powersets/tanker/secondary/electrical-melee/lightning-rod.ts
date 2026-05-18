/**
 * Lightning Rod — OVERRIDES LAYER
 *
 * See sibling brute/primary/electrical-melee/lightning-rod.ts for rationale.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  targetType: 'Foe',
  effects: {
    summon: {
      isPseudoPet: false,
      entity: 'Pets_Lightning_Rod_Tanker',
      displayName: 'Lightning Rod',
      duration: 1,
    },
  },
};
