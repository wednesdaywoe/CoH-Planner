/**
 * Regression guard for the RefreshToCount stacking-flaw fix + Wild Bastion
 * perma fix. Asserts the metadata the converter now emits and the numbers a
 * build would show, against the REAL generated data + REAL perma eligibility.
 *
 * If HC rebalances Psionic Armor / Nature Affinity these values may shift —
 * update them, but the STRUCTURE (RefreshToCount→stacks, perTarget base+
 * increment, divergent stackCaps, absorb-duration→perma) must hold.
 */
import { describe, it, expect } from 'vitest';
import { isPermaEligible } from './perma';
import { FortifyMind as BruteFortifyMind } from '@/data/datasets/homecoming/generated/powersets/brute/secondary/psionic-armor/fortify-mind';
import { ConsumePsyche } from '@/data/datasets/homecoming/generated/powersets/brute/secondary/psionic-armor/consume-psyche';
import { WildBastion } from '@/data/datasets/homecoming/generated/powersets/controller/secondary/nature-affinity/wild-bastion';

// Mirror the calc's cap math (adjustForStacking) and perTarget math
// (adjustForPerTarget) so we assert the numbers a build would actually show.
const linearAt = (scale: number, n: number, cap: number) => scale * Math.min(n, cap);
const perTargetAt = (scale: number, perTarget: number, n: number) =>
  n <= 0 ? 0 : n === 1 ? scale : scale + perTarget * (n - 1);

describe('Psychokinetic Barrier (Fortify_Mind) — RefreshToCount debuff-res ×3', () => {
  const e = BruteFortifyMind.effects!;
  it('surfaces a 3-stack axis with divergent per-effect caps', () => {
    expect(e.maxStacks).toBe(3);
    expect(e.stacksLinear).toEqual(expect.arrayContaining(['absorb', 'debuffResistance']));
    expect(e.stackCaps).toEqual({ absorb: 2 }); // absorb caps at 2, debuff-res reaches 3
  });
  it('debuff-resistance scales to +60% at 3 stacks; absorb clamps at ×2', () => {
    const dr = (e.debuffResistance!.recharge as { scale: number }).scale; // 0.2
    expect(linearAt(dr, 3, e.stackCaps?.debuffResistance ?? e.maxStacks!)).toBeCloseTo(0.6);
    const abs = (e.absorb as { scale: number }).scale; // 3.0
    expect(linearAt(abs, 3, e.stackCaps!.absorb)).toBeCloseTo(6.0); // NOT 9.0
  });
  it('did NOT leak the RechargeTime@Resistance template into a fake rechargeBuff', () => {
    expect(e.rechargeBuff).toBeUndefined();
    expect(e.debuffResistance?.recharge).toBeDefined();
  });
});

describe('Consume Psyche — per-foe +Regen/+Recovery ×10 via perTarget', () => {
  const e = ConsumePsyche.effects!;
  it('models base + per-foe increment (not a flat 1-stack value)', () => {
    const regen = e.regenBuff as { scale: number; perTarget?: number };
    const rec = e.recoveryBuff as { scale: number; perTarget?: number };
    expect(regen.perTarget).toBeCloseTo(0.35);
    expect(rec.perTarget).toBeCloseTo(0.05);
    // No N² risk: perTarget keys are NOT also in stacksLinear.
    expect(e.stacksLinear ?? []).not.toContain('regenBuff');
    expect(e.stacksLinear ?? []).not.toContain('recoveryBuff');
  });
  it('reaches +400% Regen / +60% Recovery at 10 foes', () => {
    const regen = e.regenBuff as { scale: number; perTarget: number };
    const rec = e.recoveryBuff as { scale: number; perTarget: number };
    expect(perTargetAt(regen.scale, regen.perTarget, 1)).toBeCloseTo(0.85);
    expect(perTargetAt(regen.scale, regen.perTarget, 10)).toBeCloseTo(4.0);
    expect(perTargetAt(rec.scale, rec.perTarget, 10)).toBeCloseTo(0.6);
  });
});

describe('Wild Bastion — absorb shield is now perma-trackable', () => {
  it('is perma-eligible (absorb duration counts as a self-state)', () => {
    expect(WildBastion.effects?.durations?.absorb).toBeGreaterThan(0);
    expect(isPermaEligible(WildBastion)).toBe(true);
  });
});
