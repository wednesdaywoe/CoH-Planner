/**
 * Incarnate Crafting Recipes
 *
 * Per-slot, per-tier currency costs and incarnate component requirements.
 * Ported from CoH-Incarnate-Calculator/js/incarnate-recipes.js.
 */

import type { IncarnateSlotId, TierRecipe, CraftingConversions } from '@/types';

// ============================================
// RECIPE DATA
// ============================================

export const INCARNATE_RECIPES: Record<IncarnateSlotId, Record<number, TierRecipe>> = {
  alpha: {
    1: { threads: 20,  empyrean: 0,  shards: 12, noticeOfWell: 0, incarnateComponents: ['3x Common Alpha Component'],                                     requires: [] },
    2: { threads: 60,  empyrean: 0,  shards: 32, noticeOfWell: 0, incarnateComponents: ['1x Uncommon Alpha Component', '2x Common Alpha Component'],       requires: ['t1'] },
    3: { threads: 100, empyrean: 8,  shards: 0,  noticeOfWell: 1, incarnateComponents: ['1x Rare Alpha Component'],                                        requires: ['t2'] },
    4: { threads: 600, empyrean: 60, shards: 0,  noticeOfWell: 0, incarnateComponents: ['2x Very Rare Alpha Component'],                                   requires: ['t3_core', 't3_radial'] },
  },
  judgement: {
    1: { threads: 60,  empyrean: 0,  shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Common Incarnate Component'],   requires: [] },
    2: { threads: 240, empyrean: 0,  shards: 0, noticeOfWell: 0, incarnateComponents: ['4x Uncommon Incarnate Component'], requires: ['t1'] },
    3: { threads: 100, empyrean: 8,  shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Rare Incarnate Component'],     requires: ['t2'] },
    4: { threads: 300, empyrean: 30, shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Very Rare Incarnate Component'], requires: ['t3_core', 't3_radial'] },
  },
  interface: {
    1: { threads: 60,  empyrean: 0,  shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Common Incarnate Component'],   requires: [] },
    2: { threads: 240, empyrean: 0,  shards: 0, noticeOfWell: 0, incarnateComponents: ['4x Uncommon Incarnate Component'], requires: ['t1'] },
    3: { threads: 100, empyrean: 8,  shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Rare Incarnate Component'],     requires: ['t2'] },
    4: { threads: 300, empyrean: 30, shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Very Rare Incarnate Component'], requires: ['t3_core', 't3_radial'] },
  },
  destiny: {
    1: { threads: 60,  empyrean: 0,  shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Common Incarnate Component'],   requires: [] },
    2: { threads: 240, empyrean: 0,  shards: 0, noticeOfWell: 0, incarnateComponents: ['4x Uncommon Incarnate Component'], requires: ['t1'] },
    3: { threads: 100, empyrean: 8,  shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Rare Incarnate Component'],     requires: ['t2'] },
    4: { threads: 300, empyrean: 30, shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Very Rare Incarnate Component'], requires: ['t3_core', 't3_radial'] },
  },
  lore: {
    1: { threads: 60,  empyrean: 0,  shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Common Incarnate Component'],   requires: [] },
    2: { threads: 240, empyrean: 0,  shards: 0, noticeOfWell: 0, incarnateComponents: ['4x Uncommon Incarnate Component'], requires: ['t1'] },
    3: { threads: 100, empyrean: 8,  shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Rare Incarnate Component'],     requires: ['t2'] },
    4: { threads: 300, empyrean: 30, shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Very Rare Incarnate Component'], requires: ['t3_core', 't3_radial'] },
  },
  hybrid: {
    1: { threads: 60,  empyrean: 0,  shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Common Incarnate Component'],   requires: [] },
    2: { threads: 240, empyrean: 0,  shards: 0, noticeOfWell: 0, incarnateComponents: ['4x Uncommon Incarnate Component'], requires: ['t1'] },
    3: { threads: 100, empyrean: 8,  shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Rare Incarnate Component'],     requires: ['t2'] },
    4: { threads: 300, empyrean: 30, shards: 0, noticeOfWell: 0, incarnateComponents: ['1x Very Rare Incarnate Component'], requires: ['t3_core', 't3_radial'] },
  },
};

// ============================================
// CONVERSION RATES
// ============================================

export const CRAFTING_CONVERSIONS: CraftingConversions = {
  empyreanToThreads: 20,
  shardsToThreads: 5,
  noticeOfWellToEmpyrean: 1,
  favorOfWellToEmpyrean: 2.5,
};

// ============================================
// ACCESSOR / CALCULATOR FUNCTIONS
// ============================================

export function getTierRecipe(slotId: IncarnateSlotId, tier: number): TierRecipe | null {
  return INCARNATE_RECIPES[slotId]?.[tier] || null;
}

/**
 * Calculate cumulative costs up to a given tier (including prerequisites).
 * For T4: automatically doubles T3 cost (both variants required).
 */
export function calculateCumulativeCost(slotId: IncarnateSlotId, tier: number): {
  threads: number; empyrean: number; shards: number; noticeOfWell: number; incarnateComponents: string[];
} {
  const recipes = INCARNATE_RECIPES[slotId];
  let threads = 0, empyrean = 0, shards = 0, noticeOfWell = 0;
  const incarnateComponents: string[] = [];

  for (let t = 1; t <= Math.min(tier, 4); t++) {
    const recipe = recipes[t];
    if (!recipe) continue;
    threads += recipe.threads;
    empyrean += recipe.empyrean;
    shards += recipe.shards;
    noticeOfWell += recipe.noticeOfWell;
    incarnateComponents.push(...recipe.incarnateComponents);
  }

  // T4 requires both T3 variants -- add second T3 cost
  if (tier === 4) {
    const t3 = recipes[3];
    if (t3) {
      threads += t3.threads;
      empyrean += t3.empyrean;
      incarnateComponents.push(...t3.incarnateComponents);
    }
  }

  return { threads, empyrean, shards, noticeOfWell, incarnateComponents };
}
