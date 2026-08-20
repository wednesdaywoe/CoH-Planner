import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { ioSetSlot } from '@/test/build-fixtures';
import {
  findIllegalSlots,
  powerIllegalSlotIndices,
  withoutIllegalSlots,
} from './build-enhancement-validation';
import { calculateCharacterTotals } from './calculations/character-totals';
// Shield Defense's internal names are permuted vs display names:
//   internal Battle_Agility → display "Active Defense" (mez Click, no set categories)
//   internal Active_Defense → display "Deflection" (def toggle, accepts Defense Sets)
import { BattleAgility } from '@/data/datasets/homecoming/powersets/stalker/secondary/shield-defense/battle-agility';
import { ActiveDefense } from '@/data/datasets/homecoming/powersets/stalker/secondary/shield-defense/active-defense';
import type { Build, SelectedPower } from '@/types';
import type { Enhancement } from '@/types/enhancement';

/**
 * Non-destructive illegal-enhancement handling.
 *
 * A defense IO set routed into the mez-only "Active Defense" (internal
 * Battle_Agility) — the classic import cross-wire — must not count toward stats
 * or set bonuses, while the identical set in a power that accepts Defense Sets
 * still does. The build itself is never mutated.
 */
describe('build enhancement legality', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  // Built by the picker's own factory: a hand-rolled literal was missing `aspects` (and the
  // piece's real name), which the engine's CharacterState rejects outright.
  const LOTG_PIECE_NAMES = ['Defense/Endurance', 'Defense/Recharge', 'Endurance/Recharge',
    'Defense/Endurance/Recharge', 'Defense', 'Defense/Increased Global Recharge Speed'];
  const lotgPiece = (pieceNum: number): Enhancement =>
    ioSetSlot('luck_of_the_gambler', LOTG_PIECE_NAMES[pieceNum - 1]);

  const power = (base: typeof BattleAgility, slots: (Enhancement | null)[]): SelectedPower =>
    ({ ...base, powerSet: 'stalker/shield-defense', level: 10, slots }) as unknown as SelectedPower;

  const buildWith = (powers: SelectedPower[]): Build => {
    const b = createEmptyBuild();
    b.level = 50;
    b.archetype = { id: 'stalker', name: 'Stalker', stats: null, inherent: null } as never;
    b.secondary = { id: 'stalker/shield-defense', name: 'Shield Defense', powers } as never;
    return b;
  };

  it('flags Defense sets slotted in the mez power, not in a Defense-accepting power', () => {
    const mez = power(BattleAgility, [lotgPiece(1), lotgPiece(2)]);
    const toggle = power(ActiveDefense, [lotgPiece(1), lotgPiece(2)]);
    expect(powerIllegalSlotIndices(mez)).toEqual([0, 1]);
    expect(powerIllegalSlotIndices(toggle)).toEqual([]);
  });

  it('findIllegalSlots reports the offending power + slot', () => {
    const build = buildWith([power(BattleAgility, [lotgPiece(1)])]);
    const illegal = findIllegalSlots(build);
    expect(illegal).toHaveLength(1);
    expect(illegal[0]).toMatchObject({
      category: 'secondary',
      powerName: 'Active Defense',
      internalName: 'Battle_Agility',
      slotIndex: 0,
    });
  });

  it('withoutIllegalSlots nulls illegal slots without mutating the original', () => {
    const build = buildWith([power(BattleAgility, [lotgPiece(1), lotgPiece(2)])]);
    const clean = withoutIllegalSlots(build);
    expect(clean).not.toBe(build);
    expect(clean.secondary.powers[0].slots).toEqual([null, null]);
    // original untouched
    expect(build.secondary.powers[0].slots[0]).not.toBeNull();
  });

  it('returns the same reference when nothing is illegal', () => {
    const build = buildWith([power(ActiveDefense, [lotgPiece(1), lotgPiece(2)])]);
    expect(withoutIllegalSlots(build)).toBe(build);
  });

  it('end-to-end: a hydrated build flags the mis-routed Shield Defense slots', async () => {
    const { hydrateBuild } = await import('./build-serialization');
    // The reported cross-wire: internal Battle_Agility ("Active Defense", mez)
    // holding 4× Luck of the Gambler + Shield Wall — as it arrives from the
    // real load path (slim slots, resolved against the dataset).
    const hydrated = hydrateBuild({
      archetype: { id: 'stalker', name: 'Stalker' },
      level: 50,
      primary: { id: 'stalker/electrical-melee', powers: [] },
      secondary: {
        id: 'stalker/shield-defense',
        powers: [
          {
            name: 'Active Defense',
            internalName: 'Battle_Agility',
            level: 10,
            slots: [
              ioSetSlot('luck_of_the_gambler', 'Defense/Increased Global Recharge Speed'),
              ioSetSlot('luck_of_the_gambler', 'Defense/Recharge'),
              ioSetSlot('shield_wall', 'Teleportation Protection, +Res(All)'),
            ],
          },
          {
            name: 'Deflection', // internal Active_Defense — a legal Defense toggle
            internalName: 'Active_Defense',
            level: 16,
            slots: [{ type: 'io-generic', stat: 'Recharge', level: 50 }],
          },
        ],
      },
    });

    const illegal = findIllegalSlots(hydrated);
    // All three defense set pieces in the mez power are flagged; the Recharge
    // IO in the legal toggle is not.
    expect(illegal.map((s) => s.powerName)).toEqual(['Active Defense', 'Active Defense', 'Active Defense']);
    expect(illegal.every((s) => s.internalName === 'Battle_Agility')).toBe(true);
  });

  it('calc excludes set bonuses from an illegal placement but keeps a legal one', () => {
    const sixPieces = [1, 2, 3, 4, 5, 6].map(lotgPiece);
    const illegalBuild = buildWith([power(BattleAgility, sixPieces)]);
    const legalBuild = buildWith([power(ActiveDefense, sixPieces)]);

    const illegal = calculateCharacterTotals(illegalBuild);
    const legal = calculateCharacterTotals(legalBuild);

    // The legal placement contributes Luck of the Gambler set bonuses; the illegal one
    // contributes none. Counted off `bonusTracking` — the engine publishes set-bonus
    // provenance there (and leaves the legacy `setBonuses` bag empty by design).
    const bonusStats = (r: typeof legal) =>
      Object.values(r.bonusTracking).reduce((n, byValue) => n + Object.keys(byValue).length, 0);
    expect(bonusStats(legal)).toBeGreaterThan(0);
    expect(bonusStats(illegal)).toBe(0);
  });
});
