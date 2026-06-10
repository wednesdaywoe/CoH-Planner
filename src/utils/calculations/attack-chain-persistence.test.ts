import { describe, it, expect } from 'vitest';
import { sequenceToIds, idsToSequence } from './attack-chain-powers';
import type { ChainPower } from './attack-chain';

const mk = (id: string): ChainPower => ({
  id,
  name: id,
  type: 'attack',
  cast: 1,
  baseRecharge: 1,
  rechargeEnh: 0,
  endCost: 1,
  damage: 1,
  dot: null,
});

const powers = [mk('pri:Smite'), mk('sec:Build_Up'), mk('pool0:Boxing')];

describe('saved-chain conversion', () => {
  it('round-trips a sequence through ids and back', () => {
    const seq = [0, 2, 0, 1];
    const ids = sequenceToIds(powers, seq);
    expect(ids).toEqual(['pri:Smite', 'pool0:Boxing', 'pri:Smite', 'sec:Build_Up']);
    expect(idsToSequence(powers, ids)).toEqual(seq);
  });

  it('drops ids whose power is no longer in the build', () => {
    const ids = ['pri:Smite', 'epic:Long_Gone', 'sec:Build_Up'];
    expect(idsToSequence(powers, ids)).toEqual([0, 1]); // missing one skipped, order kept
  });

  it('falls back to internalName when the bucket prefix changed (pool reshuffle)', () => {
    // Saved as pool0:Boxing, but Boxing now sits in pool1 — still resolves.
    const moved = [mk('pri:Smite'), mk('pool1:Boxing')];
    expect(idsToSequence(moved, ['pool0:Boxing'])).toEqual([1]);
  });

  it('sequenceToIds skips out-of-range indices defensively', () => {
    expect(sequenceToIds(powers, [0, 99, 2])).toEqual(['pri:Smite', 'pool0:Boxing']);
  });

  it('empty in, empty out', () => {
    expect(sequenceToIds(powers, [])).toEqual([]);
    expect(idsToSequence(powers, [])).toEqual([]);
  });
});
