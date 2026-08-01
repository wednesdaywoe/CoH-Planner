/**
 * Live build → `document.title` sync.
 *
 * The planner already keeps a self-contained build link in the URL
 * (`url-build-sync.ts` writes `?serverId=<id>#<encoded build>`), so every
 * bookmark points at a genuinely different build. A browser bookmark takes its
 * label from `document.title` at the instant the star is clicked, so without a
 * live title every one of those distinct links saves under the same static
 * `index.html` string and has to be renamed by hand. Titling the page after the
 * build is what makes the bookmark self-labelling.
 *
 * Character name leads, because bookmark menus truncate from the right.
 */

import { useEffect } from 'react';
import { useBuildStore } from '@/stores';
import { DEFAULT_BUILD_NAME } from '@/types/build';

/** Must match the `<title>` in `index.html` — asserted by `document-title.test.ts`. */
export const DEFAULT_DOCUMENT_TITLE = 'Sidekick - City of Heroes Build Planner';

/** The build fields that identify a character. */
export interface BuildIdentity {
  name: string;
  archetypeName: string;
  primaryName: string;
  secondaryName: string;
}

/**
 * Format a build's identity as a bookmark-friendly title.
 *
 * A named build leads with the name and qualifies it with the archetype. An
 * unnamed build has no user-supplied handle to lead with, so it falls back to
 * the powerset pairing — still enough to tell two saved links apart. A build
 * with no archetype picked yet has no identity at all, so it keeps the default.
 *
 * `DEFAULT_BUILD_NAME` counts as unnamed: it's the factory placeholder, so
 * treating it as a name would title every untouched build identically — which
 * is the very thing this function exists to stop.
 */
export function buildDocumentTitle(identity: BuildIdentity): string {
  const trimmedName = identity.name.trim();
  const name = trimmedName === DEFAULT_BUILD_NAME ? '' : trimmedName;
  const archetypeName = identity.archetypeName.trim();
  if (!archetypeName) return DEFAULT_DOCUMENT_TITLE;

  const powersets = [identity.primaryName.trim(), identity.secondaryName.trim()]
    .filter(Boolean)
    .join('/');

  const subject = name
    ? `${name} — ${archetypeName}`
    : [archetypeName, powersets].filter(Boolean).join(': ');

  return `${subject} · Sidekick`;
}

/**
 * Set `document.title` for as long as the calling component is mounted,
 * restoring the default on unmount so a stale character name can't outlive the
 * page that named it.
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = DEFAULT_DOCUMENT_TITLE;
    };
  }, [title]);
}

/**
 * Title the page after the build currently in the store. Mount once on the
 * planner page, alongside `useUrlBuildSync()`.
 *
 * Selects the four identity strings individually rather than the whole build so
 * slotting and enhancement edits — which is most of what a build session is —
 * don't re-run the effect.
 */
export function useBuildDocumentTitle(): void {
  const name = useBuildStore((s) => s.build.name);
  const archetypeName = useBuildStore((s) => s.build.archetype.name);
  const primaryName = useBuildStore((s) => s.build.primary.name);
  const secondaryName = useBuildStore((s) => s.build.secondary.name);

  useDocumentTitle(buildDocumentTitle({ name, archetypeName, primaryName, secondaryName }));
}
