/**
 * Plan B, Phase 1 — unit guard for the atom-native calc primitives.
 *
 * The corpus-wide proof lives in `scripts/planb-shadow-bag.cjs` (8,913 powers,
 * every dataset), which is the real gate. These tests pin the *semantics* each
 * helper promises, on hand-built atoms, so a behavior change fails here with a
 * readable message instead of as a count shift in a corpus sweep.
 *
 * Each case below is an axis the `PowerEffects` bag could not represent without
 * minting a discriminator — that's why the helper exists.
 */

import { describe, it, expect } from 'vitest';
import type { Power } from '@/types/power';
import { encodeAtom, type AtomicEffect } from './atomic-effect';
import {
  atomsOf, atomsOfType, byType, bySubType, selfDirected, targetDirected,
  enhanceableVsNot, resistibleTwins, durationBuckets,
} from './atom-query';

/** A complete AtomicEffect with sane defaults; override only what a test means. */
function atom(over: Partial<AtomicEffect> = {}): AtomicEffect {
  return {
    effectType: 'Resistance', subType: 'Fire', pvMode: 'Any', resistible: true,
    toWho: 'Target', attribType: 'Magnitude', aspect: 'Res',
    modifierTable: 'Ranged_Res_Dmg', scale: 1, magnitude: 1, duration: 10,
    stacking: 'Replace', baseProbability: 1,
    ...over,
  };
}

function powerWith(atoms: AtomicEffect[]): Power {
  return { name: 'T', atoms: atoms.map(encodeAtom) } as unknown as Power;
}

describe('atomsOf', () => {
  it('decodes the wire form back to atoms', () => {
    const a = atom({ scale: -4, ignoreStrength: true, toWho: 'Self' });
    const [got] = atomsOf(powerWith([a]));
    expect(got).toMatchObject({ scale: -4, ignoreStrength: true, toWho: 'Self' });
  });

  it('preserves the SIGN the bag stores as an absolute value', () => {
    // The projection does Math.abs() when routing to a slot; the atom must not.
    const [got] = atomsOf(powerWith([atom({ scale: -7.5 })]));
    expect(got.scale).toBe(-7.5);
  });

  it('returns [] for a power with no atoms, and caches per power object', () => {
    const p = { name: 'X' } as unknown as Power;
    expect(atomsOf(p)).toEqual([]);
    const q = powerWith([atom()]);
    expect(atomsOf(q)).toBe(atomsOf(q)); // memoized identity
  });
});

describe('byType / atomsOfType / bySubType', () => {
  const atoms = [
    atom({ effectType: 'Resistance', subType: 'Fire' }),
    atom({ effectType: 'Resistance', subType: 'Cold' }),
    atom({ effectType: 'Defense', subType: 'Fire' }),
  ];

  it('groups by effectType, preserving list order within a bucket', () => {
    const m = byType(atoms);
    expect(m.get('Resistance')?.map((a) => a.subType)).toEqual(['Fire', 'Cold']);
    expect(m.get('Defense')).toHaveLength(1);
  });

  it('atomsOfType filters a power to one effectType', () => {
    expect(atomsOfType(powerWith(atoms), 'Defense')).toHaveLength(1);
  });

  it('bySubType keys scalar (subType-less) atoms under ""', () => {
    const m = bySubType([atom({ effectType: 'Recovery', subType: undefined })]);
    expect(m.get('')).toHaveLength(1);
  });
});

describe('selfDirected — the eToWho axis', () => {
  const atoms = [
    atom({ toWho: 'Self' }),        // Rage's crash, Granite's -recharge
    atom({ toWho: 'All' }),         // self + pets
    atom({ toWho: 'Target' }),      // a foe debuff
    atom({ toWho: 'Unspecified' }),
  ];

  it("counts 'Self' AND 'All' as landing on the caster", () => {
    expect(selfDirected(atoms).map((a) => a.toWho)).toEqual(['Self', 'All']);
  });

  it('partitions exactly — every atom is self- or target-directed, never both', () => {
    expect(selfDirected(atoms).length + targetDirected(atoms).length).toBe(atoms.length);
  });
});

describe('enhanceableVsNot — the IgnoreStrength axis', () => {
  it('splits the twin the bag needed a parallel slot for', () => {
    // Bio Armor's +MaxHP: both halves apply and SUM; only one is enhanceable.
    const atoms = [
      atom({ effectType: 'MaxHP', scale: 66.93 }),
      atom({ effectType: 'MaxHP', scale: 66.93, ignoreStrength: true }),
    ];
    const { enhanceable, unenhanceable } = enhanceableVsNot(atoms);
    expect(enhanceable).toHaveLength(1);
    expect(unenhanceable).toHaveLength(1);
    expect(enhanceable[0].scale + unenhanceable[0].scale).toBeCloseTo(133.86);
  });

  it('treats a missing ignoreStrength as enhanceable (absent ⇒ false)', () => {
    const { enhanceable } = enhanceableVsNot([atom({ ignoreStrength: undefined })]);
    expect(enhanceable).toHaveLength(1);
  });
});

describe('resistibleTwins — the resistible axis', () => {
  const base = { effectType: 'ToHit' as const, subType: undefined, scale: -0.75, duration: 60 };

  it('pairs two atoms identical but for the IgnoreResistance flag', () => {
    const { twins, rest } = resistibleTwins([
      atom({ ...base, resistible: true }),
      atom({ ...base, resistible: false }),
    ]);
    expect(twins).toHaveLength(1);
    expect(rest).toHaveLength(0);
    expect(twins[0].resistible.resistible).toBe(true);
    expect(twins[0].unresistible.resistible).toBe(false);
  });

  it('does NOT pair atoms that differ in anything else (table)', () => {
    const { twins, rest } = resistibleTwins([
      atom({ ...base, resistible: true, modifierTable: 'A' }),
      atom({ ...base, resistible: false, modifierTable: 'B' }),
    ]);
    expect(twins).toHaveLength(0);
    expect(rest).toHaveLength(2);
  });

  it('pairs on scale MAGNITUDE — sign belongs to the effect, not the split', () => {
    const { twins } = resistibleTwins([
      atom({ ...base, scale: -0.75, resistible: true }),
      atom({ ...base, scale: -0.75, resistible: false }),
    ]);
    expect(twins).toHaveLength(1);
  });

  it('leaves an unpaired half in rest rather than inventing a partner', () => {
    const { twins, rest } = resistibleTwins([atom({ ...base, resistible: false })]);
    expect(twins).toHaveLength(0);
    expect(rest).toHaveLength(1);
  });

  it('pairs off N-of-each without cross-pairing distinct debuffs', () => {
    const { twins, rest } = resistibleTwins([
      atom({ ...base, resistible: true }), atom({ ...base, resistible: true }),
      atom({ ...base, resistible: false }),
    ]);
    expect(twins).toHaveLength(1);
    expect(rest).toHaveLength(1); // the leftover resistible half
  });
});

describe('durationBuckets — the duration axis', () => {
  it('keeps same-debuff-different-duration applications apart, longest first', () => {
    // EMP Arrow: -500% regen at BOTH 15s and 45s — two real applications that
    // expire at different times. Summing them into one value is the collapse.
    const atoms = [
      atom({ effectType: 'Regeneration', subType: undefined, scale: -5, duration: 15 }),
      atom({ effectType: 'Regeneration', subType: undefined, scale: -5, duration: 45 }),
    ];
    const buckets = durationBuckets(atoms);
    expect(buckets.map((b) => b.duration)).toEqual([45, 15]);
    expect(buckets[0].key).toBe(buckets[1].key); // same identity, different duration
  });

  it('groups atoms sharing a duration into one bucket', () => {
    const a = atom({ duration: 30 });
    expect(durationBuckets([a, a])[0].atoms).toHaveLength(2);
  });

  it('separates different identities at the same duration', () => {
    const buckets = durationBuckets([
      atom({ subType: 'Fire', duration: 30 }),
      atom({ subType: 'Cold', duration: 30 }),
    ]);
    expect(buckets).toHaveLength(2);
  });

  it('orders deterministically regardless of input order', () => {
    const mk = (d: number) => atom({ effectType: 'Recovery', subType: undefined, scale: -1, duration: d });
    const fwd = durationBuckets([mk(10), mk(20)]).map((b) => b.duration);
    const rev = durationBuckets([mk(20), mk(10)]).map((b) => b.duration);
    expect(fwd).toEqual(rev);
  });
});
