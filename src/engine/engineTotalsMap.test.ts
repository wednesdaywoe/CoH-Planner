import { describe, it, expect } from 'vitest';
import {
  mapBonusTracking,
  mapSetBonusBreakdown,
  type EngineSetBonusTracking,
  type EngineBonusSourceRef,
  type PowerNameResolver,
} from './engineTotalsMap';

/** Resolve p0/p1/... internal names to "Power 0"/"Power 1"; anything else falls through. */
const resolver: PowerNameResolver = (ref: EngineBonusSourceRef) =>
  /^p\d+$/.test(ref.power_internal_name) ? `Power ${ref.power_internal_name.slice(1)}` : ref.power_internal_name;

function ref(i: number, set = 'Thunderstrike', pieces = 4): EngineBonusSourceRef {
  return { power_internal_name: `p${i}`, power_set: 'primary/blast', set_name: set, pieces };
}

/** A capped bucket: 5 accepted + 1 rejected, all +9% of one value. */
const cappedAccuracy: EngineSetBonusTracking = {
  stat_key: 'accuracy',
  breakdown_keys: ['accuracy'],
  buckets: {
    '9.00': {
      value: 9,
      count: 5,
      capped: true,
      sources: [ref(0), ref(1), ref(2), ref(3), ref(4)],
      rejected_sources: [ref(5)],
    },
  },
};

describe('mapBonusTracking', () => {
  it('keys by the engine stat key and value key, mirroring the beta BonusTracking', () => {
    const tracking = mapBonusTracking([cappedAccuracy], resolver);
    const bucket = tracking['accuracy']['9.00'];
    expect(bucket.count).toBe(5);
    expect(bucket.capped).toBe(true);
    expect(bucket.value).toBe(9);
    expect(bucket.sources).toHaveLength(5);
    expect(bucket.rejectedSources).toHaveLength(1);
    // Source string = "${set} (${pieces}pc in ${power})", powerName = resolved display name.
    expect(bucket.sources[0]).toEqual({ name: 'Thunderstrike (4pc in Power 0)', powerName: 'Power 0' });
    expect(bucket.rejectedSources[0]).toEqual({ name: 'Thunderstrike (4pc in Power 5)', powerName: 'Power 5' });
  });

  it('falls back to the internal name when a power is not in the build map', () => {
    const orphan: EngineSetBonusTracking = {
      stat_key: 'recovery',
      breakdown_keys: ['recovery'],
      buckets: { '5.00': { value: 5, count: 1, capped: false, sources: [{ ...ref(0), power_internal_name: 'ghost' }], rejected_sources: [] } },
    };
    const bucket = mapBonusTracking([orphan], resolver)['recovery']['5.00'];
    expect(bucket.sources[0].powerName).toBe('ghost');
  });
});

describe('mapSetBonusBreakdown', () => {
  it('emits capped:false accepted + capped:true rejected sources with total = value x count', () => {
    const bd = mapSetBonusBreakdown([cappedAccuracy], resolver);
    const acc = bd.get('accuracy')!;
    expect(acc.total).toBe(45); // 9 x 5, the sixth is rejected and does NOT add
    expect(acc.cappedSources).toBe(1);
    expect(acc.sources.filter((s) => !s.capped)).toHaveLength(5);
    const rejected = acc.sources.find((s) => s.capped)!;
    expect(rejected).toMatchObject({ type: 'set-bonus', capped: true, value: 9, powerName: 'Power 5' });
  });

  it('fans one stat out to every breakdown key without sharing the source array', () => {
    // +Res(Recharge Debuff) surfaces under BOTH debuffResistRecharge and debuffResistSlow.
    const fanned: EngineSetBonusTracking = {
      stat_key: 'debuffresistrecharge',
      breakdown_keys: ['debuffResistRecharge', 'debuffResistSlow'],
      buckets: { '7.50': { value: 7.5, count: 2, capped: false, sources: [ref(0, 'Set', 6), ref(1, 'Set', 6)], rejected_sources: [] } },
    };
    const bd = mapSetBonusBreakdown([fanned], resolver);
    const rech = bd.get('debuffResistRecharge')!;
    const slow = bd.get('debuffResistSlow')!;
    expect(rech.total).toBe(15);
    expect(slow.total).toBe(15);
    expect(rech.sources).toHaveLength(2);
    expect(slow.sources).toHaveLength(2);
    // Distinct arrays — mutating one must not leak into the other.
    rech.sources.push({ name: 'x', value: 0, type: 'set-bonus' });
    expect(slow.sources).toHaveLength(2);
  });

  it('merges two stats that route to the same breakdown key', () => {
    // Two separate value buckets under the same key accumulate their totals + sources.
    const a: EngineSetBonusTracking = {
      stat_key: 'defMelee',
      breakdown_keys: ['defMelee'],
      buckets: { '3.75': { value: 3.75, count: 2, capped: false, sources: [ref(0), ref(1)], rejected_sources: [] } },
    };
    const b: EngineSetBonusTracking = {
      stat_key: 'defMelee',
      breakdown_keys: ['defMelee'],
      buckets: { '1.88': { value: 1.88, count: 1, capped: false, sources: [ref(2)], rejected_sources: [] } },
    };
    const melee = mapSetBonusBreakdown([a, b], resolver).get('defMelee')!;
    expect(melee.total).toBeCloseTo(3.75 * 2 + 1.88);
    expect(melee.sources).toHaveLength(3);
  });
});
