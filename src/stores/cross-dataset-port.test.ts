// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { slimBuild } from '@/utils/build-serialization';
import { useBuildStore } from '@/stores/buildStore';

/**
 * Reading a build from ANOTHER server against the dataset already loaded — "what does my
 * live build look like on Brainstorm". The sibling of `cross-dataset-import.test.ts`, which
 * grades the default act (reload onto the file's own server); this grades the one the user
 * has to ask for.
 *
 * The stamp is the whole point. `serverId` is what the engine calculates against, so a ported
 * build still carrying the file's own id would compute against the server it came from while
 * the header badge named the one on screen — numbers from one dataset under the label of
 * another, which is the defect the roster fix in `hydrateBuild` closed. A port must re-stamp.
 */
function foreignBuild(): string {
  const build = createEmptyBuild('rebirth');
  build.archetype = { id: 'controller', name: 'Controller', stats: null, inherent: null } as never;
  build.level = 50;
  return JSON.stringify({ version: 4, build: slimBuild(build) });
}

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

describe('reading a foreign build against the loaded dataset', () => {
  it('applies it in-session instead of reloading onto its own server', () => {
    stubWindow();
    const ok = useBuildStore.getState().importBuild(foreignBuild(), { intoLoadedDataset: true });

    expect(ok).toBe(true);
    expect(assignSpy).not.toHaveBeenCalled();
    expect(useBuildStore.getState().build.archetype.id).toBe('controller');
  });

  it('stamps it with the dataset it was read against, not the one it came from', () => {
    stubWindow();
    useBuildStore.getState().importBuild(foreignBuild(), { intoLoadedDataset: true });

    expect(useBuildStore.getState().build.serverId).toBe('homecoming');
  });

  it('reports what the loaded dataset could not carry', () => {
    stubWindow();
    const build = createEmptyBuild('rebirth');
    build.archetype = { id: 'controller', name: 'Controller', stats: null, inherent: null } as never;
    build.primary = {
      id: 'controller/not-a-homecoming-set',
      name: 'Nothing Here',
      powers: [
        { name: 'Imaginary Bolt', internalName: 'Imaginary_Bolt', level: 1, slots: [null] },
      ],
    } as never;

    useBuildStore
      .getState()
      .importBuild(JSON.stringify({ version: 4, build: slimBuild(build) }), {
        intoLoadedDataset: true,
      });

    const notes = useBuildStore.getState().lastImportNotes;
    expect(notes.map((n) => n.detail)).toEqual(
      expect.arrayContaining(['controller/not-a-homecoming-set', 'Imaginary Bolt']),
    );
  });

  it('leaves no receipt when the file was already on the loaded dataset', () => {
    stubWindow();
    const build = createEmptyBuild('homecoming');
    useBuildStore.getState().importBuild(JSON.stringify({ version: 4, build: slimBuild(build) }));

    expect(useBuildStore.getState().lastImportNotes).toEqual([]);
  });
});
