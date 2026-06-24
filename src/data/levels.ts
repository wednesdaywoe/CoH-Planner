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
  type InherentPowerDef,
} from './datasets/homecoming/levels';
import { getActiveDataset } from './dataset';

/**
 * Excluded-inherent list for the active server, or empty when no dataset is
 * loaded yet (the shared HC list applies until one is). Tolerant of the
 * not-loaded case so static lookups (and tests) work without booting a dataset.
 */
function activeExcludedInherents(): readonly string[] {
  try {
    return getActiveDataset().inherentRules.excludeInherents ?? [];
  } catch {
    return [];
  }
}

/**
 * The shared inherent list is sourced from HC. Servers that don't grant one
 * of those powers declare it in `inherentRules.excludeInherents` (e.g. Rebirth
 * has no Prestige Athletic Run). These facade overrides apply that filter at
 * runtime so the rest of the app sees only the inherents the active server
 * actually grants. The explicit named exports shadow the ones from `export *`.
 */
export function getInherentPowers(): InherentPowerDef[] {
  const excluded = activeExcludedInherents();
  const all = _getInherentPowersBase();
  if (!excluded.length) return all;
  const drop = new Set(excluded);
  return all.filter((p) => !drop.has(p.internalName));
}

/**
 * Name lookup, with excluded inherents blocked for the active server. Delegates
 * to the base resolver (which also covers archetype-specific inherents like
 * Kheldian travel powers) for everything that isn't excluded.
 */
export function getInherentPowerDef(name: string): InherentPowerDef | undefined {
  const excluded = activeExcludedInherents();
  if (excluded.length && new Set(excluded).has(name)) return undefined;
  return _getInherentPowerDefBase(name);
}
