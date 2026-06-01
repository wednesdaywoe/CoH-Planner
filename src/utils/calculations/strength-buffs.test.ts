import { describe, it, expect, beforeAll } from 'vitest';
import { collectStrengthBuffs, calculateCharacterTotals } from './character-totals';
import { loadDataset } from '@/data/dataset';
import { getEpicPool } from '@/data/epic-pools';
import { createEmptyBuild } from '@/types/build';
import { calcThreeTier } from '@/components/info/powerDisplayUtils';

/**
 * Tests for the Power Boost / +Strength mechanic.
 *
 * collectStrengthBuffs is exercised with synthetic powers whose specialBuff
 * entries use the `Melee_Ones` table — resolveScaledEffect returns `scale × 1`
 * for *_Ones tables, so the resolved strength fraction equals the raw scale,
 * making assertions deterministic without depending on AT modifier tables.
 */

const ONES = 'Melee_Ones';
const s = (scale: number) => ({ scale, table: ONES });

// Minimal PowerWithToggle-shaped object (the type is module-private).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mk = (over: any) => ({ name: 'P', internalName: 'P', powerType: 'Click', isActive: false, ...over } as any);

// A Power Boost-like specialBuff: defense (all + positional + typed), tohit,
// mez, heal, absorb, endmod, movement — all at the same scale, mirroring the
// real binary which enumerates every defense/mez sub-attribute uniformly.
const powerBoostSpecial = (scale: number) => ({
  defense: s(scale), melee: s(scale), ranged: s(scale), aoe: s(scale),
  smashing: s(scale), lethal: s(scale), fire: s(scale),
  hold: s(scale), stun: s(scale), sleep: s(scale), confuse: s(scale), fear: s(scale), immobilize: s(scale),
  tohit: s(scale), heal: s(scale), absorb: s(scale), endurance: s(scale), movement: s(scale),
});

describe('collectStrengthBuffs', () => {
  it('returns zero when no strength powers are active', () => {
    const sb = collectStrengthBuffs([
      mk({ internalName: 'PowerBoost', isActive: false, effects: { specialBuff: powerBoostSpecial(1.2) } }),
    ], 'controller', 50);
    expect(sb).toEqual({ defense: 0, toHit: 0, heal: 0, absorb: 0, endMod: 0, movement: 0, mez: 0 });
  });

  it('collapses uniform defense/mez sub-keys to a single representative value (no 12x overcount)', () => {
    const sb = collectStrengthBuffs([
      mk({ internalName: 'PowerBoost', isActive: true, effects: { specialBuff: powerBoostSpecial(1.2) } }),
    ], 'controller', 50);
    // defense and mez are the MAX of their sub-keys (uniform 1.2), not the sum
    expect(sb.defense).toBeCloseTo(1.2, 6);
    expect(sb.mez).toBeCloseTo(1.2, 6);
    // single-keyed aspects pass through
    expect(sb.toHit).toBeCloseTo(1.2, 6);
    expect(sb.heal).toBeCloseTo(1.2, 6);
    expect(sb.absorb).toBeCloseTo(1.2, 6);
    expect(sb.endMod).toBeCloseTo(1.2, 6);
    expect(sb.movement).toBeCloseTo(1.2, 6);
  });

  it('counts Auto powers as active even without an explicit isActive toggle', () => {
    const sb = collectStrengthBuffs([
      mk({ internalName: 'AutoBuff', powerType: 'Auto', isActive: false, effects: { specialBuff: { defense: s(0.5) } } }),
    ], 'controller', 50);
    expect(sb.defense).toBeCloseTo(0.5, 6);
  });

  it('sums strength across multiple active strength powers', () => {
    const sb = collectStrengthBuffs([
      mk({ internalName: 'PowerBoost', isActive: true, effects: { specialBuff: { defense: s(1.2), tohit: s(1.2) } } }),
      mk({ internalName: 'PowerBuildUp', isActive: true, effects: { specialBuff: { defense: s(0.66), tohit: s(0.66) } } }),
    ], 'controller', 50);
    expect(sb.defense).toBeCloseTo(1.86, 6);
    expect(sb.toHit).toBeCloseTo(1.86, 6);
  });

  it('honors self-stacking via maxStacks + stacksLinear and the targets-hit slider', () => {
    const eff = { specialBuff: { defense: s(1.0), hold: s(1.0) }, maxStacks: 2, stacksLinear: ['specialBuff'] };
    // 2 stacks → doubled
    const two = collectStrengthBuffs(
      [mk({ internalName: 'PB', isActive: true, effects: eff })],
      'controller', 50, { PB: 2 },
    );
    expect(two.defense).toBeCloseTo(2.0, 6);
    expect(two.mez).toBeCloseTo(2.0, 6);
    // slider beyond maxStacks is capped at 2
    const capped = collectStrengthBuffs(
      [mk({ internalName: 'PB', isActive: true, effects: eff })],
      'controller', 50, { PB: 5 },
    );
    expect(capped.defense).toBeCloseTo(2.0, 6);
  });

  it('ignores ally-only / non-specialBuff powers and never invents damage', () => {
    const sb = collectStrengthBuffs([
      mk({ internalName: 'Weave', isActive: true, effects: { defenseBuff: { melee: s(0.5) } } }), // flat def, no specialBuff
    ], 'controller', 50);
    // No specialBuff → no strength at all
    expect(sb).toEqual({ defense: 0, toHit: 0, heal: 0, absorb: 0, endMod: 0, movement: 0, mez: 0 });
  });
});

describe('Power Boost data integrity + endurance regression (rebirth)', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  it('Primal Forces Power Boost is a pure strength buff (no phantom damageBuff/flat defenseBuff)', () => {
    const pool = getEpicPool('primal_forces_mastery');
    expect(pool).toBeTruthy();
    const pb = pool!.powers.find(p => p.internalName === 'Power_Boost');
    expect(pb).toBeTruthy();
    const eff = pb!.effects as Record<string, unknown>;
    expect(eff.specialBuff).toBeTruthy();
    expect(eff.damageBuff).toBeUndefined();
    expect(eff.defenseBuff).toBeUndefined();
    expect(eff.tohitBuff).toBeUndefined();
  });

  it('Power Boost (a Click) costs ~9.75 end, not the doubled 19.5', () => {
    const pool = getEpicPool('primal_forces_mastery');
    const pb = pool!.powers.find(p => p.internalName === 'Power_Boost');
    const endCost = (pb!.effects as { enduranceCost?: number }).enduranceCost;
    expect(endCost).toBeCloseTo(9.75, 5);
  });
});

describe('Power Info Final formula applies strength (calcThreeTier)', () => {
  it('mez duration Final = base × (1 + enh + strength), strength lands only in Final', () => {
    // base 10s hold, +0.4 slotted enh, +1.2 Power Boost mez strength
    const t = calcThreeTier('hold', 10, { hold: 0.4 }, { hold: 1.2 });
    expect(t.base).toBeCloseTo(10, 6);
    expect(t.enhanced).toBeCloseTo(14, 6);      // strength NOT in the Enhanced tier
    expect(t.final).toBeCloseTo(26, 6);          // 10 × (1 + 0.4 + 1.2)
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildWith(powers: { pool?: boolean; powerBoostActive?: boolean }): any {
  const b = createEmptyBuild();
  b.serverId = 'rebirth';
  b.level = 50;
  b.archetype = { id: 'controller', name: 'Controller', stats: null, inherent: null } as any;
  if (powers.pool) {
    b.pools = [{ id: 'leaping', name: 'Leaping', powers: [
      { internalName: 'Combat_Jumping', name: 'Combat Jumping', isActive: true, slots: [] },
    ] }] as any;
  }
  b.epicPool = { id: 'primal_forces_mastery', name: 'Primal Forces Mastery', powers: [
    { internalName: 'Power_Boost', name: 'Power Boost', isActive: !!powers.powerBoostActive, slots: [] },
  ] } as any;
  return b;
}

describe('Power Boost integration — General totals (rebirth, controller)', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  it('multiplies an active defense power’s contribution when Power Boost is ON', () => {
    const off = calculateCharacterTotals(buildWith({ pool: true, powerBoostActive: false }), false, undefined, { combatMode: true });
    const on = calculateCharacterTotals(buildWith({ pool: true, powerBoostActive: true }), false, undefined, { combatMode: true });
    // Combat Jumping alone provides positive melee defense...
    expect(off.globalBonuses.defMelee).toBeGreaterThan(0);
    // ...and Power Boost (a strong +Strength buff, ~+120%) roughly doubles it.
    expect(on.globalBonuses.defMelee).toBeGreaterThan(off.globalBonuses.defMelee);
    expect(on.globalBonuses.defMelee / off.globalBonuses.defMelee).toBeGreaterThan(2);
    // strengthDefense is surfaced on globalBonuses for the Power Info display.
    expect(on.globalBonuses.strengthDefense).toBeGreaterThan(1);
    expect(off.globalBonuses.strengthDefense).toBe(0);
  });

  it('adds NOTHING on its own — "twice nothing is still nothing"', () => {
    const off = calculateCharacterTotals(buildWith({ pool: false, powerBoostActive: false }), false, undefined, { combatMode: true });
    const on = calculateCharacterTotals(buildWith({ pool: false, powerBoostActive: true }), false, undefined, { combatMode: true });
    // No defense powers → Power Boost yields no flat defense whether on or off.
    expect(off.globalBonuses.defMelee).toBe(0);
    expect(on.globalBonuses.defMelee).toBe(0);
    // And it never fabricates damage.
    expect(on.globalBonuses.damage).toBe(off.globalBonuses.damage);
  });
});
