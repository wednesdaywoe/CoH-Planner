import { describe, it, expect } from 'vitest';
import {
  replayChain,
  computeChain,
  effectiveRecharge,
  type ChainPower,
} from './attack-chain';

const mk = (over: Partial<ChainPower> = {}): ChainPower => ({
  id: 'x',
  name: 'X',
  type: 'attack',
  cast: 1,
  baseRecharge: 2,
  rechargeEnh: 0,
  endCost: 1,
  damage: 10,
  dot: null,
  ...over,
});

describe('effectiveRecharge', () => {
  it('folds enhancement + global recharge into one divisive denominator', () => {
    const p = mk({ baseRecharge: 10, rechargeEnh: 1 }); // +100% slotted
    expect(effectiveRecharge(p, 0)).toBeCloseTo(5, 5); // 10 / (1 + 1)
    expect(effectiveRecharge(p, 100)).toBeCloseTo(10 / 3, 5); // 10 / (1 + 1 + 1)
  });
});

describe('chain packer', () => {
  it('alternates two ready attacks with no dead time', () => {
    const A = mk({ id: 'A', damage: 10 });
    const B = mk({ id: 'B', damage: 20 });
    const powers = [A, B];
    const acts = replayChain(powers, [0, 1, 0, 1], 0);
    expect(acts.map((a) => a.start)).toEqual([0, 1, 2, 3]);

    const r = computeChain(powers, acts, null)!;
    expect(r.cycleSec).toBe(4);
    expect(r.deadTime).toBe(0);
    expect(r.efficiency).toBe(100);
    expect(r.totalDamage).toBe(60); // 10+20+10+20
    expect(r.dps).toBe(15);
    expect(r.maxDamage).toBe(20);
  });

  it('leaves a dead gap when a single power out-paces its recharge', () => {
    const C = mk({ id: 'C', baseRecharge: 3, cast: 1, damage: 5 });
    const acts = replayChain([C], [0, 0], 0); // second cast waits for recharge
    expect(acts.map((a) => a.start)).toEqual([0, 3]);

    const r = computeChain([C], acts, null)!;
    expect(r.cycleSec).toBe(4);
    expect(r.deadTime).toBe(2); // idle from 1s → 3s
    expect(r.efficiency).toBe(50);
  });

  it('global recharge closes the gap', () => {
    const C = mk({ id: 'C', baseRecharge: 3, cast: 1 });
    // +50% global → effRech 2; second cast can fire at t=2 (right after first recharge)
    const acts = replayChain([C], [0, 0], 50);
    expect(acts.map((a) => a.start)).toEqual([0, 2]);
    expect(computeChain([C], acts, null)!.deadTime).toBe(1); // gap 1s→2s
  });

  it('counts after-cast DoT ticks that land inside the cycle', () => {
    const D = mk({ id: 'D', cast: 1, baseRecharge: 1, damage: 0, dot: { ticks: 3, period: 1, perTick: 4 } });
    const acts = replayChain([D], [0, 0], 0); // D@0, D@1 → cycle = 2
    const r = computeChain([D], acts, null)!;
    // D@0 ticks land at 2,3,4 → only t=2 is ≤ cycle(2); D@1 ticks at 3,4,5 → none ≤ 2
    expect(r.cycleSec).toBe(2);
    expect(r.totalDamage).toBe(4);
  });
});

describe('endurance model', () => {
  it('reports a sustainable chain (net ≥ 0, no stall)', () => {
    const A = mk({ id: 'A' });
    const B = mk({ id: 'B' });
    const acts = replayChain([A, B], [0, 1, 0, 1], 0); // cycle 4, 4 casts × 1 end
    const r = computeChain([A, B], acts, { maxEnd: 100, recoveryPerSec: 2, togglePerSec: 0 })!;
    const e = r.endurance!;
    expect(e.attackPerSec).toBeCloseTo(1, 5); // 4 end / 4 s
    expect(e.netPerSec).toBeCloseTo(1, 5); // 2 recovery − 0 toggle − 1 attack
    expect(e.sustainable).toBe(true);
    expect(e.stallTime).toBeNull();
    expect(e.timeToEmpty).toBeNull();
  });

  it('detects a mid-rotation stall even from a full bar', () => {
    const D = mk({ id: 'D', cast: 1, baseRecharge: 1, endCost: 15 });
    const acts = replayChain([D], [0, 0, 0], 0); // D@0,1,2
    const r = computeChain([D], acts, { maxEnd: 20, recoveryPerSec: 1, togglePerSec: 0 })!;
    const e = r.endurance!;
    // full 20 → cast −15 = 5 → +1/s → at t=1: 6 − 15 = −9 ⇒ stall at t=1
    expect(e.sustainable).toBe(false);
    expect(e.stallTime).toBeCloseTo(1, 5);
  });

  it('toggle drain pushes an otherwise-fine chain negative', () => {
    const A = mk({ id: 'A', endCost: 1, baseRecharge: 1 }); // cast 1 + rech 1 → 2s cycle
    const acts = replayChain([A], [0, 0], 0); // A@0, A@1
    const r = computeChain([A], acts, { maxEnd: 100, recoveryPerSec: 1.5, togglePerSec: 1.5 })!;
    const e = r.endurance!;
    expect(e.attackPerSec).toBeCloseTo(1, 5); // 2 end / 2 s
    expect(e.netPerSec).toBeCloseTo(-1, 5); // 1.5 − 1.5 − 1
    expect(e.sustainable).toBe(false);
    expect(e.timeToEmpty).toBeCloseTo(100, 5); // 100 / 1
  });
});

describe('per-bar removal via sequence', () => {
  it('removing a sequence entry drops exactly that cast', () => {
    const A = mk({ id: 'A' });
    const B = mk({ id: 'B' });
    const seq = [0, 1, 0]; // A, B, A
    const acts = replayChain([A, B], seq, 0);
    expect(acts.map((a) => a.seq)).toEqual([0, 1, 2]);

    const seq2 = seq.filter((_, i) => i !== 1); // remove the B
    const acts2 = replayChain([A, B], seq2, 0);
    expect(acts2.every((a) => a.pi === 0)).toBe(true);
    expect(acts2).toHaveLength(2);
  });
});
