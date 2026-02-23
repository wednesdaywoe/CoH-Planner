/**
 * Shared utilities for incarnate crafting calculations.
 */

import type { IncarnateBranch, CraftingVariantKey, CraftingVariant, SalvageId } from '@/types';

export const TIER_NUMBER: Record<string, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  veryrare: 4,
};

/** Filter variant map to only the branch-relevant keys */
export function branchVariants(
  variants: Partial<Record<CraftingVariantKey, CraftingVariant>>,
  branch: IncarnateBranch,
  tier: number
): Partial<Record<CraftingVariantKey, CraftingVariant>> {
  // T1 has no branch choice yet — show all variants
  if (tier === 1 || branch === 'base') return variants;

  const keys: CraftingVariantKey[] = branch === 'core'
    ? ['core', 'core_2']
    : ['radial', 'radial_2'];

  const filtered: Partial<Record<CraftingVariantKey, CraftingVariant>> = {};
  for (const k of keys) {
    if (variants[k]) filtered[k] = variants[k];
  }
  return filtered;
}

/** Aggregate salvage across tiers, summing quantities by salvageId */
export function aggregateSalvage(
  treeComponents: Record<number, Partial<Record<CraftingVariantKey, CraftingVariant>>>,
  branch: IncarnateBranch,
  fromTier: number,
  toTier: number
): Map<SalvageId, number> {
  const totals = new Map<SalvageId, number>();

  for (let t = fromTier; t <= toTier; t++) {
    const allVariants = treeComponents[t];
    if (!allVariants) continue;
    const filtered = branchVariants(allVariants, branch, t);
    for (const variant of Object.values(filtered)) {
      if (!variant) continue;
      for (const req of variant.salvage) {
        totals.set(req.salvageId, (totals.get(req.salvageId) || 0) + req.quantity);
      }
    }
  }

  return totals;
}
