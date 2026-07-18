// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, afterEach } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { serializeBuildForStorage } from '@/utils/per-server-builds';
import { useBuildStore } from '@/stores/buildStore';

/**
 * Proves that a build persisted to localStorage BEFORE `mutedOverCapStats`
 * existed (a real pre-feature blob, lacking the field entirely) rehydrates
 * with `mutedOverCapStats` backfilled to `[]`, not left `undefined`. The real
 * rehydration path (`onRehydrateStorage`) force-casts the raw persisted blob
 * to `Build` — it does not go through `hydrateBuild` — so any required field
 * added to `Build` needs an explicit backfill guard there too.
 */

const KEY = 'coh-planner-build';

afterEach(() => {
  localStorage.clear();
});

describe('mutedOverCapStats legacy rehydrate backfill', () => {
  it('backfills mutedOverCapStats to [] for a pre-feature persisted build', async () => {
    const blob = serializeBuildForStorage(createEmptyBuild('homecoming')) as Record<string, unknown>;
    delete blob.mutedOverCapStats; // simulate a pre-feature save

    localStorage.setItem(KEY, JSON.stringify({ state: { build: blob }, version: 0 }));

    await loadDataset('homecoming');
    await useBuildStore.persist.rehydrate();

    expect(useBuildStore.getState().build.mutedOverCapStats).toEqual([]);
  });
});
