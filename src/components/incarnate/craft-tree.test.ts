import { describe, it, expect } from 'vitest';
import type { CraftingVariant, CraftingVariantKey } from '@/types';
import { buildCraftTree, remainingSalvage, resolveGoalVariant } from './craft-tree';
import type { TreeComponents } from './craft-tree';

/** Minimal one-salvage-per-node tree so each node is identifiable by its salvage. */
const v = (salvageId: string): CraftingVariant => ({
  name: '',
  salvage: [{ salvageId: salvageId as never, quantity: 1 }],
  prerequisites: [],
});

const COMPONENTS: TreeComponents = {
  1: { core: v('BiomorphicGoo') },
  2: { core: v('ArcaneCantrip'), radial: v('EnchantedSand') },
  3: {
    core: v('AncientTexts'),        // Total Core
    core_2: v('ExoticIsotope'),     // Partial Core
    radial: v('SuperconductiveMembrane'),
    radial_2: v('SemiConsciousEnergy'),
  },
  4: { core: v('ThaumicResonator'), radial: v('SelfEvolvingAlloy') },
};

const obj = (m: Map<string, number>) => Object.fromEntries(m as Map<string, number>);

describe('craft-tree consumption model', () => {
  it('expands a T4 into both T3 variants, each with its own T2 + T1', () => {
    const goal = resolveGoalVariant(4, 'core', null);
    const tree = buildCraftTree(COMPONENTS, 4, goal as CraftingVariantKey);

    expect(tree.path).toBe('4:core');
    expect(tree.children.map((c) => c.path)).toEqual(['3:core', '3:core_2']);
    // Each T3 derives from a Core T2, which derives from the T1 base. The two
    // chains stay distinct (core vs core_2) so the doubling isn't collapsed.
    expect(tree.children[0].children.map((c) => c.path)).toEqual(['2:core']);
    expect(tree.children[0].children[0].children.map((c) => c.path)).toEqual(['1:core']);
    expect(tree.children[1].children.map((c) => c.path)).toEqual(['2:core_2']);
  });

  it('keeps node identity stable as the goal tier rises (progress carries over)', () => {
    // The T1 a player crafts under a T1 goal keeps its key under T2/T3/T4 goals,
    // so checking it off once stays checked when the target moves up the chain.
    const t1Goal = buildCraftTree(COMPONENTS, 1, 'core');
    const t2Goal = buildCraftTree(COMPONENTS, 2, 'core');
    const t3Goal = buildCraftTree(COMPONENTS, 3, 'core');
    const t4Goal = buildCraftTree(COMPONENTS, 4, 'core');

    expect(t1Goal.path).toBe('1:core');
    expect(t2Goal.children[0].path).toBe('1:core'); // T1 under T2 goal
    expect(t3Goal.children[0].children[0].path).toBe('1:core'); // T1 under T3 goal
    // T1 under the T4's primary (Total) chain
    expect(t4Goal.children[0].children[0].children[0].path).toBe('1:core');
  });

  it('doubles the T1/T2 and counts both T3 variants for a from-scratch T4', () => {
    const tree = buildCraftTree(COMPONENTS, 4, 'core');
    const remaining = obj(remainingSalvage(tree, () => false));

    expect(remaining).toEqual({
      ThaumicResonator: 1,   // T4 itself
      AncientTexts: 1,       // Total Core T3
      ExoticIsotope: 1,      // Partial Core T3
      ArcaneCantrip: 2,      // Core T2 — one per T3 chain
      BiomorphicGoo: 2,      // T1 base — one per T3 chain
    });
  });

  it('prunes an obtained node and everything it consumed', () => {
    const tree = buildCraftTree(COMPONENTS, 4, 'core');
    // Already hold the Total Core T3 → its T2 + T1 are gone too.
    const remaining = obj(remainingSalvage(tree, (path) => path === '3:core'));

    expect(remaining).toEqual({
      ThaumicResonator: 1,   // still need the T4
      ExoticIsotope: 1,      // still need the Partial Core T3
      ArcaneCantrip: 1,      // and its single T2
      BiomorphicGoo: 1,      // and its single T1
    });
  });

  it('marks the whole path done when the goal node itself is obtained', () => {
    const tree = buildCraftTree(COMPONENTS, 4, 'core');
    expect(obj(remainingSalvage(tree, (path) => path === '4:core'))).toEqual({});
  });

  it('does not double anything for a T3 goal (single chain)', () => {
    const tree = buildCraftTree(COMPONENTS, 3, resolveGoalVariant(3, 'core', 'core') as CraftingVariantKey);
    expect(obj(remainingSalvage(tree, () => false))).toEqual({
      AncientTexts: 1,
      ArcaneCantrip: 1,
      BiomorphicGoo: 1,
    });
  });
});
