// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import type { Build, PoolSelection } from '@/types/build';
import type { SelectedPower } from '@/types/power';
import { serializeBuildForStorage } from '@/utils/per-server-builds';
import { useBuildStore } from '@/stores/buildStore';

/**
 * The pick-level relevelling migration in `onRehydrateStorage` rebuilds every
 * category from one flat, globally level-sorted list. Pools are the only
 * category that is a list OF lists, so the write-back has to re-partition —
 * and it partitions by per-pool COUNT against a list whose order no longer
 * has anything to do with pool membership. The counts come out right and the
 * membership comes out wrong.
 *
 * A power that lands in the wrong pool still renders (the UI reads the power's
 * own fields) but is keyed `<wrongPool>/<Name>` for the engine, which drops it:
 *   [engine] gather: selected power leaping/Maneuvers is not in this dataset
 * So the symptom is a build that looks intact and computes low.
 */

const KEY = 'coh-planner-build';

const stub = (name: string, powerSet: string, level: number): SelectedPower =>
  ({ name, internalName: name, level, powerSet, slots: [] } as unknown as SelectedPower);

const pool = (id: string, name: string, powers: SelectedPower[]): PoolSelection =>
  ({ id, name, powers } as PoolSelection);

/**
 * A build whose pool powers, sorted by level, interleave across pools — the
 * ordinary case for anyone who takes Hasten early and the Fighting pool late.
 * One power carries an out-of-schedule level so the migration's guard trips.
 */
function interleavedBuild(): Build {
  const b = createEmptyBuild('homecoming');
  b.archetype = { id: 'defender', name: 'Defender', stats: null, inherent: null } as never;
  b.level = 50;
  b.primary = { id: 'time-manipulation', name: 'Time Manipulation', powers: [
    stub('Time_Crawl', 'time-manipulation', 1),
    stub('Temporal_Mending', 'time-manipulation', 50), // invalid pick level → trips the guard
  ] } as never;
  b.secondary = { id: 'ice-blast', name: 'Ice Blast', powers: [
    stub('Ice_Bolt', 'ice-blast', 1),
    stub('Ice_Blast', 'ice-blast', 4),
  ] } as never;
  b.pools = [
    pool('fighting', 'Fighting', [
      stub('Boxing', 'fighting', 30),
      stub('Tough', 'fighting', 35),
      stub('Weave', 'fighting', 38),
    ]),
    pool('leaping', 'Leaping', [stub('Combat_Jumping', 'leaping', 26)]),
    pool('speed', 'Speed', [stub('Hasten', 'speed', 12)]),
  ];
  return b;
}

async function boot(build: Build): Promise<Build> {
  localStorage.setItem(KEY, JSON.stringify({
    state: { activeServerId: 'homecoming', buildsByServer: { homecoming: serializeBuildForStorage(build) } },
    version: 1,
  }));
  await useBuildStore.persist.rehydrate();
  return useBuildStore.getState().build;
}

beforeAll(async () => {
  await loadDataset('homecoming');
}, 60_000);

afterEach(() => {
  localStorage.clear();
});

describe('pick-level relevelling preserves pool membership', () => {
  it('leaves each pool power in the pool it was taken from', async () => {
    const loaded = await boot(interleavedBuild());
    const membership = Object.fromEntries(
      loaded.pools.map((p) => [p.id, p.powers.map((w) => w.internalName).sort()])
    );
    expect(membership).toEqual({
      fighting: ['Boxing', 'Tough', 'Weave'],
      leaping: ['Combat_Jumping'],
      speed: ['Hasten'],
    });
  });

  it('keeps every pool power addressable as <poolId>/<internalName>', async () => {
    const loaded = await boot(interleavedBuild());
    // `powerSet` is stamped at pick time and never rewritten, so it is an
    // independent witness of the pool a power actually belongs to.
    for (const p of loaded.pools) {
      for (const w of p.powers) {
        expect(`${p.id}/${w.internalName}`).toBe(`${w.powerSet}/${w.internalName}`);
      }
    }
  });

  it('still assigns valid, non-duplicated pick levels', async () => {
    const loaded = await boot(interleavedBuild());
    const levels = [
      ...loaded.primary.powers,
      ...loaded.secondary.powers,
      ...loaded.pools.flatMap((p) => p.powers),
    ].map((w) => w.level);
    const atOne = levels.filter((l) => l === 1).length;
    expect(atOne).toBeLessThanOrEqual(2);
    const beyondOne = levels.filter((l) => l !== 1);
    expect(new Set(beyondOne).size).toBe(beyondOne.length);
  });
});
