import { describe, it, expect, beforeAll } from 'vitest';
import { collectStrengthBuffs } from './character-totals';
import { legacyCalculateCharacterTotals as calculateCharacterTotals } from './legacy-totals.oracle';
import { loadDataset } from '@/data/dataset';
import { getEpicPool } from '@/data/epic-pools';
import { createEmptyBuild } from '@/types/build';
import { calcThreeTier } from '@/components/info/powerDisplayUtils';
import { shouldShowToggle } from '@/components/powers/power-row-utils';
import { getPowerset } from '@/data/powersets';
import { getTableValue } from '@/data/at-tables';

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

/**
 * Graded against the TS ORACLE, not the engine, deliberately.
 *
 * These cases feed the calc SYNTHETIC power definitions — hand-authored `atoms` tuples on a
 * power the dataset does not contain — to pin one applier rule in isolation. The engine cannot
 * consume that: it resolves a selected power's effects from its own contract bundle by
 * (powerSet, internalName), so a fabricated def resolves to nothing and the case would grade an
 * empty result rather than the rule it describes. `legacyCalculateCharacterTotals` is the same
 * calculation over the build object, kept as the independent oracle `serverParity` diffs the
 * engine against on all three datasets — so the rule stays graded, and the engine's own
 * agreement with this calc stays graded there, on real powers.
 */
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

  it('excludes Foe-targeted specialBuff (legacy -Special debuffs like Benumb/Time Stop)', () => {
    const sb = collectStrengthBuffs([
      mk({ internalName: 'TimeStop', isActive: true, targetType: 'Foe', effects: { specialBuff: { hold: s(1.0), immobilize: s(1.0) } } }),
    ], 'controller', 50);
    expect(sb.mez).toBe(0);
    expect(sb).toEqual({ defense: 0, toHit: 0, heal: 0, absorb: 0, endMod: 0, movement: 0, mez: 0 });
  });
});

describe('shouldShowToggle — Power Boost family is activatable', () => {
  it('shows a toggle for a self Click with only specialBuff (Power Boost)', () => {
    expect(shouldShowToggle({ powerType: 'Click', targetType: 'Self', effects: { specialBuff: { defense: s(0.66) } } })).toBe(true);
  });
  it('still shows a toggle for Build Up (self Click with damageBuff)', () => {
    expect(shouldShowToggle({ powerType: 'Click', targetType: 'Self', effects: { damageBuff: { scale: 8, table: 'Melee_Buff_Dmg' } } })).toBe(true);
  });
  it('does NOT show a self toggle for a Foe Click whose only buff-ish field is a legacy specialBuff', () => {
    expect(shouldShowToggle({ powerType: 'Click', targetType: 'Foe', effects: { specialBuff: { hold: s(1.0) } } })).toBe(false);
  });
  it('does NOT show a toggle for a plain damage Click', () => {
    expect(shouldShowToggle({ powerType: 'Click', targetType: 'Foe', damage: { type: 'Smashing', scale: 1 }, effects: {} })).toBe(false);
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

describe('Mez duration surfacing — prefer PvE template over PvP (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  // Homecoming holds carry both a PvE template (e.g. Ranged_Immobilize) and a
  // PvP one (Ranged_PvPMez). The PvP table has no PvE AT-table entry, so if the
  // converter's "higher magnitude wins" rule picked it, the mez duration
  // (scale × table) silently vanished. The fix prefers the PvE template.
  const cases: Array<[string, string, string]> = [
    ['controller/mind-control', 'Dominate', 'hold'],
    ['controller/mind-control', 'Total_Domination', 'hold'],
    ['controller/mind-control', 'Mesmerize', 'sleep'],
  ];

  for (const [psId, internalName, mezKey] of cases) {
    it(`${internalName} ${mezKey} uses a resolvable PvE table (duration surfaces)`, () => {
      const ps = getPowerset(psId);
      expect(ps, `powerset ${psId}`).toBeTruthy();
      const power = ps!.powers.find(p => p.internalName === internalName);
      expect(power, internalName).toBeTruthy();
      const mez = (power!.effects as Record<string, { scale: number; table: string; mag?: number }>)[mezKey];
      expect(mez, `${internalName}.${mezKey}`).toBeTruthy();
      // Not the PvP table…
      expect(mez.table).not.toMatch(/pvp/i);
      // …and the AT table resolves, so duration = scale × table is computable & positive.
      const tableVal = getTableValue('controller', mez.table, 50);
      expect(tableVal, `table ${mez.table} resolves`).toBeGreaterThan(0);
      expect(mez.scale * (tableVal as number)).toBeGreaterThan(0);
    });
  }
});

// Guards the damage-buff AT tables (Melee_Buff_Dmg / Ranged_Buff_Dmg) that were
// missing from the extractor allowlist — without them, every damage buff (Build
// Up, Soul Drain, Against All Odds, …) fell back to a flat 0.10, over-valuing
// low-damage ATs and under-valuing high-damage ones. at-tables is a layered
// output outside the regen-diff guard, so this focused test is the backstop
// against a future re-extract silently dropping them.
describe('damage-buff AT tables (Melee/Ranged_Buff_Dmg)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('resolve to AT-specific values, not the generic 0.10 fallback', () => {
    // Tanker is a low-damage AT (0.0875 → Build Up scale 8 = +70%);
    // Blaster/Scrapper are high (0.125 → +100%). Pre-fix all read 0.10 (+80%).
    expect(getTableValue('tanker', 'melee_buff_dmg', 50)).toBeCloseTo(0.0875, 4);
    expect(getTableValue('blaster', 'melee_buff_dmg', 50)).toBeCloseTo(0.125, 4);
    expect(getTableValue('scrapper', 'melee_buff_dmg', 50)).toBeCloseTo(0.125, 4);
    // Ranged variant present too (used by Aim and ranged damage buffs).
    expect(getTableValue('blaster', 'ranged_buff_dmg', 50)).toBeGreaterThan(0);
  });

  it('Build Up resolves to its AT-accurate value via the table (not 0.10)', () => {
    // Tanker Build Up (damageBuff scale 8) → 8 × 0.0875 = 0.70 (+70%), not 0.80.
    const ps = getPowerset('tanker/battle-axe');
    const buildUp = ps?.powers.find(p => p.internalName === 'Build_Up');
    expect(buildUp, 'Build_Up').toBeTruthy();
    const dmgBuff = (buildUp!.effects as Record<string, { scale: number; table: string }>).damageBuff;
    expect(dmgBuff?.table).toBe('Melee_Buff_Dmg');
    const resolved = dmgBuff.scale * (getTableValue('tanker', dmgBuff.table, 50) as number);
    expect(resolved).toBeCloseTo(0.70, 2);
  });
});
