/**
 * Live URL ↔ build sync.
 *
 * The planner page calls `useUrlBuildSync()` to:
 *   1. On first mount (after store hydration), if the URL hash holds a
 *      build, decode it and load it into the store.
 *   2. Subscribe to store changes and rewrite the URL hash (debounced)
 *      so the URL always reflects the current build.
 *
 * Encoding: `slimBuild()` → JSON → deflate-raw → base64. This is the
 * same pipeline as the existing `/import` route, so links produced here
 * are also valid `/import#…` links and vice versa.
 */

import { useEffect, useRef } from 'react';
import { useBuildStore } from '@/stores';
import { slimBuild } from '@/utils/build-serialization';
import { encodeImportFragment, decodeImportFragment } from '@/utils/import-url';
import type { Build } from '@/types';

const SYNC_DEBOUNCE_MS = 300;

/** slimBuild → JSON → deflate-raw → base64.
 *
 * Strips personal progress (`craftingChecklist`, `shoppingListAcquired`)
 * before encoding. These are device-local crafting state, not part of
 * the build itself, and they would otherwise:
 *   - bloat shared URLs with data the recipient can't act on
 *   - cause every checklist tick to mutate the URL
 *   - get blown away on the recipient's device when they paste the link
 * The hash-equality check in `useUrlBuildSync` means a user reloading
 * their own URL keeps their localStorage checklist, since both sides
 * encode without it and so the hashes match. */
export function encodeBuildToHash(build: Build): string {
  const slim = slimBuild(build);
  // Drop fields that aren't part of the shareable build identity
  const { craftingChecklist: _cc, shoppingListAcquired: _sl, ...shareable } = slim;
  void _cc; void _sl;
  return encodeImportFragment(JSON.stringify({ version: 4, build: shareable }));
}

/** Build the full shareable URL for a given build, anchored to the planner ("/"). */
export function buildShareUrl(build: Build): string {
  const hash = encodeBuildToHash(build);
  const url = new URL(window.location.href);
  url.pathname = url.pathname.replace(/\/(import|builds|author|settings).*$/, '/') || '/';
  url.search = '';
  url.searchParams.set('serverId', build.serverId);
  url.hash = hash;
  return url.toString();
}

/** Replace the current URL with `?serverId=<id>#<hash>` without adding a history entry. */
function writeUrl(build: Build): void {
  const hash = encodeBuildToHash(build);
  const url = new URL(window.location.href);
  url.searchParams.set('serverId', build.serverId);
  const next = `${url.pathname}${url.search}#${hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) {
    window.history.replaceState(null, '', next);
  }
}

/**
 * Bidirectional URL ↔ build store sync. Mount once on the planner page.
 *
 * Initial-load behaviour: if the URL already has a hash and it doesn't
 * match the persisted build, import the URL's build (treating shared
 * links as authoritative on first visit). The serverId query param is
 * already consumed by `main.tsx` before React mounts, so the correct
 * dataset is loaded by the time we get here.
 */
export function useUrlBuildSync(): void {
  const hasHydrated = useBuildStore((s) => s._hasHydrated);
  const importBuild = useBuildStore((s) => s.importBuild);
  const importedRef = useRef(false);

  // One-shot: hydrate from URL on first ready render
  useEffect(() => {
    if (!hasHydrated || importedRef.current) return;
    importedRef.current = true;

    const fragment = window.location.hash;
    if (!fragment || fragment === '#') return;

    const currentBuild = useBuildStore.getState().build;
    let currentEncoded = '';
    try {
      currentEncoded = encodeBuildToHash(currentBuild);
    } catch {
      // ignore — fall through and try to import the URL
    }

    const incoming = fragment.startsWith('#') ? fragment.slice(1) : fragment;
    if (incoming === currentEncoded) return; // already in sync

    // Preserve device-local crafting/shopping progress across URL imports.
    // These fields aren't part of the shareable build identity (their keys
    // reference inventory items, not powers), so they shouldn't be wiped
    // when a URL load replaces the build — including the user's own reload
    // case where syncBuildDefinitions might shift hashes out of alignment.
    const priorChecklist = currentBuild.craftingChecklist;
    const priorShopping = currentBuild.shoppingListAcquired;

    try {
      const json = decodeImportFragment(incoming);
      const ok = importBuild(json);
      if (ok) {
        const after = useBuildStore.getState().build;
        // Re-apply prior progress on top of the imported build
        useBuildStore.setState({
          build: {
            ...after,
            craftingChecklist: { ...priorChecklist, ...after.craftingChecklist },
            shoppingListAcquired: { ...priorShopping, ...after.shoppingListAcquired },
          },
        });
      }
    } catch (err) {
      console.warn('[url-build-sync] failed to decode URL hash:', err);
    }
  }, [hasHydrated, importBuild]);

  // Continuous: write store changes back to the URL (debounced)
  useEffect(() => {
    if (!hasHydrated) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    // Initial write so a freshly-loaded planner has a valid live link
    writeUrl(useBuildStore.getState().build);

    const unsubscribe = useBuildStore.subscribe((state, prev) => {
      if (state.build === prev.build) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          writeUrl(state.build);
        } catch (err) {
          console.warn('[url-build-sync] failed to write URL:', err);
        }
      }, SYNC_DEBOUNCE_MS);
    });

    return () => {
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, [hasHydrated]);
}
