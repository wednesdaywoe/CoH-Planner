/**
 * VEAT branch ownership.
 *
 * An Arachnos Soldier/Widow buys into a branch at level 24, and the game gives you exactly
 * one — a Bane Spider is not also a Crab Spider. The branch is not a field on the build; it
 * is a consequence of the picks, and each pick states its own owner in `SelectedPower.powerSet`
 * (the branch's set id, e.g. `arachnos-soldier/bane-spider-soldier`). So "which powers belong
 * to this branch" is a question the build can answer without matching names.
 *
 * Name matching is the wrong tool here twice over: branch sets reuse the base sets' display
 * names (Bane's Build Up, Night Widow's Slash) and the internal names carry per-branch prefixes
 * that were added late, so old saves have neither reliably.
 */

import type { Build } from '@/types/build';
import type { SelectedPower } from '@/types/power';
import type { Archetype, ArchetypeBranchId } from '@/types/archetype';

/**
 * The powerset ids a branch owns. Most branches add one set per role; some add only a
 * secondary, so `primarySet` is optional and absent means "keeps the base primary".
 */
export function branchSetIds(
  archetype: Archetype | null | undefined,
  branchId: ArchetypeBranchId | null,
): string[] {
  if (!archetype?.branches || !branchId) return [];
  const branch = archetype.branches[branchId];
  if (!branch) return [];
  return [branch.primarySet, branch.secondarySet].filter((id): id is string => Boolean(id));
}

/** The build's picks that belong to `branchId`, across both roles. */
export function branchPowersInBuild(
  build: Build,
  archetype: Archetype | null | undefined,
  branchId: ArchetypeBranchId | null,
): SelectedPower[] {
  const owned = new Set(branchSetIds(archetype, branchId));
  if (owned.size === 0) return [];
  return [...build.primary.powers, ...build.secondary.powers].filter((p) => owned.has(p.powerSet));
}
