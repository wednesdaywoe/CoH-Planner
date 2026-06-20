/**
 * Incarnate crafting dependency tree (the "DAG").
 *
 * Each craftable ability is a node identified by `(tier, variantKey)`. Crafting
 * a node *consumes* its prerequisite node(s), so the cost of reaching a goal is
 * the sum over every node in its prerequisite tree — and a Tier 4 needs BOTH of
 * its Tier 3 variants (Total + Partial), each of which drags along its own
 * Tier 2 and Tier 1. That doubling is why a flat by-tier sum under-counts T4s.
 *
 * Nodes can repeat by *type* (two Core Boost T2s feed a T4 Core), so every node
 * gets a unique `path` from the goal — two instances of the same item are
 * tracked independently. Marking a node "obtained" prunes its whole sub-tree
 * from the remaining cost (its ingredients were consumed making it).
 */

import type {
  CraftingVariant,
  CraftingVariantKey,
  SalvageId,
  SalvageRequirement,
  IncarnateBranch,
} from '@/types';

export interface CraftNode {
  /**
   * Goal-independent identity, `"{tier}:{chain}"` (e.g. "1:core", "3:core_2").
   *
   * The key is the same regardless of which goal tier the player is currently
   * targeting, so marking a node obtained (or ticking its salvage) carries over
   * when they raise their target — a Tier 1 they already made stays checked once
   * the goal becomes Tier 2. A Tier 4 splits into two independent chains (its two
   * Tier 3 variants), so the doubled lower tiers keep distinct keys (`2:core`
   * vs `2:core_2`) and aren't collapsed into one.
   */
  path: string;
  tier: number;
  variantKey: CraftingVariantKey;
  /** Human-readable label, e.g. "Tier 3 · Partial Core". */
  label: string;
  salvage: SalvageRequirement[];
  children: CraftNode[];
}

export type TreeComponents = Record<number, Partial<Record<CraftingVariantKey, CraftingVariant>>>;

/** Prerequisite node(s) consumed when crafting `(tier, variantKey)`. */
function prereqChildren(
  tier: number,
  variantKey: CraftingVariantKey
): { tier: number; variantKey: CraftingVariantKey }[] {
  if (tier === 4) {
    // T4 requires both T3 variants of its branch (Total + Partial).
    return variantKey === 'core'
      ? [{ tier: 3, variantKey: 'core' }, { tier: 3, variantKey: 'core_2' }]
      : [{ tier: 3, variantKey: 'radial' }, { tier: 3, variantKey: 'radial_2' }];
  }
  if (tier === 3) {
    // Both Total and Partial of a branch derive from that branch's single T2.
    const t2: CraftingVariantKey = variantKey === 'core' || variantKey === 'core_2' ? 'core' : 'radial';
    return [{ tier: 2, variantKey: t2 }];
  }
  if (tier === 2) {
    // Both T2 branches derive from the single T1 base.
    return [{ tier: 1, variantKey: 'core' }];
  }
  return [];
}

const VARIANT_LABEL: Record<CraftingVariantKey, string> = {
  core: 'Core',
  core_2: 'Core',
  radial: 'Radial',
  radial_2: 'Radial',
};

/** Structural label for a node, e.g. "Tier 3 · Partial Core". */
export function nodeLabel(tier: number, variantKey: CraftingVariantKey): string {
  if (tier === 1) return 'Tier 1 · Base';
  if (tier === 3) {
    const totality = variantKey === 'core_2' || variantKey === 'radial_2' ? 'Partial' : 'Total';
    return `Tier 3 · ${totality} ${VARIANT_LABEL[variantKey]}`;
  }
  return `Tier ${tier} · ${VARIANT_LABEL[variantKey]}`;
}

/** Resolve the goal node's variant key from the selected power's tier/branch. */
export function resolveGoalVariant(
  tier: number,
  branch: IncarnateBranch,
  t3VariantKey: CraftingVariantKey | null
): CraftingVariantKey {
  if (tier === 3) return t3VariantKey ?? (branch === 'radial' ? 'radial' : 'core');
  return branch === 'radial' ? 'radial' : 'core';
}

/** Build the full prerequisite tree for a goal node. */
export function buildCraftTree(
  treeComponents: TreeComponents,
  goalTier: number,
  goalVariantKey: CraftingVariantKey,
  /** Label override for the root node (e.g. the real power display name). */
  goalLabel?: string
): CraftNode {
  const build = (
    tier: number,
    variantKey: CraftingVariantKey,
    chain: CraftingVariantKey,
    isRoot: boolean
  ): CraftNode => {
    const path = `${tier}:${chain}`;
    const salvage = treeComponents[tier]?.[variantKey]?.salvage ?? [];
    const children = prereqChildren(tier, variantKey).map((c) =>
      // A Tier 4 forks into two chains (its two Tier 3 variants); every other
      // step stays on the same chain, so its key is independent of the goal.
      build(c.tier, c.variantKey, tier === 4 ? c.variantKey : chain, false)
    );
    const label = isRoot && goalLabel ? goalLabel : nodeLabel(tier, variantKey);
    return { path, tier, variantKey, label, salvage, children };
  };
  return build(goalTier, goalVariantKey, goalVariantKey, true);
}

/**
 * Sum salvage over every node still needed: a node is skipped (its ingredients
 * already spent) when it — or any ancestor — is obtained.
 */
export function remainingSalvage(
  root: CraftNode,
  isObtained: (path: string) => boolean
): Map<SalvageId, number> {
  const totals = new Map<SalvageId, number>();
  const walk = (node: CraftNode, ancestorObtained: boolean) => {
    const effObtained = ancestorObtained || isObtained(node.path);
    if (!effObtained) {
      for (const req of node.salvage) {
        totals.set(req.salvageId, (totals.get(req.salvageId) ?? 0) + req.quantity);
      }
    }
    for (const child of node.children) walk(child, effObtained);
  };
  walk(root, false);
  return totals;
}

/** Salvage for just the goal node itself (the final combine step). */
export function goalNodeSalvage(root: CraftNode): Map<SalvageId, number> {
  const m = new Map<SalvageId, number>();
  for (const req of root.salvage) m.set(req.salvageId, (m.get(req.salvageId) ?? 0) + req.quantity);
  return m;
}
