import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset, GRANTED_POWER_GROUPS } from '@/data';
import { createEmptyBuild } from '@/types/build';
import { createDefaultIncarnateActiveState } from '@/types/incarnate';
import { calculateArcanaTime } from './damage';
import { calculateCharacterTotals } from './character-totals';
import {
  buildChainPowers,
  buildFormModes,
  buildFormSwitchPowers,
  SHAPESHIFT_BLOCKING_CAST,
  SHAPESHIFT_FULL_ANIM,
} from './attack-chain-powers';
import {
  replayChain,
  computeChain,
  reservedCast,
  casterFormTimeline,
  nextPickContext,
  nextPickForm,
  displayForm,
  activationForm,
  effectiveRecharge,
  powerMetricValue,
  type ChainPower,
  type RechargeBounds,
} from './attack-chain';
import type { Build, SelectedPower } from '@/types';

/**
 * Attack chains that switch CASTER FORM mid-rotation.
 *
 * The motivating Warshade rotation is human Gravity Well → human Essence Drain → shift to
 * Black Dwarf → Black Dwarf Drain → Black Dwarf Smite. Every piece of that existed already —
 * the powers, their mode gates, their redirects — but the chain modelled the caster form as a
 * chain-wide FILTER applied before the candidate list existed, so a rotation lived inside one
 * form and could never leave it.
 *
 * Four things had to be true at once for cross-form to be more than a palette change:
 *
 *  1. a power's human and in-form versions stay ONE ChainPower on ONE recharge lane. Gleaming
 *     Bolt and Dwarf Gleaming Bolt are one tray slot; split into two ChainPowers, `findSlot`
 *     (which keys `laneReadyAt` on `pi`) would let `Bolt → shift → Bolt` fire twice off one
 *     cooldown and report ~2× the true DPS. That is the regression this file exists to pin;
 *  2. a switch is a first-class ChainPower, so its animation is reserved and the
 *     one-animation-at-a-time invariant covers it for free;
 *  3. illegality is DETECTED rather than prevented — a union palette can no longer keep an
 *     uncastable power out of reach, and an uncastable step silently counted in the totals
 *     would be worse than the roster filter it replaced;
 *  4. the two shapeshift cast times are honest about what they model. See
 *     SHAPESHIFT_BLOCKING_CAST / SHAPESHIFT_FULL_ANIM for the sequencer provenance; the
 *     default charges the blocking segment only, because a chain that casts immediately after
 *     switching animation-cancels the tail BY CONSTRUCTION.
 */

/** Every player class of every dataset authors these ClampStrength bounds. */
const BOUNDS: RechargeBounds = { floor: 0.25, cap: 5 };

/** ArcanaTime of each shapeshift assumption, derived from the constants themselves. */
const SHIFT_BLOCK = calculateArcanaTime(SHAPESHIFT_BLOCKING_CAST);
const SHIFT_FULL = calculateArcanaTime(SHAPESHIFT_FULL_ANIM);

const mk = (over: Partial<ChainPower> = {}): ChainPower => ({
  id: 'x', name: 'X', type: 'attack', cast: 1, baseRecharge: 2, rechargeEnh: 0,
  endCost: 1, damage: 10, dot: null, ...over,
});

// ---------------------------------------------------------------------------
// The two modelling constants, pinned at the ArcanaTime the chain actually uses.
// ---------------------------------------------------------------------------

describe('shapeshift cast constants', () => {
  it('are the sequencer-derived seconds, run through ArcanaTime like every other cast', () => {
    expect(SHAPESHIFT_BLOCKING_CAST).toBe(0.067); // 2 frames @30fps, TRANSFORM_KHELDIAN
    expect(SHAPESHIFT_FULL_ANIM).toBe(2.033); // 61 frames, the sibling-power oracle
    expect(SHIFT_BLOCK).toBeCloseTo(0.264, 9); // (ceil(0.067/0.132) + 1) × 0.132
    expect(SHIFT_FULL).toBeCloseTo(2.244, 9); // (ceil(2.033/0.132) + 1) × 0.132
  });

  it('0.067 is a measured number, not a stand-in for zero', () => {
    // calculateArcanaTime(0) takes its `<= 0` branch and returns one bare tick — a DIFFERENT
    // answer, and the reason the blocking segment is carried as its real 0.067 rather than
    // rounded away. Two frames of animation is not "no animation".
    expect(calculateArcanaTime(0)).toBeCloseTo(0.132, 9);
    expect(SHIFT_BLOCK).not.toBeCloseTo(calculateArcanaTime(0), 9);
  });
});

// ---------------------------------------------------------------------------
// Scheduler plumbing, on synthetic powers so every number is checkable by hand.
// ---------------------------------------------------------------------------

/** A switch shaped exactly as `buildFormSwitchPowers` emits one. */
const mkSwitch = (id: string, to: string | null, castable: (string | null)[]): ChainPower => ({
  id: `switch:${id}`, name: id, type: 'switch', switchTo: to,
  cast: SHIFT_BLOCK, baseRecharge: 1, rechargeEnh: 0, endCost: 0.13, damage: 0, dot: null,
  castableModes: castable,
  forms: [{
    id: 'full', label: 'Full shift animation', kind: 'slow',
    cast: SHIFT_FULL, damage: 0, endCost: 0.13, dot: null, trigger: { type: 'manual' },
  }],
});

describe('a switch is a chain step like any other', () => {
  const toDwarf = mkSwitch('Dwarf', 'DWARF', [null]);
  const toHuman = mkSwitch('Human', null, ['DWARF']);
  const humanHit = mk({ id: 'H', cast: 1, baseRecharge: 0, damage: 10, castableModes: [null] });
  const dwarfHit = mk({ id: 'D', cast: 1, baseRecharge: 0, damage: 20, castableModes: ['DWARF'] });
  const powers = [humanHit, dwarfHit, toDwarf, toHuman];

  it('occupies the animation lane, so nothing overlaps it', () => {
    const acts = replayChain(powers, [0, 2, 1, 1, 3, 0], 0, BOUNDS);
    expect(acts).toHaveLength(6);
    const sorted = [...acts].sort((a, b) => a.start - b.start);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].start, `cast ${i} overlaps ${i - 1}`)
        .toBeGreaterThanOrEqual(sorted[i - 1].end - 1e-9);
    }
    // H@0→1, switch@1→1.264, D@1.264→2.264, D@2.264→3.264, switch@3.264→3.528, H@3.528→4.528
    const expected = [0, 1, 1.264, 2.264, 3.264, 3.528];
    acts.forEach((a, i) => expect(a.start, `cast ${i}`).toBeCloseTo(expected[i], 9));
  });

  it('moves the live caster form for every LATER cast, and not for itself', () => {
    const acts = replayChain(powers, [0, 2, 1, 3, 0], 0, BOUNDS);
    const walk = casterFormTimeline(powers, acts, null);
    expect(walk.map((w) => w.form)).toEqual([null, null, 'DWARF', 'DWARF', null]);
    // The switch itself happens in the form it is LEAVING — which is what makes
    // "already the active form" detectable at all.
    expect(walk[1].form, 'the shift into Dwarf happens while still human').toBeNull();
  });

  it('opens in `startForm` rather than always in human', () => {
    const acts = replayChain(powers, [1, 3, 0], 0, BOUNDS, { startForm: 'DWARF' });
    expect(casterFormTimeline(powers, acts, 'DWARF').map((w) => w.form))
      .toEqual(['DWARF', 'DWARF', null]);
  });
});

describe('the full-shift assumption', () => {
  const toDwarf = mkSwitch('Dwarf', 'DWARF', [null]);
  const toHuman = mkSwitch('Human', null, ['DWARF']);
  // Zero-recharge fillers so the packed timeline — not a cooldown — is what sets cycleSec in
  // BOTH assumption states. Otherwise a long-recharge power can absorb the extra animation
  // and the delta measures the binding constraint instead of the switches.
  const f = mk({ id: 'F', cast: 1, baseRecharge: 0, damage: 10 });
  const powers = [f, toDwarf, toHuman];
  const seq = [1, 0, 0, 0, 2, 0, 0, 0]; // shift, 3 casts, shift back, 3 casts

  const cycle = (fullShiftAnimations: boolean) => {
    const ctx = { fullShiftAnimations };
    const acts = replayChain(powers, seq, 0, BOUNDS, ctx);
    return computeChain(powers, acts, 0, BOUNDS, null, 'damage', ctx)!.cycleSec;
  };

  it('charges the blocking segment by default and the full animation on request', () => {
    const n = seq.filter((pi) => powers[pi].type === 'switch').length;
    expect(n, 'the probe must contain switches or it grades air').toBe(2);
    expect(cycle(false)).toBeCloseTo(6.528, 9); // 0.264 + 6×1 + 0.264
    expect(cycle(true) - cycle(false)).toBeCloseTo(n * (SHIFT_FULL - SHIFT_BLOCK), 9);
    expect(cycle(true) - cycle(false)).toBeCloseTo(2 * (2.244 - 0.264), 9);
  });

  it('the flag reaches the palette too, so a chip cannot advertise the other animation', () => {
    const blocked = nextPickForm(powers, [], [], 1, 0, BOUNDS, {});
    const full = nextPickForm(powers, [], [], 1, 0, BOUNDS, { fullShiftAnimations: true });
    expect(blocked, 'default = base form = the blocking segment').toBeUndefined();
    expect(full?.id).toBe('full');
    expect(full!.cast).toBeCloseTo(SHIFT_FULL, 9);
  });
});

// ---------------------------------------------------------------------------
// The regression the whole design turns on.
// ---------------------------------------------------------------------------

describe('a power’s human and in-form variants share ONE recharge lane', () => {
  // A 4s-recharge attack that redirects into a Dwarf version. One ChainPower, two forms.
  const bolt = mk({
    id: 'BOLT', name: 'Bolt', cast: 1, baseRecharge: 4, damage: 10,
    castableModes: [null, 'DWARF'],
    forms: [{
      id: 'mode:DWARF', label: 'Dwarf Bolt', kind: 'mode',
      cast: 1, damage: 25, endCost: 1, dot: null, trigger: { type: 'mode', mode: 'DWARF' },
    }],
  });
  const toDwarf = mkSwitch('Dwarf', 'DWARF', [null]);
  const powers = [bolt, toDwarf];

  it('shifting form does NOT refresh the cooldown', () => {
    const acts = replayChain(powers, [0, 1, 0], 0, BOUNDS);
    expect(acts).toHaveLength(3);
    const bolts = acts.filter((a) => a.pi === 0).sort((a, b) => a.start - b.start);
    expect(bolts).toHaveLength(2);
    // Bolt@0 ends at 1; recharge starts at cast-END, so the lane reopens at 1 + 4 = 5.
    // The shift lands at [1, 1.264) and does nothing to that.
    expect(bolts[1].start, 'the second Bolt waits out the ONE shared cooldown').toBeCloseTo(5, 9);
    // …and it fires the Dwarf variant, which is the point of keeping them one power.
    expect(bolts[1].formId).toBe('mode:DWARF');
    expect(activationForm(powers, bolts[1])?.damage).toBe(25);
    expect(effectiveRecharge(powers[0], 0, BOUNDS), 'recharge is not form-specific').toBe(4);
  });

  it('the counter-factual: two ChainPowers would report ~2x the DPS', () => {
    // Modelling the redirect as its own ChainPower is the tempting shortcut, and this is what
    // it buys — a second lane that is ready immediately, so the "cooldown" is free.
    const shared = computeChain(powers, replayChain(powers, [0, 1, 0], 0, BOUNDS), 0, BOUNDS, null)!;
    const split = [
      mk({ id: 'BOLT', cast: 1, baseRecharge: 4, damage: 10 }),
      mk({ id: 'BOLT_DWARF', cast: 1, baseRecharge: 4, damage: 25 }),
      toDwarf,
    ];
    const splitR = computeChain(split, replayChain(split, [0, 2, 1], 0, BOUNDS), 0, BOUNDS, null)!;
    expect(splitR.dps / shared.dps, 'the split model inflates DPS').toBeGreaterThan(1.9);
    // The tell is the schedule, not just the number: the split fires the second cast the
    // instant the shift finishes.
    expect(splitR.cycleSec).toBeLessThan(shared.cycleSec);
  });

  // The same invariant read from the OTHER end. Every lane assertion above casts the
  // base (human) form first, and that ordering cannot distinguish a lane keyed on `pi`
  // from one keyed on `pi` + the form the cast fired in — the first cast carries no
  // `formId`, so a form-keyed lane still sees it and still holds the second cast back.
  // Open in the form instead and the two diverge: the first cast is the variant, and a
  // form-keyed lane would hand the following human cast a fresh cooldown. Mutating
  // `findSlot`'s filter to `a.pi === pi && !a.formId` passes every other test in this
  // file and fails only these two, which is what makes them worth their runtime.
  describe('read from the other end — in-form cast FIRST', () => {
    const toHuman = mkSwitch('Human', null, ['DWARF']);
    const both = [bolt, toDwarf, toHuman];

    it('an in-form cast holds the lane against a LATER human cast', () => {
      // shift → Bolt (Dwarf variant) → shift back → Bolt (human).
      const acts = replayChain(both, [1, 0, 2, 0], 0, BOUNDS);
      const bolts = acts.filter((a) => a.pi === 0).sort((a, b) => a.start - b.start);
      expect(bolts).toHaveLength(2);
      expect(bolts[0].formId, 'the FIRST cast is the variant').toBe('mode:DWARF');
      expect(bolts[1].formId, 'the second is human').toBeUndefined();
      expect(
        bolts[1].start,
        'the human cast waits out the cooldown the Dwarf cast started',
      ).toBeCloseTo(bolts[0].end + 4, 9);
    });

    it('and two in-form casts share it too', () => {
      const acts = replayChain(both, [1, 0, 0], 0, BOUNDS);
      const bolts = acts.filter((a) => a.pi === 0).sort((a, b) => a.start - b.start);
      expect(bolts).toHaveLength(2);
      expect(bolts.every((b) => b.formId === 'mode:DWARF')).toBe(true);
      expect(bolts[1].start).toBeCloseTo(bolts[0].end + 4, 9);
    });
  });
});

// ---------------------------------------------------------------------------
// Legality: detected, flagged, and NOT silently excised.
// ---------------------------------------------------------------------------

describe('illegal casts', () => {
  const toDwarf = mkSwitch('Dwarf', 'DWARF', [null]);
  const toHuman = mkSwitch('Human', null, ['DWARF']);
  const humanHit = mk({ id: 'H', cast: 1, baseRecharge: 0, damage: 10, castableModes: [null] });
  const dwarfHit = mk({ id: 'D', cast: 1, baseRecharge: 0, damage: 20, castableModes: ['DWARF'] });
  const untagged = mk({ id: 'U', cast: 1, baseRecharge: 0, damage: 5 });
  const powers = [humanHit, dwarfHit, toDwarf, toHuman, untagged];

  it('flags a form attack cast in the wrong form, and clears once the shift is inserted', () => {
    const bad = replayChain(powers, [0, 1, 1], 0, BOUNDS);
    const r = computeChain(powers, bad, 0, BOUNDS, null)!;
    expect(r.illegal.length, 'two Dwarf casts made while human').toBe(2);
    expect(r.illegal.map((x) => x.seq)).toEqual([1, 2]);
    expect(r.illegal.every((x) => x.form === null)).toBe(true);
    expect(r.illegal[0].reason).toContain('Human');

    const good = replayChain(powers, [0, 2, 1, 1], 0, BOUNDS);
    const ok = computeChain(powers, good, 0, BOUNDS, null)!;
    expect(ok.illegal, 'the same casts are legal once the shift precedes them').toEqual([]);
  });

  it('still returns the numbers — a half-built chain is not a blank readout', () => {
    const acts = replayChain(powers, [0, 1, 1], 0, BOUNDS);
    const r = computeChain(powers, acts, 0, BOUNDS, { maxEnd: 100, recoveryPerSec: 2, togglePerSec: 0 })!;
    expect(r.illegal).toHaveLength(2);
    expect(r.totalDamage, 'the flagged casts still count').toBe(10 + 20 + 20);
    expect(r.cycleSec).toBeGreaterThan(0);
    expect(r.dps).toBeGreaterThan(0);
    expect(r.endurance).not.toBeNull();
  });

  it('an untagged power is never illegal, in any form', () => {
    // Only a build that can shapeshift tags anything. Everything else — Judgement, every
    // power in every non-Kheldian build — must pass unconditionally.
    for (const startForm of [null, 'DWARF']) {
      const acts = replayChain(powers, [4, 4], 0, BOUNDS, { startForm });
      expect(computeChain(powers, acts, 0, BOUNDS, null, 'damage', { startForm })!.illegal).toEqual([]);
    }
  });

  it('flags shifting into the form already worn', () => {
    const acts = replayChain(powers, [2, 2], 0, BOUNDS);
    const r = computeChain(powers, acts, 0, BOUNDS, null)!;
    expect(r.illegal).toHaveLength(1);
    expect(r.illegal[0].seq).toBe(1);
    expect(r.illegal[0].reason).toContain('already the active form');
    // Nova → Dwarf in one click is legal, so only the destination form is excluded.
    expect(toDwarf.castableModes).not.toContain('DWARF');
  });

  it('respects startForm — the same sequence flips legality with the opening form', () => {
    const seq = [1, 1];
    const human = computeChain(powers, replayChain(powers, seq, 0, BOUNDS), 0, BOUNDS, null)!;
    const dwarf = computeChain(
      powers, replayChain(powers, seq, 0, BOUNDS, { startForm: 'DWARF' }),
      0, BOUNDS, null, 'damage', { startForm: 'DWARF' },
    )!;
    expect(human.illegal).toHaveLength(2);
    expect(dwarf.illegal).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Compactness must not be diluted by the shapeshifts between the attacks.
// ---------------------------------------------------------------------------

describe('compactness ignores switch steps', () => {
  const toDwarf = mkSwitch('Dwarf', 'DWARF', [null]);
  const toHuman = mkSwitch('Human', null, ['DWARF']);
  const humanHit = mk({ id: 'H', cast: 1, baseRecharge: 1, damage: 10, castableModes: [null] });
  const dwarfHit = mk({ id: 'D', cast: 1, baseRecharge: 1, damage: 20, castableModes: ['DWARF'] });
  const powers = [humanHit, dwarfHit, toDwarf, toHuman];

  it('a switch carries zero metric weight under every metric', () => {
    // This is the mechanism `computeChain`'s `if (w <= 0) continue` relies on. Verified
    // rather than assumed: if a switch ever gained a damage number the guard would stop
    // firing and the shapeshifts would start voting on the attacks' recharge utilization.
    for (const metric of ['damage', 'dpa', 'dps'] as const) {
      expect(powerMetricValue(toDwarf, metric, 0, BOUNDS), metric).toBe(0);
      expect(powerMetricValue(toHuman, metric, 0, BOUNDS), metric).toBe(0);
    }
  });

  it('the reported compactness equals the attacks-only computation over the same cycle', () => {
    const acts = replayChain(powers, [0, 2, 1, 1, 3, 0], 0, BOUNDS);
    const r = computeChain(powers, acts, 0, BOUNDS, null)!;
    expect(r.compactness).not.toBeNull();

    // Re-derive compactness by hand from the ATTACKS only, against computeChain's own
    // cycleSec. If a switch contributed weight the two would diverge.
    let wSum = 0;
    let wuSum = 0;
    let switchCasts = 0;
    let attackPowers = 0;
    for (const pi of new Set(acts.map((a) => a.pi))) {
      const casts = acts.filter((a) => a.pi === pi);
      if (powers[pi].type === 'switch') { switchCasts += casts.length; continue; }
      attackPowers++;
      const effRech = effectiveRecharge(powers[pi], 0, BOUNDS);
      let w = 0;
      let laneTime = 0;
      for (const a of casts) {
        const f = activationForm(powers, a);
        w += powerMetricValue(powers[pi], 'damage', 0, BOUNDS, f) / casts.length;
        laneTime += (f?.cast ?? powers[pi].cast) + effRech;
      }
      wSum += w;
      wuSum += w * Math.min(1, laneTime / r.cycleSec);
    }
    // Counts, so a structural zero cannot pass as agreement.
    expect(switchCasts, 'the probe scheduled switches').toBe(2);
    expect(attackPowers, 'and attacks on both sides of them').toBe(2);
    expect(wSum, 'the hand computation has weight').toBeGreaterThan(0);
    expect(Math.round((wuSum / wSum) * 100)).toBe(r.compactness);
  });

  it('negative control: a switch WITH damage would move it', () => {
    // The invariant above holds because a switch's metric weight is zero, not because
    // compactness special-cases the type. Give one damage and the equality must break —
    // otherwise the check above is grading air and would not notice a switch that started
    // carrying a number (a Kheldian shift deals none, but nothing structural forbids it).
    const seq = [0, 2, 1, 1, 3, 0];
    const clean = computeChain(powers, replayChain(powers, seq, 0, BOUNDS), 0, BOUNDS, null)!;
    const armed = [powers[0], powers[1], { ...toDwarf, damage: 50 }, powers[3]];
    const dirty = computeChain(armed, replayChain(armed, seq, 0, BOUNDS), 0, BOUNDS, null)!;
    expect(dirty.compactness).not.toBe(clean.compactness);
  });
});

// ---------------------------------------------------------------------------
// Reservation: never short, and never gratuitously long.
// ---------------------------------------------------------------------------

describe('reservedCast and mode forms', () => {
  // A power whose IN-FORM variant animates LONGER than its human one — the shape that made
  // Assassin's Strike overlap its neighbour when the packer reserved the base cast.
  const heavy = mk({
    id: 'HV', cast: 1, baseRecharge: 0, damage: 10, castableModes: [null, 'DWARF'],
    forms: [{
      id: 'mode:DWARF', label: 'Dwarf Heavy', kind: 'mode',
      cast: 3, damage: 30, endCost: 1, dot: null, trigger: { type: 'mode', mode: 'DWARF' },
    }],
  });
  const powers = [heavy];

  it('reserves exactly the animation the live form will play', () => {
    expect(reservedCast(powers, 0, { currentForm: null }), 'human').toBe(1);
    expect(reservedCast(powers, 0, { currentForm: 'DWARF' }), 'in form').toBe(3);
  });

  it('widens when the caller does not track the form at all', () => {
    // `undefined` is not human: the cast could still land in any form, and reserving the
    // base would under-reserve exactly as the from-Hide bug did.
    expect(reservedCast(powers, 0, {})).toBe(3);
  });

  it('does not over-reserve on the scheduling path', () => {
    // replayChain settles the form before findSlot runs, so a human-form cast still fits a
    // 1s hole. Blanket widening would push it past a gap its animation does fit.
    const filler = mk({ id: 'F', cast: 1, baseRecharge: 2, damage: 1 });
    const roster = [heavy, filler];
    const acts = replayChain(roster, [1, 1, 0], 0, BOUNDS); // F@0-1, F@3-4, then Heavy
    const hv = acts.find((a) => a.pi === 0)!;
    expect(hv.start, 'human Heavy slots into the [1,3) hole').toBeCloseTo(1, 9);
    expect(hv.end - hv.start).toBeCloseTo(1, 9);
  });

  it('no two casts animate at once, in either shift assumption', () => {
    const toDwarf = mkSwitch('Dwarf', 'DWARF', [null]);
    const roster = [heavy, toDwarf, mk({ id: 'F', cast: 1, baseRecharge: 2, damage: 1 })];
    for (const ctx of [{}, { fullShiftAnimations: true }]) {
      const acts = replayChain(roster, [2, 2, 1, 0, 0], 0, BOUNDS, ctx);
      const sorted = [...acts].sort((a, b) => a.start - b.start);
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].start, `${JSON.stringify(ctx)} cast ${i}`)
          .toBeGreaterThanOrEqual(sorted[i - 1].end - 1e-9);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// The palette and the timeline must not drift apart about the live form.
// ---------------------------------------------------------------------------

describe('nextPickContext replays the same form walk as replayChain', () => {
  const toDwarf = mkSwitch('Dwarf', 'DWARF', [null]);
  const toHuman = mkSwitch('Human', null, ['DWARF']);
  const bolt = mk({
    id: 'BOLT', cast: 1, baseRecharge: 4, damage: 10, castableModes: [null, 'DWARF'],
    forms: [{
      id: 'mode:DWARF', label: 'Dwarf Bolt', kind: 'mode',
      cast: 1.5, damage: 25, endCost: 1, dot: null, trigger: { type: 'mode', mode: 'DWARF' },
    }],
  });
  const dwarfHit = mk({ id: 'D', cast: 1, baseRecharge: 2, damage: 20, castableModes: ['DWARF'] });
  const powers = [bolt, dwarfHit, toDwarf, toHuman];

  const sequences = [
    [], [2], [2, 0], [2, 1], [2, 1, 3], [0, 2, 0], [2, 3, 2], [2, 1, 3, 0], [3], [0, 0],
  ];

  it('advertises the form the pick will actually fire in, across every sequence', () => {
    let checked = 0;
    let modeForms = 0;
    for (const formCtx of [{}, { startForm: 'DWARF' }, { fullShiftAnimations: true }]) {
      for (const seq of sequences) {
        const acts = replayChain(powers, seq, 0, BOUNDS, formCtx);
        for (let pi = 0; pi < powers.length; pi++) {
          const predicted = nextPickForm(powers, seq, acts, pi, 0, BOUNDS, formCtx);
          const scheduled = replayChain(powers, [...seq, pi], 0, BOUNDS, formCtx)
            .find((a) => a.seq === seq.length)!;
          expect(
            scheduled.formId,
            `ctx ${JSON.stringify(formCtx)} seq [${seq}] then pi ${pi} (${powers[pi].id})`,
          ).toBe(predicted?.id);
          if (predicted?.trigger.type === 'mode') modeForms++;
          checked++;
        }
      }
    }
    expect(checked, 'the sweep must actually run').toBe(3 * sequences.length * powers.length);
    expect(modeForms, 'and it must reach the mode branch, not just the base form')
      .toBeGreaterThan(0);
  });

  it('carries the live form out in the context it returns', () => {
    expect(nextPickContext(powers, []).currentForm).toBeNull();
    expect(nextPickContext(powers, [2]).currentForm).toBe('DWARF');
    expect(nextPickContext(powers, [2, 3]).currentForm).toBeNull();
    expect(nextPickContext(powers, [], [], { startForm: 'DWARF' }).currentForm).toBe('DWARF');
    // …and displayForm reads it, which is what makes a chip show the in-form numbers.
    expect(displayForm(powers, 0, nextPickContext(powers, [2]))?.damage).toBe(25);
    expect(displayForm(powers, 0, nextPickContext(powers, []))).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// End to end, on the real Warshade the feature was asked for.
// ---------------------------------------------------------------------------

describe('Warshade — the motivating cross-form rotation', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  }, 120000);

  function pick(powersetId: string, names: string[], granting?: string[]): SelectedPower[] {
    const powerset = getPowerset(powersetId);
    expect(powerset, `${powersetId} resolves`).toBeDefined();
    const picked: SelectedPower[] = [];
    const take = (name: string, parent?: string) => {
      const def = powerset!.powers.find((p) => p.internalName === name);
      expect(def, `${name} is in ${powersetId}`).toBeDefined();
      picked.push({
        ...def!, powerSet: powersetId, level: 1, slots: [], isActive: true,
        ...(parent ? { isAutoGranted: true, grantedByPower: parent } : {}),
      } as SelectedPower);
    };
    for (const name of names) take(name);
    for (const parent of granting ?? []) {
      for (const grant of GRANTED_POWER_GROUPS[parent].grantedPowers) take(grant, parent);
    }
    return picked;
  }

  function warshadeBuild(): Build {
    const build = createEmptyBuild();
    build.level = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    build.archetype = { id: 'warshade', name: 'Warshade', stats: null, inherent: null } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    build.primary = {
      id: 'warshade/umbral-blast', name: 'Umbral Blast',
      powers: pick(
        'warshade/umbral-blast',
        ['Shadow_Bolt', 'Ebon_Eye', 'Gravity_Well', 'Essence_Drain', 'Dark_Nova'],
        ['Dark_Nova'],
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    build.secondary = {
      id: 'warshade/umbral-aura', name: 'Umbral Aura',
      powers: pick('warshade/umbral-aura', ['Black_Dwarf'], ['Black_Dwarf']),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    return build;
  }

  const chain = (build: Build) => buildChainPowers(
    build,
    calculateCharacterTotals(build, false, createDefaultIncarnateActiveState(), {}).globalBonuses,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { archetypeId: 'warshade' } as any,
  );
  const idx = (powers: ChainPower[], id: string) => {
    const i = powers.findIndex((p) => p.id === id);
    expect(i, `${id} is in the roster`).toBeGreaterThanOrEqual(0);
    return i;
  };

  it('offers one switch per form plus a way back to human, priced from the toggle', () => {
    const build = warshadeBuild();
    const modes = buildFormModes(build);
    expect(modes).toHaveLength(2);
    const switches = buildFormSwitchPowers(build);
    expect(switches).toHaveLength(3);
    expect(switches.map((p) => p.id).sort()).toEqual(
      [...modes.map((m) => `switch:${m}`), 'switch:human'].sort(),
    );
    for (const s of switches) {
      expect(s.type).toBe('switch');
      expect(s.damage).toBe(0);
      expect(s.cast).toBeCloseTo(SHIFT_BLOCK, 9);
      expect(s.forms?.[0].cast).toBeCloseTo(SHIFT_FULL, 9);
    }
    // Read from the toggle, not invented: the Kheldian form toggles carry recharge_time 1.0
    // and endurance_cost 0.13, which is a real 1s floor on how fast you can re-shift.
    const intoDwarf = switches.find((p) => p.id === `switch:${modes[1]}`)!;
    expect(intoDwarf.name, 'named after the toggle that enters it').toBe('Black Dwarf');
    expect(intoDwarf.baseRecharge).toBe(1);
    expect(intoDwarf.endCost).toBeCloseTo(0.13, 6);
    // Dropping a form is a detoggle: free, and on no cooldown of its own.
    const toHuman = switches.find((p) => p.id === 'switch:human')!;
    expect(toHuman.baseRecharge).toBe(0);
    expect(toHuman.endCost).toBe(0);
  });

  it('schedules Gravity Well → Essence Drain → shift → Dwarf Drain → Dwarf Smite → human', () => {
    const build = warshadeBuild();
    const powers = chain(build);
    const dwarfMode = buildFormModes(build).find((m) => m.includes('Tanker'))!;
    const seq = [
      idx(powers, 'pri:Gravity_Well'),
      idx(powers, 'pri:Essence_Drain'),
      idx(powers, `switch:${dwarfMode}`),
      idx(powers, 'sec:Black_Dwarf_Drain'),
      idx(powers, 'sec:Black_Dwarf_Smite'),
      idx(powers, 'switch:human'),
    ];
    const acts = replayChain(powers, seq, 0, BOUNDS);
    const r = computeChain(powers, acts, 0, BOUNDS, null)!;

    expect(acts, 'every step scheduled').toHaveLength(seq.length);
    expect(r.illegal, 'the whole rotation is legal').toEqual([]);
    expect(r.totalDamage).toBeGreaterThan(0);
    // The form walk the rotation describes, in order.
    expect(casterFormTimeline(powers, acts, null).map((w) => w.form))
      .toEqual([null, null, null, dwarfMode, dwarfMode, dwarfMode]);
    // The two human openers are human-ONLY, and the two Dwarf attacks Dwarf-only — this
    // rotation is not reachable without the shift, which is the feature.
    expect(powers[seq[0]].castableModes).toEqual([null]);
    expect(powers[seq[3]].castableModes).toEqual([dwarfMode]);
  });

  it('without the shift, both Dwarf casts are flagged and the numbers still come back', () => {
    const build = warshadeBuild();
    const powers = chain(build);
    const seq = [
      idx(powers, 'pri:Gravity_Well'),
      idx(powers, 'pri:Essence_Drain'),
      idx(powers, 'sec:Black_Dwarf_Drain'),
      idx(powers, 'sec:Black_Dwarf_Smite'),
    ];
    const r = computeChain(powers, replayChain(powers, seq, 0, BOUNDS), 0, BOUNDS, null)!;
    // Counts, printed: a zero here would mean the walk found nothing to check.
    // eslint-disable-next-line no-console
    console.log(`[cross-form] casts=${seq.length} illegal=${r.illegal.length} ` +
      `tagged=${powers.filter((p) => p.castableModes).length}/${powers.length}`);
    expect(powers.filter((p) => p.castableModes).length, 'the roster is tagged').toBe(powers.length);
    expect(r.illegal).toHaveLength(2);
    expect(r.illegal.map((x) => x.seq)).toEqual([2, 3]);
    expect(r.illegal[0].reason).toContain('Black Dwarf Drain');
    expect(r.totalDamage).toBeGreaterThan(0);
    expect(r.dps).toBeGreaterThan(0);
  });

  it('one id per power, and it is the UNREDIRECTED name', () => {
    // A union roster must not emit a power twice, and an id must not move with the caster's
    // form: the redirect renames Ebon Eye to Nova_Ebon_Eye, which as an id would be a second
    // palette entry, a second saved-chain key, and a second recharge lane for one tray slot.
    // `<bucket>:<internalName>` is also the shape saved chains are persisted in.
    const powers = chain(warshadeBuild());
    const ids = powers.map((p) => p.id);
    expect(new Set(ids).size, 'no duplicate ids in the union').toBe(ids.length);
    expect(ids).toContain('pri:Ebon_Eye');
    expect(ids.filter((id) => /Nova_Ebon_Eye|Dwarf_Shadow_Bolt/.test(id)), 'no redirect ids')
      .toEqual([]);
    for (const p of powers) {
      expect(p.id, `${p.id} keeps the bucket:internalName shape`).toMatch(/^[a-z0-9]+:.+/);
    }
  });

  it('Ebon Eye keeps one cooldown lane across the shift into Nova', () => {
    // The real instance of the split-lane regression: Ebon Eye is castable in human AND Nova
    // (where it redirects to the Nova version), so it is one ChainPower with a `mode` form.
    const build = warshadeBuild();
    const powers = chain(build);
    const novaMode = buildFormModes(build).find((m) => m.includes('Blaster'))!;
    const ee = idx(powers, 'pri:Ebon_Eye');
    expect(powers[ee].castableModes).toEqual([null, novaMode]);
    expect(powers.filter((p) => p.id === 'pri:Ebon_Eye'), 'one entry, not two').toHaveLength(1);
    const novaForm = powers[ee].forms?.find((f) => f.trigger.type === 'mode');
    expect(novaForm, 'the Nova redirect rides as a sibling form').toBeDefined();
    expect(novaForm!.damage, 'with the Nova numbers').not.toBeCloseTo(powers[ee].damage, 6);

    const acts = replayChain(powers, [ee, idx(powers, `switch:${novaMode}`), ee], 0, BOUNDS);
    const casts = acts.filter((a) => a.pi === ee).sort((a, b) => a.start - b.start);
    expect(casts).toHaveLength(2);
    const rech = effectiveRecharge(powers[ee], 0, BOUNDS);
    expect(casts[1].start, 'the shift does not refresh the lane')
      .toBeCloseTo(casts[0].end + rech, 9);
    expect(casts[1].formId).toBe(`mode:${novaMode}`);
    // And well after the shift finished — i.e. it really did wait.
    const shift = acts.find((a) => a.pi !== ee)!;
    expect(casts[1].start).toBeGreaterThan(shift.end + 1);
  });

  /**
   * What the shift assumption actually costs the motivating rotation — and WHICH number it
   * shows up in, which is not the same answer twice.
   *
   * This replaced a version that ran the rotation at one recharge level and asserted only
   * `full.cycleSec > block.cycleSec` / `full.dps < block.dps`. Those passed on 8.9e-16s and
   * -3.6e-15 — one ULP of float noise — because the rotation it probed is RECHARGE-bound: the
   * extra 3.96s of animation dropped straight into dead time the loop already had, and the
   * cycle did not move at all. The direction of a crumb decided the verdict, and a mutant that
   * changed SHAPESHIFT_FULL_ANIM to 0.30 "killed" it by flipping the crumb the other way
   * (`expected 7.715999999999999 to be greater than 7.716`). A gate whose red/green is the last
   * bit of a double is grading air (GAME-DATA-PRINCIPLES §14), so it now measures the magnitude
   * — in both regimes, because the regime is what decides where the cost lands.
   */
  it('the full-shift assumption costs exactly n × (full − blocking), in whichever number is free to move', () => {
    const build = warshadeBuild();
    const powers = chain(build);
    const dwarfMode = buildFormModes(build).find((m) => m.includes('Tanker'))!;
    const seq = [
      idx(powers, 'pri:Gravity_Well'),
      idx(powers, 'pri:Essence_Drain'),
      idx(powers, `switch:${dwarfMode}`),
      idx(powers, 'sec:Black_Dwarf_Drain'),
      idx(powers, 'sec:Black_Dwarf_Smite'),
      idx(powers, 'switch:human'),
    ];
    const n = seq.filter((pi) => powers[pi].type === 'switch').length;
    const extra = n * (SHIFT_FULL - SHIFT_BLOCK);
    const run = (globalRech: number, fullShiftAnimations: boolean) => {
      const ctx = { fullShiftAnimations };
      return computeChain(
        powers, replayChain(powers, seq, globalRech, BOUNDS, ctx),
        globalRech, BOUNDS, null, 'damage', ctx,
      )!;
    };

    // Counts first, so neither half can pass against an empty probe.
    expect(n, 'the rotation must actually shift, twice').toBe(2);
    expect(extra).toBeCloseTo(2 * (2.244 - 0.264), 9);

    // ── PACKED-BOUND (+250% global recharge): every power is ready the moment the animation
    // lane frees up, so there is no dead time for the extra animation to hide in and the whole
    // of it lands on the cycle. This is the regime the "full shift" marker on Cycle/DPS assumes.
    const pBlock = run(250, false);
    const pFull = run(250, true);
    expect(pBlock.deadTime, 'the packed probe really is packed').toBeCloseTo(0, 9);
    expect(pFull.cycleSec - pBlock.cycleSec, 'the whole extra animation lands on the cycle')
      .toBeCloseTo(extra, 9);
    expect(pFull.totalDamage, 'the attacks are untouched').toBeCloseTo(pBlock.totalDamage, 9);
    expect(pFull.dps, 'so DPS falls by the cycle it was divided by').toBeCloseTo(
      pBlock.totalDamage / (pBlock.cycleSec + extra), 9,
    );
    // A real margin, not a crumb: ~31% of the reported DPS on this rotation.
    expect(pBlock.dps - pFull.dps).toBeGreaterThan(1);

    // ── RECHARGE-BOUND (no global recharge): Gravity Well's cooldown sets the cycle, so the
    // extra animation is absorbed by dead time the loop already had. Cycle, damage and DPS are
    // IDENTICAL — bit for bit, which is what the old assertions were unknowingly measuring —
    // and the only thing the assumption moves is how much of the loop is idle. Pinned because
    // it is the common case at ordinary slotting, and because the surface's "full shift" marker
    // sits on Cycle and DPS, which here do not move at all.
    const rBlock = run(0, false);
    const rFull = run(0, true);
    expect(rBlock.deadTime, 'the recharge-bound probe has idle time to absorb the shift')
      .toBeGreaterThan(extra);
    expect(rFull.cycleSec - rBlock.cycleSec, 'the cycle does not move').toBeCloseTo(0, 9);
    expect(rFull.dps, 'and neither does DPS').toBeCloseTo(rBlock.dps, 9);
    expect(rFull.totalDamage).toBeCloseTo(rBlock.totalDamage, 9);
    expect(rBlock.deadTime - rFull.deadTime, 'the extra animation comes out of the idle time')
      .toBeCloseTo(extra, 9);
    // …which reads as the rotation getting MORE efficient the more honestly it is priced.
    // Efficiency counts a shift as busy (correctly — the lane is occupied), so charging the
    // uncancelled animation improves the score while the damage is unchanged.
    expect(rFull.efficiency).toBeGreaterThan(rBlock.efficiency);

    expect(pFull.illegal).toEqual([]);
    expect(rFull.illegal).toEqual([]);
    // eslint-disable-next-line no-console
    console.log(
      `[cross-form] shift cost n=${n} extra=${extra.toFixed(3)}s | ` +
      `packed +250%: cycle ${pBlock.cycleSec.toFixed(3)}→${pFull.cycleSec.toFixed(3)} ` +
      `dps ${pBlock.dps.toFixed(2)}→${pFull.dps.toFixed(2)} | ` +
      `recharge-bound +0%: cycle ${rBlock.cycleSec.toFixed(3)}→${rFull.cycleSec.toFixed(3)} ` +
      `dps ${rBlock.dps.toFixed(2)}→${rFull.dps.toFixed(2)} ` +
      `eff ${rBlock.efficiency}→${rFull.efficiency}`,
    );
  });
});
