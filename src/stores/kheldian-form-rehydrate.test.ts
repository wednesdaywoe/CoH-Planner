// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { importExternalBuild } from '@/utils/external-import';
import { composePersistedState } from '@/utils/per-server-builds';
import { useBuildStore } from '@/stores/buildStore';
import type { Build, Enhancement, SelectedPower } from '@/types';

/**
 * The pick-level repair migration in `onRehydrateStorage` exists for legacy /
 * Mids-imported saves that stamped every power at the display level (50)
 * instead of its real pick level. It deliberately EXCLUDES auto-granted form
 * sub-powers from the relevelling (they don't occupy a pick slot) — but it
 * then rebuilt `primary.powers` / `secondary.powers` from that filtered list,
 * which deleted every excluded sub-power along with its slots and
 * enhancements. Kheldian (Bright Nova / White Dwarf) and Primalist
 * (Hunter/Prowler Form) sub-powers are the only slottable auto-grants, so
 * they were the only ones that could lose user data this way.
 *
 * These tests drive the REAL rehydrate path (localStorage → persist.rehydrate)
 * because that migration runs nowhere else.
 */

const KEY = 'coh-planner-build';

const NOVA_SUBS = ['Bright_Nova_Bolt', 'Bright_Nova_Blast', 'Bright_Nova_Scatter', 'Bright_Nova_Detonation'];
const DWARF_SUBS = [
  'White_Dwarf_Strike',
  'White_Dwarf_Smite',
  'White_Dwarf_Flare',
  'White_Dwarf_Sublimation',
  'White_Dwarf_Step',
  'White_Dwarf_Antagonize',
];

function p(categoryName: string, powerSetName: string, powerName: string, level: number) {
  return {
    categoryName,
    powerSetName,
    powerName,
    powerLevelBought: level,
    powerNumBoostsBought: 0,
    boosts: [],
  };
}

const PB_JSON = JSON.stringify({
  ok: true,
  build: {
    character: { name: 'Legacy PB', archetype: 'class_peacebringer', origin: 'mutation', level: 50 },
    powers: [
      p('peacebringer_offensive', 'luminous_blast', 'glinting_eye', 1),
      p('peacebringer_offensive', 'luminous_blast', 'bright_nova', 4),
      ...NOVA_SUBS.map((n) => p('peacebringer_offensive', 'luminous_blast', n.toLowerCase(), 4)),
      p('peacebringer_offensive', 'luminous_blast', 'dawn_strike', 26),
      p('peacebringer_defensive', 'luminous_aura', 'incandescence', 1),
      p('peacebringer_defensive', 'luminous_aura', 'white_dwarf', 20),
      ...DWARF_SUBS.map((n) => p('peacebringer_defensive', 'luminous_aura', n.toLowerCase(), 20)),
      p('peacebringer_defensive', 'luminous_aura', 'light_form', 32),
      p('inherent', 'inherent', 'cosmic_balance', 1),
    ],
  },
});

const IO: Enhancement = {
  type: 'io-generic',
  stat: 'Damage',
  level: 50,
  id: 'dam-io',
  name: 'Damage IO',
} as unknown as Enhancement;

/** A Peacebringer save in the exact legacy shape the migration targets: every
 *  power — picks and form sub-powers alike — stamped at the display level 50,
 *  with user slotting on two of the sub-powers. */
function legacyPeacebringerSave(): Build {
  const result = importExternalBuild(PB_JSON);
  expect(result.success, 'fixture build imported').toBe(true);
  const build = result.build!;
  build.serverId = 'homecoming';

  const stamp = (p: SelectedPower): SelectedPower => {
    const next: SelectedPower = { ...p, level: 50 };
    // Real user slotting on one Nova and one Dwarf sub-power: 3 slots, the
    // first one filled. This is what the migration was throwing away.
    if (next.internalName === 'Bright_Nova_Bolt' || next.internalName === 'White_Dwarf_Strike') {
      next.slots = [IO, null, null];
    }
    return next;
  };

  build.primary = { ...build.primary, powers: build.primary.powers.map(stamp) };
  build.secondary = { ...build.secondary, powers: build.secondary.powers.map(stamp) };
  return build;
}

function rehydrateFrom(build: Build) {
  localStorage.setItem(
    KEY,
    JSON.stringify({ state: composePersistedState(build, {}), version: 1 }),
  );
  return useBuildStore.persist.rehydrate();
}

describe('pick-level migration preserves auto-granted form sub-powers', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('relevels the picks (precondition: the migration actually fires)', async () => {
    await rehydrateFrom(legacyPeacebringerSave());

    const primary = useBuildStore.getState().build.primary.powers;
    const nova = primary.find((p) => p.internalName === 'Bright_Nova');
    expect(nova, 'Bright Nova survived').toBeDefined();
    // If this ever stops being true the migration stopped running and every
    // other assertion in this file becomes vacuous.
    expect(nova!.level, 'pick level repaired away from the legacy 50').not.toBe(50);
  });

  it('keeps every Nova and Dwarf sub-power', async () => {
    await rehydrateFrom(legacyPeacebringerSave());

    const { primary, secondary } = useBuildStore.getState().build;
    for (const sub of NOVA_SUBS) {
      expect(primary.powers.find((p) => p.internalName === sub), `${sub} survived`).toBeDefined();
    }
    for (const sub of DWARF_SUBS) {
      expect(secondary.powers.find((p) => p.internalName === sub), `${sub} survived`).toBeDefined();
    }
  });

  it('keeps the slots and enhancements the user put in sub-powers', async () => {
    await rehydrateFrom(legacyPeacebringerSave());

    const { primary, secondary } = useBuildStore.getState().build;
    const bolt = primary.powers.find((p) => p.internalName === 'Bright_Nova_Bolt');
    const strike = secondary.powers.find((p) => p.internalName === 'White_Dwarf_Strike');

    expect(bolt?.slots, 'Bright Nova Bolt slot count').toHaveLength(3);
    expect(bolt?.slots[0], 'Bright Nova Bolt enhancement').not.toBeNull();
    expect(strike?.slots, 'White Dwarf Strike slot count').toHaveLength(3);
    expect(strike?.slots[0], 'White Dwarf Strike enhancement').not.toBeNull();
  });

  it('restamps sub-power levels onto their parent form\'s corrected pick level', async () => {
    await rehydrateFrom(legacyPeacebringerSave());

    const { primary, secondary } = useBuildStore.getState().build;
    const novaLevel = primary.powers.find((p) => p.internalName === 'Bright_Nova')!.level;
    const dwarfLevel = secondary.powers.find((p) => p.internalName === 'White_Dwarf')!.level;

    // A sub-power left at the stale legacy 50 while its parent moved to a real
    // pick level misreports slot placement levels (see slot-levels.ts
    // addAutoGrantedPowers, which stamps every sub-power slot with p.level).
    for (const sub of NOVA_SUBS) {
      expect(primary.powers.find((p) => p.internalName === sub)!.level, `${sub} level`).toBe(novaLevel);
    }
    for (const sub of DWARF_SUBS) {
      expect(secondary.powers.find((p) => p.internalName === sub)!.level, `${sub} level`).toBe(dwarfLevel);
    }
  });

  it('leaves the sub-powers marked auto-granted and attributed to their form', async () => {
    await rehydrateFrom(legacyPeacebringerSave());

    const primary = useBuildStore.getState().build.primary.powers;
    for (const sub of NOVA_SUBS) {
      const sp = primary.find((p) => p.internalName === sub)!;
      expect(sp.isAutoGranted, `${sub} still auto-granted`).toBe(true);
      expect(sp.grantedByPower, `${sub} still attributed`).toBe('Bright_Nova');
    }
  });
});
