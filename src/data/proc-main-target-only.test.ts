import { describe, it, expect } from 'vitest';
import {
  PROC_MAIN_TARGET_ONLY_POWERS,
  isProcMainTargetOnlyPower,
  resolveProcRollGeometry,
  findProcData,
  calculateProcChance,
} from './proc-data';
import { calculateSlottedProcDamagePerCast } from '@/utils/calculations/power-proc-damage';
import type { IOSetEnhancement } from '@/types';

/**
 * Regression guard for the "main-target-only" proc area-factor override.
 *
 * Propel carries a 15ft AoE radius, but that radius belongs to its knockback
 * splash — the power lands on the main target only (`ProcMainTargetOnly` /
 * effect-group `MainTargetOnly` in the bin, a flag the parser currently drops).
 * EVERY proc slotted in it therefore rolls the single-target area-factor: the
 * flag is a property of the power, not of the individual proc, so Force Feedback
 * (+Recharge) scores exactly like a damage proc does. The first cut of this
 * override applied only to foe-damage procs and left Force Feedback on the 15ft
 * denominator — that was wrong, and the third test below pins the correction.
 *
 * MEASURED IN GAME 2026-07-28 (Propel + Explosive Strike 3.5 PPM, no recharge
 * slotted, single target): 66 hits → 43 procs = 65.2%. The single-target model
 * predicts 58.7% (z = +1.06, consistent); the 15ft-AoE model predicts 21.9%
 * (z = +8.51, p = 5.6e-14 — excluded). Do not "fix" this back to an AoE
 * denominator; the numbers are in docs/DATA-GAP-REGISTER.md HC-3.
 *
 * See PROC_MAIN_TARGET_ONLY_POWERS in proc-data.ts. When the parser learns to
 * capture MainTargetOnly, this override is superseded — but the observable
 * behavior pinned here must not change.
 */
describe('main-target-only proc area factor', () => {
  it('flags Propel and nothing that is a genuine AoE', () => {
    expect(PROC_MAIN_TARGET_ONLY_POWERS.has('Propel')).toBe(true);
    expect(isProcMainTargetOnlyPower('Propel')).toBe(true);
    // Real AoE powers must NOT be flagged (their procs genuinely roll AoE).
    expect(isProcMainTargetOnlyPower('Fire Ball')).toBe(false);
    expect(isProcMainTargetOnlyPower('Blaze')).toBe(false);
    // Safe on missing names.
    expect(isProcMainTargetOnlyPower(undefined)).toBe(false);
    expect(isProcMainTargetOnlyPower(null)).toBe(false);
    expect(isProcMainTargetOnlyPower('')).toBe(false);
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
    const overridden = calculateSlottedProcDamagePerCast({ ...base, radius: 15, internalName: 'Propel' });
    const trueSingleTarget = calculateSlottedProcDamagePerCast({ ...base, radius: 0 });

    // Sanity: the proc actually contributes damage (effects are populated).
    expect(aoe).toBeGreaterThan(0);
    // The override makes a 15ft power's damage proc behave exactly like a
    // single-target power (radius 0) — the AoE penalty is removed.
    expect(overridden).toBeCloseTo(trueSingleTarget, 6);
    // And that is strictly more than the (buggy) AoE-penalized value.
    expect(overridden).toBeGreaterThan(aoe);
  });

  it('scores Force Feedback single-target too — the flag is per-power, not per-proc', () => {
    // The bug this pins: Force Feedback (+Recharge, no damage payload) was left
    // on Propel's 15ft denominator because the override only covered foe-damage
    // procs. Every PPM surface goes through resolveProcRollGeometry, so proving
    // the seam returns single-target geometry proves it for all of them.
    const forceFeedback = findProcData('Chance for Recharge Buff', 'Force Feedback');
    expect(forceFeedback).toBeTruthy();
    const ppm = forceFeedback!.ppm;
    expect(ppm).toBeTruthy();

    const propel = resolveProcRollGeometry('Propel', 15, 360);
    expect(propel).toEqual({ radius: 0, arcDegrees: 360 });

    // Propel's timing (8s recharge, 2.07s cast): the single-target roll, not the
    // AoE-penalized one.
    const rolled = calculateProcChance(ppm!, 8, 2.07, propel.radius, propel.arcDegrees);
    expect(rolled).toBeCloseTo(calculateProcChance(ppm!, 8, 2.07, 0, 360), 10);
    expect(rolled).toBeGreaterThan(calculateProcChance(ppm!, 8, 2.07, 15, 360));
  });

  it('leaves a genuine AoE alone and normalizes its arc', () => {
    expect(resolveProcRollGeometry('Fire Ball', 15, 360)).toEqual({ radius: 15, arcDegrees: 360 });
    // Cone: a real arc survives.
    expect(resolveProcRollGeometry('Frost', 40, 30)).toEqual({ radius: 40, arcDegrees: 30 });
    // Missing/zero arc on an AoE, and any arc on a single-target power, read 360.
    expect(resolveProcRollGeometry('Fire Ball', 15, undefined)).toEqual({ radius: 15, arcDegrees: 360 });
    expect(resolveProcRollGeometry('Blaze', 0, 30)).toEqual({ radius: 0, arcDegrees: 360 });
  });
});
