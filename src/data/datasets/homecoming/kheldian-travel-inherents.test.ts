import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getArchetypeInherentPowers } from '@/data';
import { useBuildStore } from '@/stores/buildStore';

/**
 * Kheldian auto-granted travel inherents (Peacebringer: Energy Flight L1 /
 * Combat Flight L10; Warshade: Shadow Step L1 / Shadow Recall L10) are added
 * to `build.inherents` via getArchetypeInherentPowers when both powersets are
 * picked. They MUST carry `category: 'archetype'` so PoolPowers renders them
 * in the expanded "<AT> Inherent" group (next to Cosmic Balance / Dark
 * Sustenance). If they were 'basic' they'd land in the Basic group, which is
 * collapsed by default — making these always-on powers effectively invisible
 * (the original "missing Energy/Combat Flight" bug report).
 */
describe('Kheldian travel inherents are discoverable (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('Peacebringer travel inherents are categorized "archetype", not "basic"', () => {
    const defs = getArchetypeInherentPowers('peacebringer');
    const byName = Object.fromEntries(defs.map((d) => [d.internalName, d]));
    expect(byName.Energy_Flight?.category).toBe('archetype');
    expect(byName.Combat_Flight?.category).toBe('archetype');
  });

  it('Warshade travel inherents are categorized "archetype", not "basic"', () => {
    const defs = getArchetypeInherentPowers('warshade');
    const byName = Object.fromEntries(defs.map((d) => [d.internalName, d]));
    expect(byName.Shadow_Step?.category).toBe('archetype');
    expect(byName.Shadow_Recall?.category).toBe('archetype');
  });

  it('a Peacebringer build auto-grants the travel powers into the archetype inherent group', () => {
    const s = useBuildStore.getState();
    s.setArchetype('peacebringer');
    s.setPrimary('peacebringer/luminous-blast');
    s.setSecondary('peacebringer/luminous-aura');
    const inherents = useBuildStore.getState().build.inherents;

    const energy = inherents.find((p) => p.internalName === 'Energy_Flight');
    const combat = inherents.find((p) => p.internalName === 'Combat_Flight');
    expect(energy).toBeDefined();
    expect(combat).toBeDefined();
    // The display group is keyed off inherentCategory — must be the expanded one.
    expect(energy?.inherentCategory).toBe('archetype');
    expect(combat?.inherentCategory).toBe('archetype');
  });

  // Regression (bug report @nyhm, 2026-07-06): a Peacebringer build SAVED before
  // the travel-inherent fix stores inherents as just [Health, Stamina]. Importing
  // it via a share link / JSON (importBuild → hydrateBuild) must backfill the
  // missing Energy/Combat Flight — previously the backfill lived only in the
  // localStorage rehydrate path, so imported builds loaded without them and the
  // user couldn't find or slot the powers. The fix moved the backfill into the
  // shared syncBuildDefinitions funnel that importBuild also runs.
  it('importBuild backfills travel inherents into a pre-fix Peacebringer save', () => {
    const preFixSave = JSON.stringify({
      version: 4,
      build: {
        name: 'Pre-fix PB',
        serverId: 'homecoming',
        archetype: { id: 'peacebringer', name: 'Peacebringer' },
        level: 50,
        primary: { id: 'peacebringer/luminous-blast', powers: [] },
        secondary: { id: 'peacebringer/luminous-aura', powers: [] },
        pools: [],
        epicPool: null,
        // The tell-tale pre-fix shape: no Energy_Flight / Combat_Flight.
        inherents: [
          { name: 'Health', internalName: 'Health', level: 1, slots: [] },
          { name: 'Stamina', internalName: 'Stamina', level: 1, slots: [] },
        ],
      },
    });

    const ok = useBuildStore.getState().importBuild(preFixSave);
    expect(ok).toBe(true);

    const inherents = useBuildStore.getState().build.inherents;
    const energy = inherents.find((p) => p.internalName === 'Energy_Flight');
    const combat = inherents.find((p) => p.internalName === 'Combat_Flight');
    expect(energy).toBeDefined();
    expect(combat).toBeDefined();
    // And they must be slottable (the second half of the report — "can't slot").
    expect(energy?.maxSlots).toBeGreaterThan(0);
    expect(combat?.maxSlots).toBeGreaterThan(0);
    expect(energy?.inherentCategory).toBe('archetype');
  });

  // Regression (bug report, 2026-08-04): "Peacebringer builds aren't saving
  // changes — slotted enhancements or number of slots". The 2026-07-06 backfill
  // above put the travel inherents BACK on an imported build, but it appends
  // pristine copies from `syncBuildDefinitions`. `hydrateBuild` builds the list
  // the stored inherents merge onto, and that list omitted the archetype-specific
  // inherents entirely — so a slotted Energy/Combat Flight matched nothing, its
  // slots were dropped, and the backfill then re-added it EMPTY. The power was
  // visibly present, which is why this read as "slots don't save" rather than
  // "power missing". Only Kheldians have slottable archetype inherents, so only
  // they lost data. Covers every hydrateBuild consumer: JSON/.skif import, share
  // links, the /import route, and loading a saved cloud build.
  it.each([
    ['peacebringer', 'peacebringer/luminous-blast', 'peacebringer/luminous-aura', ['Energy_Flight', 'Combat_Flight']],
    ['warshade', 'warshade/umbral-blast', 'warshade/umbral-aura', ['Shadow_Step', 'Shadow_Recall']],
  ] as const)(
    '%s travel-inherent slots and enhancements survive an export → import round trip',
    (archetypeId, primaryId, secondaryId, travelPowers) => {
      const s = () => useBuildStore.getState();
      s().resetBuild();
      s().setArchetype(archetypeId);
      s().setPrimary(primaryId);
      s().setSecondary(secondaryId);
      s().setLevel(50);

      // One extra slot (2 total) and an enhancement in the base slot.
      for (const name of travelPowers) {
        expect(s().addSlot(name, 'inherent')).toBe(true);
        s().setEnhancement(
          name,
          0,
          { type: 'io-generic', stat: 'Fly', level: 50, id: 'fly-io', name: 'Flight Speed IO' } as never,
          'inherent',
        );
      }

      const json = s().exportBuild();
      // The slim export itself must carry them — this is the save half.
      const exported = JSON.parse(json).build.inherents as Array<{ internalName: string; slots: unknown[] }>;
      for (const name of travelPowers) {
        const slim = exported.find((p) => p.internalName === name);
        expect(slim, `${name} exported`).toBeDefined();
        expect(slim!.slots).toHaveLength(2);
        expect(slim!.slots[0]).not.toBeNull();
      }

      expect(s().importBuild(json)).toBe(true);

      // ...and the load half must put them back on the SAME power, not append a
      // pristine empty one.
      for (const name of travelPowers) {
        const restored = s().build.inherents.filter((p) => p.internalName === name);
        expect(restored, `${name} appears exactly once`).toHaveLength(1);
        expect(restored[0].slots, `${name} slot count`).toHaveLength(2);
        expect(restored[0].slots[0], `${name} enhancement`).not.toBeNull();
      }
    },
  );
});
