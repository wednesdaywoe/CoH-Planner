import { describe, it, expect } from 'vitest';
import type { DashboardStatBreakdown } from '@/utils/calculations';
import { toCanonicalStatKey } from '@/data/set-bonus-groups';
import { computeOffendingPowerReasons, countUnmutedCappedSources } from './over-cap-mute';

// Minimal breakdown factory: one stat key → its capped/uncapped sources.
function bd(entries: Record<string, { name: string; powerName?: string; value: number; capped?: boolean }[]>) {
  const map = new Map<string, DashboardStatBreakdown>();
  for (const [key, sources] of Object.entries(entries)) {
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
