import { describe, it, expect } from 'vitest';
import { findProcData, getProcEffects } from './proc-data';

/**
 * Five ATO sets have a 6th-piece special that's an always-on global (or pet
 * proc) rather than a self chance-proc. The binary tagged them proc:false, so
 * the special was dropped from BOTH the slot UI and the character totals
 * (enhancement-outline + the totals calc both gate on the piece `proc` flag).
 * The extractor now flips proc:true and proc-data carries each global; these
 * lock the display resolution + the one SELF global's calc values.
 *
 * Piece names are the extractor's labels; findProcData resolves by set name.
 */
describe('ATO passive-global / pet-proc 6th-piece specials', () => {
  const SETS: [piece: string, set: string, mechanicsIncludes: string][] = [
    ['Recharge/Critical Hit Bonus', "Scrapper's Strike", '+2% vs Minions'],
    ['Recharge/Critical Hit Bonus', "Superior Scrapper's Strike", '+3% vs Minions'],
    ['Recharge/Pet Defense Bonus', 'Command of the Mastermind', 'Def AoE 10%'],
    ['Recharge/Pet Defense Bonus', 'Superior Command of the Mastermind', 'Def AoE 15%'],
    ['Recharge/Resistance Bonus', "Kheldian's Grace", 'Max HP 7.5%'],
    ['Recharge/Resistance Bonus', "Superior Kheldian's Grace", 'Max HP 10%'],
    ['Recharge/Pet Resistance Bonus', 'Mark of Supremacy', 'Res All 10%'],
    ['Recharge/Pet Resistance Bonus', 'Superior Mark of Supremacy', 'Res All 15%'],
    ['Recharge/Pet Toxic Bonus', "Spider's Bite", '8% chance'],
    ['Recharge/Pet Toxic Bonus', "Superior Spider's Bite", '8% chance'],
  ];

  it('every set resolves to its OWN global (display), not just the first match', () => {
    for (const [piece, set, frag] of SETS) {
      const d = findProcData(piece, set);
      expect(d, `${set} should resolve`).toBeTruthy();
      expect(d!.setName).toBe(set);
      expect(d!.mechanics).toContain(frag);
    }
  });

  it("Kheldian's Grace (the one SELF global) applies +Res(All) + Max HP to totals", () => {
    const std = getProcEffects(findProcData('Recharge/Resistance Bonus', "Kheldian's Grace")!);
    expect(std).toEqual(expect.arrayContaining([
      expect.objectContaining({ category: 'Resistance', value: 3.5, effectType: 'All' }),
      expect.objectContaining({ category: 'MaxHP', value: 7.5 }),
    ]));
    const sup = getProcEffects(findProcData('Recharge/Resistance Bonus', 'Superior Kheldian\'s Grace')!);
    expect(sup).toEqual(expect.arrayContaining([
      expect.objectContaining({ category: 'Resistance', value: 5, effectType: 'All' }),
      expect.objectContaining({ category: 'MaxHP', value: 10 }),
    ]));
  });

  it('pet-buff globals yield no player-applicable value (calc skips them)', () => {
    for (const [piece, set] of SETS.filter(([, s]) => /Command|Mark|Spider/.test(s))) {
      const effs = getProcEffects(findProcData(piece, set)!);
      // Either no effect or a valueless "Special" — never a player stat value.
      expect(effs.every((e) => e.value === undefined)).toBe(true);
    }
  });
});
