// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { POWER_PICK_LEVELS } from '@/data';
import { useBuildStore } from '@/stores/buildStore';
import type { SelectedPower } from '@/types/power';

/**
 * B4 (2026-08-17): a Stalker removed low-level powers and re-picked epics in
 * by-set mode. Fire Ball's floor is 44 and every pick level >= 44 was taken —
 * the only free pick sat at level 4 — so addPower's `?? 50` fallback stamped
 * level 50, which isn't a pick level. The power stayed selected and slotted
 * but the by-level view had no row for it, and the level-4 pick rendered
 * empty. Nothing told the user.
 *
 * The fix: addPower's no-free-level case now runs the same relevel the
 * rehydrate migration uses — earlier picks cascade into the free low levels,
 * freeing a legal level for the new power. importBuild runs the relevel too,
 * so a persisted export carrying the old level-50 stamp heals on load instead
 * of on the next full-page rehydrate.
 */

// Mirrors the reporter's build shape (v4 slim): primary/secondary level-1
// picks, three pool powers pinned on 44/47/49, and Blaze Mastery. With the
// epic tail present, every pick level >= Fire Ball's 44 floor is occupied
// while low levels stay free — the exact stuck state.
const slimBuild = (epicPowers: { name: string; internalName: string; level: number }[]) =>
  JSON.stringify({
    version: 4,
    build: {
      name: 'B4 repro',
      serverId: 'homecoming',
      archetype: { id: 'stalker', name: 'Stalker' },
      level: 50,
      progressionMode: 'auto',
      primary: {
        id: 'stalker/ice-melee',
        name: 'Ice Melee',
        powers: [{ name: 'Ice Sword', internalName: 'Ice_Sword', level: 1, slots: [null] }],
      },
      secondary: {
        id: 'stalker/invulnerability',
        name: 'Invulnerability',
        powers: [{ name: 'Hide', internalName: 'Hide', level: 1, slots: [null] }],
      },
      pools: [
        { id: 'speed', name: 'Speed', powers: [{ name: 'Hasten', internalName: 'Hasten', level: 44, slots: [null] }] },
        { id: 'leaping', name: 'Leaping', powers: [{ name: 'Combat Jumping', internalName: 'Combat_Jumping', level: 47, slots: [null] }] },
        { id: 'fighting', name: 'Fighting', powers: [{ name: 'Kick', internalName: 'Kick', level: 49, slots: [null] }] },
      ],
      epicPool: {
        id: 'blaze_mastery',
        name: 'Blaze Mastery',
        powers: [
          { name: 'Char', internalName: 'Char', level: 35, slots: [null] },
          { name: 'Melt Armor', internalName: 'Melt_Armor', level: 41, slots: [null] },
          ...epicPowers,
        ].map((p) => ({ ...p, slots: [null] })),
      },
      inherents: [],
      accolades: [],
      sets: {},
      settings: { origin: 'Natural' },
      slotOrder: [],
    },
  });

const pickedPowers = (): SelectedPower[] => {
  const b = useBuildStore.getState().build;
  return [
    ...b.primary.powers,
    ...b.secondary.powers,
    ...b.pools.flatMap((p) => p.powers),
    ...(b.epicPool?.powers ?? []),
  ].filter((p) => !p.isAutoGranted);
};

const expectLegalPickLevels = () => {
  const powers = pickedPowers();
  const pickSet = new Set(POWER_PICK_LEVELS);
  for (const p of powers) {
    expect(pickSet.has(p.level), `${p.internalName} at non-pick level ${p.level}`).toBe(true);
  }
  const nonLevelOne = powers.filter((p) => p.level !== 1).map((p) => p.level);
  expect(new Set(nonLevelOne).size, `duplicate pick levels: ${nonLevelOne}`).toBe(nonLevelOne.length);
};

beforeAll(async () => {
  await loadDataset('homecoming');
}, 120_000);

afterEach(() => {
  localStorage.clear();
  useBuildStore.getState().resetBuild();
});

describe('B4 — an epic pick with no free legal level', () => {
  it('addPower relevels instead of stamping the invisible level 50', () => {
    const ok = useBuildStore.getState().importBuild(slimBuild([]));
    expect(ok).toBe(true);

    // Fire Ball: floor 44 (available 43), and 44/47/49 are all occupied.
    useBuildStore.getState().addPower('epic', {
      internalName: 'Fire_Ball',
      name: 'Fire Ball',
      powerSet: 'blaze_mastery',
      available: 43,
      level: 1,
      slots: [null],
    } as unknown as SelectedPower);

    const fireBall = useBuildStore.getState().build.epicPool?.powers
      .find((p) => p.internalName === 'Fire_Ball');
    expect(fireBall, 'Fire Ball was added').toBeDefined();
    // The cascade frees exactly its floor: Hasten/CJ/Kick drop into the open
    // low levels and Fire Ball lands on 44.
    expect(fireBall!.level).toBe(44);
    expectLegalPickLevels();
  });

  it('importBuild heals an export carrying the old level-50 stamp', () => {
    const ok = useBuildStore.getState().importBuild(
      slimBuild([{ name: 'Fire Ball', internalName: 'Fire_Ball', level: 50 }]),
    );
    expect(ok).toBe(true);

    const fireBall = useBuildStore.getState().build.epicPool?.powers
      .find((p) => p.internalName === 'Fire_Ball');
    expect(fireBall, 'Fire Ball survived import').toBeDefined();
    expect(fireBall!.level).toBe(44);
    expectLegalPickLevels();
  });
});
