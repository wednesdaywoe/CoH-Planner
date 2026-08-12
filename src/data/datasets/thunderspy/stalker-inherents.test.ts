// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time). This file
// drives a real build through the store, so `resetBuild` writes.
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loadDataset, getActiveDataset } from '@/data/dataset';
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

  it.each(['homecoming', 'rebirth'] as const)(
    '%s derives no archetype inherents at all — no fork but Thunderspy needs this layer',
    async (datasetId) => {
      // The property that lets `levels.ts` merge the generated map into the
      // shared hand-written list unconditionally. Checked on the dataset's own
      // additions rather than through `getArchetypeInherentPowers`, which
      // merges in the shared Kheldian list and so is non-empty on every fork.
      await loadDataset(datasetId);
      expect(Object.keys(getActiveDataset().inherentRules.archetypeInherents ?? {})).toHaveLength(0);
    },
    DATASET_LOAD_MS,
  );

  it('a homecoming Mastermind has no Hold Ground', async () => {
    await loadDataset('homecoming');
    expect(getArchetypeInherentPowers('mastermind')).toHaveLength(0);
    expect(getInherentPowerDef('Hold_Ground')).toBeUndefined();
  }, DATASET_LOAD_MS);

  it('homecoming still grants Hide from the Ninjitsu powerset', async () => {
    await loadDataset('homecoming');
    const hide = getPowerset('stalker/ninjitsu')?.powers.find((p) => p.internalName === 'Hide');
    expect(hide?.name).toBe('Hide');
  }, DATASET_LOAD_MS);
});

/**
 * Thunderspy Mastermind Hold Ground — the second half of the same gap.
 *
 * `Hold_Ground` is an auto-issued, Mastermind-gated Toggle in
 * `Inherent.Inherent`: a 60ft sphere on `MastermindPets` that immobilises them
 * and gives them knockback protection — the "stay put" pet command, icon
 * `petcommand_action_stay.png`. It carries an empty `boosts_allowed`, so the
 * converter's original clause 3 ("slottable") rejected it along with the
 * engine bookkeeping.
 *
 * It has nowhere else to go. The archetype's headline inherent reaches a build
 * through the hand-written `inherent:` field on the archetype record
 * (`createArchetypeInherentPower`), and that field holds exactly one power —
 * Supremacy, on this fork as on Homecoming. So a Mastermind needs both paths.
 *
 * `Toggle` is the discriminator, and across all three forks it selects exactly
 * this power: every other unslottable member of that directory is an `Auto`
 * (bookkeeping, or a headline inherent already delivered) or a `Click` (which
 * would double Domination). That is what keeps Homecoming and Rebirth deriving
 * zero, which is what makes the emit safe to merge unconditionally.
 */
describe('Thunderspy Mastermind Hold Ground is reachable', () => {
  beforeAll(async () => {
    await loadDataset('thunderspy');
    useBuildStore.getState().resetBuild();
  }, DATASET_LOAD_MS);

  afterAll(async () => {
    await loadDataset('homecoming');
  }, DATASET_LOAD_MS);

  it('is an archetype inherent for a Mastermind', () => {
    const [def] = getArchetypeInherentPowers('mastermind');

    expect(def, 'Hold Ground is granted').toBeDefined();
    expect(def.internalName).toBe('Hold_Ground');
    expect(def.name).toBe('Hold Ground');
    expect(def.powerType).toBe('Toggle');
    expect(def.category).toBe('archetype');
    expect(def.isLocked).toBe(true);
  });

  it('is unslottable, as the export states', () => {
    const [def] = getArchetypeInherentPowers('mastermind');

    // hold_ground.json states `max_boosts: 0` AND an empty `boosts_allowed`.
    // Both agree, which is why this one doesn't depend on the `max_boosts || 6`
    // question still open in `convert-powerset.cjs`.
    expect(def.maxSlots).toBe(0);
    expect(def.allowedEnhancements).toHaveLength(0);
  });

  it('a Thunderspy Mastermind build carries it once, alongside Supremacy', () => {
    const s = () => useBuildStore.getState();
    s().resetBuild();
    s().setArchetype('mastermind');
    s().setPrimary('mastermind/robotics');
    s().setSecondary('mastermind/traps');

    const inherents = s().build.inherents;
    const holdGround = inherents.filter((p) => p.internalName === 'Hold_Ground');
    expect(holdGround, 'Hold Ground appears exactly once').toHaveLength(1);
    expect(holdGround[0].inherentCategory).toBe('archetype');

    // The other path must still fire. If widening clause 3 had let the
    // headline inherents through, Supremacy would be here twice.
    const supremacy = inherents.filter((p) => p.name === 'Supremacy');
    expect(supremacy, 'Supremacy appears exactly once').toHaveLength(1);
  });

  it('a saved build re-hydrates Hold Ground by name', () => {
    const def = getInherentPowerDef('Hold_Ground');
    expect(def?.name).toBe('Hold Ground');
    expect(def?.maxSlots).toBe(0);
  });

  it('no headline archetype inherent is derived as well', () => {
    // The load-bearing half of clause 3. Containment, Fury, Gauntlet, Scourge,
    // Domination and the rest are auto-issued and archetype-gated in the same
    // directory; every one of them already reaches a build through the
    // archetype record. Deriving any of them here would show it twice.
    for (const archetypeId of ['controller', 'brute', 'tanker', 'corruptor', 'dominator', 'defender']) {
      expect(getArchetypeInherentPowers(archetypeId), `${archetypeId} derives none`).toHaveLength(0);
    }
  });
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
