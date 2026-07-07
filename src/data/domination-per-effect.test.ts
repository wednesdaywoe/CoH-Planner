import { describe, it, expect } from 'vitest';
import type { Power, MezEffect } from '@/types';
import { isMezEffect } from '@/types/power';
import { Dominate } from './datasets/homecoming/powersets/dominator/primary/mind-control/dominate';
import { TotalFocus } from './datasets/homecoming/powersets/dominator/secondary/energy-assault/total-focus';
import { CryoFreezeRay } from './datasets/homecoming/powersets/dominator/primary/arsenal-control/cryo-freeze-ray';
import { FRTDominate } from './datasets/homecoming/powersets/arachnos-widow/epic/fortunata-training/frt-dominate';

/**
 * Per-effect Domination bonus (Dominator inherent).
 *
 * The boost is data-driven: each Dominator control/assault power carries a
 * nested `Tag "Domination"` effect group that adds an extra mez (stacking onto
 * the base) while Domination is active. The converter now routes it through the
 * shared `domination` conditionalEffect (id 'Domination Active') — the SAME
 * representation Rebirth/tspy get from their `kStealth source>` gate — instead
 * of the retired `MezEffect.domination` sub-field. The planner reads it
 * per-power (NOT a blanket ×2/×1.5 gated on category): exact per-power values,
 * boosts tagged ASSAULT powers the category gate missed, and leaves untagged
 * control effects (e.g. epic/patron holds) alone.
 *
 * See HOMECOMING_PARSER.md "attrib-118 misdecode" → Domination correction, and
 * DEDUCTIVE_SCHEMA_HARNESS.md DSH6b (domination bolt-on retirement).
 */

const mez = (power: Power, key: string): MezEffect | undefined => {
  const v = (power.effects as unknown as Record<string, unknown> | undefined)?.[key];
  return isMezEffect(v as never) ? (v as MezEffect) : undefined;
};

/** The Domination bonus mez for `key`, from the power's `domination` conditional. */
const domBonus = (power: Power, key: string): MezEffect | undefined => {
  const dom = power.conditionalEffects?.find((c) => c.id === 'domination');
  const v = (dom?.effects as unknown as Record<string, unknown> | undefined)?.[key];
  return isMezEffect(v as never) ? (v as MezEffect) : undefined;
};

describe('Domination per-effect bonus (data-driven, shared conditional)', () => {
  it('Dominate carries its Domination hold bonus (base 3/12 → +3/18 = mag 6, ×1.5 dur)', () => {
    const hold = mez(Dominate, 'hold');
    const bonus = domBonus(Dominate, 'hold');
    expect(hold?.mag).toBe(3);
    expect(hold?.scale).toBe(12);
    expect(bonus).toEqual({ mag: 3, scale: 18, table: 'Ranged_Immobilize' });
    // Effective under Domination: mag 3+3=6, duration scale 18/12 = ×1.5.
    expect(hold!.mag + bonus!.mag).toBe(6);
    expect(bonus!.scale / hold!.scale).toBeCloseTo(1.5);
  });

  it('captures the bonus on an ASSAULT power (Total Focus Stun) — the old category gate missed these', () => {
    const stun = mez(TotalFocus, 'stun');
    const bonus = domBonus(TotalFocus, 'stun');
    expect(bonus).toBeTruthy();
    expect(stun!.mag + bonus!.mag).toBe(6); // 3 + 3
    expect(bonus!.scale / stun!.scale).toBeCloseTo(1.5); // 15/10
  });

  it('preserves per-power outliers (Cryo Freeze Ray duration is ×1.8, not a blanket ×1.5)', () => {
    const hold = mez(CryoFreezeRay, 'hold');
    const bonus = domBonus(CryoFreezeRay, 'hold');
    expect(hold?.scale).toBe(10);
    expect(bonus?.scale).toBe(18);
    expect(bonus!.scale / hold!.scale).toBeCloseTo(1.8);
  });

  it('does NOT boost an untagged control power (Widow FRT Dominate has no Domination tag)', () => {
    // A Fortunata hold reuses the Dominate name/shape but carries no
    // `Tag "Domination"` — it must have no `domination` conditional, so the
    // planner leaves it unboosted even while Domination is toggled on.
    const hold = mez(FRTDominate, 'hold');
    // It has a base hold...
    expect(hold?.mag).toBeGreaterThan(0);
    // ...but NO domination bonus.
    expect(domBonus(FRTDominate, 'hold')).toBeUndefined();
  });
});
