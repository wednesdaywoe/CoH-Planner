// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { slimBuild } from '@/utils/build-serialization';
import { decodeImportFragment } from '@/utils/import-url';
import { useBuildStore } from '@/stores/buildStore';

/**
 * A build imported for a DIFFERENT server than the one currently loaded must
 * NOT be applied in-session. The active dataset is a boot-time singleton that
 * can't be hot-swapped, so importBuild has to reload with `?serverId=<id>`
 * (carrying the build in the URL hash) and let boot load the right dataset —
 * otherwise the build's powers silently resolve against the wrong dataset and
 * the server dropdown never switches. This is the regression the Rebirth dev's
 * `mmhero.skif` hit: it loaded, but stayed on Homecoming.
 */

function slimJson(serverId: 'homecoming' | 'rebirth'): string {
  const build = createEmptyBuild(serverId);
  build.archetype = { id: 'controller', name: 'Controller', stats: null, inherent: null } as never;
  build.level = 50;
  return JSON.stringify({ version: 4, build: slimBuild(build) });
}

// The suite runs in node (no jsdom), so `window` is undefined by default —
// which is also the SSR guard in importBuild. Install a minimal global window
// with a spyable `location.assign` so the reload branch is exercised.
let assignSpy: ReturnType<typeof vi.fn>;

beforeAll(async () => {
  await loadDataset('homecoming');
});

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
});

function stubWindow(): void {
  assignSpy = vi.fn();
  (globalThis as { window?: unknown }).window = {
    location: { href: 'http://localhost/', pathname: '/', search: '', hash: '', assign: assignSpy },
  };
}

describe('cross-dataset import reloads instead of applying in-session', () => {
  it('reloads with ?serverId when the imported build is for another server', () => {
    stubWindow();
    // Sanity: we are on Homecoming.
    expect(useBuildStore.getState().build.serverId).toBe('homecoming');

    const ok = useBuildStore.getState().importBuild(slimJson('rebirth'));

    // Reported success (import in progress via reload)...
    expect(ok).toBe(true);
    // ...navigated to the target dataset, carrying the build in the hash...
    expect(assignSpy).toHaveBeenCalledTimes(1);
    const target = assignSpy.mock.calls[0][0] as string;
    expect(target).toMatch(/^\/\?serverId=rebirth#.+/);
    // ...and did NOT apply the Rebirth build against the loaded Homecoming data.
    expect(useBuildStore.getState().build.serverId).toBe('homecoming');

    // Critically: the hash carries the ORIGINAL, un-hydrated payload — NOT a
    // build re-hydrated against the (wrong) Homecoming dataset, which would have
    // stripped Rebirth-only enhancements before the reload. Decoding it must
    // reproduce the exact input we passed in.
    const carried = decodeImportFragment(target.split('#')[1]);
    expect(carried).toBe(slimJson('rebirth'));
  });

  it('applies the build in-session when it matches the loaded server', () => {
    stubWindow();
    const ok = useBuildStore.getState().importBuild(slimJson('homecoming'));

    expect(ok).toBe(true);
    // No reload for a same-server import.
    expect(assignSpy).not.toHaveBeenCalled();
    // The build was applied in-session.
    expect(useBuildStore.getState().build.archetype.id).toBe('controller');
    expect(useBuildStore.getState().build.serverId).toBe('homecoming');
  });
});
