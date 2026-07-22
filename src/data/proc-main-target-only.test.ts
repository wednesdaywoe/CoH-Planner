import { describe, it, expect } from 'vitest';
import {
  DAMAGE_MAIN_TARGET_ONLY_POWERS,
  isDamageMainTargetOnlyPower,
  isFoeDamageProc,
  findProcData,
} from './proc-data';
import { calculateSlottedProcDamagePerCast } from '@/utils/calculations/power-proc-damage';
import type { IOSetEnhancement } from '@/types';

/**
 * Regression guard for the "main-target-only damage" proc area-factor override.
 *
 * Propel carries a 15ft AoE radius, but that radius belongs to its knockback
 * splash — the Smashing damage lands only on the main target (`ProcMainTargetOnly`
 * / effect-group `MainTargetOnly` in the bin, a flag the parser currently drops).
 * A slotted DAMAGE proc therefore rolls the single-target area-factor, NOT the
 * 15ft-AoE one, while non-damage procs (Force Feedback: +Recharge, a Knockback
 * proc that rolls against the AoE knockback) keep the power's radius.
 *
 * See DAMAGE_MAIN_TARGET_ONLY_POWERS in proc-data.ts. When the parser learns to
 * capture MainTargetOnly, this override is superseded — but the observable
 * behavior pinned here must not change.
 */
describe('main-target-only damage proc area factor', () => {
  it('flags Propel and nothing that is a genuine AoE', () => {
    expect(DAMAGE_MAIN_TARGET_ONLY_POWERS.has('Propel')).toBe(true);
    expect(isDamageMainTargetOnlyPower('Propel')).toBe(true);
    // Real AoE damage powers must NOT be flagged (their damage is genuinely AoE).
    expect(isDamageMainTargetOnlyPower('Fire Ball')).toBe(false);
    expect(isDamageMainTargetOnlyPower('Blaze')).toBe(false);
    // Safe on missing names.
    expect(isDamageMainTargetOnlyPower(undefined)).toBe(false);
    expect(isDamageMainTargetOnlyPower(null)).toBe(false);
    expect(isDamageMainTargetOnlyPower('')).toBe(false);
  });

  it('distinguishes a foe-damage proc from Force Feedback (+Recharge)', () => {
    const dmgProc = findProcData('Chance for Smashing Damage', 'Unbreakable Constraint');
    const forceFeedback = findProcData('Chance for Recharge Buff', 'Force Feedback');
    expect(dmgProc).toBeTruthy();
    expect(forceFeedback).toBeTruthy();
    // A foe-damage proc carries a Damage effect with a value..valueMax range;
    // Force Feedback carries a Recharge buff, no damage payload.
    expect(isFoeDamageProc(dmgProc!)).toBe(true);
    expect(isFoeDamageProc(forceFeedback!)).toBe(false);
  });

  it('scores a damage proc in a 15ft power single-target when main-target-only', () => {
    // Minimal Propel-shaped slot: one foe-damage proc.
    const dmgSlot = {
      type: 'io-set',
      setId: 'unbreakable-constraint',
      setName: 'Unbreakable Constraint',
      pieceNum: 6,
      aspects: [],
      isProc: true,
      isUnique: true,
      id: 'test-proc',
      name: 'Chance for Smashing Damage',
      level: 50,
    } as unknown as IOSetEnhancement;

    // Propel's real timing: base recharge 8s, cast 2.07s.
    const base = {
      slots: [dmgSlot],
      baseRecharge: 8,
      castTime: 2.07,
      arcDegrees: 360,
      rechargeEnh: 0,
      buildLevel: 50,
    };

    const aoe = calculateSlottedProcDamagePerCast({ ...base, radius: 15 });
    const overridden = calculateSlottedProcDamagePerCast({ ...base, radius: 15, damageMainTargetOnly: true });
    const trueSingleTarget = calculateSlottedProcDamagePerCast({ ...base, radius: 0 });

    // Sanity: the proc actually contributes damage (effects are populated).
    expect(aoe).toBeGreaterThan(0);
    // The override makes a 15ft power's damage proc behave exactly like a
    // single-target power (radius 0) — the AoE penalty is removed.
    expect(overridden).toBeCloseTo(trueSingleTarget, 6);
    // And that is strictly more than the (buggy) AoE-penalized value.
    expect(overridden).toBeGreaterThan(aoe);
  });
});
