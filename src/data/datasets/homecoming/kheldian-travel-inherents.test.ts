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
});
