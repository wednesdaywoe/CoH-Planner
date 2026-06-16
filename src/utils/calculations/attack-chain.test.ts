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
    // Recharge starts at cast-END, so a power's solo repeat period is
    // cast + recharge. With cast 1 + recharge 1, each is ready exactly when the
    // other finishes animating ⇒ perfect A,B,A,B packing, no gap.
    const A = mk({ id: 'A', baseRecharge: 1, damage: 10 });
    const B = mk({ id: 'B', baseRecharge: 1, damage: 20 });
    const powers = [A, B];
    const acts = replayChain(powers, [0, 1, 0, 1], 0);
    expect(acts.map((a) => a.start)).toEqual([0, 1, 2, 3]);

    const r = computeChain(powers, acts, 0, null)!;
    expect(r.cycleSec).toBe(4);
    expect(r.deadTime).toBe(0);
    expect(r.efficiency).toBe(100);
    expect(r.totalDamage).toBe(60); // 10+20+10+20
    expect(r.dps).toBe(15);
    expect(r.maxDamage).toBe(20);
    // Both fire exactly on cooldown (2 casts × period 2 = cycle 4) → compact.
    expect(r.compactness).toBe(100);
  });

  it('extends the cycle past the last cast when the opener is still recharging', () => {
    // The reported bug: visible casts end at 2s, but A (cast once, cast 1 +
    // recharge 5) isn't ready again until cast-end(1) + 5 = 6s — so the true
    // cycle is 6s, and the boundary idle counts as dead time.
    const A = mk({ id: 'A', cast: 1, baseRecharge: 5 });
    const B = mk({ id: 'B', cast: 1, baseRecharge: 1 });
    const acts = replayChain([A, B], [0, 1], 0); // A@0, B@1
    const r = computeChain([A, B], acts, 0, null)!;
    expect(r.cycleSec).toBe(6);
    expect(r.deadTime).toBe(4); // 6s loop − 2s of animation
    expect(r.efficiency).toBe(33);
  });

  it('a single power loops at cast + recharge, not its last visible cast', () => {
    const C = mk({ id: 'C', baseRecharge: 3, cast: 1, damage: 5 });
    const acts = replayChain([C], [0, 0], 0); // C@0, then ready at end(1)+3=4
    expect(acts.map((a) => a.start)).toEqual([0, 4]);

    const r = computeChain([C], acts, 0, null)!;
    // C cycles every cast + recharge = 4s; two casts span an 8s loop.
    expect(r.cycleSec).toBe(8);
    expect(r.deadTime).toBe(6); // idle 1→4 and 5→8
    expect(r.efficiency).toBe(25);
    // Orthogonal to efficiency: C fires exactly on cooldown (2 × period 4 = 8),
    // so it's perfectly COMPACT even though the loop is mostly idle.
    expect(r.compactness).toBe(100);
  });

  it('global recharge shrinks the loop', () => {
    const C = mk({ id: 'C', baseRecharge: 3, cast: 1 });
    const acts = replayChain([C], [0, 0], 50); // +50% → effRech 2 → ready at end(1)+2=3
    expect(acts.map((a) => a.start)).toEqual([0, 3]);
    const r = computeChain([C], acts, 50, null)!;
    expect(r.cycleSec).toBe(6); // 2 casts × (cast 1 + effRech 2)
    expect(r.deadTime).toBe(4);
  });

  it('counts after-cast DoT ticks that land inside the cycle', () => {
    const D = mk({ id: 'D', cast: 1, baseRecharge: 1, damage: 0, dot: { ticks: 3, period: 1, perTick: 4 } });
    const acts = replayChain([D], [0, 0], 0); // D@0, ready at end(1)+1=2 → D@2 → cycle = 4
    const r = computeChain([D], acts, 0, null)!;
    // D@0 ticks land at 2,3,4 (all ≤ cycle 4 → +12); D@2 ticks at 4,5,6 → only
    // t=4 lands (+4). Trailing ticks past the loop boundary truncate.
    expect(r.cycleSec).toBe(4);
    expect(r.totalDamage).toBe(16);
  });
});

describe('compactness', () => {
  it('drops below 100 when a power overshoots its cooldown (no idle though)', () => {
    // Three powers, each cast 1 + recharge 1 (period 2), round-robin X,Y,Z,X,Y,Z.
    // Each needs only 1s of other animation between repeats, so the timeline
    // packs solid (efficiency 100) — but each fires just 2× in the 6s loop when
    // its 2s cooldown would allow 3×, so it's only two-thirds compact.
    const X = mk({ id: 'X', cast: 1, baseRecharge: 1, damage: 100 });
    const Y = mk({ id: 'Y', cast: 1, baseRecharge: 1, damage: 100 });
    const Z = mk({ id: 'Z', cast: 1, baseRecharge: 1, damage: 100 });
    const acts = replayChain([X, Y, Z], [0, 1, 2, 0, 1, 2], 0); // packs [0..6)
    const r = computeChain([X, Y, Z], acts, 0, null)!;
    expect(r.cycleSec).toBe(6);
    expect(r.efficiency).toBe(100); // packed, no idle
    expect(r.compactness).toBe(67); // each: min(1, 2×period2/6) = 0.667
  });

  it('weights compactness by the power metric — a compact big hitter outweighs filler slack', () => {
    // X (hard hitter, period 5) sits idle ~1s of the 6s loop (u≈0.83); A (jab,
    // period 2) fires 3× = exactly on cooldown (u=1). The slack lands on the
    // high-damage power, so default metric = per-cast damage weights it heavily.
    const X = mk({ id: 'X', cast: 1, baseRecharge: 4, damage: 100 });
    const A = mk({ id: 'A', cast: 1, baseRecharge: 1, damage: 10 });
    const acts = replayChain([X, A], [0, 1, 1, 1], 0); // X@0, A@1,3,5
    const r = computeChain([X, A], acts, 0, null)!;
    expect(r.cycleSec).toBe(6);
    expect(r.efficiency).toBe(67);
    // X period 5 in a 6s loop → u = 5/6 = 0.833; A period 2 × 3 = 6 → u = 1.
    // (100×0.833 + 10×1) / 110 = 0.848 → 85
    expect(r.compactness).toBe(85);
  });

  it('the metric changes the weighting — dps weights by damage/(cast+recharge)', () => {
    // Same chain, metric = dps: X = 100/(1+4) = 20, A = 10/(1+1) = 5.
    const X = mk({ id: 'X', cast: 1, baseRecharge: 4, damage: 100 });
    const A = mk({ id: 'A', cast: 1, baseRecharge: 1, damage: 10 });
    const acts = replayChain([X, A], [0, 1, 1, 1], 0);
    const r = computeChain([X, A], acts, 0, null, 'dps')!;
    // (20×0.833 + 5×1) / 25 = 0.867 → 87
    expect(r.compactness).toBe(87);
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
    const A = mk({ id: 'A', baseRecharge: 1 });
    const B = mk({ id: 'B', baseRecharge: 1 });
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
    const acts = replayChain([D], [0, 0, 0], 0); // ready at end+1 → D@0,2,4
    const r = computeChain([D], acts, 0, { maxEnd: 20, recoveryPerSec: 1, togglePerSec: 0 })!;
    const e = r.endurance!;
    // full 20 → cast −15 = 5 → +1/s for 2s → at t=2: 7 − 15 = −8 ⇒ stall at t=2
    expect(e.sustainable).toBe(false);
    expect(e.stallTime).toBeCloseTo(2, 5);
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
    expect(e.netPerSec).toBeCloseTo(4, 5); // analytic (−3 + 11) / 2s
    expect(e.sustainable).toBe(true); // clamped bar holds at full
    expect(e.stallTime).toBeNull();
  });

  it('does not over-report sustainability when a recovery click overfills the cap', () => {
    // R refunds +110 but fires on a full bar (all wasted); 3 attacks then drain
    // 105 with no passive recovery. Analytic perLoopDelta = +5 (looks fine), but
    // the clamped bar empties → must report a stall, not "sustainable".
    const R = mk({ id: 'R', cast: 1, baseRecharge: 1, endCost: 0, endGain: 110, damage: 0 });
    const A = mk({ id: 'A', cast: 1, baseRecharge: 1, endCost: 35, damage: 5 });
    const acts = replayChain([R, A], [0, 1, 1, 1], 0); // R@0, A@1,2,3 → cycle 4
    const r = computeChain([R, A], acts, 0, { maxEnd: 100, recoveryPerSec: 0, togglePerSec: 0 })!;
    const e = r.endurance!;
    expect(e.perLoopDelta).toBeCloseTo(5, 5); // analytic looks positive…
    expect(e.sustainable).toBe(false); // …but the overfilled gain is wasted
    expect(e.stallTime).not.toBeNull();
  });

  it('toggle drain pushes an otherwise-fine chain negative', () => {
    const A = mk({ id: 'A', endCost: 1, baseRecharge: 1 }); // period cast 1 + rech 1
    const acts = replayChain([A], [0, 0], 0); // A@0, A@2 → 4s loop (2 casts × 2s)
    const r = computeChain([A], acts, 0, { maxEnd: 100, recoveryPerSec: 1.5, togglePerSec: 1.5 })!;
    const e = r.endurance!;
    expect(e.attackPerSec).toBeCloseTo(0.5, 5); // 2 end / 4 s
    expect(e.netPerSec).toBeCloseTo(-0.5, 5); // 1.5 − 1.5 − 0.5
    expect(e.sustainable).toBe(false);
    expect(e.timeToEmpty).toBeCloseTo(200, 5); // 100 / 0.5
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

describe('cast forms (charge trigger — fast Energy Transfer)', () => {
  // TF grants `energy_focus`; ET upgrades to its fast form (cast 1 vs base 2.67)
  // by spending one. Damage is identical between forms — only the cast differs.
  const tf = mk({ id: 'TF', cast: 2, baseRecharge: 1, damage: 5, grants: 'energy_focus' });
  const et = mk({
    id: 'ET',
    cast: 2.67,
    baseRecharge: 1,
    damage: 100,
    forms: [
      {
        id: 'fast',
        label: 'Energy Focus',
        kind: 'fast',
        cast: 1,
        damage: 100,
        endCost: 1,
        dot: null,
        trigger: { type: 'charge', resource: 'energy_focus' },
      },
    ],
  });
  const powers = [tf, et];

  it('uses the base (slow) form with no preceding grantor', () => {
    const acts = replayChain([et], [0], 0);
    expect(acts[0].formId).toBeUndefined();
    expect(acts[0].end - acts[0].start).toBeCloseTo(2.67, 5); // slow animation
  });

  it('upgrades to the fast form after Total Focus, consuming the charge', () => {
    const acts = replayChain(powers, [0, 1], 0);
    const etAct = acts.find((a) => a.pi === 1)!;
    expect(etAct.formId).toBe('fast');
    expect(etAct.end - etAct.start).toBeCloseTo(1, 5); // shortened cast
  });

  it('powers exactly one fast ET per Energy Focus', () => {
    // TF, ET, ET → first ET fast (spends the charge), second falls back to slow.
    const acts = replayChain(powers, [0, 1, 1], 0);
    const ets = acts.filter((a) => a.pi === 1).sort((a, b) => a.start - b.start);
    expect(ets.map((a) => a.formId)).toEqual(['fast', undefined]);
  });
});

describe('cast forms (tohit trigger — fast snipe)', () => {
  // Snipe: slow base (3.67s) + fast form (1.67s) gated on ≥22% ToHit.
  const snipe = mk({
    id: 'SNIPE',
    cast: 3.67,
    baseRecharge: 12,
    damage: 100,
    forms: [
      {
        id: 'fast',
        label: 'Fast Snipe',
        kind: 'fast',
        cast: 1.67,
        damage: 60,
        endCost: 1,
        dot: null,
        trigger: { type: 'tohit', threshold: 22 },
      },
    ],
  });
  // Build Up grants a 10s ToHit window; Hasten is recharge-only (no window).
  const buildUp = mk({ id: 'BU', cast: 1, baseRecharge: 90, damage: 0, type: 'buff', tohitWindow: 10 });
  const hasten = mk({ id: 'HAS', cast: 1, baseRecharge: 90, damage: 0, type: 'buff' });

  it('uses the slow form with no permanent ToHit and no buff window', () => {
    const acts = replayChain([snipe], [0], 0);
    expect(acts[0].formId).toBeUndefined();
    expect(acts[0].end - acts[0].start).toBeCloseTo(3.67, 5);
  });

  it('fires fast when permanent ToHit meets the threshold', () => {
    const acts = replayChain([snipe], [0], 0, { permanentToHit: 24 });
    expect(acts[0].formId).toBe('fast');
    expect(acts[0].end - acts[0].start).toBeCloseTo(1.67, 5);
  });

  it('fires fast inside a Build Up ToHit window (no permanent ToHit)', () => {
    const acts = replayChain([buildUp, snipe], [0, 1], 0, { permanentToHit: 0 });
    expect(acts.find((a) => a.pi === 1)!.formId).toBe('fast');
  });

  it('a recharge-only buff (Hasten) does NOT make a snipe fast', () => {
    const acts = replayChain([hasten, snipe], [0, 1], 0, { permanentToHit: 0 });
    expect(acts.find((a) => a.pi === 1)!.formId).toBeUndefined();
  });
});
