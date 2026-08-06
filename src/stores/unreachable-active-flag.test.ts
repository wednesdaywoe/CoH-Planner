// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset, getPowersetsForArchetype } from '@/data/powersets';
import { createEmptyBuild } from '@/types/build';
import type { Build } from '@/types/build';
import type { Power, SelectedPower } from '@/types/power';
import { shouldShowToggle } from '@/components/powers/power-row-utils';
import { useBuildStore } from '@/stores/buildStore';

/**
 * An `isActive` flag on a power the UI gives no toggle for must not survive a load.
 *
 * Such a flag is unreachable state: the calc's gate is `isAuto || isActive`, so the
 * power contributes to every dashboard total, while the row renders no control to turn
 * it off and no indicator that it is on. Reported 2026-08-05 — a Blaster's End of Time
 * and Future Pain were adding +16.4% global damage from their Defiance riders, and the
 * owner could find nothing anywhere to switch off.
 *
 * The flag gets there honestly: a Mids `.mbd` import maps Mids' `StatInclude` onto
 * `isActive` for every power it brings in (`mids-import/importer.ts`), and Mids happily
 * includes attacks. It also accumulates historically — `shouldShowToggle` has retired
 * toggles three times (the per-cast `damageBuff`/`rangeBuff` skip on attacks, snipes,
 * and caster-buff keys the calc cannot route), and each retirement left whatever was
 * already stored behind it.
 *
 * `syncBuildDefinitions` is the single funnel both import and localStorage rehydrate
 * pass through, which is why the repair lives there and why this drives the real store
 * rather than the helper.
 *
 * Four checks, because the obvious one passes vacuously: a repair that stripped EVERY
 * `isActive` would satisfy "the orphan is gone" and quietly switch off every armour
 * toggle in the game. So the exemptions are graded too, and the corpus is counted — a
 * classifier that started handing toggles to everything would make the whole file
 * trivially true.
 */

const AT = 'blaster';
const SET = 'blaster/temporal-manipulation';

/** A build holding `names` from one secondary set, every pick flagged active — the
 *  shape a Mids import produces. */
function activeBuild(setId: string, names: string[]): Build {
  const build = createEmptyBuild('homecoming');
  build.level = 50;
  build.archetype = { id: AT, name: 'Blaster', stats: null, inherent: null } as never;
  const set = getPowerset(setId)!;
  build.secondary = {
    id: set.id!,
    name: set.name,
    powers: names.map((n) => {
      const def = set.powers.find((p) => p.internalName === n)!;
      return { ...def, powerSet: set.id!, level: 1, slots: [null], isActive: true } as SelectedPower;
    }),
  };
  return build;
}

/** Round-trip through the real store load path (import → syncBuildDefinitions → state). */
function afterLoad(build: Build): SelectedPower[] {
  useBuildStore.getState().importBuild(JSON.stringify({ version: 4, build }));
  return useBuildStore.getState().build.secondary.powers;
}

beforeAll(async () => {
  await loadDataset('homecoming');
});

describe('an unreachable isActive flag does not survive a load', () => {
  it('drops the flag on the two reported powers', () => {
    const loaded = afterLoad(activeBuild(SET, ['End_of_Time', 'Future_Pain']));
    expect(loaded.map((p) => p.internalName).sort()).toEqual(['End_of_Time', 'Future_Pain']);
    for (const power of loaded) {
      expect(shouldShowToggle(power), `${power.internalName} unexpectedly has a toggle`).toBe(false);
      expect(power.isActive, `${power.internalName} kept an isActive the UI cannot clear`).toBeUndefined();
    }
  });

  it('keeps the flag on a power that DOES have a toggle', () => {
    // Chronological Selection is the same set's self-buff click — a toggle the owner can
    // see and clear, so its flag is reachable state and must be left alone. Without this
    // the repair could strip every flag and still pass the check above.
    const [power] = afterLoad(activeBuild(SET, ['Chronological_Selection']));
    expect(shouldShowToggle(power)).toBe(true);
    expect(power.isActive).toBe(true);
  });

  it('keeps the flag on toggles and autos, which no toggle-classifier decides', () => {
    // A Toggle always renders its toggle; an Auto contributes via `isAuto` whatever the
    // flag says. Both are exempted by power TYPE rather than by the classifier, so they
    // need their own check — `shouldShowToggle` returns false for an Auto.
    const build = createEmptyBuild('homecoming');
    build.level = 50;
    build.archetype = { id: AT, name: 'Blaster', stats: null, inherent: null } as never;
    // Found rather than named: the first set this archetype offers that carries BOTH
    // types. Hard-coding one couples the check to a set's current composition, which is
    // exactly what a rework changes.
    const byType = (s: { powers: readonly Power[] }, t: string) =>
      s.powers.find((p) => p.powerType?.toLowerCase() === t);
    const candidate = getPowersetsForArchetype(AT).find(
      (s) => byType(s, 'toggle') && byType(s, 'auto'),
    );
    expect(candidate, `no ${AT} powerset offers both a toggle and an auto`).toBeDefined();
    const set = getPowerset(candidate!.id!)!;
    const picks = [byType(set, 'toggle')!, byType(set, 'auto')!];
    build.secondary = {
      id: set.id!,
      name: set.name,
      powers: picks.map((def) => ({ ...def, powerSet: set.id!, level: 1, slots: [null], isActive: true } as SelectedPower)),
    };
    for (const power of afterLoad(build)) {
      expect(power.isActive, `${power.internalName} (${power.powerType}) lost its flag`).toBe(true);
    }
  });

  it('leaves most of the corpus toggleable — the repair is narrow, not a purge', () => {
    // If `shouldShowToggle` ever started answering true for everything (or false for
    // everything), every check above would pass for the wrong reason. Count instead.
    const set = getPowerset(SET)!;
    const withToggle = set.powers.filter((p) => shouldShowToggle(p)).length;
    // eslint-disable-next-line no-console
    console.log(`[unreachable-flag] ${SET}: ${withToggle}/${set.powers.length} powers show a toggle`);
    expect(withToggle).toBeGreaterThan(0);
    expect(withToggle).toBeLessThan(set.powers.length);
  });
});
