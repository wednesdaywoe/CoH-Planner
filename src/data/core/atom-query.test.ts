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
  atomsOf, atomsOfType, baseAtoms, gatedAtoms, baseAtomsOfType, byType, bySubType,
  selfDirected, targetDirected, enhanceableVsNot, resistibleTwins, durationBuckets,
  stackCapOf, buffStack, movementAxisSubType, DEBUFF_RESISTANCE_STACK, SPECIAL_BUFF_STACK,
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

describe('baseAtoms / gatedAtoms — the gate axis', () => {
  // Bio Armor's shape: an always-on armor plus a stance-gated bonus. Summing
  // both into the base is the stance-leak; only the base applies by default.
  const power = powerWith([
    atom({ effectType: 'Defense', scale: 1.5 }),
    atom({ effectType: 'Defense', scale: 0.45, gated: true, requiresExpression: ['kDefensiveAdaptation', 'source.Mode?'] }),
  ]);

  it('base excludes gated atoms; gated is exactly the complement', () => {
    expect(baseAtoms(power).map((a) => a.scale)).toEqual([1.5]);
    expect(gatedAtoms(power).map((a) => a.scale)).toEqual([0.45]);
    expect(baseAtoms(power).length + gatedAtoms(power).length).toBe(atomsOf(power).length);
  });

  it('an absent gated flag means base (the common case round-trips)', () => {
    // `gated` is last in the tuple so base atoms trim it away entirely.
    expect(baseAtoms(powerWith([atom()]))).toHaveLength(1);
  });

  it('baseAtomsOfType filters both axes at once', () => {
    expect(baseAtomsOfType(power, 'Defense')).toHaveLength(1);
    expect(baseAtomsOfType(power, 'Resistance')).toHaveLength(0);
  });

  it('gated atoms keep the gate that explains them', () => {
    expect(gatedAtoms(power)[0].requiresExpression).toContain('source.Mode?');
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
    atom({ toWho: 'Self' }),          // Rage's crash, Granite's -recharge
    atom({ toWho: 'SelfAndPets' }),   // the caster, plus a copy for each pet
    atom({ toWho: 'TargetAndPets' }), // whoever was hit, resolved UP to their owner
    atom({ toWho: 'Target' }),        // a foe debuff
    atom({ toWho: 'TargetOnly' }),    // the power's main target and nobody else
    atom({ toWho: 'Unspecified' }),
  ];

  it('counts the three caster-anchored recipients, and only those', () => {
    expect(selfDirected(atoms).map((a) => a.toWho)).toEqual([
      'Self', 'SelfAndPets', 'TargetAndPets',
    ]);
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

describe('stackCapOf', () => {
  /** A self row that stacks to `cap`; override whatever the case is about. */
  const stacker = (over: Partial<AtomicEffect> = {}, cap = 2): AtomicEffect =>
    atom({ toWho: 'Self', aspect: 'Cur', stacking: 'Stack', stackCap: cap, ...over });

  it('answers the membership question and the depth at once', () => {
    const p = powerWith([stacker({ effectType: 'DamageBuff', aspect: 'Str', subType: undefined })]);
    expect(stackCapOf(p, buffStack('DamageBuff'))).toBe(2);
    // a family with no self-stacking atom is `undefined` — not stacking, not a cap of zero
    expect(stackCapOf(p, buffStack('ToHit'))).toBeUndefined();
  });

  it('takes the MAX across a family whose atoms disagree', () => {
    const p = powerWith([
      stacker({ effectType: 'ToHit', subType: undefined }, 2),
      stacker({ effectType: 'ToHit', subType: undefined }, 3),
    ]);
    expect(stackCapOf(p, buffStack('ToHit'))).toBe(3);
  });

  it('splits the enhanceable half from its IgnoreStrength twin', () => {
    // The two differ on no field but `ignoreStrength`, which is exactly what the bag's
    // `regenBuff` / `regenBuffUnenhanced` slot pair encoded.
    const p = powerWith([
      stacker({ effectType: 'Regeneration', subType: undefined }, 2),
      stacker({ effectType: 'Regeneration', subType: undefined, ignoreStrength: true }, 4),
    ]);
    expect(stackCapOf(p, buffStack('Regeneration', 'enhanceable'))).toBe(2);
    expect(stackCapOf(p, buffStack('Regeneration', 'unenhanced'))).toBe(4);
    expect(stackCapOf(p, buffStack('Regeneration', 'either'))).toBe(4);
  });

  it('narrows to one movement axis (STACK-4)', () => {
    // Time Wall's shape: the Run axis states `Stack`, the Fly axis `Replace`. A whole-family
    // cap answered all three axes with 2 and multiplied the ones that never double.
    const p = powerWith([
      stacker({ effectType: 'Movement', subType: 'Run' }, 2),
      atom({ effectType: 'Movement', subType: 'Fly', toWho: 'Self', aspect: 'Cur', stacking: 'Replace' }),
    ]);
    expect(stackCapOf(p, buffStack('Movement', 'either', movementAxisSubType('runSpeed')))).toBe(2);
    expect(stackCapOf(p, buffStack('Movement', 'either', movementAxisSubType('flySpeed')))).toBeUndefined();
    expect(stackCapOf(p, buffStack('Movement', 'either'))).toBe(2);
  });

  it('reads an `All` atom as the typed atom of every position it covers', () => {
    // The two Parse6 forks state one `Defense/All` row where Homecoming states eleven typed
    // ones; the narrowed question has to get the same answer on both.
    const p = powerWith([stacker({ effectType: 'Defense', subType: 'All', aspect: 'Cur' })]);
    expect(stackCapOf(p, buffStack('Defense', 'either', 'melee'))).toBe(2);
    expect(stackCapOf(p, buffStack('Defense', 'either', 'smashing'))).toBe(2);
  });

  it('gives an atom naming NO sub type only the whole-family question', () => {
    // It owns no row, so a narrowed ask must not borrow it. Admitting it would answer every
    // defense position with a cap the export never stated for any of them.
    const p = powerWith([stacker({ effectType: 'Defense', subType: undefined, aspect: 'Cur' })]);
    expect(stackCapOf(p, buffStack('Defense', 'either'))).toBe(2);
    expect(stackCapOf(p, buffStack('Defense', 'either', 'melee'))).toBeUndefined();
  });

  it('keeps the three variants a partition — Str and Res are not one rule', () => {
    // Both spellings of a flat rule were measured wrong before the carve-outs stood:
    // Build Up's `DamageBuff|Str` is its +damage BUFF, while Power Boost's `Absorb|Str` is a
    // specialBuff strength meta; and a `Resistance|Res` atom is ordinary damage resistance
    // where a `ToHit|Res` atom is debuff-resistance.
    const p = powerWith([
      stacker({ effectType: 'DamageBuff', aspect: 'Str', subType: undefined }, 2),
      stacker({ effectType: 'Absorb', aspect: 'Str', subType: undefined }, 3),
      stacker({ effectType: 'Resistance', aspect: 'Res', subType: 'Fire' }, 4),
      stacker({ effectType: 'ToHit', aspect: 'Res', subType: undefined }, 5),
    ]);
    expect(stackCapOf(p, buffStack('DamageBuff'))).toBe(2);
    expect(stackCapOf(p, SPECIAL_BUFF_STACK)).toBe(3);
    expect(stackCapOf(p, buffStack('Resistance', 'either', 'fire'))).toBe(4);
    expect(stackCapOf(p, DEBUFF_RESISTANCE_STACK)).toBe(5);
    // and the buff face of ToHit is NOT the debuff-resistance row that shares its type
    expect(stackCapOf(p, buffStack('ToHit'))).toBeUndefined();
  });

  it('declines a per-target atom — that value is on the AoE path', () => {
    const p = powerWith([stacker({ effectType: 'Defense', subType: 'Melee', perTarget: 0.05 })]);
    expect(stackCapOf(p, buffStack('Defense', 'either', 'melee'))).toBeUndefined();
  });

  it('declines a foe-facing row, a `Replace` row, and a cap of 1', () => {
    expect(stackCapOf(powerWith([stacker({ effectType: 'ToHit', subType: undefined, toWho: 'Target' })]),
      buffStack('ToHit'))).toBeUndefined();
    expect(stackCapOf(powerWith([stacker({ effectType: 'ToHit', subType: undefined, stacking: 'Replace' })]),
      buffStack('ToHit'))).toBeUndefined();
    expect(stackCapOf(powerWith([stacker({ effectType: 'ToHit', subType: undefined }, 1)]),
      buffStack('ToHit'))).toBeUndefined();
  });

  it('declines a Defiance rider — it decides no power\u2019s +damage stacks', () => {
    const p = powerWith([
      stacker({ effectType: 'DamageBuff', aspect: 'Str', subType: undefined, tags: 'Defiance' }),
    ]);
    expect(stackCapOf(p, buffStack('DamageBuff'))).toBeUndefined();
  });

  it('counts a gated atom — it still states the depth its family reaches', () => {
    const p = powerWith([stacker({ effectType: 'ToHit', subType: undefined, gated: true })]);
    expect(stackCapOf(p, buffStack('ToHit'))).toBe(2);
  });
});
