import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data';
import { calculatePermaInfo } from '@/utils/calculations/perma';
import type { Power } from '@/types';

/**
 * StrengthsDisallowed / GlobalStrengthsDisallowed — power flags that block
 * recharge (and other) strength from applying to specific powers.
 *
 * StrengthsDisallowed IS serialized into powers.bin, so it comes from the
 * export on every fork. GlobalStrengthsDisallowed is an HC addition with no
 * i24 parse-table entry and no bin field, so it alone still comes from the
 * committed `raw defs/` .powers oracle. These tests pin:
 *   1. the dataset emission on known carriers (armor T9s, Rune of Protection,
 *      melee Range locks, Kuji-In Rin's global-only variant), and
 *   2. the perma calc honoring them (Hasten/set bonuses must not perma a
 *      fixed-cooldown T9).
 */

function powerBy(powersetId: string, internalName: string) {
  return getPowerset(powersetId)?.powers.find((p) => p.internalName === internalName);
}

describe('strengthsDisallowed dataset emission — homecoming', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('Willpower Strength of Will (Brute + Scrapper) locks RechargeTime', () => {
    for (const setId of ['brute/willpower', 'scrapper/willpower']) {
      const p = powerBy(setId, 'Strength_of_Will');
      expect(p, `${setId} Strength_of_Will`).toBeTruthy();
      expect(p!.strengthsDisallowed).toContain('RechargeTime');
    }
  });

  it('Shield Defense One with the Shield locks RechargeTime', () => {
    const p = powerBy('brute/shield-defense', 'One_with_the_Shield');
    expect(p).toBeTruthy();
    expect(p!.strengthsDisallowed).toContain('RechargeTime');
  });

  it('a melee attack locks Range (the big kRange class)', () => {
    const p = powerBy('brute/shield-defense', 'One_with_the_Shield');
    expect(p).toBeTruthy();
    // sibling check on an attack set: Battle Axe Swoop carries kRange
    const swoop = powerBy('tanker/battle-axe', 'Swoop');
    expect(swoop, 'tanker/battle-axe Swoop').toBeTruthy();
    expect(swoop!.strengthsDisallowed).toContain('Range');
  });

  it('Kuji-In Rin carries the GLOBAL-only variant (slotting still works)', () => {
    const p = powerBy('stalker/ninjitsu', 'Kuji-In_Rin');
    expect(p).toBeTruthy();
    expect(p!.globalStrengthsDisallowed?.length).toBeGreaterThan(0);
    // the full lock must NOT be set from the global-only field
    expect(p!.strengthsDisallowed ?? []).not.toContain('RechargeTime');
  });
});

describe('strengthsDisallowed on rebirth — its own bin, not the HC oracle', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  it('Rebirth Strength of Will locks RechargeTime like its HC twin', () => {
    const p = powerBy('brute/willpower', 'Strength_of_Will');
    expect(p).toBeTruthy();
    expect(p!.strengthsDisallowed).toContain('RechargeTime');
  });

  it('a Rebirth melee attack locks Range', () => {
    const swoop = powerBy('tanker/battle-axe', 'Swoop');
    expect(swoop, 'tanker/battle-axe Swoop').toBeTruthy();
    expect(swoop!.strengthsDisallowed).toContain('Range');
  });
});

describe('calculatePermaInfo honors the recharge locks', () => {
  const base: Power = {
    name: 'T9',
    internalName: 'T9',
    available: 0,
    maxSlots: 6,
    allowedEnhancements: [],
    description: '',
    powerType: 'Click',
    // Hasten-shaped, and the self-buff slot is load-bearing: the perma window is
    // the CASTER-side state's own duration, so a bare `buffDuration` with nothing
    // landing on the caster is no window at all and yields null. These cases are
    // about the recharge LOCKS, so the power has to hold something first.
    effects: { recharge: 300, buffDuration: 120, rechargeBuff: 0.7 },
  } as unknown as Power;

  it('unflagged power: slotted + global recharge both apply', () => {
    const info = calculatePermaInfo(base, { recharge: 0.5 }, 0.7);
    expect(info!.totalRecharge).toBeCloseTo(1.2, 6);
    expect(info!.effectiveRecharge).toBeCloseTo(300 / 2.2, 4);
  });

  it('strengthsDisallowed RechargeTime: NO recharge strength applies', () => {
    const p = { ...base, strengthsDisallowed: ['RechargeTime'] };
    const info = calculatePermaInfo(p, { recharge: 0.5 }, 0.7);
    expect(info!.totalRecharge).toBe(0);
    expect(info!.effectiveRecharge).toBe(300);
    expect(info!.isPerma).toBe(false);
  });

  it('globalStrengthsDisallowed RechargeTime: slotted applies, global does not', () => {
    const p = { ...base, globalStrengthsDisallowed: ['RechargeTime'] };
    const info = calculatePermaInfo(p, { recharge: 0.5 }, 0.7);
    expect(info!.totalRecharge).toBeCloseTo(0.5, 6);
    expect(info!.effectiveRecharge).toBeCloseTo(200, 4);
  });

  it('locks on a different attribute do not touch recharge', () => {
    const p = { ...base, strengthsDisallowed: ['Range'] };
    const info = calculatePermaInfo(p, { recharge: 0.5 }, 0.7);
    expect(info!.totalRecharge).toBeCloseTo(1.2, 6);
  });
});
