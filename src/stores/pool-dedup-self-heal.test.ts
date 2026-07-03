// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import type { Build, PoolSelection } from '@/types/build';
import type { SelectedPower } from '@/types/power';
import { slimBuild } from '@/utils/build-serialization';
import { useBuildStore } from '@/stores/buildStore';

/**
 * End-to-end proof that loading a build heals a duplicate pool.
 *
 * The user's corrupt `.skif` carries two byte-identical Flight pools. Every
 * import AND localStorage rehydrate funnels through `syncBuildDefinitions`,
 * which now dedupes pools — so opening the file must collapse the two Flight
 * pools into one, no manual repair required. This exercises the real store
 * `importBuild` path (hydrate → syncBuildDefinitions → set state).
 */

// Minimal SelectedPower stub — only the fields the serializer/hydrator read.
const stub = (name: string, powerSet: string, level: number): SelectedPower =>
  ({ name, internalName: name, level, powerSet, slots: [] } as unknown as SelectedPower);

const flyPower = (): SelectedPower => stub('Fly', 'flight', 10);

const flightPool = (): PoolSelection =>
  ({ id: 'flight', name: 'Flight', powers: [flyPower()] } as PoolSelection);

beforeAll(async () => {
  await loadDataset('homecoming');
});

describe('syncBuildDefinitions self-heals a duplicated pool on load', () => {
  let healed: Build;

  beforeAll(() => {
    // A corrupt build with TWO identical Flight pools plus a distinct Speed pool.
    const corrupt = createEmptyBuild();
    corrupt.archetype = { id: 'controller', name: 'Controller', stats: null, inherent: null } as never;
    corrupt.level = 50;
    corrupt.pools = [
      flightPool(),
      flightPool(),
      { id: 'speed', name: 'Speed', powers: [stub('Hasten', 'speed', 4)] } as PoolSelection,
    ];

    // Serialize exactly as a v4 .skif would, then load it through the store.
    const json = JSON.stringify({ version: 4, build: slimBuild(corrupt) });
    useBuildStore.getState().importBuild(json);
    healed = useBuildStore.getState().build;
  });

  it('collapses the two Flight pools into a single entry', () => {
    expect(healed.pools.filter((p) => p.id === 'flight')).toHaveLength(1);
  });

  it('has no duplicate pool ids at all', () => {
    const ids = healed.pools.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('preserves the surviving pools and their powers', () => {
    expect(healed.pools.map((p) => p.id).sort()).toEqual(['flight', 'speed']);
    const flight = healed.pools.find((p) => p.id === 'flight')!;
    expect(flight.powers.map((p) => p.internalName)).toContain('Fly');
  });
});
