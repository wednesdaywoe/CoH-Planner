/**
 * The Hybrid foe count reaches the engine and moves the totals.
 *
 * Same shape, and same reason, as `incarnateLevelShiftCeiling.test.ts`: it drives
 * `toCharacterState` rather than a hand-built CharacterState, because the failure worth
 * guarding is not a wrong number but a DEAD CONTROL. A gate that hands the engine its own
 * state proves the engine reads a field while the adapter silently drops it — which is how
 * `incarnateLevelShiftActive` shipped with a store slot, a setter and no path to the calc.
 *
 * The layer under test: a Melee Hybrid stacks its buff once per enemy in the sphere, capped
 * by the equipped tier. Both calcs cut that layer for years ("needs slider infrastructure")
 * while the slot's own tooltip listed it, so a player could read the per-enemy numbers off
 * the UI and never see them in a total.
 *
 * What it cannot see: whether the beta's SLIDER writes the store value these assertions pass
 * in by hand. That link is UI-side and this file is blind to it by construction.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { engineArtifactsPresent, recalcJson } from './engine.node';
import { toCharacterStateJson, type AdapterCalcContext } from './characterStateAdapter';
import { loadDataset } from '@/data/dataset';
import { getHybridEffects } from '@/data';
import { createEmptyBuild, type Build } from '@/types';

const suite = engineArtifactsPresent('homecoming') ? describe : describe.skip;
if (!engineArtifactsPresent('homecoming')) {
  console.warn('[hybridPerTargetSlider] engine artifacts missing — run `npm run build:engine`; suite skipped.');
}

/** The T4 Core (resistance) and T1 (regen only) Melee tiers — a 9-foe cap and a 4-foe one, so
 *  the clamp is graded against two different ceilings rather than one magic number. */
const CORE_T4 = 'melee_genome_8';
const T1 = 'melee_genome_1';

function pick(slotId: string, powerId: string) {
  return { slotId, powerId, powerName: powerId, displayName: powerId, icon: '', tier: 'T4', treeId: '', treeName: '' };
}

const ctx = (hybridTargetsHit: number | null): AdapterCalcContext => ({
  exemplarMode: false,
  exemplarLevel: 50,
  incarnateActive: { alpha: false, destiny: false, hybrid: true, interface: false, judgement: false, lore: false, genesis: false },
  incarnateLevelShift: null,
  targetsHitValues: {},
  targetLevelOffset: 0,
  vigilanceTeamSize: 0,
  furyLevel: 0,
  combatMode: false,
  destinyTime: null,
  hybridTargetsHit,
  globalAdjusters: {},
  mechanicAdjusters: {},
  dominationActive: false,
  stalkerHidden: false,
  whatIfBuffs: {},
});

function bonusesAt(build: Build, foes: number | null): Record<string, number> {
  const json = recalcJson('homecoming', toCharacterStateJson(build, ctx(foes)));
  expect(json, 'engine returned no totals').not.toBeNull();
  return JSON.parse(json!).bonuses;
}

suite('the Hybrid per-enemy layer', () => {
  let build: Build;

  beforeAll(async () => {
    // Unconditionally, despite the `isDatasetLoaded` next door in
    // `incarnateLevelShiftCeiling.test.ts`: that helper answers whether the ENGINE handle is
    // up, not whether the TS dataset is active, and this file reads the export directly to
    // source its expectations. Guarding on it left `getHybridEffects` throwing.
    await loadDataset('homecoming');
    build = createEmptyBuild('homecoming');
    build.level = 50;
    build.archetype = { ...build.archetype, id: 'scrapper', name: 'Scrapper' };
    build.incarnates.hybrid = pick('hybrid', CORE_T4) as never;
  }, 120_000);

  it('applies nothing with no foe count stated', () => {
    // The behaviour the pass had while the layer was cut, held as the default so a build that
    // says nothing about nearby enemies reads as solo rather than as a crowd.
    const none = bonusesAt(build, null);
    const zero = bonusesAt(build, 0);
    expect(none.resistance_fire).toBe(zero.resistance_fire);
    expect(none.regeneration).toBe(zero.regeneration);
  });

  it('stacks once per foe, at the rate the export states', () => {
    const fx = getHybridEffects(CORE_T4);
    expect(fx, 'fixture power missing from the dataset').not.toBeNull();
    const perFoeRes = fx!.perTarget.resFire;
    expect(perFoeRes, 'fixture power has no per-foe resistance row').toBeGreaterThan(0);

    const zero = bonusesAt(build, 0);
    const three = bonusesAt(build, 3);
    // The response, not the absolute — the base is the passive and front-loaded layers, which
    // this test is not about and which cancel in the difference.
    expect(three.resistance_fire - zero.resistance_fire).toBeCloseTo(perFoeRes * 3 * 100, 6);
    expect(three.regeneration - zero.regeneration).toBeCloseTo(fx!.perTarget.regeneration * 3 * 100, 6);
  });

  it('stops at the equipped tier ceiling, which is the power\'s and not a constant', () => {
    const cap = getHybridEffects(CORE_T4)!.maxTargets;
    const atCap = bonusesAt(build, cap);
    const over = bonusesAt(build, cap + 5);
    expect(over.resistance_fire).toBe(atCap.resistance_fire);

    // A smaller tier caps sooner on the same slider position — proof the ceiling is read off
    // the equipped power rather than written once.
    const t1Build: Build = { ...build, incarnates: { ...build.incarnates, hybrid: pick('hybrid', T1) as never } };
    const t1Cap = getHybridEffects(T1)!.maxTargets;
    expect(t1Cap).toBeLessThan(cap);
    const t1AtCap = bonusesAt(t1Build, t1Cap);
    const t1Over = bonusesAt(t1Build, cap);
    expect(t1Over.regeneration).toBe(t1AtCap.regeneration);
  });

  it('needs the toggle: an equipped but inactive Hybrid stacks nothing', () => {
    const json = recalcJson(
      'homecoming',
      toCharacterStateJson(build, {
        ...ctx(9),
        incarnateActive: { ...ctx(9).incarnateActive, hybrid: false },
      }),
    );
    const off = JSON.parse(json!).bonuses;
    const offSolo = JSON.parse(
      recalcJson('homecoming', toCharacterStateJson(build, { ...ctx(0), incarnateActive: { ...ctx(0).incarnateActive, hybrid: false } }))!,
    ).bonuses;
    expect(off.resistance_fire).toBe(offSolo.resistance_fire);
    expect(off.regeneration).toBe(offSolo.regeneration);
  });
});
