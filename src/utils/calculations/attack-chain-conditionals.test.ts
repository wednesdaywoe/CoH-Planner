import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { buildChainPowers, type ChainConditionalState } from './attack-chain-powers';
import { Propel } from '@/data/datasets/homecoming/generated/powersets/controller/primary/gravity-control/propel';
import { Crush } from '@/data/datasets/homecoming/generated/powersets/controller/primary/gravity-control/crush';

/**
 * The Attack Chain Builder never read `power.conditionalEffects`, so every gated
 * contribution the InfoPanel shows was missing from chain DPS. Gravity Control's
 * Impact is the case that surfaced it (reported 2026-07-30): the tooltip counts
 * the +0.49 bonus on Propel, the chain did not.
 *
 * Two halves to get right, and the second is why this isn't a one-liner:
 *
 *  1. the merge itself — run per CAST FORM, because `applyQuickSnipe` REPLACES
 *     `damage` outright and would drop a merge done before it. Ungated: no power
 *     today carries both a conditional and an alternate form, so the ordering is
 *     defensive and this file cannot prove it;
 *  2. the AT hit-time mechanic must still step around the exempt slice. Folding
 *     Impact into the bag and then applying Containment gives (1.96 + 0.49) × 2
 *     where the game gives 1.96 × 2 + 0.49 — so naively wiring conditionals in
 *     REINTRODUCES the ~11% overstatement the InfoPanel was just fixed for.
 */

const IMPACT_KEY = 'Propel:gravitydistortion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function controllerBuild(powers: unknown[]): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b: any = createEmptyBuild();
  b.level = 50;
  b.archetype = { id: 'controller', name: 'Controller', stats: null, inherent: null };
  b.primary = {
    id: 'controller/gravity-control',
    name: 'Gravity Control',
    powers: powers.map((p) => ({ ...(p as object), level: 1, isActive: true, slots: [] })),
  };
  return b;
}

const globalBonuses = { recharge: 0, toHit: 0, maxEndurance: 0, toggleEndCost: 0 } as never;

function propelDamage(conditionals: ChainConditionalState, containmentActive = false): number {
  const mechCtx = { archetypeId: 'controller', containmentActive } as never;
  const powers = buildChainPowers(controllerBuild([Propel]), globalBonuses, mechCtx, {}, conditionals);
  const propel = powers.find((p) => p.id.endsWith(':Propel'));
  expect(propel, 'Propel missing from the chain candidates').toBeDefined();
  return propel!.damage;
}

/** Toggle maps that force Impact off / on, overriding its `defaultActive`. */
const IMPACT_OFF: ChainConditionalState = { mechanicAdjusters: { [IMPACT_KEY]: false } };
const IMPACT_ON: ChainConditionalState = { mechanicAdjusters: { [IMPACT_KEY]: true } };

describe('Attack chain — conditional effects', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('counts an active conditional in the chain damage', () => {
    const off = propelDamage(IMPACT_OFF);
    const on = propelDamage(IMPACT_ON);
    expect(off).toBeGreaterThan(0);
    // 1.96 base + 0.49 Impact.
    expect(on / off).toBeCloseTo(2.45 / 1.96, 6);
  });

  it('an untouched toggle falls back to the conditional\'s own defaultActive', () => {
    // No adjuster maps at all — Impact ships defaultActive, so the chain must
    // read it as ON without the modal having to seed anything.
    expect(propelDamage({})).toBeCloseTo(propelDamage(IMPACT_ON), 6);
    expect(propelDamage({})).toBeGreaterThan(propelDamage(IMPACT_OFF));
  });

  it('reads the per-power key, not a bare id', () => {
    // `scope: 'per-power'` conditionals key on `<internalName>:<id>`; a bare id
    // must not switch it off, or one power's toggle would move another's.
    expect(propelDamage({ mechanicAdjusters: { gravitydistortion: false } }))
      .toBeCloseTo(propelDamage(IMPACT_ON), 6);
  });

  it('leaves a sibling power with no conditionals untouched', () => {
    // Crush sits in the same powerset and carries no `conditionalEffects` — the
    // toggle map must not reach it (the per-power key is what keeps them apart).
    const mechCtx = { archetypeId: 'controller' } as never;
    const build = controllerBuild([Crush]);
    const bare = buildChainPowers(build, globalBonuses, mechCtx)[0];
    const withState = buildChainPowers(build, globalBonuses, mechCtx, {}, IMPACT_ON)[0];
    // Crush is a pure DoT — its damage rides on `dot`, not the direct hit.
    expect(bare.dot?.perTick).toBeGreaterThan(0);
    expect(withState.dot?.perTick).toBeCloseTo(bare.dot!.perTick, 10);
    expect(withState.damage).toBeCloseTo(bare.damage, 10);
  });
});

describe('Attack chain — Containment must not double the exempt slice', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('applies base × 2 + Impact, not (base + Impact) × 2', () => {
    const plain = propelDamage(IMPACT_ON);
    const contained = propelDamage(IMPACT_ON, true);

    // In scale terms: 1.96 × 2 + 0.49 = 4.41 against an un-contained 2.45.
    expect(contained / plain).toBeCloseTo(4.41 / 2.45, 6);
    // The bug: doubling the merged total gives 4.90 — an ~11% overstatement.
    expect(contained / plain).not.toBeCloseTo(2, 3);
  });

  it('Containment still doubles everything when Impact is off', () => {
    expect(propelDamage(IMPACT_OFF, true) / propelDamage(IMPACT_OFF)).toBeCloseTo(2, 6);
  });

  it('Impact adds proportionally less DPS to a Controller than to a Dominator', () => {
    // The whole point of the exemption: on a contained Controller the bonus is a
    // smaller share of the hit (0.49 / 4.41) than it is unmultiplied (0.49 / 2.45).
    const contributionPlain = 1 - propelDamage(IMPACT_OFF) / propelDamage(IMPACT_ON);
    const contributionContained =
      1 - propelDamage(IMPACT_OFF, true) / propelDamage(IMPACT_ON, true);
    expect(contributionPlain).toBeCloseTo(0.49 / 2.45, 6);
    expect(contributionContained).toBeCloseTo(0.49 / 4.41, 6);
    expect(contributionContained).toBeLessThan(contributionPlain);
  });
});
