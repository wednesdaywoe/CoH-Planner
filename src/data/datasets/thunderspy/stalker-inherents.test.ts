// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time). This file
// drives a real build through the store, so `resetBuild` writes.
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getArchetypeInherentPowers, getInherentPowerDef, getPowerset } from '@/data';
import { useBuildStore } from '@/stores/buildStore';

/**
 * Each dataset is a 13-20 MB dynamic chunk and this file switches datasets
 * four times. The default 10s hook budget times out on a cold transform, which
 * is a build-cost failure rather than a real one.
 */
const DATASET_LOAD_MS = 120_000;

/**
 * Thunderspy Stalker Hide + Placate (bug report, 2026-08-07: "Stalkers get Hide
 * and Placate as an inherent power. Hide can be slotted, placate cannot").
 *
 * Thunderspy moved both powers out of the Stalker powersets into
 * `Inherent.Inherent`, auto-issued and gated `$archetype @Class_Stalker ==`,
 * and then reused the vacated powerset name slots for OTHER powers —
 * `Stalker_Defense.Ninjitsu.Hide` holds Quick Recovery,
 * `Stalker_Melee.Ninja_Sword.Placate` holds The Lotus Drops. Nothing in the
 * planner read archetype-gated auto-issue inherents, so on Thunderspy both
 * powers were reachable from NO screen: absent from the powerset picker (which
 * correctly shows the repurposed powers under their own display names) and
 * absent from the inherent list (hand-written, Kheldians only).
 *
 * Homecoming and Rebirth grant both from powersets and must stay unchanged —
 * a fix that applied everywhere would show every Stalker two Hides.
 */
describe('Thunderspy Stalker Hide + Placate are reachable', () => {
  beforeAll(async () => {
    await loadDataset('thunderspy');
    useBuildStore.getState().resetBuild();
  }, DATASET_LOAD_MS);

  afterAll(async () => {
    // Other suites assume the default dataset.
    await loadDataset('homecoming');
  }, DATASET_LOAD_MS);

  it('both powers are archetype inherents for a Stalker', () => {
    const byName = Object.fromEntries(
      getArchetypeInherentPowers('stalker').map((d) => [d.internalName, d]),
    );

    expect(byName.Hide, 'Hide is granted').toBeDefined();
    expect(byName.Placate, 'Placate is granted').toBeDefined();

    // These are the real powers, not the repurposed powerset slots that share
    // their internal names — the display name is what separates them.
    expect(byName.Hide.name).toBe('Hide');
    expect(byName.Placate.name).toBe('Placate');
    expect(byName.Hide.powerType).toBe('Toggle');
    expect(byName.Placate.powerType).toBe('Click');

    // 'archetype', not 'basic': the Basic group is collapsed by default, which
    // is what made the Kheldian travel inherents undiscoverable in 2026-07.
    expect(byName.Hide.category).toBe('archetype');
    expect(byName.Placate.category).toBe('archetype');
  });

  it('Hide can be slotted and Placate cannot — as the export states and the report said', () => {
    const byName = Object.fromEntries(
      getArchetypeInherentPowers('stalker').map((d) => [d.internalName, d]),
    );

    // Thunderspy's hide.json omits `max_boosts` (→ the 6-slot default) and its
    // placate.json states `max_boosts: 0`. Reading that 0 as a zero is the
    // whole reason this converter doesn't reuse `convert-powerset.cjs`'s
    // `max_boosts || 6`.
    expect(byName.Hide.maxSlots).toBe(6);
    expect(byName.Placate.maxSlots).toBe(0);

    expect(byName.Hide.allowedSetCategories).toContain('Defense Sets');
  });

  it('a Thunderspy Stalker build carries both, exactly once each', () => {
    const s = () => useBuildStore.getState();
    s().resetBuild();
    s().setArchetype('stalker');
    s().setPrimary('stalker/ninja-blade');
    s().setSecondary('stalker/ninjitsu');

    const inherents = s().build.inherents;
    for (const name of ['Hide', 'Placate']) {
      const found = inherents.filter((p) => p.internalName === name);
      expect(found, `${name} appears exactly once`).toHaveLength(1);
      expect(found[0].inherentCategory, `${name} display group`).toBe('archetype');
    }
    expect(inherents.find((p) => p.internalName === 'Hide')!.name).toBe('Hide');
  });

  it('the repurposed powerset slots still show their own powers', () => {
    // The other half of the fork's change. If these ever came back as "Hide" /
    // "Placate" the powersets would be granting them again and the inherent
    // grant above would become a duplicate.
    const ninjitsu = getPowerset('stalker/ninjitsu');
    const hideSlot = ninjitsu?.powers.find((p) => p.internalName === 'Hide');
    expect(hideSlot?.name).toBe('Quick Recovery');

    const ninjaBlade = getPowerset('stalker/ninja-blade');
    const placateSlot = ninjaBlade?.powers.find((p) => p.internalName === 'Placate');
    expect(placateSlot?.name).toBe('The Lotus Drops');
  });

  it('a saved build re-hydrates Hide by name', () => {
    // `getInherentPowerDef` is how buildStore resolves a stored inherent back
    // to its definition. Before the facade fell through to the dataset's own
    // additions it only searched the shared hand-written list, so a saved
    // Thunderspy Stalker would have loaded without its Hide.
    const def = getInherentPowerDef('Hide');
    expect(def?.name).toBe('Hide');
    expect(def?.maxSlots).toBe(6);
  });
});

describe('Homecoming and Rebirth Stalkers are untouched', () => {
  afterAll(async () => {
    await loadDataset('homecoming');
  }, DATASET_LOAD_MS);

  it.each(['homecoming', 'rebirth'] as const)(
    '%s grants no archetype inherents to a Stalker (both powers come from powersets)',
    async (datasetId) => {
      await loadDataset(datasetId);
      expect(getArchetypeInherentPowers('stalker')).toHaveLength(0);
    },
    DATASET_LOAD_MS,
  );

  it('homecoming still grants Hide from the Ninjitsu powerset', async () => {
    await loadDataset('homecoming');
    const hide = getPowerset('stalker/ninjitsu')?.powers.find((p) => p.internalName === 'Hide');
    expect(hide?.name).toBe('Hide');
  }, DATASET_LOAD_MS);
});

describe('Kheldian travel inherents are not doubled on Thunderspy', () => {
  beforeAll(async () => {
    await loadDataset('thunderspy');
  }, DATASET_LOAD_MS);

  afterAll(async () => {
    await loadDataset('homecoming');
  }, DATASET_LOAD_MS);

  // Thunderspy's export names Energy Flight / Combat Flight / Shadow Step /
  // Shadow Recall alongside the four this fork adds, and the shared
  // hand-written list already carries them. The merge dedupes on internalName
  // with the shared list winning; without that every Kheldian would see its
  // travel powers twice.
  it.each([
    ['peacebringer', ['Energy_Flight', 'Combat_Flight', 'Group_Energy_Flight', 'Quantum_Acceleration']],
    ['warshade', ['Shadow_Step', 'Shadow_Recall', 'Shadow_Slip', 'Starless_Step']],
  ] as const)('%s carries each travel inherent once', (archetypeId, expected) => {
    const defs = getArchetypeInherentPowers(archetypeId);
    const names = defs.map((d) => d.internalName);
    expect(new Set(names).size, 'no duplicates').toBe(names.length);
    for (const name of expected) expect(names, `${name} present`).toContain(name);
  });
});
