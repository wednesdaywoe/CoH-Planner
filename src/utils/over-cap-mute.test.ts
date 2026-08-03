import { describe, it, expect } from 'vitest';
import type { DashboardStatBreakdown, StatSource } from '@/utils/calculations';
import { statKeyToLabel, toCanonicalStatKey } from '@/data/set-bonus-groups';
import { computeOffendingPowerReasons, countUnmutedCappedSources } from './over-cap-mute';

// Minimal breakdown factory: one stat key → its capped/uncapped sources. `type` defaults to
// 'set-bonus' — it is the Rule-of-5 pool axis, so a case about proc globals must state it.
function bd(
  entries: Record<string, { name: string; powerName?: string; value: number; capped?: boolean; type?: StatSource['type'] }[]>,
) {
  const map = new Map<string, DashboardStatBreakdown>();
  for (const [key, raw] of Object.entries(entries)) {
    const sources = raw.map((s) => ({ type: 'set-bonus' as const, ...s }));
    map.set(key, { total: 0, sources } as unknown as DashboardStatBreakdown);
  }
  return map;
}

describe('computeOffendingPowerReasons', () => {
  it('a power whose ONLY over-cap is muted gets no reason', () => {
    const breakdown = bd({
      mezResist: [{ name: 'Set A', powerName: 'Power X', value: 10, capped: true }],
    });
    const muted = [toCanonicalStatKey('mezResist')];
    expect(computeOffendingPowerReasons(breakdown, true, muted).has('Power X')).toBe(false);
  });

  it('a power over-cap on a muted AND a non-muted stat keeps its ring', () => {
    const breakdown = bd({
      mezResist: [{ name: 'Set A', powerName: 'Power X', value: 10, capped: true }],
      resFire: [{ name: 'Set A', powerName: 'Power X', value: 3, capped: true }],
    });
    const muted = [toCanonicalStatKey('mezResist')];
    const reasons = computeOffendingPowerReasons(breakdown, true, muted);
    expect(reasons.get('Power X')?.map((r) => r.label)).toEqual(['Fire/Cold']); // res mez dropped, fire kept
  });

  it('muting a paired-defense popup row suppresses BOTH breakdown halves', () => {
    const breakdown = bd({
      defEnergy: [{ name: 'Set B', powerName: 'Power Y', value: 3.13, capped: true }],
      defNegative: [{ name: 'Set B', powerName: 'Power Y', value: 3.13, capped: true }],
    });
    const muted = [toCanonicalStatKey('defEnergy')]; // popup row.stat could be either half
    expect(computeOffendingPowerReasons(breakdown, true, muted).has('Power Y')).toBe(false);
  });

  it('returns an empty map when disabled', () => {
    const breakdown = bd({ mezResist: [{ name: 'A', powerName: 'X', value: 10, capped: true }] });
    expect(computeOffendingPowerReasons(breakdown, false, []).size).toBe(0);
  });

  // Procs and set bonuses are counted in independent Rule-of-5 pools, so a same-value
  // pair belongs to two different buckets and one capping says nothing about the other.
  it('a capped PROC bucket does not flag a same-value SET BONUS power', () => {
    // Six LotG +7.5% Recharge globals (the 6th rejected) beside a Basilisk's Gaze
    // 4-piece +7.5% Recharge set bonus on Tesla Coil.
    const lotg = ['Ice Shield', 'Glacial Shield', 'Arctic Fog', 'Combat Jumping', 'Infiltration'].map(
      (powerName) => ({ name: 'Luck of the Gambler: +Recharge', powerName, value: 7.5, type: 'proc' as const }),
    );
    const breakdown = bd({
      recharge: [
        ...lotg,
        { name: 'Luck of the Gambler: +Recharge', powerName: 'Stealth', value: 7.5, capped: true, type: 'proc' },
        { name: "Basilisk's Gaze (4pc in Tesla Coil)", powerName: 'Tesla Coil', value: 7.5, type: 'set-bonus' },
      ],
    });
    const reasons = computeOffendingPowerReasons(breakdown, true, []);
    expect(reasons.has('Tesla Coil')).toBe(false);
    expect(reasons.has('Stealth')).toBe(true);
    expect(reasons.has('Ice Shield')).toBe(true); // the five accepted LotG are interchangeable
  });

  it('a capped SET BONUS bucket does not flag a same-value PROC power', () => {
    const breakdown = bd({
      recharge: [
        { name: 'Set A (5pc in Power A)', powerName: 'Power A', value: 7.5, capped: true },
        { name: 'Luck of the Gambler: +Recharge', powerName: 'Ice Shield', value: 7.5, type: 'proc' },
      ],
    });
    const reasons = computeOffendingPowerReasons(breakdown, true, []);
    expect(reasons.has('Power A')).toBe(true);
    expect(reasons.has('Ice Shield')).toBe(false);
  });

  it('a source in no Rule-of-5 pool never joins a capped bucket', () => {
    const breakdown = bd({
      recharge: [
        { name: 'Set A (5pc in Power A)', powerName: 'Power A', value: 5, capped: true },
        { name: 'Pet Aura', powerName: 'Force Field Generator', value: 5, type: 'active-power' },
      ],
    });
    expect(computeOffendingPowerReasons(breakdown, true, []).has('Force Field Generator')).toBe(false);
  });

  it('powers sharing one capped bucket are all flagged', () => {
    const breakdown = bd({
      recharge: [
        { name: 'Set A (5pc in Power A)', powerName: 'Power A', value: 5 },
        { name: 'Set B (5pc in Power B)', powerName: 'Power B', value: 5, capped: true },
        { name: 'Set C (5pc in Power C)', powerName: 'Power C', value: 6.25 }, // other bucket
      ],
    });
    const reasons = computeOffendingPowerReasons(breakdown, true, []);
    expect([...reasons.keys()].sort()).toEqual(['Power A', 'Power B']);
    expect(reasons.get('Power A')).toEqual([{ label: statKeyToLabel('recharge'), display: '+5%' }]);
  });
});

describe('countUnmutedCappedSources', () => {
  it('excludes capped sources of muted stats', () => {
    const breakdown = bd({
      mezResist: [{ name: 'A', value: 10, capped: true }],
      resFire: [{ name: 'B', value: 3, capped: true }],
    });
    expect(countUnmutedCappedSources(breakdown, [])).toBe(2);
    expect(countUnmutedCappedSources(breakdown, [toCanonicalStatKey('mezResist')])).toBe(1);
  });

  it('is zero when every capped stat is muted', () => {
    const breakdown = bd({ mezResist: [{ name: 'A', value: 10, capped: true }] });
    expect(countUnmutedCappedSources(breakdown, [toCanonicalStatKey('mezResist')])).toBe(0);
  });
});
