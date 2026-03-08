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

type PowerCategory = 'primary' | 'secondary' | 'pool' | 'epic' | 'inherent';

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
 * Inherent powers get level 1 for slot 0 (free default), but extra slots
 * consume from the grant pool like any other power.
 */
export function computeAllSlotLevels(build: Build): Map<string, number[]> {
  const result = new Map<string, number[]>();

  // 1. Collect ALL powers with their category (including inherents)
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
  // Inherents sort as level 1 (available from start).
  const effectiveLevel = (cp: CategorizedPower) =>
    cp.category === 'inherent' ? 1 : cp.power.level;

  allPowers.sort((a, b) => {
    const aLvl = effectiveLevel(a);
    const bLvl = effectiveLevel(b);
    if (aLvl !== bLvl) return aLvl - bLvl;
    return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
  });

  // 2. Build the grant pool
  const grantPool = buildGrantPool(build.level);
  let grantIndex = 0;

  // 3. Assign slot levels — interleave across powers.
  // Instead of assigning all of a power's extra slots greedily (which makes
  // low-level powers "steal" all early grants), process one extra slot per
  // power per round. This distributes grant levels fairly:
  //   Round 1: each power with ≥1 extra slot gets one grant
  //   Round 2: each power with ≥2 extra slots gets one grant
  //   etc.

  // Initialize slot 0 for every power
  for (const { power, category } of allPowers) {
    const pickLevel = category === 'inherent' ? 1 : power.level;
    result.set(power.name, [pickLevel]);
  }

  // Find max extra slots any power has
  const maxExtraSlots = allPowers.reduce(
    (max, { power }) => Math.max(max, power.slots.length - 1), 0
  );

  // Interleave: one slot per power per round
  for (let round = 0; round < maxExtraSlots; round++) {
    for (const { power, category } of allPowers) {
      if (round < power.slots.length - 1) {
        const pickLevel = category === 'inherent' ? 1 : power.level;
        const levels = result.get(power.name)!;
        levels.push(grantPool[grantIndex] ?? pickLevel);
        grantIndex++;
      }
    }
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

  return result;
}
