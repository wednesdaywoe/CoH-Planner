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

/**
 * For a T3 (rare) power, determine the specific crafting variant key.
 * "Total" → primary variant (core / radial), "Partial" → alt variant (core_2 / radial_2).
 */
export function inferT3VariantKey(
  displayName: string,
  branch: IncarnateBranch
): CraftingVariantKey | null {
  if (branch === 'base') return null;
  const lower = displayName.toLowerCase();
  const isTotal = lower.includes('total');
  const isPartial = lower.includes('partial');
  if (!isTotal && !isPartial) return null;
  if (branch === 'core') return isTotal ? 'core' : 'core_2';
  return isTotal ? 'radial' : 'radial_2';
}

/** Filter variant map to only the branch-relevant keys */
export function branchVariants(
  variants: Partial<Record<CraftingVariantKey, CraftingVariant>>,
  branch: IncarnateBranch,
  tier: number,
  t3VariantKey?: CraftingVariantKey | null
): Partial<Record<CraftingVariantKey, CraftingVariant>> {
  // T1 has no branch choice yet — show all variants
  if (tier === 1 || branch === 'base') return variants;

  // For T3, if a specific variant key is provided, only return that one
  if (tier === 3 && t3VariantKey && variants[t3VariantKey]) {
    return { [t3VariantKey]: variants[t3VariantKey] };
  }

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
  toTier: number,
  t3VariantKey?: CraftingVariantKey | null
): Map<SalvageId, number> {
  const totals = new Map<SalvageId, number>();

  for (let t = fromTier; t <= toTier; t++) {
    const allVariants = treeComponents[t];
    if (!allVariants) continue;
    const filtered = branchVariants(allVariants, branch, t, t3VariantKey);
    for (const variant of Object.values(filtered)) {
      if (!variant) continue;
      for (const req of variant.salvage) {
        totals.set(req.salvageId, (totals.get(req.salvageId) || 0) + req.quantity);
      }
    }
  }

  return totals;
}
