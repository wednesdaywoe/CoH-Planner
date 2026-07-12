import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { expectedDotTicks, calculatePowerDamage } from './damage';
import { ChainDoT, chainDotTickProbability } from './attack-chain';
import { Flares } from '@/data/datasets/homecoming/generated/powersets/blaster/primary/fire-blast/flares';

beforeAll(async () => {
  await loadDataset('homecoming');
});

/**
 * Chance-gated / cancel-on-miss DoTs.
 *
 * Many CoH DoTs roll a per-tick chance rather than applying every tick, and the
 * binary's CancelOnMiss flag ends the chain on the first miss — so tick k only
 * fires if all prior ticks landed (probability chance^k). The planner used to
 * drop `tick_chance` in the converter and sum every tick at 100%, overstating
 * every such DoT by ~20-25%. Flares was the reported case:
 *
 *   direct 0.71·base + DoT 0.15·base × Σ_{k=1..4} 0.8^k
 *   ticks weighted: 0.8 + 0.64 + 0.512 + 0.4096 = 2.3616  (not 4)
 *
 * which reconciles to the in-game tooltip total (66.58) to the penny. These lock
 * the fix against a regen or calc change silently reverting to flat-tick sums.
 */
describe('expectedDotTicks — probability-weighted tick count', () => {
  it('cancel-on-miss uses the geometric partial sum Σ chance^k', () => {
    // Flares: 4 ticks @ 80%, cancel-on-miss.
    expect(expectedDotTicks(4, 0.8, true)).toBeCloseTo(2.3616, 4);
  });

  it('independent (non-cancel) chance is a flat n·chance', () => {
    expect(expectedDotTicks(4, 0.8, false)).toBeCloseTo(3.2, 4);
  });

  it('an unconditional DoT (chance ≥ 1 or absent) is unchanged', () => {
    expect(expectedDotTicks(4, 1, true)).toBe(4);
    expect(expectedDotTicks(4, undefined, undefined)).toBe(4);
    expect(expectedDotTicks(11, undefined, false)).toBe(11);
  });

  it('a degenerate chance ≤ 0 does not divide by zero', () => {
    expect(expectedDotTicks(4, 0, true)).toBe(4);
  });
});

describe('chainDotTickProbability — per-tick landing chance on the timeline', () => {
  const com: ChainDoT = { ticks: 4, period: 1, perTick: 9.38, chance: 0.8, cancelOnMiss: true };
  const indep: ChainDoT = { ticks: 4, period: 1, perTick: 9.38, chance: 0.8 };
  const always: ChainDoT = { ticks: 4, period: 1, perTick: 9.38 };

  it('cancel-on-miss decays geometrically (chance^t)', () => {
    expect(chainDotTickProbability(com, 1)).toBeCloseTo(0.8, 6);
    expect(chainDotTickProbability(com, 2)).toBeCloseTo(0.64, 6);
    expect(chainDotTickProbability(com, 4)).toBeCloseTo(0.4096, 6);
  });

  it('independent chance is flat per tick', () => {
    expect(chainDotTickProbability(indep, 1)).toBeCloseTo(0.8, 6);
    expect(chainDotTickProbability(indep, 4)).toBeCloseTo(0.8, 6);
  });

  it('unconditional ticks always land', () => {
    expect(chainDotTickProbability(always, 3)).toBe(1);
  });

  it('summing per-tick probabilities equals expectedDotTicks', () => {
    let s = 0;
    for (let t = 1; t <= com.ticks; t++) s += chainDotTickProbability(com, t);
    expect(s).toBeCloseTo(expectedDotTicks(com.ticks, com.chance, com.cancelOnMiss), 6);
  });
});

describe('Flares — converter carries the DoT chance, calc weights the ticks', () => {
  it('the generated DoT damage entry keeps chance 0.8 + cancelOnMiss', () => {
    const dot = (Flares.damage as Array<{ duration?: number; chance?: number; cancelOnMiss?: boolean }>)
      .find((d) => d.duration);
    expect(dot?.chance).toBeCloseTo(0.8, 3);
    expect(dot?.cancelOnMiss).toBe(true);
  });

  it('calculatePowerDamage exposes effectiveTicks ≈ 2.3616 (not the nominal 4)', () => {
    const res = calculatePowerDamage(Flares, { level: 50, archetypeId: 'blaster', primaryName: 'Fire Blast', primaryCategory: 'blaster_ranged' });
    expect(res?.dotDamage).toBeDefined();
    expect(res!.dotDamage!.ticks).toBe(4);
    expect(res!.dotDamage!.chance).toBeCloseTo(0.8, 3);
    expect(res!.dotDamage!.cancelOnMiss).toBe(true);
    expect(res!.dotDamage!.effectiveTicks).toBeCloseTo(2.3616, 4);
  });

  it('the DoT total is the cancel-on-miss average, ~63% of the naive 4-tick sum', () => {
    const res = calculatePowerDamage(Flares, { level: 50, archetypeId: 'blaster', primaryName: 'Fire Blast', primaryCategory: 'blaster_ranged' })!;
    const perTick = res.dotDamage!.base;
    const weighted = perTick * res.dotDamage!.effectiveTicks;
    const naive = perTick * res.dotDamage!.ticks;
    expect(weighted / naive).toBeCloseTo(2.3616 / 4, 4);
    // Direct + weighted DoT is well below direct + all-4-ticks.
    expect(res.base + weighted).toBeLessThan(res.base + naive);
  });
});
