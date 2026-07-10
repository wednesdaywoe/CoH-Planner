// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, afterEach } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import type { Build } from '@/types/build';
import { serializeBuildForStorage } from '@/utils/per-server-builds';
import { useBuildStore } from '@/stores/buildStore';

/**
 * End-to-end proof of per-server build storage through the real store persist
 * pipeline (localStorage → migrate → merge → onRehydrateStorage). This is the
 * mechanism that makes a `?serverId=` deeplink non-destructive: each server
 * keeps its own working build.
 */

const KEY = 'coh-planner-build';

function storedBuild(serverId: Build['serverId'], archetypeId: string) {
  const b = createEmptyBuild(serverId);
  b.archetype = { id: archetypeId, name: archetypeId, stats: null, inherent: null } as never;
  return serializeBuildForStorage(b);
}

function writeLegacy(serverId: Build['serverId'], archetypeId: string): void {
  localStorage.setItem(KEY, JSON.stringify({ state: { build: storedBuild(serverId, archetypeId) }, version: 0 }));
}

function writePerServer(
  activeServerId: Build['serverId'],
  buildsByServer: Record<string, ReturnType<typeof storedBuild>>,
): void {
  localStorage.setItem(KEY, JSON.stringify({ state: { activeServerId, buildsByServer }, version: 1 }));
}

/** Boot the store against `datasetId` with whatever is in localStorage. */
async function boot(datasetId: 'homecoming' | 'rebirth'): Promise<Build> {
  await loadDataset(datasetId); // sets the active dataset (what merge keys off)
  await useBuildStore.persist.rehydrate();
  return useBuildStore.getState().build;
}

afterEach(() => {
  localStorage.clear();
});

describe('per-server persist pipeline', () => {
  it('migrates a legacy single-slot build and loads it on its own server', async () => {
    writeLegacy('homecoming', 'controller');
    const build = await boot('homecoming');
    expect(build.serverId).toBe('homecoming');
    expect(build.archetype.id).toBe('controller');
    // Nothing to carry over — the legacy build was the only one.
    expect(useBuildStore.getState()._inactiveServerBuilds).toEqual({});
  });

  it('a deeplink to another server loads THAT server\'s build and preserves the rest', async () => {
    writePerServer('homecoming', {
      homecoming: storedBuild('homecoming', 'controller'),
      rebirth: storedBuild('rebirth', 'mastermind'),
    });
    // Simulates arriving via ?serverId=rebirth: boot loads the Rebirth dataset.
    const build = await boot('rebirth');
    expect(build.serverId).toBe('rebirth');
    expect(build.archetype.id).toBe('mastermind');
    // The Homecoming build is preserved, not clobbered.
    const inactive = useBuildStore.getState()._inactiveServerBuilds;
    expect(Object.keys(inactive)).toEqual(['homecoming']);
    expect((inactive.homecoming as { archetype: { id: string } }).archetype.id).toBe('controller');
  });

  it('re-persists all servers after an edit on the active one (no silent loss)', async () => {
    writePerServer('homecoming', {
      homecoming: storedBuild('homecoming', 'controller'),
      rebirth: storedBuild('rebirth', 'mastermind'),
    });
    await boot('rebirth');
    // Edit the active (Rebirth) build — triggers a persist write via partialize.
    useBuildStore.getState().setBuildName('Renamed Rebirth Build');

    const persisted = JSON.parse(localStorage.getItem(KEY)!);
    expect(persisted.state.activeServerId).toBe('rebirth');
    expect(Object.keys(persisted.state.buildsByServer).sort()).toEqual(['homecoming', 'rebirth']);
    // The Rebirth edit landed...
    expect(persisted.state.buildsByServer.rebirth.name).toBe('Renamed Rebirth Build');
    // ...and the untouched Homecoming build is still there.
    expect(persisted.state.buildsByServer.homecoming.archetype.id).toBe('controller');
  });

  it('a brand-new visitor deeplinking to a server lands stamped to that server', async () => {
    // No persisted data at all.
    const build = await boot('rebirth');
    expect(build.serverId).toBe('rebirth');
    expect(build.archetype.id).toBeNull();
  });
});
