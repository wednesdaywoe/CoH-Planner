/**
 * Level / progression facade.
 *
 * Per the multi-dataset plan, the actual level rules (max level, power-pick
 * cadence, slot-grant table, inherent power definitions) live in the active
 * dataset (e.g. `src/data/datasets/homecoming/levels.ts`).
 *
 * NOTE: this file uses direct `export * from` rather than the runtime
 * `getActiveDataset()` indirection seen in `archetypes.ts` / `at-tables.ts`.
 * That's intentional: most exports here are primitive constants
 * (`MAX_LEVEL`, `EPIC_POOL_LEVEL`, …) which JS doesn't allow live-binding
 * across module boundaries. In practice these values are identical across
 * every CoH server we'd realistically support — the file is siloed for
 * organizational tidiness and to give a future Rebirth fork a single
 * place to edit, NOT for runtime swap. If a primitive ever needs to
 * actually differ at runtime, convert that single export to a getter
 * function that reads from `getActiveDataset()`.
 */

export * from './datasets/homecoming/levels';

import {
  getInherentPowers as _getInherentPowersBase,
  getInherentPowerDef as _getInherentPowerDefBase,
  getArchetypeInherentPowers as _getArchetypeInherentPowersBase,
  type InherentPowerDef,
} from './datasets/homecoming/levels';
import { getActiveDataset } from './dataset';

/**
 * The active server's id, or `undefined` when no dataset is loaded yet (the
 * Homecoming lists apply until one is). Tolerant of the not-loaded case so
 * static lookups — and tests — work without booting a dataset.
 */
function activeServerId(): string | undefined {
  try {
    return getActiveDataset().id;
  } catch {
    return undefined;
  }
}

/**
 * Inherent membership is per-server, read from each fork's own export, so these
 * facade overrides just thread the active server through. They used to filter a
 * shared Homecoming list against a hand-written `inherentRules.excludeInherents`
 * — one entry long, naming Rebirth's missing Athletic Run — which is exactly the
 * shape that let Thunderspy go on being offered Ninja Run, Beast Run and five
 * prestige sprints it has never had (INHERENT-4). Absence is now data.
 *
 * The explicit named exports shadow the ones from `export *`.
 */
export function getInherentPowers(): InherentPowerDef[] {
  return _getInherentPowersBase(activeServerId());
}

/**
 * The active server's extra archetype inherents, or empty when no dataset is
 * loaded. Same tolerance as `activeExcludedInherents` — static lookups and
 * tests work without booting a dataset.
 */
function activeArchetypeInherents(): Record<string, readonly InherentPowerDef[]> {
  try {
    return getActiveDataset().inherentRules.archetypeInherents ?? {};
  } catch {
    return {};
  }
}

/**
 * Archetype inherents for the active server: the shared hand-written list
 * (Kheldian travel powers) plus anything this server grants that the shared
 * list doesn't carry.
 *
 * The shared list wins on an `internalName` clash. Thunderspy's export names
 * Energy Flight and Shadow Step alongside the two the shared list already has,
 * so without the dedup a Peacebringer would carry Energy Flight twice.
 *
 * The server additions come from `inherentRules.archetypeInherents`, generated
 * from that server's own `Inherent.Inherent` set — see
 * `scripts/convert-archetype-inherents.cjs`. On Thunderspy this is what
 * restores the Stalker's Hide and Placate, which that fork moved out of the
 * powersets (and whose vacated powerset name slots it then reused for other
 * powers, so the internal names alone are not evidence of reachability).
 */
export function getArchetypeInherentPowers(archetypeId?: string): InherentPowerDef[] {
  if (!archetypeId) return [];
  const shared = _getArchetypeInherentPowersBase(archetypeId);
  const extra = activeArchetypeInherents()[archetypeId];
  if (!extra?.length) return shared;
  const have = new Set(shared.map((p) => p.internalName));
  return [...shared, ...extra.filter((p) => !have.has(p.internalName))];
}

/**
 * Name lookup against the active server's membership. Delegates
 * to the base resolver (which also covers archetype-specific inherents like
 * Kheldian travel powers), then falls back to the active server's own additions
 * so a saved build re-hydrates a power like Thunderspy's Hide by name.
 */
export function getInherentPowerDef(name: string): InherentPowerDef | undefined {
  const shared = _getInherentPowerDefBase(name, activeServerId());
  if (shared) return shared;
  for (const powers of Object.values(activeArchetypeInherents())) {
    const match = powers.find((p) => p.internalName === name);
    if (match) return match;
  }
  return undefined;
}
