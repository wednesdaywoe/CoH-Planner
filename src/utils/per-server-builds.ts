/**
 * Per-server build storage.
 *
 * The planner keeps ONE working build per dataset (server) rather than a single
 * global slot. Switching datasets — via the header dropdown or a `?serverId=`
 * deeplink — is therefore non-destructive: each server's in-progress build is
 * preserved in its own slot and restored when you return, with no account
 * required. This retires the old "switching resets your build" clobber.
 *
 * Only the ACTIVE server's build is ever hydrated/edited in a session (the
 * other servers' powers reference an unloaded dataset), so inactive builds are
 * carried as opaque stored blobs and re-persisted verbatim.
 *
 * These helpers are pure (no store/DOM access) so they're unit-testable; the
 * store wires them into its persist `migrate`/`merge`/`partialize`.
 */

import { DATASET_IDS } from '@/data/dataset';
import type { Build } from '@/types';
import { createEmptyBuild } from '@/types';

export type ServerId = Build['serverId'];

/**
 * A build serialized for storage: `sets` map-values hold `pieces` as arrays
 * (not `Set`s, which don't survive JSON). Treated as opaque for inactive
 * servers and deserialized lazily when its server becomes active.
 */
export type StoredBuild = Record<string, unknown>;

/**
 * Persisted shape (persist version 1): one working build per server plus the
 * last-active server. Supersedes the legacy single-slot `{ build }` shape (v0).
 */
export interface PerServerPersistedState {
  activeServerId: ServerId;
  buildsByServer: Partial<Record<ServerId, StoredBuild>>;
}

const KNOWN_SERVERS: readonly ServerId[] = DATASET_IDS;

export function isKnownServerId(v: unknown): v is ServerId {
  return typeof v === 'string' && (KNOWN_SERVERS as readonly string[]).includes(v);
}

/** Serialize a build's `sets` `Set`-valued `pieces` to arrays for JSON storage. */
export function serializeBuildForStorage(build: Build): StoredBuild {
  return {
    ...build,
    sets: Object.fromEntries(
      Object.entries(build.sets).map(([setId, tracking]) => [
        setId,
        { count: tracking.count, pieces: Array.from(tracking.pieces) },
      ])
    ),
  } as StoredBuild;
}

/**
 * Normalize any persisted payload into the per-server shape.
 *
 * - Already per-server (`buildsByServer` present) → passed through (idempotent).
 * - Legacy v0 `{ build }` → the old build is filed under its own server so
 *   nothing is lost, and that server becomes active.
 * - Empty/garbage → an empty Homecoming workspace.
 *
 * `version` is accepted for the persist `migrate` signature but the shape is
 * detected structurally, so this is safe to call from `merge` too.
 */
export function migratePerServerState(persisted: unknown, _version?: number): PerServerPersistedState {
  const p = (persisted ?? {}) as Record<string, unknown>;

  if (p.buildsByServer && typeof p.buildsByServer === 'object') {
    return {
      activeServerId: isKnownServerId(p.activeServerId) ? p.activeServerId : 'homecoming',
      buildsByServer: p.buildsByServer as PerServerPersistedState['buildsByServer'],
    };
  }

  const legacy = p.build as StoredBuild | undefined;
  if (legacy && typeof legacy === 'object') {
    const sid = isKnownServerId(legacy.serverId) ? (legacy.serverId as ServerId) : 'homecoming';
    return { activeServerId: sid, buildsByServer: { [sid]: legacy } };
  }

  return { activeServerId: 'homecoming', buildsByServer: {} };
}

/**
 * Pick the working build for the loaded dataset out of the per-server map and
 * return the remaining servers' builds untouched.
 *
 * The returned `build` is still in stored form (`sets` as arrays) — the store's
 * rehydrate migrations convert it — and is stamped with `activeServerId` so the
 * build's server always agrees with the dataset actually loaded (this is what
 * makes a first-time visitor following `?serverId=rebirth` land as Rebirth
 * rather than the hardcoded initial Homecoming stamp).
 */
export function selectActiveBuild(
  persisted: PerServerPersistedState,
  activeServerId: ServerId,
): { build: StoredBuild; inactiveServerBuilds: Partial<Record<ServerId, StoredBuild>> } {
  const stored = persisted.buildsByServer ?? {};
  const activeBlob = stored[activeServerId] ?? serializeBuildForStorage(createEmptyBuild(activeServerId));
  const build: StoredBuild = { ...activeBlob, serverId: activeServerId };

  const inactiveServerBuilds: Partial<Record<ServerId, StoredBuild>> = {};
  for (const [sid, blob] of Object.entries(stored)) {
    if (sid !== activeServerId && blob) inactiveServerBuilds[sid as ServerId] = blob;
  }
  return { build, inactiveServerBuilds };
}

/**
 * Compose the per-server persisted payload from the active build plus the
 * carried-over inactive blobs. Mirror of `selectActiveBuild`; used by the
 * store's `partialize`.
 */
export function composePersistedState(
  build: Build,
  inactiveServerBuilds: Partial<Record<ServerId, StoredBuild>>,
): PerServerPersistedState {
  return {
    activeServerId: build.serverId,
    buildsByServer: {
      ...inactiveServerBuilds,
      [build.serverId]: serializeBuildForStorage(build),
    },
  };
}
