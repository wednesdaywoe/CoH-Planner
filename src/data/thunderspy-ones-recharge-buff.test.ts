import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerPool } from '@/data';
import { isPermaEligible } from '@/utils/calculations/perma';

/**
 * Thunderspy stores recharge buffs (Hasten, Adrenal Booster, Unleash Potential)
 * with a generic `Ones` attrib and blank aspect/type — a byte-level decode of
 * the binary confirmed the modified attribute is NOT stored per-template, so
 * `extractEffects` can't classify the template and dropped both the buff and its
 * duration. That left Thunderspy Hasten with no `rechargeBuff` (no +recharge
 * applied) and no `buffDuration` (so the perma-tracking "Track" button never
 * appeared). `recoverThunderspyOnesBuffs` reconstructs them from the shortHelp.
 * See BIN-PARSER-LOG "Thunderspy `Ones`-attrib buffs lose their attribute".
 *
 * These tests re-read the recovered shape from the committed dataset so a future
 * regen can't silently undo it (GAME-DATA-PRINCIPLES §9).
 */
describe('Thunderspy Ones-attrib recharge-buff recovery', () => {
  beforeAll(async () => {
    await loadDataset('thunderspy');
  });

  it('Hasten recovers its +70% recharge buff and 120s duration from the shortHelp', () => {
    const hasten = getPowerPool('speed')?.powers.find((p) => p.internalName === 'Hasten');
    expect(hasten).toBeDefined();
    expect(hasten!.effects?.rechargeBuff).toEqual({ scale: 0.7, table: 'Melee_Ones' });
    expect(hasten!.effects?.buffDuration).toBe(120);
  });

  it('Hasten is now perma-eligible (the Track button appears)', () => {
    const hasten = getPowerPool('speed')?.powers.find((p) => p.internalName === 'Hasten');
    // 450s recharge / 120s duration, self recharge-buff → eligible.
    expect(isPermaEligible(hasten!)).toBe(true);
  });

  it('Burnout (instant, no duration) stays ineligible — recovery is skipped', () => {
    // Burnout's only Ones template has duration 0 (it instantly recharges other
    // powers), so it must NOT gain a buffDuration / rechargeBuff.
    const burnout = getPowerPool('speed')?.powers.find((p) => p.internalName === 'Burnout');
    expect(burnout).toBeDefined();
    expect(burnout!.effects?.buffDuration).toBeUndefined();
    expect(isPermaEligible(burnout!)).toBe(false);
  });
});
