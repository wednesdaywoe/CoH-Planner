import { describe, it, expect } from 'vitest';
import {
  mapBonusTracking,
  mapSetBonusBreakdown,
  mapGlobal,
  addProcBreakdown,
  addPowerBreakdown,
  addIncarnateBreakdown,
  addStealthBreakdown,
  type EngineStats,
  type EngineBonuses,
  type EngineSetBonusTracking,
  type EngineBonusSourceRef,
  type EngineProcBreakdownSource,
  type EnginePowerBreakdownSource,
  type EnginePowerSourceKind,
  type PowerNameResolver,
  type IncarnateNameResolver,
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

describe('addPowerBreakdown', () => {
  const row = (
    kind: EnginePowerSourceKind,
    breakdown_key: string,
    value: number,
    i = 0,
  ): EnginePowerBreakdownSource => ({
    breakdown_key, power_internal_name: `p${i}`, power_set: 'primary/blast', value, kind,
  });

  it('routes each ledger kind to the group that renders it', () => {
    const bd = new Map<string, DashboardStatBreakdown>();
    addPowerBreakdown(bd, [
      row('ActivePower', 'resSmashing', 25, 0),
      row('Accolade', 'maxHP', 5, 1),
      row('Inherent', 'regeneration', 20, 2),
    ], resolver);
    expect(bd.get('resSmashing')!.sources[0]).toEqual({ name: 'Power 0', value: 25, type: 'active-power' });
    expect(bd.get('maxHP')!.sources[0]).toEqual({ name: 'Power 1', value: 5, type: 'accolade' });
    expect(bd.get('regeneration')!.sources[0]).toEqual({ name: 'Power 2', value: 20, type: 'inherent' });
  });

  it('sums same-key contributors and lands on top of existing set-bonus sources', () => {
    const bd = mapSetBonusBreakdown([{
      stat_key: 'resSmashing',
      breakdown_keys: ['resSmashing'],
      buckets: { '3.13': { value: 3.13, count: 2, capped: false, sources: [ref(7), ref(8)], rejected_sources: [] } },
    }], resolver);
    addPowerBreakdown(bd, [row('ActivePower', 'resSmashing', 25, 0), row('ActivePower', 'resSmashing', 12.5, 1)], resolver);
    const res = bd.get('resSmashing')!;
    expect(res.total).toBeCloseTo(3.13 * 2 + 25 + 12.5);
    expect(res.sources.map((s) => s.type)).toEqual(['set-bonus', 'set-bonus', 'active-power', 'active-power']);
  });

  it('carries a self-penalty through as the negative it is', () => {
    const bd = new Map<string, DashboardStatBreakdown>();
    addPowerBreakdown(bd, [row('ActivePower', 'recharge', -20)], resolver);
    expect(bd.get('recharge')!.total).toBe(-20);
  });

  it('leaves power rows out of the Rule-of-5 accounting', () => {
    // No `capped`, no `powerName`: a power contribution can neither cap a bucket nor be
    // rejected by one, so it must not light the over-cap ring.
    const bd = new Map<string, DashboardStatBreakdown>();
    addPowerBreakdown(bd, [row('ActivePower', 'defMelee', 13.9)], resolver);
    const entry = bd.get('defMelee')!;
    expect(entry.cappedSources).toBe(0);
    expect(entry.sources[0].capped).toBeUndefined();
    expect(entry.sources[0].powerName).toBeUndefined();
  });
});

describe('addIncarnateBreakdown', () => {
  const incarnateName: IncarnateNameResolver = (src) =>
    src.slot === 'destiny' ? 'Barrier Core Epiphany' : src.power_name;

  it('names the equipped power and marks the exemplar buff as a separate contribution', () => {
    const bd = new Map<string, DashboardStatBreakdown>();
    addIncarnateBreakdown(bd, [
      { breakdown_key: 'defMelee', slot: 'destiny', power_name: 'Barrier_Core_Epiphany', exemplar: false, value: 5 },
      { breakdown_key: 'defMelee', slot: 'destiny', power_name: 'Barrier_Core_Epiphany', exemplar: true, value: 2.5 },
    ], incarnateName);
    const entry = bd.get('defMelee')!;
    expect(entry.total).toBe(7.5);
    expect(entry.sources).toEqual([
      { name: 'Barrier Core Epiphany', value: 5, type: 'incarnate' },
      { name: 'Barrier Core Epiphany (exemplar)', value: 2.5, type: 'incarnate' },
    ]);
  });

  it('falls back to the internal name when the slot holds nothing resolvable', () => {
    const bd = new Map<string, DashboardStatBreakdown>();
    addIncarnateBreakdown(bd, [
      { breakdown_key: 'recovery', slot: 'hybrid', power_name: 'Assault_Radial_Embodiment', exemplar: false, value: 3 },
    ], incarnateName);
    expect(bd.get('recovery')!.sources[0].name).toBe('Assault_Radial_Embodiment');
  });
});

describe('addStealthBreakdown', () => {
  it('shows a superseded radius dimmed and contributing nothing', () => {
    const bd = new Map<string, DashboardStatBreakdown>();
    addStealthBreakdown(bd, [
      { breakdown_key: 'stealthRadiusPvE', value: 35, superseded: false, power_name: 'Super Speed' },
      { breakdown_key: 'stealthRadiusPvE', value: 30, superseded: true, power_name: 'Stealth' },
    ]);
    const entry = bd.get('stealthRadiusPvE')!;
    expect(entry.total).toBe(35);
    expect(entry.sources[1]).toEqual({ name: 'Stealth', value: 30, type: 'active-power', suppressed: true });
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
