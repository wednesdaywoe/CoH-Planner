/**
 * Slot Level Computation
 *
 * Computes which character level each enhancement slot was "granted" at,
 * based on the game's slot grant schedule.
 *
 * Two modes:
 * - **Respec mode** (slotOrder empty): slots are assigned by power-pick order,
 *   redistributing optimally as if doing a respec.
 * - **Leveling mode** (slotOrder populated): slots are assigned in the
 *   chronological order they were added, preserving the user's leveling sequence.
 *
 * Slot 0 on every power is free (comes with the power pick at that level).
 * Additional slots (index 1+) consume from the SLOT_GRANTS pool.
 *
 * Keys: Uses powerKey("category:internalName") to avoid collisions when
 * multiple powers share the same internalName across categories.
 */

import type { Build, SelectedPower } from '@/types';
import { SLOT_GRANTS, getInherentAutoGrantedSlotLevels } from '@/data';
import { powerKey, type PowerCategory } from '@/utils/power-key';

/** Number of inherent (auto-granted) slots a power has, if any. */
function inherentCount(power: SelectedPower): number {
  return power.inherentSlotCount ?? 0;
}

/** Levels for a power's inherent slots, parallel to slots[1..inherentCount].
 *  Sourced from the active dataset's inherent-rules, so each server can plug
 *  in its own grant schedule (HC: none, Rebirth: Health [8,16] / Stamina
 *  [12,22], future servers TBD). */
function inherentLevels(power: SelectedPower): readonly number[] {
  const fixed = getInherentAutoGrantedSlotLevels(power.internalName);
  if (fixed.length === 0) return fixed;
  return fixed.slice(0, inherentCount(power));
}

interface CategorizedPower {
  power: SelectedPower;
  category: PowerCategory;
}

/** Build a flat, sorted array of slot grant levels up to maxLevel. */
function buildGrantPool(maxLevel: number): number[] {
  const pool: number[] = [];
  for (const [lvl, count] of Object.entries(SLOT_GRANTS)) {
    const level = parseInt(lvl);
    if (level > maxLevel) continue;
    for (let i = 0; i < count; i++) pool.push(level);
  }
  return pool.sort((a, b) => a - b);
}

/** Collect all powers in the build (excluding auto-granted sub-powers). */
function collectAllPowers(build: Build): CategorizedPower[] {
  const allPowers: CategorizedPower[] = [];
  const categoryOrder: PowerCategory[] = ['inherent', 'primary', 'secondary', 'pool', 'epic'];

  for (const p of build.inherents) {
    allPowers.push({ power: p, category: 'inherent' });
  }
  for (const p of build.primary.powers) {
    if (!p.isAutoGranted) allPowers.push({ power: p, category: 'primary' });
  }
  for (const p of build.secondary.powers) {
    if (!p.isAutoGranted) allPowers.push({ power: p, category: 'secondary' });
  }
  for (const pool of build.pools) {
    for (const p of pool.powers) {
      allPowers.push({ power: p, category: 'pool' });
    }
  }
  if (build.epicPool) {
    for (const p of build.epicPool.powers) {
      allPowers.push({ power: p, category: 'epic' });
    }
  }

  // Sort by effective pick level, then by category for ties.
  const effectiveLevel = (cp: CategorizedPower) =>
    cp.category === 'inherent' ? 1 : cp.power.level;

  allPowers.sort((a, b) => {
    const aLvl = effectiveLevel(a);
    const bLvl = effectiveLevel(b);
    if (aLvl !== bLvl) return aLvl - bLvl;
    return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
  });

  return allPowers;
}

/** Initialize result map with slot 0 = pick level for every power.
 *  For inherent powers with auto-granted inherent slots (Rebirth Health/Stamina),
 *  pre-fill those slot indices with their fixed grant levels so subsequent
 *  pool consumption skips them. */
function initSlotLevels(allPowers: CategorizedPower[]): Map<string, number[]> {
  const result = new Map<string, number[]>();
  for (const { power, category } of allPowers) {
    const pickLevel = category === 'inherent' ? 1 : power.level;
    const levels = new Array(power.slots.length).fill(pickLevel);
    if (category === 'inherent') {
      const fixed = inherentLevels(power);
      for (let i = 0; i < fixed.length && i + 1 < levels.length; i++) {
        levels[i + 1] = fixed[i];
      }
    }
    result.set(powerKey(category, power.internalName), levels);
  }
  return result;
}

/** Add auto-granted sub-powers (Kheldian forms, etc.) to the result. */
function addAutoGrantedPowers(build: Build, result: Map<string, number[]>) {
  const primaryCategory: PowerCategory = 'primary';
  const secondaryCategory: PowerCategory = 'secondary';
  for (const p of build.primary.powers) {
    const key = powerKey(primaryCategory, p.internalName);
    if (p.isAutoGranted && !result.has(key)) {
      result.set(key, p.slots.map(() => p.level));
    }
  }
  for (const p of build.secondary.powers) {
    const key = powerKey(secondaryCategory, p.internalName);
    if (p.isAutoGranted && !result.has(key)) {
      result.set(key, p.slots.map(() => p.level));
    }
  }
}

/**
 * Resolve which category a slotOrder entry belongs to.
 * New entries have an explicit `category` field.
 * Legacy entries (no category) fall back to searching the build.
 */
function resolveSlotCategory(
  build: Build,
  powerName: string,
  category?: string
): PowerCategory | null {
  if (category && ['primary', 'secondary', 'pool', 'epic', 'inherent'].includes(category)) {
    return category as PowerCategory;
  }
  // Legacy fallback: search categories in standard order
  if (build.primary.powers.some((p) => p.internalName === powerName)) return 'primary';
  if (build.secondary.powers.some((p) => p.internalName === powerName)) return 'secondary';
  for (const pool of build.pools) {
    if (pool.powers.some((p) => p.internalName === powerName)) return 'pool';
  }
  if (build.epicPool?.powers.some((p) => p.internalName === powerName)) return 'epic';
  if (build.inherents.some((p) => p.internalName === powerName)) return 'inherent';
  return null;
}

/**
 * Respec mode: assign slot levels by power-pick order.
 * Each power consumes grants sequentially from the pool.
 */
function computeSlotLevelsRespec(build: Build): Map<string, number[]> {
  const allPowers = collectAllPowers(build);
  const result = initSlotLevels(allPowers);
  const grantPool = buildGrantPool(build.level);

  let grantIndex = 0;

  for (const { power, category } of allPowers) {
    const pickLevel = category === 'inherent' ? 1 : power.level;
    const key = powerKey(category, power.internalName);
    const levels = result.get(key)!;
    // Auto-granted inherent slots (Rebirth Health/Stamina) sit at fixed levels
    // and don't consume from the user grant pool — skip them.
    const skipUntil = category === 'inherent' ? 1 + inherentCount(power) : 1;

    for (let s = skipUntil; s < power.slots.length; s++) {
      while (grantIndex < grantPool.length && grantPool[grantIndex] < pickLevel) {
        grantIndex++;
      }
      levels[s] = grantPool[grantIndex] ?? pickLevel;
      grantIndex++;
    }
  }

  addAutoGrantedPowers(build, result);
  return result;
}

/**
 * Leveling mode: assign slot levels in the chronological order they were added.
 * Each slotOrder entry consumes the next available grant at or after its
 * power's pick level.
 */
function computeSlotLevelsLeveling(build: Build): Map<string, number[]> {
  const allPowers = collectAllPowers(build);
  const result = initSlotLevels(allPowers);
  const grantPool = buildGrantPool(build.level);

  // Build a lookup for power pick levels (keyed by powerKey)
  const pickLevelMap = new Map<string, number>();
  for (const { power, category } of allPowers) {
    pickLevelMap.set(
      powerKey(category, power.internalName),
      category === 'inherent' ? 1 : power.level
    );
  }

  // Track which grants have been consumed (by index)
  const usedGrants = new Set<number>();

  // Track inherent-slot indices to skip when iterating slotOrder
  const inherentSkipIndex = new Map<string, number>(); // key → first user-placeable index
  for (const { power, category } of allPowers) {
    if (category !== 'inherent') continue;
    const skipUntil = 1 + inherentCount(power);
    if (skipUntil > 1) {
      inherentSkipIndex.set(powerKey(category, power.internalName), skipUntil);
    }
  }

  // Process slotOrder entries chronologically
  for (const entry of build.slotOrder) {
    const cat = resolveSlotCategory(build, entry.powerName, entry.category);
    if (!cat) continue;

    const key = powerKey(cat, entry.powerName);
    const levels = result.get(key);
    const pickLevel = pickLevelMap.get(key);
    if (!levels || pickLevel === undefined || entry.slotIndex >= levels.length) continue;
    // Don't let slotOrder overwrite Rebirth's auto-granted inherent slot levels
    const skipUntil = inherentSkipIndex.get(key) ?? 1;
    if (entry.slotIndex < skipUntil) continue;

    // Find the first unused grant at or after this power's pick level
    let assigned = false;
    for (let gi = 0; gi < grantPool.length; gi++) {
      if (usedGrants.has(gi)) continue;
      if (grantPool[gi] < pickLevel) continue;
      levels[entry.slotIndex] = grantPool[gi];
      usedGrants.add(gi);
      assigned = true;
      break;
    }

    if (!assigned) {
      // No grants left — use pick level as fallback
      levels[entry.slotIndex] = pickLevel;
    }
  }

  addAutoGrantedPowers(build, result);
  return result;
}

/**
 * Compute slot level assignments for every power in the build.
 *
 * Returns a Map keyed by powerKey ("category:internalName"), where each value
 * is a number[] parallel to the power's slots array. Index 0 = power pick level
 * (free slot), index 1+ = the grant pool level consumed for that slot.
 *
 * Automatically selects leveling mode if slotOrder has entries,
 * otherwise uses respec mode.
 */
export function computeAllSlotLevels(build: Build): Map<string, number[]> {
  if (build.slotOrder.length > 0) {
    return computeSlotLevelsLeveling(build);
  }
  return computeSlotLevelsRespec(build);
}
