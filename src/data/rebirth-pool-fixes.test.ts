import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerPool, getPoolPower, isPowerAvailableInPool } from '@/data';
import { calculateCharacterTotals } from '@/utils/calculations/character-totals';
import { createEmptyBuild } from '@/types/build';

/**
 * Two @Redlynne Rebirth pool reports:
 *
 * A) Gadgetry > Jet Pack required a prior pool pick + level 14, unlike the other
 *    Origin-pool travel powers. Jetpack (rank 3, available L4, no `requires`) was
 *    simply missing from EARLY_TRAVEL_POWERS, so it fell through to the generic
 *    "rank 3 needs level 14 + 1 pool power" rule.
 *
 * B) Concealment > Grant Invisibility (target: Teammate) added its ally Defense
 *    buff to the CASTER's own Defense totals. The ally-only filter keys off
 *    `power.targetType`, but `transformPoolPower` dropped targetType, so the
 *    powerset def carried `undefined` and the filter never fired.
 */

describe('Rebirth pool fixes', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  // ---- A) Jet Pack availability -------------------------------------------
  describe('Gadgetry travel power availability', () => {
    it('Jet Pack is available at level 4 with no prior pool powers (Origin travel power)', () => {
      const jetpack = getPowerPool('gadgetry')?.powers.find((p) => p.internalName === 'Jetpack');
      expect(jetpack).toBeDefined();
      expect(isPowerAvailableInPool('gadgetry', jetpack!, 4, [])).toBe(true);
    });

    it('a non-travel rank-4 Gadgetry power still needs level 14 + pool prerequisites', () => {
      const rank4 = getPowerPool('gadgetry')?.powers.find((p) => p.rank === 4);
      expect(rank4).toBeDefined();
      expect(isPowerAvailableInPool('gadgetry', rank4!, 4, [])).toBe(false);
    });
  });

  // ---- B) Grant Invisibility ally-buff filtering --------------------------
  describe('Grant Invisibility ally Defense does not leak to the caster', () => {
    it('the powerset def carries targetType through the transform', () => {
      expect(getPoolPower('invisibility', 'Grant_Invisibility')?.targetType).toBe('Teammate');
      // Contrast: a self-targeted pool power keeps Self (so it DOES contribute).
      expect(getPoolPower('invisibility', 'Stealth')?.targetType).toBe('Self');
    });

    it('an active Grant Invisibility adds no Defense to the caster totals', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const b: any = createEmptyBuild();
      b.serverId = 'rebirth';
      b.level = 50;
      b.archetype = { id: 'mastermind', name: 'Mastermind', stats: null, inherent: null };
      b.pools = [{ id: 'invisibility', name: 'Concealment', powers: [
        { internalName: 'Grant_Invisibility', name: 'Grant Invisibility', powerType: 'Click', isActive: true, slots: [] },
      ] }];
      const t = calculateCharacterTotals(b, false, undefined, { combatMode: false });
      expect(t.globalBonuses.defMelee).toBe(0);
      expect(t.globalBonuses.defRanged).toBe(0);
      expect(t.globalBonuses.defSmashing).toBe(0);
    });
  });
});
