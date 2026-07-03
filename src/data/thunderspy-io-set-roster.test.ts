import { describe, it, expect } from 'vitest';
import { IO_SETS_RAW as TSPY_SETS } from '@/data/datasets/thunderspy/io-sets-raw';
import { IO_SETS_RAW as HC_SETS } from '@/data/datasets/homecoming/io-sets-raw';

/**
 * Thunderspy IO-set roster, extracted from Thunderspy's own boostsets.bin
 * (scripts/extract-rebirth-io-sets-v2.py --dataset thunderspy) instead of the
 * old placeholder that re-exported Homecoming's entire registry wholesale.
 *
 * The wholesale re-export was the root cause of two reported bug classes:
 *   1. HC-only sets that don't exist on Thunderspy leaked in (Sudden
 *      Acceleration, Synapse's Shock, Power Transfer, Hypersonic, + 13 more).
 *   2. Thunderspy-only sets were missing entirely.
 *
 * These invariants guard against a regression back to the HC roster.
 */
describe('Thunderspy IO-set roster', () => {
  it('excludes the HC-only sets that are not on Thunderspy', () => {
    // The four the player reported, plus a few of the other HC-only sets that
    // aren't in tspy's boostsets.bin.
    for (const id of [
      'sudden_acceleration',
      'synapses_shock',
      'power_transfer',
      'hypersonic',
    ]) {
      expect(TSPY_SETS, `${id} should NOT be on Thunderspy`).not.toHaveProperty(id);
      expect(HC_SETS, `${id} sanity: is an HC set`).toHaveProperty(id);
    }
  });

  it('has Overwhelming Force AND Subaluwa as distinct Universal Damage sets', () => {
    // Both exist on Thunderspy (verified in-game 2026-07-02): Overwhelming Force
    // is the natively-attuned universal-damage set — its boostsets.bin record is
    // a gutted `SumoBoostName` stub (0 pieces, garbage rarity) so build_sets drops
    // it and it's re-injected from HC's hand entry (HC_WHOLESET_SETS). Subaluwa is
    // a SEPARATE tspy-only crafted knockback set (record `kb`). An earlier pass
    // wrongly assumed OF had been reworked *into* Subaluwa and dropped it.
    expect(TSPY_SETS, 'Overwhelming Force should be present').toHaveProperty('overwhelming_force');
    expect(TSPY_SETS['overwhelming_force']).toEqual(HC_SETS['overwhelming_force']);
    // Distinct sets, distinct icons.
    expect(TSPY_SETS['overwhelming_force'].name).toBe('Overwhelming Force');
    expect(TSPY_SETS['kb'].name).toBe('Subaluwa');
    expect(TSPY_SETS['overwhelming_force'].icon).toBe('UD_Overwhelming_Force.png');
    expect(TSPY_SETS['kb'].icon).toBe('UD_Subaluwa.png');
  });

  it('keeps sets shared with Homecoming, reusing HC\'s curated data', () => {
    for (const id of [
      'kinetic_combat',
      'luck_of_the_gambler',
      'essence_transfer',
      'superior_essence_transfer',
    ]) {
      expect(TSPY_SETS, `${id} should be present`).toHaveProperty(id);
      // Shared sets reuse HC's entry verbatim (Mids-compatible piece names).
      expect(TSPY_SETS[id]).toEqual(HC_SETS[id]);
    }
  });

  it('has strictly fewer sets than HC (HC-only sets removed)', () => {
    expect(Object.keys(TSPY_SETS).length).toBeLessThan(Object.keys(HC_SETS).length);
  });

  it('includes Subaluwa (Universal Damage) with the correct pieces + bonuses', () => {
    const sub = TSPY_SETS['kb'];
    expect(sub, 'Subaluwa (kb) should be present').toBeDefined();
    expect(sub.name).toBe('Subaluwa');
    expect(sub.type).toBe('Universal Damage Sets');
    // 6 pieces: 5 aspect pieces + the Chance for Knockback proc.
    expect(sub.pieces).toHaveLength(6);
    expect(sub.pieces[0].aspects).toEqual(['Accuracy', 'Damage']);
    expect(sub.pieces.some((p) => p.proc && /knockback/i.test(p.name))).toBe(true);
    // Bonuses derived from the authoritative Set_Bonus names + binary scales,
    // cross-checked against Overwhelming Force: +3% Damage and +2.5%/1.25%
    // Energy/Ranged defense.
    const effs = sub.bonuses.flatMap((b) => b.effects);
    expect(effs).toContainEqual(expect.objectContaining({ stat: 'damage', value: 3 }));
    expect(effs).toContainEqual(expect.objectContaining({ stat: 'defense_(energy)', value: 2.5 }));
    expect(effs).toContainEqual(expect.objectContaining({ stat: 'defense_(ranged)', value: 1.25 }));
    // Paired resist must NOT be double-emitted (planner auto-pairs lethal↔smashing).
    expect(effs.some((e) => e.stat === 'damage_resistance_(smashing)')).toBe(false);
  });

  it('includes the Primalist ATO sets under the Primalist Archetype category', () => {
    for (const id of ['primalists_nature', 'superior_primalists_nature']) {
      expect(TSPY_SETS, `${id} should be present`).toHaveProperty(id);
      expect(TSPY_SETS[id].category).toBe('ato');
      expect(TSPY_SETS[id].type).toBe('Primalist Archetype Sets');
      expect(TSPY_SETS[id].pieces).toHaveLength(6);
    }
  });
});
