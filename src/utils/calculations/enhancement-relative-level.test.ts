import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getEnhancementCurves } from '@/data/enhancement-curves';
import {
  enhancementLevelAxis,
  enhancementLevelRange,
  enhancementLevelMultiplier,
  calculatePowerEnhancementBonuses,
} from './enhancement-values';
import { createOriginEnhancement, createSpecialEnhancement, createGenericIOEnhancement } from '@/data/enhancement-registry';
import { slimBuild, hydrateBuild } from '@/utils/build-serialization';
import { createEmptyBuild } from '@/types/build';
import type { Enhancement } from '@/types';

/**
 * Enhancement level offsets sit on TWO axes, from two different bins, and the
 * app collapsed them into one unsigned `boost` field.
 *
 *   boost_effect_boosters.bin  -> Enhancement Booster combines, IOs, 0..+5
 *   boost_effect_above.bin     -> relative level at or above even
 *   boost_effect_below.bin     -> relative level BELOW even
 *
 * The collapse was invisible because on Homecoming the booster curve and the
 * `above` curve are numerically identical over 0..+3 — the whole range the app
 * could previously express. They diverge only below even, and that half was
 * dropped everywhere: the Mids importer floored `MinusOne/Two/Three` to 0, the
 * registry factories dropped any value <= 0, and no control could produce one.
 *
 * The headline number: `below` is -10% per level, NOT the -5% the old
 * `BOOST_MULTIPLIER_PER_LEVEL` constant would have given. A -3 SO is worth
 * x0.70, not x0.85.
 */

describe('Enhancement level offset — the two axes', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('routes origin/special to relative level and IOs to boosters', () => {
    expect(enhancementLevelAxis('origin')).toBe('relative');
    expect(enhancementLevelAxis('special')).toBe('relative');
    expect(enhancementLevelAxis('io-set')).toBe('booster');
    expect(enhancementLevelAxis('io-generic')).toBe('booster');
  });

  it('reads the below curve at -10% per level, not -5%', () => {
    const so = (boost: number) => enhancementLevelMultiplier({ type: 'origin', boost });
    expect(so(-1)).toBeCloseTo(0.9, 6);
    expect(so(-2)).toBeCloseTo(0.8, 6);
    expect(so(-3)).toBeCloseTo(0.7, 6);
    // The bug this pins: a symmetric ±5% rule would have said 0.85 at -3.
    expect(so(-3)).not.toBeCloseTo(0.85, 3);
  });

  it('the two axes agree over 0..+3 — which is why the collapse hid', () => {
    for (let n = 0; n <= 3; n++) {
      expect(enhancementLevelMultiplier({ type: 'origin', boost: n }))
        .toBeCloseTo(enhancementLevelMultiplier({ type: 'io-generic', boost: n }), 10);
    }
    // ...and diverge past it: boosters run to +5, relative level stops at +3.
    expect(enhancementLevelMultiplier({ type: 'io-generic', boost: 5 })).toBeCloseTo(1.25, 6);
    expect(enhancementLevelMultiplier({ type: 'origin', boost: 5 })).toBeCloseTo(1.15, 6);
  });

  it('never reads a negative as a bonus on the unsigned booster axis', () => {
    // There is no such thing as a negative combine. A negative here is a
    // corrupt value, and indexing |offset| into `boosters` would have turned
    // it into a +10% BONUS.
    expect(enhancementLevelMultiplier({ type: 'io-generic', boost: -2 })).toBe(1);
    expect(enhancementLevelMultiplier({ type: 'io-set', boost: -3 })).toBe(1);
  });

  it('clamps past the end of a curve instead of throwing or dropping the slot', () => {
    // Mids can legitimately write PlusFive on an SO; older saves can hold
    // anything. Clamping is what the game does at the ends of these tables.
    expect(enhancementLevelMultiplier({ type: 'origin', boost: 99 })).toBeCloseTo(1.15, 6);
    expect(enhancementLevelMultiplier({ type: 'origin', boost: -99 })).toBeCloseTo(0.7, 6);
    expect(enhancementLevelMultiplier({ type: 'io-generic', boost: 99 })).toBeCloseTo(1.25, 6);
  });

  it('derives the domain from the dataset curves, not a hardcoded ±3', () => {
    const { above, below, boosters } = getEnhancementCurves().boostEffectiveness;
    expect(enhancementLevelRange('origin')).toEqual({
      min: -(below.length - 1),
      max: above.length - 1,
    });
    expect(enhancementLevelRange('io-set')).toEqual({ min: 0, max: boosters.length - 1 });
    // Pinned for Homecoming specifically so a curve change surfaces here.
    expect(enhancementLevelRange('origin')).toEqual({ min: -3, max: 3 });
    expect(enhancementLevelRange('io-set')).toEqual({ min: 0, max: 5 });
  });
});

describe('Enhancement level offset — datasets genuinely disagree', () => {
  it('Rebirth runs far deeper below even than Homecoming', async () => {
    await loadDataset('rebirth');
    expect(enhancementLevelRange('origin')).toEqual({ min: -9, max: 4 });
    expect(enhancementLevelMultiplier({ type: 'origin', boost: -9 })).toBeCloseTo(0.1, 6);
  });

  it('Thunderspy applies no relative-level attenuation at all', async () => {
    await loadDataset('thunderspy');
    // A hardcoded -10%/level would have invented a penalty this server does
    // not apply. Its above/below curves are flat 1.0 at every step.
    expect(enhancementLevelMultiplier({ type: 'origin', boost: -3 })).toBe(1);
    expect(enhancementLevelMultiplier({ type: 'origin', boost: 3 })).toBe(1);
    // Boosters still work there — it is only the relative-level axis that is off.
    expect(enhancementLevelMultiplier({ type: 'io-generic', boost: 5 })).toBeCloseTo(1.25, 6);
  });
});

describe('Enhancement level offset — end to end through the slot calc', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  const damageOf = (slot: Enhancement) =>
    calculatePowerEnhancementBonuses({ name: 'p', slots: [slot] }, 50, undefined)['damage'] ?? 0;

  it('an under-level SO contributes less than an even one', () => {
    const even = damageOf(createOriginEnhancement('Damage', 'SO'));
    const under = damageOf(createOriginEnhancement('Damage', 'SO', undefined, -3));
    expect(even).toBeGreaterThan(0);
    expect(under / even).toBeCloseTo(0.7, 5);
  });

  it('an under-level special contributes less than an even one', () => {
    const def = { name: 'Test HO', aspects: [{ stat: 'Damage', value: 33.3 }] };
    const even = damageOf(createSpecialEnhancement('nucleolus', def as never));
    const under = damageOf(createSpecialEnhancement('nucleolus', def as never, 'hamidon', -2));
    expect(even).toBeGreaterThan(0);
    expect(under / even).toBeCloseTo(0.8, 5);
  });

  it('a generic IO is untouched by the relative-level curve', () => {
    const plain = damageOf(createGenericIOEnhancement('Damage', 50));
    const boosted = damageOf(createGenericIOEnhancement('Damage', 50, 5));
    expect(boosted / plain).toBeCloseTo(1.25, 5);
  });
});

describe('Enhancement level offset — a negative survives the round trip', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('the factories keep a negative and drop only the no-op', () => {
    expect(createOriginEnhancement('Damage', 'SO', undefined, -3).boost).toBe(-3);
    expect(createOriginEnhancement('Damage', 'SO', undefined, 0).boost).toBeUndefined();
    expect(createOriginEnhancement('Damage', 'SO').boost).toBeUndefined();
    // The old factories capped at +3 with `Math.min(boost, 3)`; the domain is
    // now the dataset's business, resolved at read time.
    expect(createOriginEnhancement('Damage', 'SO', undefined, 5).boost).toBe(5);
  });

  it('serialization persists it — the field the old slider wrote did not', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const build: any = createEmptyBuild();
    build.level = 50;
    build.archetype = { id: 'blaster', name: 'Blaster', stats: null, inherent: null };
    build.primary = {
      id: 'blaster/fire-blast',
      name: 'Fire Blast',
      powers: [
        {
          name: 'Fire Blast',
          internalName: 'FireBlast',
          level: 1,
          isActive: true,
          slots: [createOriginEnhancement('Damage', 'SO', undefined, -3)],
        },
      ],
    };

    const wire = JSON.parse(JSON.stringify(slimBuild(build)));
    // The negative has to actually reach the wire — the writers gate on
    // truthiness, so a 0 stays off it and a -3 must not.
    expect(wire.p?.[0]?.s?.[0]?.boost ?? wire.primary?.powers?.[0]?.slots?.[0]?.boost).toBe(-3);

    const restored = hydrateBuild(wire);
    const slot = restored?.primary?.powers[0]?.slots[0];
    expect(slot, 'slot did not survive the round trip').toBeTruthy();
    expect(slot!.boost).toBe(-3);
  });
});
