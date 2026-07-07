import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data';
import { calculatePermaInfo } from '@/utils/calculations/perma';
import type { Power } from '@/types';

/**
 * StrengthsDisallowed / GlobalStrengthsDisallowed — server-side power flags
 * that block recharge (and other) strength from applying to specific powers.
 *
 * The flags are NOT in the client powers.bin (verified 2026-07-07 by full
 * byte-accounting of Parse7 records — see tools/extraction-audit/audit.py
 * SERVER_ONLY_FIELDS); the converter sources them from the committed
 * `raw defs/` .powers oracle, HC only. These tests pin:
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

describe('strengthsDisallowed absent on rebirth (no oracle — no flags)', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  it('Rebirth Strength of Will carries no flag', () => {
    const p = powerBy('brute/willpower', 'Strength_of_Will');
    expect(p).toBeTruthy();
    expect(p!.strengthsDisallowed).toBeUndefined();
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
    effects: { recharge: 300, buffDuration: 120 },
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
