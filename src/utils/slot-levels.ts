/**
 * Slot Level Computation
 *
 * Computes which character level each enhancement slot was "granted" at,
 * based on the game's slot grant schedule and the order powers were picked.
 *
 * Slot 0 on every power is free (comes with the power pick at that level).
 * Additional slots (index 1+) consume from the SLOT_GRANTS pool in level order.
 */

import type { Build, SelectedPower } from '@/types';
import { SLOT_GRANTS } from '@/data/levels';

type PowerCategory = 'primary' | 'secondary' | 'pool' | 'epic';

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

/**
 * Compute slot level assignments for every power in the build.
 *
 * Returns a Map keyed by power name, where each value is a number[]
 * parallel to the power's slots array. Index 0 = power pick level (free slot),
 * index 1+ = the grant pool level consumed for that slot.
 *
 * Inherent powers get level 1 for all slots (they're free, outside the budget).
 */
export function computeAllSlotLevels(build: Build): Map<string, number[]> {
  const result = new Map<string, number[]>();

  // 1. Collect all non-inherent powers with their category
  const allPowers: CategorizedPower[] = [];
  const categoryOrder: PowerCategory[] = ['primary', 'secondary', 'pool', 'epic'];

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

  // Sort by pick level, then by category for ties (primary before secondary, etc.)
  allPowers.sort((a, b) => {
    if (a.power.level !== b.power.level) return a.power.level - b.power.level;
    return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
  });

  // 2. Build the grant pool
  const grantPool = buildGrantPool(build.level);
  let grantIndex = 0;

  // 3. Assign slot levels for each non-inherent power
  for (const { power } of allPowers) {
    const levels: number[] = [power.level]; // slot 0 = free at power's pick level
    for (let i = 1; i < power.slots.length; i++) {
      levels.push(grantPool[grantIndex] ?? power.level);
      grantIndex++;
    }
    result.set(power.name, levels);
  }

  // 4. Auto-granted sub-powers (Kheldian forms, etc.) — same as parent level
  for (const p of build.primary.powers) {
    if (p.isAutoGranted && !result.has(p.name)) {
      const levels: number[] = [];
      for (let i = 0; i < p.slots.length; i++) {
        levels.push(i === 0 ? p.level : (grantPool[grantIndex++] ?? p.level));
      }
      result.set(p.name, levels);
    }
  }
  for (const p of build.secondary.powers) {
    if (p.isAutoGranted && !result.has(p.name)) {
      const levels: number[] = [];
      for (let i = 0; i < p.slots.length; i++) {
        levels.push(i === 0 ? p.level : (grantPool[grantIndex++] ?? p.level));
      }
      result.set(p.name, levels);
    }
  }

  // 5. Inherent powers — all slots at level 1 (free, not from budget)
  for (const p of build.inherents) {
    const levels: number[] = [];
    for (let i = 0; i < p.slots.length; i++) {
      levels.push(1);
    }
    result.set(p.name, levels);
  }

  return result;
}
