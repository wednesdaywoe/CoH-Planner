// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import type { Build } from '@/types/build';
import type { SelectedPower } from '@/types/power';
import { useBuildStore } from '@/stores/buildStore';
import { enhancementAllowedInPower } from '@/utils/enhancement-eligibility';
import { getIOSetsForPower } from '@/data/io-sets';
import { createIOSetEnhancement } from '@/data/enhancement-registry';

/**
 * End-to-end proof that loading a build heals a poisoned slotting allow-list.
 *
 * The Rebirth Psionic Tornado / Ragnarok report (2026-08-13): a stored epic
 * power carried `allowedEnhancements: []` and no `allowedSetCategories` — the
 * minimal-fallback shape a power hydrates into when its epic pool def is
 * unreachable (a build hydrated while the wrong dataset was active, on an app
 * version that ordered boot that way). The persisted store keeps whole
 * SelectedPower objects, so the poison outlived every later boot: the picker
 * (a fresh def lookup) listed Ragnarok while the legality check (the stored
 * record) rejected every piece of it.
 *
 * `syncBuildDefinitions` is the funnel every import and rehydrate passes
 * through, and it now repairs the two allow-lists from the current def the
 * same way it repairs the mode gates. This drives the real store `importBuild`
 * path with a v1 (full-object) payload, which lands the poisoned record in the
 * funnel unmodified.
 */

const poisonedTornado = (): SelectedPower =>
  ({
    name: 'Psionic Tornado',
    internalName: 'Psionic_Tornado',
    powerSet: 'psionic_mastery',
    level: 50,
    available: 40,
    maxSlots: 6,
    slots: [null, null, null],
    allowedEnhancements: [],
    description: '',
    powerType: 'Click',
    effects: {},
  } as unknown as SelectedPower);

beforeAll(async () => {
  await loadDataset('rebirth');
});

describe('syncBuildDefinitions self-heals a poisoned allow-list on load', () => {
  let healed: SelectedPower;

  beforeAll(() => {
    const poisoned: Build = createEmptyBuild('rebirth');
    poisoned.archetype = { id: 'controller', name: 'Controller', stats: null, inherent: null } as never;
    poisoned.level = 50;
    poisoned.epicPool = {
      id: 'psionic_mastery',
      name: 'Psionic Mastery',
      powers: [poisonedTornado()],
    } as Build['epicPool'];

    // v1 payload: a FULL build object, taken as-is by importBuild — the only
    // entry that reaches syncBuildDefinitions without hydratePowers re-fattening
    // the record first, i.e. the same shape a persisted poisoned store carries.
    const json = JSON.stringify({ version: 1, build: poisoned });
    useBuildStore.getState().importBuild(json);
    healed = useBuildStore.getState().build.epicPool!.powers
      .find((p) => p.internalName === 'Psionic_Tornado')!;
  });

  it('restores the allow-lists from the current definition', () => {
    expect(healed.allowedEnhancements).toContain('Damage');
    expect(healed.allowedSetCategories).toContain('Targeted AoE Damage');
  });

  it('accepts a Ragnarok piece exactly as the picker offers it', () => {
    const ragnarok = getIOSetsForPower(healed.allowedSetCategories ?? [])
      .find((s) => s.name === 'Ragnarok');
    expect(ragnarok).toBeDefined();
    const piece = createIOSetEnhancement(ragnarok!, ragnarok!.pieces[0], 0, {
      attuned: false,
      level: 50,
    });
    expect(enhancementAllowedInPower(piece, healed)).toBe(true);
  });
});
