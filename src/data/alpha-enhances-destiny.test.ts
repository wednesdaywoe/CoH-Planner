import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import {
  applyAlphaToDestiny,
  getAlphaEffects,
  getDestinyBoostsAllowed,
  getDestinyEffects,
} from '@/data';
import type { AlphaEffects, DestinyEffects } from '@/data';

/**
 * Alpha enhances a Destiny buff only when the game says the power accepts that
 * boost category (its boosts_allowed list). This is the data-gated rule Mids
 * doesn't model. These tests pin the pure mapping/gating and one real-data path
 * (Cardiac → Barrier resistance).
 */
describe('applyAlphaToDestiny (pure mapping + gating)', () => {
  it('enhances resistance only when the power accepts Res_Damage', () => {
    const fx: DestinyEffects = { resistanceAll: 0.5, defenseAll: 0.5 };
    const cardiac: AlphaEffects = { resistance: 0.2 };
    // Barrier-like: accepts both → resistance boosted, defense untouched (no defense aspect).
    const out = applyAlphaToDestiny(fx, ['Res_Damage', 'Buff_Defense'], cardiac);
    expect(out.resistanceAll).toBeCloseTo(0.6, 6); // 0.5 × 1.2
    expect(out.defenseAll).toBe(0.5);
  });

  it('does not enhance a stat whose boost category is absent', () => {
    const fx: DestinyEffects = { resistanceAll: 0.5 };
    // Power accepts only Buff_Defense; a resistance alpha must not apply.
    const out = applyAlphaToDestiny(fx, ['Buff_Defense'], { resistance: 0.2 });
    expect(out).toBe(fx); // unchanged reference
  });

  it('maps defense, heal and recovery to their aspects', () => {
    const alpha: AlphaEffects = { defense: 0.1, heal: 0.33, enduranceModification: 0.2 };
    const fx: DestinyEffects = { defenseAll: 0.3, healPercent: 1, recovery: 5 };
    const out = applyAlphaToDestiny(fx, ['Buff_Defense', 'Heal', 'Recovery'], alpha);
    expect(out.defenseAll).toBeCloseTo(0.33, 6); // 0.3 × 1.1
    expect(out.healPercent).toBeCloseTo(1.33, 6); // 1 × 1.33
    expect(out.recovery).toBeCloseTo(6, 6); // 5 × 1.2
  });

  it('is a no-op without an Alpha or with an irrelevant aspect', () => {
    const fx: DestinyEffects = { resistanceAll: 0.5 };
    expect(applyAlphaToDestiny(fx, ['Res_Damage'], null)).toBe(fx);
    // Musculature-like (damage only) touches nothing on a Barrier-like power.
    expect(applyAlphaToDestiny(fx, ['Res_Damage'], { damage: 0.45 })).toBe(fx);
  });
});

describe('Alpha → Destiny with real Homecoming data', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('Barrier accepts Res_Damage + Buff_Defense; Ageless accepts only Recovery', () => {
    expect(getDestinyBoostsAllowed('barrier_core_invocation')).toEqual(['Res_Damage', 'Buff_Defense']);
    expect(getDestinyBoostsAllowed('ageless_core_epiphany')).toEqual(['Recovery']);
  });

  it('Cardiac Core Paragon enhances Barrier resistance by its 20%, leaving defense alone', () => {
    const alpha = getAlphaEffects('cardiac_core_paragon');
    expect(alpha?.resistance).toBeCloseTo(0.2, 6);

    const barrier = getDestinyEffects('barrier_core_invocation')!; // peak 0.6 def/res
    const out = applyAlphaToDestiny(barrier, getDestinyBoostsAllowed('barrier_core_invocation'), alpha);
    expect(out.resistanceAll).toBeCloseTo(0.72, 6); // 0.6 × 1.2 (Cardiac has no defense aspect)
    expect(out.defenseAll).toBe(barrier.defenseAll);
  });
});
