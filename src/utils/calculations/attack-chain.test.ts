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

    const r = computeChain(powers, acts, 0, null)!;
    // Each power cast twice, span 2, effRech 2 → loop need 4 = lastEnd. No gap.
    expect(r.cycleSec).toBe(4);
    expect(r.deadTime).toBe(0);
    expect(r.efficiency).toBe(100);
    expect(r.totalDamage).toBe(60); // 10+20+10+20
    expect(r.dps).toBe(15);
    expect(r.maxDamage).toBe(20);
    // Both fire exactly on cooldown (2 casts × effRech 2 = cycle 4) → compact.
    expect(r.compactness).toBe(100);
  });

  it('extends the cycle past the last cast when the opener is still recharging', () => {
    // The reported bug: visible casts end at 2s, but A (cast once) needs 5s to
    // recharge before the loop can restart — so the true cycle is 5s, not 2s,
    // and the boundary idle counts as dead time.
    const A = mk({ id: 'A', cast: 1, baseRecharge: 5 });
    const B = mk({ id: 'B', cast: 1, baseRecharge: 1 });
    const acts = replayChain([A, B], [0, 1], 0); // A@0, B@1
    const r = computeChain([A, B], acts, 0, null)!;
    expect(r.cycleSec).toBe(5);
    expect(r.deadTime).toBe(3); // 5s loop − 2s of animation
    expect(r.efficiency).toBe(40);
  });

  it('a single power loops at its recharge, not its last visible cast', () => {
    const C = mk({ id: 'C', baseRecharge: 3, cast: 1, damage: 5 });
    const acts = replayChain([C], [0, 0], 0); // C@0, C@3
    expect(acts.map((a) => a.start)).toEqual([0, 3]);

    const r = computeChain([C], acts, 0, null)!;
    // 2 casts span 3s; +3s recharge ⇒ loop is 6s, not 4s (the last cast's end).
    expect(r.cycleSec).toBe(6);
    expect(r.deadTime).toBe(4); // idle 1→3 and 4→6
    expect(r.efficiency).toBe(33);
    // Orthogonal to efficiency: C fires exactly on cooldown (2 × effRech 3 = 6),
    // so it's perfectly COMPACT even though the loop is mostly idle.
    expect(r.compactness).toBe(100);
  });

  it('global recharge shrinks the loop', () => {
    const C = mk({ id: 'C', baseRecharge: 3, cast: 1 });
    const acts = replayChain([C], [0, 0], 50); // +50% → effRech 2 → C@0, C@2
    expect(acts.map((a) => a.start)).toEqual([0, 2]);
    const r = computeChain([C], acts, 50, null)!;
    expect(r.cycleSec).toBe(4); // span 2 + effRech 2
    expect(r.deadTime).toBe(2);
  });

  it('counts after-cast DoT ticks that land inside the cycle', () => {
    const D = mk({ id: 'D', cast: 1, baseRecharge: 1, damage: 0, dot: { ticks: 3, period: 1, perTick: 4 } });
    const acts = replayChain([D], [0, 0], 0); // D@0, D@1 → cycle = 2
    const r = computeChain([D], acts, 0, null)!;
    // D@0 ticks land at 2,3,4 → only t=2 is ≤ cycle(2); D@1 ticks at 3,4,5 → none
    expect(r.cycleSec).toBe(2);
    expect(r.totalDamage).toBe(4);
  });
});

describe('compactness', () => {
  it('drops below 100 when a power overshoots its cooldown (no idle though)', () => {
    // A and B both recharge in 2s but each is cast once in a 4s loop, so each
    // sits "waiting" 2s before its next (next-loop) cast. The loop is
    // fully packed (efficiency 100) but only half-compact — you could fire each
    // twice as often.
    const A = mk({ id: 'A', cast: 2, baseRecharge: 2, damage: 100 });
    const B = mk({ id: 'B', cast: 2, baseRecharge: 2, damage: 100 });
    const acts = replayChain([A, B], [0, 1], 0); // A@0-2, B@2-4
    const r = computeChain([A, B], acts, 0, null)!;
    expect(r.cycleSec).toBe(4);
    expect(r.efficiency).toBe(100); // packed, no idle
    expect(r.compactness).toBe(50); // each: min(1, 1×2/4) = 0.5
  });

  it('weights compactness by the power metric — a compact big hitter outweighs filler slack', () => {
    // X (hard hitter) fires exactly on cooldown; A (jab) is cast 3× but could go
    // 4×. Default metric = per-cast damage: X=100 @ u=1, A=10 @ u=0.75.
    const X = mk({ id: 'X', cast: 1, baseRecharge: 4, damage: 100 });
    const A = mk({ id: 'A', cast: 1, baseRecharge: 1, damage: 10 });
    const acts = replayChain([X, A], [0, 1, 1, 1], 0); // X@0, A@1,2,3
    const r = computeChain([X, A], acts, 0, null)!;
    expect(r.cycleSec).toBe(4);
    expect(r.efficiency).toBe(100);
    // (100×1 + 10×0.75) / 110 = 0.9773 → 98
    expect(r.compactness).toBe(98);
  });

  it('the metric changes the weighting — dps weights by damage/(cast+recharge)', () => {
    // Same chain, metric = dps: X = 100/(1+4) = 20, A = 10/(1+1) = 5.
    const X = mk({ id: 'X', cast: 1, baseRecharge: 4, damage: 100 });
    const A = mk({ id: 'A', cast: 1, baseRecharge: 1, damage: 10 });
    const acts = replayChain([X, A], [0, 1, 1, 1], 0);
    const r = computeChain([X, A], acts, 0, null, 'dps')!;
    // (20×1 + 5×0.75) / 25 = 0.95 → 95
    expect(r.compactness).toBe(95);
  });

  it('is null when the chain deals no damage', () => {
    const T = mk({ id: 'T', cast: 1, baseRecharge: 1, damage: 0, dot: null });
    const acts = replayChain([T], [0, 0], 0);
    const r = computeChain([T], acts, 0, null)!;
    expect(r.compactness).toBeNull();
  });
});

describe('endurance model', () => {
  it('reports a sustainable chain (net ≥ 0, no stall)', () => {
    const A = mk({ id: 'A' });
    const B = mk({ id: 'B' });
    const acts = replayChain([A, B], [0, 1, 0, 1], 0); // cycle 4, 4 casts × 1 end
    const r = computeChain([A, B], acts, 0, { maxEnd: 100, recoveryPerSec: 2, togglePerSec: 0 })!;
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
    const r = computeChain([D], acts, 0, { maxEnd: 20, recoveryPerSec: 1, togglePerSec: 0 })!;
    const e = r.endurance!;
    // full 20 → cast −15 = 5 → +1/s → at t=1: 6 − 15 = −9 ⇒ stall at t=1
    expect(e.sustainable).toBe(false);
    expect(e.stallTime).toBeCloseTo(1, 5);
  });

  it('a recovery click pays endurance back (Dark Consumption-style)', () => {
    // A normal attack costs 2 end; R costs 1 but refunds 11 (net +10/cast).
    const A = mk({ id: 'A', cast: 1, baseRecharge: 1, endCost: 2, damage: 5 });
    const R = mk({ id: 'R', cast: 1, baseRecharge: 1, endCost: 1, endGain: 11, damage: 0 });
    const acts = replayChain([A, R], [0, 1], 0); // A@0, R@1 → cycle 2
    const r = computeChain([A, R], acts, 0, { maxEnd: 100, recoveryPerSec: 0, togglePerSec: 0 })!;
    const e = r.endurance!;
    expect(r.cycleSec).toBe(2);
    expect(e.attackPerSec).toBeCloseTo(1.5, 5); // gross spend (2+1)/2
    expect(e.gainPerSec).toBeCloseTo(5.5, 5); // 11 / 2s
    expect(e.netPerSec).toBeCloseTo(4, 5); // (−3 + 11) / 2s
    expect(e.sustainable).toBe(true);
  });

  it('toggle drain pushes an otherwise-fine chain negative', () => {
    const A = mk({ id: 'A', endCost: 1, baseRecharge: 1 }); // cast 1 + rech 1 → 2s cycle
    const acts = replayChain([A], [0, 0], 0); // A@0, A@1
    const r = computeChain([A], acts, 0, { maxEnd: 100, recoveryPerSec: 1.5, togglePerSec: 1.5 })!;
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
