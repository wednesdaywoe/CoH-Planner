/**
 * Build power enumeration helpers — flatten a Build's selected powers across
 * every category (primary / secondary / pools / epic) into a single, level-
 * ordered list, and group them by pick level for the "Powers by Level" views
 * (currently the Export-as-Image build poster).
 *
 * Auto-granted sub-powers (Kheldian form bolts, Bio Adaptation stances, etc.)
 * are excluded — they render under their parent in the interactive planner and
 * would clutter a static summary. Inherents are gathered separately since they
 * live in their own tray.
 */

import type { Build, PoolSelection } from '@/types/build';
import type { SelectedPower } from '@/types/power';
import type { SelectedIncarnatePower } from '@/types/incarnate';
import { INCARNATE_SLOT_ORDER } from '@/types/incarnate';

export interface PowerLevelGroup {
  /** Pick level (1–50) shared by every power in this group. */
  level: number;
  powers: SelectedPower[];
}

/**
 * All user-chosen build powers (primary + secondary + pools + epic), excluding
 * auto-granted sub-powers, sorted by the level they were taken at. Ties keep a
 * stable primary → secondary → pools → epic order.
 */
export function getBuildPowers(build: Build): SelectedPower[] {
  const all: SelectedPower[] = [
    ...build.primary.powers,
    ...build.secondary.powers,
    ...build.pools.flatMap((p) => p.powers),
    ...(build.epicPool?.powers ?? []),
  ].filter((p) => !p.isAutoGranted);

  // Stable sort by level — Array.prototype.sort is stable in modern engines, so
  // equal-level powers preserve the primary→secondary→pool→epic insertion order.
  return all.sort((a, b) => a.level - b.level);
}

/**
 * The same powers as {@link getBuildPowers}, grouped by pick level in ascending
 * order. Levels with no selected power are omitted.
 */
export function getSelectedPowersByLevel(build: Build): PowerLevelGroup[] {
  const byLevel = new Map<number, SelectedPower[]>();
  for (const power of getBuildPowers(build)) {
    const group = byLevel.get(power.level);
    if (group) group.push(power);
    else byLevel.set(power.level, [power]);
  }
  return [...byLevel.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([level, powers]) => ({ level, powers }));
}

/** True when a power has at least one enhancement slotted. */
export function isPowerSlotted(power: SelectedPower): boolean {
  return power.slots.some((s) => s !== null);
}

/** All inherent powers (Fitness / Basic / Archetype), excluding auto-granted sub-powers. */
export function getInherentPowers(build: Build): SelectedPower[] {
  return (build.inherents ?? []).filter((p) => !p.isAutoGranted);
}

/**
 * Inherent powers worth showing in a summary — those with at least one slotted
 * enhancement (an empty Brawl/Sprint/Rest adds nothing to a shared image).
 */
export function getSlottedInherents(build: Build): SelectedPower[] {
  return getInherentPowers(build).filter(isPowerSlotted);
}

/**
 * Enforce the pool-uniqueness invariant: a build may hold at most `maxPools`
 * DISTINCT power pools, and each pool id may appear only once.
 *
 * Duplicate pool objects can slip into `build.pools` from any import path that
 * trusts the source's powerset list — e.g. a Mids `.mbd` whose `PowerSets`
 * array names the same pool twice yields two `flight` entries. Those duplicate
 * `PoolSelection` objects may even share a single `powers` array reference (the
 * mids importer maps every id to the same `poolPowersMap[id]`), which is why a
 * duplicated pool can serialize byte-for-byte identical AND why editing one
 * would silently mutate the other in memory.
 *
 * This collapses same-id pools keeping the FIRST occurrence, merges any powers
 * from later duplicates that the first is missing (so no slotted power is lost),
 * caps the result to `maxPools`, and gives every surviving pool a FRESH powers
 * array to break any inherited shared reference. Pure — returns a new array.
 *
 * It runs inside `syncBuildDefinitions`, the single funnel every import AND
 * localStorage rehydrate passes through, so it both prevents new corruption and
 * self-heals already-saved builds (a duplicated pool in an existing `.skif`) on
 * their next load.
 */
export function dedupePools(pools: PoolSelection[], maxPools: number): PoolSelection[] {
  const byId = new Map<string, PoolSelection>();
  for (const pool of pools) {
    const existing = byId.get(pool.id);
    if (existing) {
      for (const power of pool.powers) {
        if (!existing.powers.some((p) => p.internalName === power.internalName)) {
          existing.powers.push(power);
        }
      }
    } else {
      byId.set(pool.id, { ...pool, powers: [...pool.powers] });
    }
  }
  return [...byId.values()].slice(0, Math.max(0, maxPools));
}

/** Selected incarnate powers in canonical slot order (Alpha → Genesis), skipping empty slots. */
export function getSelectedIncarnates(build: Build): SelectedIncarnatePower[] {
  const inc = build.incarnates;
  if (!inc) return [];
  return INCARNATE_SLOT_ORDER.map((slotId) => inc[slotId]).filter(
    (p): p is SelectedIncarnatePower => !!p,
  );
}
