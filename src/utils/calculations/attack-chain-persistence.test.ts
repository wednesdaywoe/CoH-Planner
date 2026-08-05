import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { sequenceToIds, idsToSequence } from './attack-chain-powers';
import { slimBuild, hydrateBuild } from '@/utils/build-serialization';
import { createEmptyBuild } from '@/types/build';
import type { AttackChain } from '@/types';
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

/**
 * A chain must remember the caster form it was built in.
 *
 * Kheldian form attacks are auto-granted by the form toggle and castable ONLY
 * inside that form, so the candidate roster a chain's ids resolve against is
 * per-form — `buildChainPowers` is passed a `formMode` and returns a different
 * list for each. `AttackChain` carried no form, and the modal's `formMode`
 * defaults to null (human) on open, so reopening a Nova chain resolved its ids
 * against the human roster, `idsToSequence` dropped the ones it could not find,
 * and Save then wrote the shortened list back over the saved chain. That is
 * silent, permanent data loss on a plain load-then-save.
 */
describe('a chain remembers its caster form', () => {
  // hydrateBuild rebuilds the inherent powers, which needs a live dataset.
  beforeAll(async () => {
    await loadDataset('homecoming');
  }, 120000);

  // The two rosters a Peacebringer chain can be built against. Disjoint by
  // construction, which is exactly the game's rule and exactly the hazard.
  const human = [mk('pri:Gleaming_Bolt'), mk('pri:Radiant_Strike')];
  const nova = [mk('pri:Bright_Nova_Blast'), mk('pri:Bright_Nova_Bolt')];

  it('the wrong form resolves NONE of a chain’s ids — the loss this field prevents', () => {
    const saved = sequenceToIds(nova, [0, 1, 0]);
    expect(saved).toEqual(['pri:Bright_Nova_Blast', 'pri:Bright_Nova_Bolt', 'pri:Bright_Nova_Blast']);
    // Reopened in the form it was built in: intact.
    expect(idsToSequence(nova, saved)).toEqual([0, 1, 0]);
    // Reopened in human form: everything gone. Saving over that is the bug.
    expect(idsToSequence(human, saved)).toEqual([]);
  });

  it('round-trips startForm through the build serialization both ways', () => {
    const chain: AttackChain = {
      id: 'chain-1',
      name: 'Nova Rotation',
      powers: sequenceToIds(nova, [0, 1, 0]),
      startForm: 'Bright_Nova',
    };
    const build = createEmptyBuild();
    build.attackChains = [chain];

    const restored = hydrateBuild(JSON.parse(JSON.stringify(slimBuild(build))));
    expect(restored.attackChains).toHaveLength(1);
    expect(restored.attackChains![0]).toEqual(chain);
    // The id format is the load-bearing part of the payload — `<bucket>:<internalName>`.
    expect(restored.attackChains![0].powers).toEqual([
      'pri:Bright_Nova_Blast', 'pri:Bright_Nova_Bolt', 'pri:Bright_Nova_Blast',
    ]);
    // …and it restores into the form it names, which is what makes the ids resolve.
    expect(idsToSequence(nova, restored.attackChains![0].powers)).toEqual([0, 1, 0]);
  });

  it('a human-form chain round-trips with an explicit null rather than a dropped field', () => {
    // Human form is null, not undefined-meaning-unknown: a chain saved before
    // this field existed is `undefined` and reads as human by the `?? null`
    // default, which is right — every pre-existing chain WAS built in human form
    // (the form selector could not save one). New human chains say so explicitly.
    const chain: AttackChain = {
      id: 'chain-2', name: 'Human', powers: sequenceToIds(human, [0, 1]), startForm: null,
    };
    const build = createEmptyBuild();
    build.attackChains = [chain];
    const restored = hydrateBuild(JSON.parse(JSON.stringify(slimBuild(build))));
    expect(restored.attackChains![0].startForm).toBeNull();

    const legacy = { id: 'chain-3', name: 'Legacy', powers: ['pri:Gleaming_Bolt'] } as AttackChain;
    expect(legacy.startForm ?? null).toBeNull();
  });

  it('survives a build with no chains at all', () => {
    const restored = hydrateBuild(JSON.parse(JSON.stringify(slimBuild(createEmptyBuild()))));
    expect(restored.attackChains ?? []).toEqual([]);
  });
});
