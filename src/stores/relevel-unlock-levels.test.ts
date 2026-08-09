// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import type { Build } from '@/types/build';
import type { SelectedPower } from '@/types/power';
import { serializeBuildForStorage } from '@/utils/per-server-builds';
import { useBuildStore } from '@/stores/buildStore';

/**
 * The pick-level relevelling migration used to stamp levels by POSITION alone:
 * sort the powers, then slot idx → POWER_PICK_LEVELS[idx]. No power's own
 * unlock level was consulted, so a Defender's Distortion Field — 5th in sort
 * order, first offered at level 8 — was stamped onto the level-6 pick. The
 * game refuses that pick; the planner showed it as fine forever, because the
 * stamped levels are all valid pick levels with no duplicates, which is all
 * the migration's guard used to check.
 *
 * The unlock levels asserted here are the game's own (verified against the
 * exported Homecoming data), written down independently so the test cannot
 * collapse into comparing the migration with itself.
 */

const KEY = 'coh-planner-build';

// Defender Time Manipulation / Ice Blast unlock levels (available + 1).
const UNLOCKS: Record<string, number> = {
  Time_Crawl: 1,
  Temporal_Mending: 1,
  Times_Juncture: 2,
  Temporal_Selection: 6,
  Distortion_Field: 8,
  Time_Stop: 12,
  Ice_Blast: 1,
  Aim: 10,
  Freeze_Ray: 16,
  Chrono_Shift: 26,
};

const stub = (name: string, powerSet: string, level: number): SelectedPower =>
  ({ name, internalName: name, level, powerSet, slots: [] } as unknown as SelectedPower);

function defenderBuild(levels: Record<string, number>): Build {
  const b = createEmptyBuild('homecoming');
  b.archetype = { id: 'defender', name: 'Defender', stats: null, inherent: null } as never;
  b.level = 50;
  // Registry keys are `<archetype>/<set>` — a bare set id misses silently and
  // the def sync (which re-attaches `available`) never runs.
  b.primary = { id: 'defender/time-manipulation', name: 'Time Manipulation', powers: [
    stub('Time_Crawl', 'defender/time-manipulation', levels.Time_Crawl),
    stub('Temporal_Mending', 'defender/time-manipulation', levels.Temporal_Mending),
    stub('Times_Juncture', 'defender/time-manipulation', levels.Times_Juncture),
    stub('Distortion_Field', 'defender/time-manipulation', levels.Distortion_Field),
    stub('Time_Stop', 'defender/time-manipulation', levels.Time_Stop),
  ] } as never;
  b.secondary = { id: 'defender/ice-blast', name: 'Ice Blast', powers: [
    stub('Ice_Blast', 'defender/ice-blast', levels.Ice_Blast),
    stub('Aim', 'defender/ice-blast', levels.Aim),
    stub('Freeze_Ray', 'defender/ice-blast', levels.Freeze_Ray),
  ] } as never;
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

function pickedLevels(build: Build): Map<string, number> {
  return new Map(
    [
      ...build.primary.powers,
      ...build.secondary.powers,
      ...build.pools.flatMap((p) => p.powers),
      ...(build.epicPool?.powers ?? []),
    ].map((p) => [p.internalName, p.level]),
  );
}

function expectLegal(levels: Map<string, number>): void {
  for (const [name, unlock] of Object.entries(UNLOCKS)) {
    const level = levels.get(name);
    if (level === undefined) continue;
    expect(level, `${name} unlocks at ${unlock} but was placed at ${level}`)
      .toBeGreaterThanOrEqual(unlock);
  }
}

beforeAll(async () => {
  await loadDataset('homecoming');
}, 60_000);

afterEach(() => {
  localStorage.clear();
});

describe('pick-level relevelling honors unlock levels', () => {
  it('never places a relevelled power below the level the game offers it', async () => {
    // Every level flattened to 50 — the legacy corruption the migration exists
    // to fix, and the shape that forces a full reassignment.
    const flattened = Object.fromEntries(Object.keys(UNLOCKS).map((k) => [k, 50]));
    const loaded = await boot(defenderBuild(flattened));
    const levels = pickedLevels(loaded);
    expectLegal(levels);
    // The reassignment must still be schedule-shaped: no duplicates past the
    // level-1 pair.
    const beyondOne = [...levels.values()].filter((l) => l !== 1);
    expect(new Set(beyondOne).size).toBe(beyondOne.length);
  });

  it('re-enters and repairs a build the positional stamping already corrupted', async () => {
    // The shipped corruption: every level a valid pick level, no duplicates —
    // and Distortion Field sitting on the level-6 pick it cannot legally take.
    // The old guard saw nothing wrong with this build.
    const loaded = await boot(defenderBuild({
      Time_Crawl: 1,
      Temporal_Mending: 2,
      Times_Juncture: 4,
      Distortion_Field: 6,
      Time_Stop: 10,
      Ice_Blast: 1,
      Aim: 8,
      Freeze_Ray: 14,
    }));
    expectLegal(pickedLevels(loaded));
  });

  it('keeps a high-tier-only primary at its unlock level instead of dragging it to 1', async () => {
    const b = createEmptyBuild('homecoming');
    b.archetype = { id: 'defender', name: 'Defender', stats: null, inherent: null } as never;
    b.level = 50;
    b.primary = { id: 'defender/time-manipulation', name: 'Time Manipulation', powers: [
      stub('Chrono_Shift', 'defender/time-manipulation', 50),
    ] } as never;
    b.secondary = { id: 'defender/ice-blast', name: 'Ice Blast', powers: [
      stub('Ice_Blast', 'defender/ice-blast', 50),
    ] } as never;
    const loaded = await boot(b);
    const levels = pickedLevels(loaded);
    expect(levels.get('Chrono_Shift')).toBeGreaterThanOrEqual(UNLOCKS.Chrono_Shift);
    // Ice Blast is the set's tier-2 power, and a legal level-1 pick: Homecoming
    // opened the choice at creation in i27 page 5, so nothing forces Ice Bolt
    // ahead of it. The lone secondary takes the level-1 secondary pick.
    expect(levels.get('Ice_Blast')).toBe(1);
  });

  it('re-enters when one category holds both level-1 picks', async () => {
    const b = createEmptyBuild('homecoming');
    b.archetype = { id: 'defender', name: 'Defender', stats: null, inherent: null } as never;
    b.level = 50;
    b.primary = { id: 'defender/time-manipulation', name: 'Time Manipulation', powers: [
      stub('Time_Crawl', 'defender/time-manipulation', 2),
    ] } as never;
    // Both level-1 picks spent on one category — every level a valid pick level
    // and no level crowded globally, so only the per-category count sees it.
    b.secondary = { id: 'defender/ice-blast', name: 'Ice Blast', powers: [
      stub('Ice_Bolt', 'defender/ice-blast', 1),
      stub('Ice_Blast', 'defender/ice-blast', 1),
    ] } as never;
    const loaded = await boot(b);
    const secondariesAtOne = loaded.secondary.powers.filter((p) => p.level === 1);
    expect(secondariesAtOne, 'level 1 holds one secondary pick, never two').toHaveLength(1);
    const levels = pickedLevels(loaded);
    expectLegal(levels);
    const beyondOne = [...levels.values()].filter((l) => l !== 1);
    expect(new Set(beyondOne).size).toBe(beyondOne.length);
  });
});
