import { describe, it, expect } from 'vitest';
import {
  mapBonusTracking,
  mapSetBonusBreakdown,
  mapGlobal,
  addProcBreakdown,
  type EngineStats,
  type EngineBonuses,
  type EngineSetBonusTracking,
  type EngineBonusSourceRef,
  type EngineProcBreakdownSource,
  type PowerNameResolver,
} from './engineTotalsMap';
import type { DashboardStatBreakdown } from '@/utils/calculations';

/** Resolve p0/p1/... internal names to "Power 0"/"Power 1"; anything else falls through. */
const resolver: PowerNameResolver = (ref) =>
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

  it('folds always-on proc sources onto set-bonus sources under the same key', () => {
    const bd = mapSetBonusBreakdown([cappedAccuracy], resolver);
    // A capped LotG-style +Recharge proc on a stat with no set bonus, plus a proc under 'accuracy'.
    const procs: EngineProcBreakdownSource[] = [
      { breakdown_key: 'recharge', set_name: 'Luck of the Gambler', proc_name: 'Defense/Increased Global Recharge Speed',
        value: 7.5, capped: true, kind: 'always_on', note: '', power_internal_name: 'p9', power_set: 'primary/blast' },
      { breakdown_key: 'accuracy', set_name: 'Kismet', proc_name: 'Accuracy', value: 6,
        capped: false, kind: 'always_on', note: '', power_internal_name: 'p8', power_set: 'primary/blast' },
    ];
    addProcBreakdown(bd, procs, resolver);

    // New 'recharge' entry created; capped proc feeds the ring (powerName present) + counts.
    const rech = bd.get('recharge')!;
    expect(rech.total).toBe(7.5);
    expect(rech.cappedSources).toBe(1);
    expect(rech.sources[0]).toMatchObject({ type: 'proc', capped: true, powerName: 'Power 9' });
    // Proc appended onto the existing 'accuracy' set-bonus sources (5 + 1 rejected + 1 proc).
    const acc = bd.get('accuracy')!;
    expect(acc.sources).toHaveLength(7);
    expect(acc.sources.filter((s) => s.type === 'proc')).toHaveLength(1);
  });

  it('labels PPM / Build-Up proc rows per pass and omits their powerName', () => {
    const bd = new Map<string, DashboardStatBreakdown>();
    const procs: EngineProcBreakdownSource[] = [
      { breakdown_key: 'recovery', set_name: 'Performance Shifter', proc_name: 'Chance for +Endurance',
        value: 3.2, capped: false, kind: 'ppm', note: '', power_internal_name: 'p0', power_set: 'primary/blast' },
      { breakdown_key: 'damage', set_name: "Gaussian's", proc_name: 'Chance for Build Up',
        value: 4.1, capped: false, kind: 'build_up', note: '', power_internal_name: 'p1', power_set: 'primary/blast' },
      { breakdown_key: 'recovery', set_name: 'Panacea', proc_name: 'Chance for +Hit Points/Endurance',
        value: 2, capped: false, kind: 'always_on', note: 'end', power_internal_name: 'p2', power_set: 'primary/blast' },
    ];
    addProcBreakdown(bd, procs, resolver);
    const rec = bd.get('recovery')!;
    const ppm = rec.sources.find((s) => s.name.includes('Performance Shifter'))!;
    expect(ppm.name).toBe('Performance Shifter: Chance for +Endurance (PPM)');
    expect(ppm.powerName).toBeUndefined(); // PPM rows don't feed the ring
    const endRow = rec.sources.find((s) => s.name.includes('Panacea'))!;
    expect(endRow.name).toBe('Panacea: Chance for +Hit Points/Endurance (+End)');
    expect(endRow.powerName).toBe('Power 2'); // always-on carries the display name
    const dmg = bd.get('damage')!.sources[0];
    expect(dmg.name).toBe("Gaussian's: Chance for Build Up (in Power 1)");
    expect(dmg.powerName).toBeUndefined();
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

describe('mapGlobal absorb', () => {
  // The dashboard surfaces absorb through globalBonuses (GLOBAL_BONUS_OVERRIDES), but the
  // engine keeps two absorbs: `bonuses.absorb` is the raw accumulated sum and `stats.absorb`
  // is that sum clamped to the archetype's per-level ceiling. The beta shipped the raw one,
  // so a stacked build's absorb grew without limit. Only the mapping is under test here —
  // the clamp itself lives in the engine (coh_math finalize.rs) and is gated there.
  const engineTotals = (rawAbsorb: number, clampedAbsorb: number) => ({
    stats: { absorb: clampedAbsorb } as EngineStats,
    bonuses: { absorb: rawAbsorb } as EngineBonuses,
  });

  it('reads the clamped stats value, not the raw accumulator', () => {
    const { stats, bonuses } = engineTotals(2400, 1874);
    expect(mapGlobal(bonuses, stats).absorb).toBe(1874);
  });

  it('is the untouched sum when the ceiling does not bind', () => {
    const { stats, bonuses } = engineTotals(669, 669);
    expect(mapGlobal(bonuses, stats).absorb).toBe(669);
  });
});
