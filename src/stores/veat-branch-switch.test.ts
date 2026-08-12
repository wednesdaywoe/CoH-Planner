// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { loadDataset, getAllDatasetMetadata } from '@/data/dataset';
import { ARCHETYPES, getPowerset } from '@/data';
import { useBuildStore } from '@/stores/buildStore';
import { useUIStore } from '@/stores/uiStore';
import { useHistoryStore } from '@/stores/historyStore';
import { undoBuild } from '@/utils/undo-redo';
import { branchSetIds } from '@/utils/branch-powers';
import type { ArchetypeBranchId, SelectedPower } from '@/types';

/**
 * A VEAT buys into exactly one branch at level 24. The planner offered the switch and kept the
 * old branch's picks: they stayed in the build, stayed in every total, and stayed unreachable
 * from the picker that no longer listed their set — a Bane Spider's Shatter permanently stapled
 * to a Crab Spider.
 *
 * Ownership is read off `SelectedPower.powerSet`, which is what makes the strip precise. The
 * last two tests grade that premise across all three forks rather than trusting it: branch sets
 * must not be shared, and power names must not collide inside one archetype (slotOrder and proc
 * overrides are keyed by NAME, so a collision would let a base power's slots go with the branch).
 */

const SOLDIER = 'arachnos-soldier';

function pickFrom(setId: string, count: number, category: 'primary' | 'secondary'): string[] {
  const set = getPowerset(setId);
  if (!set) throw new Error(`missing powerset ${setId}`);
  const store = useBuildStore.getState();
  const taken = set.powers.slice(0, count);
  for (const power of taken) {
    store.addPower(category, { ...power, powerSet: setId, level: 24, slots: [null] } as SelectedPower);
  }
  return taken.map((p) => p.internalName);
}

/** A level-50 Crab Spider holding base picks, branch picks, and an extra slot on a branch pick. */
function crabBuild(): { base: string[]; branch: string[] } {
  const store = useBuildStore.getState();
  store.resetBuild();
  store.setArchetype(SOLDIER);
  store.setLevel(50);
  const base = [
    ...pickFrom(`${SOLDIER}/arachnos-soldier`, 2, 'primary'),
    ...pickFrom(`${SOLDIER}/training-and-gadgets`, 2, 'secondary'),
  ];
  const branch = [
    ...pickFrom(`${SOLDIER}/crab-spider-soldier`, 2, 'primary'),
    ...pickFrom(`${SOLDIER}/crab-spider-training`, 1, 'secondary'),
  ];
  useUIStore.getState().setSelectedBranch('crab-spider');
  useBuildStore.getState().addSlot(branch[0], 'primary');
  useHistoryStore.setState({ past: [], future: [] });
  return { base, branch };
}

const heldNames = () => {
  const b = useBuildStore.getState().build;
  return [...b.primary.powers, ...b.secondary.powers].map((p) => p.internalName);
};

beforeAll(async () => {
  await loadDataset('homecoming');
}, 60_000);

beforeEach(() => {
  useUIStore.getState().setSelectedBranch(null);
});

describe('switching a VEAT branch', () => {
  it('drops the outgoing branch picks and keeps the base ones', () => {
    const { base, branch } = crabBuild();
    expect(heldNames()).toEqual(expect.arrayContaining(branch));

    const removed = useBuildStore.getState().switchBranch('bane-spider');

    expect(removed).toHaveLength(branch.length);
    expect(heldNames().sort()).toEqual(base.sort());
    expect(useUIStore.getState().selectedBranch).toBe('bane-spider');
  });

  it('takes the dropped picks out of slotOrder', () => {
    const { branch } = crabBuild();
    expect(useBuildStore.getState().build.slotOrder.map((e) => e.powerName))
      .toEqual(expect.arrayContaining([branch[0]]));

    useBuildStore.getState().switchBranch('bane-spider');

    const stranded = useBuildStore.getState().build.slotOrder
      .filter((e) => branch.includes(e.powerName));
    expect(stranded).toEqual([]);
  });

  it('is undoable, and undo puts the branch picker back', () => {
    const { branch } = crabBuild();
    useBuildStore.getState().switchBranch('bane-spider');

    undoBuild();

    expect(heldNames()).toEqual(expect.arrayContaining(branch));
    // `_restoreBuild` re-derives the branch from the restored powers, so the picker follows.
    expect(useUIStore.getState().selectedBranch).toBe('crab-spider');
  });

  it('leaving the branch entirely also takes its picks', () => {
    const { base, branch } = crabBuild();

    const removed = useBuildStore.getState().switchBranch(null);

    expect(removed).toHaveLength(branch.length);
    expect(heldNames().sort()).toEqual(base.sort());
    expect(useUIStore.getState().selectedBranch).toBeNull();
  });

  it('re-selecting the branch you already hold changes nothing', () => {
    const { base, branch } = crabBuild();

    const removed = useBuildStore.getState().switchBranch('crab-spider');

    expect(removed).toEqual([]);
    expect(heldNames().sort()).toEqual([...base, ...branch].sort());
    expect(useHistoryStore.getState().past).toEqual([]);
  });

  it('leaves the build alone when the raw setter is used', () => {
    // Import, rehydrate and undo all FOLLOW the build — they set the picker to match powers
    // that are already there. Stripping on that path would delete the build being loaded.
    const { base, branch } = crabBuild();

    useUIStore.getState().setSelectedBranch('bane-spider');

    expect(heldNames().sort()).toEqual([...base, ...branch].sort());
  });
});

describe('the data ownership rests on', () => {
  const forks = getAllDatasetMetadata().map((m) => m.id);

  for (const fork of forks) {
    it(`gives every ${fork} branch its own powersets`, async () => {
      await loadDataset(fork);
      let graded = 0;
      for (const [atId, at] of Object.entries(ARCHETYPES)) {
        if (!at.branches) continue;
        graded++;
        const claims = new Map<string, string>();
        for (const setId of [...at.primarySets, ...at.secondarySets]) claims.set(setId, 'base');
        for (const branchId of Object.keys(at.branches)) {
          for (const setId of branchSetIds(at, branchId as ArchetypeBranchId)) {
            const prior = claims.get(setId);
            expect(prior, `${atId}: ${setId} claimed by both ${prior} and ${branchId}`).toBeUndefined();
            claims.set(setId, branchId);
          }
        }
      }
      // Both sweeps are "nothing collides", which an empty sweep also satisfies. Every fork
      // ships the two Arachnos ATs, so a zero here is a rename, not a roster change.
      expect(graded).toBeGreaterThan(0);
    }, 60_000);

    it(`keeps ${fork} power names unique within a VEAT`, async () => {
      await loadDataset(fork);
      let graded = 0;
      for (const [atId, at] of Object.entries(ARCHETYPES)) {
        if (!at.branches) continue;
        graded++;
        const owner = new Map<string, string>();
        const branchSets = Object.keys(at.branches)
          .flatMap((b) => branchSetIds(at, b as ArchetypeBranchId));
        for (const setId of [...at.primarySets, ...at.secondarySets, ...branchSets]) {
          for (const power of getPowerset(setId)?.powers ?? []) {
            const prior = owner.get(power.internalName);
            expect(prior, `${atId}: ${power.internalName} in both ${prior} and ${setId}`).toBeUndefined();
            owner.set(power.internalName, setId);
          }
        }
      }
      expect(graded).toBeGreaterThan(0);
    }, 60_000);
  }
});
