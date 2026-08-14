import { describe, it, expect } from 'vitest';
import { getInherentPowerDef } from '@/data';

/**
 * Ninja Run and Beast Run are unslottable in-game (powers.bin boosts_allowed:
 * []). They must carry zero slots — no base slot, no auto slot. Sprint, by
 * contrast, is genuinely slottable and must keep its allowances.
 */
describe('Prestige travel toggle slot eligibility', () => {
  for (const name of ['Prestige_Ninja_Run', 'Prestige_Beast_Run']) {
    it(`${name} is unslottable (maxSlots 0, no allowed enhancements)`, () => {
      const def = getInherentPowerDef(name);
      expect(def, name).toBeTruthy();
      expect(def!.maxSlots).toBe(0);
      expect(def!.allowedEnhancements ?? []).toEqual([]);
      expect(def!.allowedSetCategories ?? []).toEqual([]);
    });
  }

  it('Sprint remains slottable (regression guard — not all travel toggles are 0-slot)', () => {
    const sprint = getInherentPowerDef('Sprint');
    expect(sprint).toBeTruthy();
    expect(sprint!.maxSlots).toBeGreaterThan(0);
    expect((sprint!.allowedEnhancements ?? []).length).toBeGreaterThan(0);
  });
});
