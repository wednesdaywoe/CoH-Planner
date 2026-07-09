import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data';

/**
 * Regression guard for ally/team +Range buffs.
 *
 * Power of the Depths (Marine Affinity, internal "Call_Depths") is a
 * self/team PBAoE that buffs the caster and nearby allies' Range by +37.5%.
 * Its Range effect template targets `AnyAffected` (not `Self`).
 *
 * The Taunt/Freezing-Touch fix (753ce0165f) gated the converter's *positive*
 * Range branch on the template target being strictly `Self`, which silently
 * dropped this ally-targeted +Range buff — PotD stopped advertising +Range
 * even though its shortHelp still claimed it. The converter now routes a
 * positive Strength-aspect Range mod on a non-Self target to `rangeBuff`,
 * mirroring the ally movement-buff branch. A positive Range on a foe is
 * nonsensical, so a non-Self positive Range is always an ally buff.
 *
 * These pin the emitted `rangeBuff` so the branch can't regress again.
 */

// Marine Affinity ships on multiple ATs; PotD lives in each copy.
const POTD_SETS = [
  'defender/marine-affinity',
  'corruptor/marine-affinity',
  'controller/marine-affinity',
  'mastermind/marine-affinity',
];

function powerBy(powersetId: string, internalName: string) {
  return getPowerset(powersetId)?.powers.find((p) => p.internalName === internalName);
}

describe('Ally/team +Range buff — homecoming', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  for (const setId of POTD_SETS) {
    it(`${setId}: Power of the Depths emits its +37.5% rangeBuff`, () => {
      const potd = powerBy(setId, 'Call_Depths');
      expect(potd, `${setId} Call_Depths`).toBeTruthy();
      const rangeBuff = potd!.effects?.rangeBuff;
      expect(rangeBuff, `${setId} rangeBuff`).toBeTruthy();
      // 0.375 scale == +37.5% Range. targetType Self → self-applies in calc.
      // rangeBuff is NumberOrScaled; PotD's is always the ScaledEffect form.
      expect(typeof rangeBuff).toBe('object');
      expect((rangeBuff as { scale: number }).scale).toBeCloseTo(0.375, 3);
      expect(potd!.targetType?.toLowerCase()).toBe('self');
    });
  }
});
