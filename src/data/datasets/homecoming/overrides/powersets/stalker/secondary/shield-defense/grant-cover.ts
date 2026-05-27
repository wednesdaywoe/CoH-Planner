/**
 * Grant Cover — OVERRIDES LAYER
 *
 * Marks defenseBuff as team-only — the caster does not receive the defense
 * bonus (per in-game description). DDR / recharge debuff resistance still
 * apply to self via the debuffResistance effect on the generated layer.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  effects: {
    defenseBuffExcludesSelf: true,
  },
};
