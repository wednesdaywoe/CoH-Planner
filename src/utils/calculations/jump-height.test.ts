import { describe, it, expect, beforeAll } from 'vitest';
import { calculateCharacterTotals } from './character-totals';
import { createEmptyBuild } from '@/types/build';
import { getInherentPowerDef } from '@/data';
import { loadDataset } from '@/data/dataset';
import { applyMovementBuff } from '@/data/core/movement-constants';

/**
 * Jump HEIGHT is table-aware like every other movement attrib: `scale ×
 * AT-table × 100`. The bin deliberately gives Ninja Run / Beast Run the big
 * `Melee_Leap` table (27.8 @50) while Sprint / prestige sprints get flat
 * `Melee_Ones` (1.0) — a distinction that only matters if the table is applied.
 *
 * This regressed TWICE to a bare-scale reading (Ninja Run +25% → ~5 ft), which
 * is an order of magnitude below the in-game ~25-30 ft rooftop leap Ninja Run
 * grants (Redlynne, Rebirth, 2026-06-16). These lock the table-aware behavior.
 */
describe('jump height (table-aware Melee_Leap)', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  const buildWithNinjaRun = (active: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const b: any = createEmptyBuild();
    b.serverId = 'rebirth';
    b.level = 50;
    b.archetype = { id: 'mastermind', name: 'Mastermind', stats: null, inherent: null };
    const ninja = getInherentPowerDef('Ninja_Run')!;
    b.inherents = [{ ...ninja, isActive: active, slots: [] }];
    return b;
  };

  const totals = (active: boolean) =>
    calculateCharacterTotals(buildWithNinjaRun(active), false, undefined, { combatMode: false });

  const feet = (pct: number) => applyMovementBuff('jumpHeight', pct).value;

  it('Ninja Run adds ~+695% jump height (0.25 × Melee_Leap 27.8), NOT the bare +25%', () => {
    expect(totals(true).globalBonuses.jumpHeight).toBeCloseTo(695, 0);
  });

  it('toggling Ninja Run moves jump height an order of magnitude in feet', () => {
    // Off: just the 4 ft base. On: clears a ~25 ft rooftop ledge in game.
    expect(feet(totals(false).globalBonuses.jumpHeight)).toBeCloseTo(4.0, 1);
    const onFt = feet(totals(true).globalBonuses.jumpHeight);
    expect(onFt).toBeGreaterThan(25);
    expect(onFt).toBeCloseTo(31.8, 1); // 4 × (1 + 6.95)
  });
});
