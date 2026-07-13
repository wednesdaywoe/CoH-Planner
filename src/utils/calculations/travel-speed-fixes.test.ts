import { describe, it, expect, beforeAll } from 'vitest';
import { calculateCharacterTotals } from './character-totals';
import { createEmptyBuild } from '@/types/build';
import { getInherentPowerDef } from '@/data';
import { getPowerPool } from '@/data/power-pools';
import { loadDataset } from '@/data/dataset';
import {
  getEffectiveMovementCaps,
  MOVEMENT_CAPS,
  MPH_PER_SCALE,
} from '@/data/core/movement-constants';
import type { MovementEffect } from '@/types/power';

/**
 * Travel-speed correctness guards (bug report 2026-07-12):
 *
 *   1. Hurdle's JumpingSpeed (0.5 × Melee_SpeedJumping = +124.5% @50) was
 *      silently dropped — FITNESS_POWER_EFFECTS listed only jumpHeight.
 *   2. TravelBuff suppression: CJ / SJ / SS-momentum / Fly / Ninja Run share
 *      the binary kTravelBuff suppress group — only the strongest applies per
 *      stat. They all stacked additively before.
 *   3. Super Speed's run buff showed the aspect=Maximum CAP raise
 *      (1.938 × Melee_Ones) instead of the real buff (1.0 × Melee_SpeedRunning
 *      = +350%) — the converter's bag collapse. Same for SJ (1.65 vs
 *      1.0 × Melee_SpeedJumping) and Fly (2.0475 vs 1.1788 × Melee_SpeedFlying).
 *   4. Movement caps are data-driven from `effects.movementCapBump`
 *      (aspect=Maximum templates) instead of a hardcoded table, and combat
 *      mode only removes the bumps the binary marks suppressible (SJ's,
 *      Afterburner's) — not SS's or Fly's.
 *   5. In-combat suppression: buffs carrying `Suppress ActivateAttackClick`
 *      (SS run, SJ jump, Ninja Run) drop in combat mode; Combat Jumping has
 *      no suppress events and persists — that's its whole point.
 *
 * All expected values are HC L50: Melee_SpeedRunning 3.5, Melee_SpeedJumping
 * 2.49, Melee_Leap 27.8, Melee_Ones 1.0 (verified against powers.bin and the
 * CoD2 `.powers` oracle).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyBuild = any;

const poolPower = (poolId: string, internalName: string, active = true) => {
  const pool = getPowerPool(poolId);
  const def = pool?.powers.find((p) => p.internalName === internalName);
  if (!def) throw new Error(`pool power not found: ${poolId}/${internalName}`);
  return { ...def, isActive: active, slots: [] };
};

const makeBuild = (opts: {
  pools?: { id: string; powers: ReturnType<typeof poolPower>[] }[];
  inherents?: object[];
}): AnyBuild => {
  const b: AnyBuild = createEmptyBuild();
  b.serverId = 'homecoming';
  b.level = 50;
  b.archetype = { id: 'scrapper', name: 'Scrapper', stats: null, inherent: null };
  b.pools = (opts.pools ?? []).map((p) => ({ id: p.id, name: p.id, powers: p.powers }));
  b.inherents = opts.inherents ?? [];
  return b;
};

const totals = (b: AnyBuild, combatMode = false) =>
  calculateCharacterTotals(b, false, undefined, { combatMode }).globalBonuses;

const breakdownOf = (b: AnyBuild, key: string, combatMode = false) =>
  calculateCharacterTotals(b, false, undefined, { combatMode }).breakdown.get(key);

describe('travel-speed fixes (HC)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  // ---- 1. Hurdle jump speed ------------------------------------------------
  it('Hurdle contributes BOTH jump height (+167%) and jump speed (+124.5%)', () => {
    const hurdle = getInherentPowerDef('Hurdle')!;
    const b = makeBuild({ inherents: [{ ...hurdle, inherentCategory: 'fitness', isActive: true, slots: [] }] });
    const g = totals(b);
    expect(g.jumpHeight).toBeCloseTo(166.8, 0); // 0.06 × 27.8
    expect(g.jumpSpeed).toBeCloseTo(124.5, 0);  // 0.5 × 2.49 — was 0
  });

  // ---- 3. Super Speed's real run buff --------------------------------------
  it('Super Speed grants +350% run (1.0 × Melee_SpeedRunning), not the 193.8% cap-raise value', () => {
    const b = makeBuild({ pools: [{ id: 'speed', powers: [poolPower('speed', 'Super_Speed')] }] });
    expect(totals(b).runSpeed).toBeCloseTo(350, 0);
  });

  it('Super Jump grants +249% jump speed (1.0 × Melee_SpeedJumping), not the 165% cap-raise value', () => {
    const b = makeBuild({ pools: [{ id: 'leaping', powers: [poolPower('leaping', 'Long_Jump')] }] });
    const g = totals(b);
    expect(g.jumpSpeed).toBeCloseTo(249, 0);
    expect(g.jumpHeight).toBeCloseTo(2780, 0); // 1.0 × 27.8
  });

  // ---- 2. TravelBuff suppression -------------------------------------------
  it('Combat Jumping + Super Jump do NOT stack — strongest TravelBuff member wins per stat', () => {
    const cj = poolPower('leaping', 'Combat_Jumping');
    const sj = poolPower('leaping', 'Long_Jump');
    const both = totals(makeBuild({ pools: [{ id: 'leaping', powers: [cj, sj] }] }));
    const sjOnly = totals(makeBuild({ pools: [{ id: 'leaping', powers: [sj] }] }));
    // CJ alone: +200% height (2.0 × Melee_Ones), +1% speed.
    const cjOnly = totals(makeBuild({ pools: [{ id: 'leaping', powers: [cj] }] }));
    expect(cjOnly.jumpHeight).toBeCloseTo(200, 0);
    // Together = SJ's values, not the sum.
    expect(both.jumpHeight).toBeCloseTo(sjOnly.jumpHeight, 5);
    expect(both.jumpSpeed).toBeCloseTo(sjOnly.jumpSpeed, 5);
  });

  it("Super Speed's momentum jump effects are suppressed by Super Jump", () => {
    const ss = poolPower('speed', 'Super_Speed');
    const sj = poolPower('leaping', 'Long_Jump');
    // SS alone: momentum +27.8% height (0.1 × Melee_Leap), +18.675% jump speed.
    const ssOnly = totals(makeBuild({ pools: [{ id: 'speed', powers: [ss] }] }));
    expect(ssOnly.jumpHeight).toBeCloseTo(278, 0);
    expect(ssOnly.jumpSpeed).toBeCloseTo(18.7, 0);
    // With SJ, only SJ's (stronger) TravelBuff jump values apply.
    const both = totals(makeBuild({
      pools: [
        { id: 'speed', powers: [ss] },
        { id: 'leaping', powers: [sj] },
      ],
    }));
    expect(both.jumpHeight).toBeCloseTo(2780, 0);
    expect(both.jumpSpeed).toBeCloseTo(249, 0);
    expect(both.runSpeed).toBeCloseTo(350, 0); // run buff unaffected by jump grouping
  });

  it('Ninja Run + Super Speed: run speed is the strongest TravelBuff (350), not the sum (490)', () => {
    const ninja = getInherentPowerDef('Ninja_Run')!;
    const b = makeBuild({
      pools: [{ id: 'speed', powers: [poolPower('speed', 'Super_Speed')] }],
      inherents: [{ ...ninja, isActive: true, slots: [] }],
    });
    expect(totals(b).runSpeed).toBeCloseTo(350, 0);
  });

  it('Sprint (no suppress group) still stacks additively with Super Speed', () => {
    const sprint = getInherentPowerDef('Sprint')!;
    const b = makeBuild({
      pools: [{ id: 'speed', powers: [poolPower('speed', 'Super_Speed')] }],
      inherents: [{ ...sprint, isActive: true, slots: [] }],
    });
    // Sprint = 0.5 + 0.5 (unenhanceable half) × Melee_Ones = +100%.
    expect(totals(b).runSpeed).toBeCloseTo(450, 0);
  });

  // ---- 5. In-combat suppression --------------------------------------------
  it('combat mode drops Super Speed\'s run buff (Suppress ActivateAttackClick)', () => {
    const b = makeBuild({ pools: [{ id: 'speed', powers: [poolPower('speed', 'Super_Speed')] }] });
    expect(totals(b, true).runSpeed).toBeCloseTo(0, 5);
  });

  it('combat mode does NOT drop Combat Jumping (no suppress events)', () => {
    const b = makeBuild({ pools: [{ id: 'leaping', powers: [poolPower('leaping', 'Combat_Jumping')] }] });
    expect(totals(b, true).jumpHeight).toBeCloseTo(200, 0);
  });

  it('combat mode drops Super Jump\'s jump buffs', () => {
    const b = makeBuild({ pools: [{ id: 'leaping', powers: [poolPower('leaping', 'Long_Jump')] }] });
    const g = totals(b, true);
    expect(g.jumpHeight).toBeCloseTo(0, 5);
    expect(g.jumpSpeed).toBeCloseTo(0, 5);
  });

  // ---- 4. Data-driven movement caps ----------------------------------------
  it('generated Super Speed carries the cap raise in movementCapBump, unsuppressible', () => {
    const ss = getPowerPool('speed')!.powers.find((p) => p.internalName === 'Super_Speed')!;
    const bump = (ss.effects?.movementCapBump as { runSpeed?: MovementEffect })?.runSpeed;
    expect(bump?.scale).toBeCloseTo(1.938, 3);
    expect(bump?.suppressible).toBeUndefined(); // SS's cap raise persists in combat
    // And the movement buff slot holds the REAL buff.
    const move = (ss.effects?.movement as { runSpeed?: MovementEffect })?.runSpeed;
    expect(move?.scale).toBeCloseTo(1.0, 3);
    expect(move?.table).toBe('Melee_SpeedRunning');
    expect(move?.stackKey).toBe('TravelBuff');
    expect(move?.suppressible).toBe(true);
  });

  it('Super Speed cap bump → 120.25 mph run cap, persisting in combat', () => {
    const bumps = [{ stat: 'runSpeed' as const, scale: 1.938 }];
    expect(getEffectiveMovementCaps(bumps).runSpeed).toBeCloseTo(120.25, 2);
    expect(getEffectiveMovementCaps(bumps, true).runSpeed).toBeCloseTo(120.25, 2); // no suppress event
  });

  it('Fly + Afterburner cap bumps ADD across suppress groups → 102.27 mph', () => {
    const bumps = [
      { stat: 'flySpeed' as const, scale: 2.0475, stackKey: 'TravelMaxBuff' },
      { stat: 'flySpeed' as const, scale: 1.0, stackKey: 'TravelTurboMaxBuff', suppressible: true },
    ];
    expect(getEffectiveMovementCaps(bumps).flySpeed).toBeCloseTo(
      MOVEMENT_CAPS.flySpeed + 3.0475 * MPH_PER_SCALE, 2); // ≈ 102.27
    // In combat only Afterburner's (suppressible) bump drops — Fly's persists.
    expect(getEffectiveMovementCaps(bumps, true).flySpeed).toBeCloseTo(
      MOVEMENT_CAPS.flySpeed + 2.0475 * MPH_PER_SCALE, 2); // ≈ 87.95
  });

  it('same-group cap bumps take the strongest, not the sum', () => {
    const bumps = [
      { stat: 'jumpSpeed' as const, scale: 1.65, stackKey: 'TravelMaxBuff' },
      { stat: 'jumpSpeed' as const, scale: 1.0, stackKey: 'TravelMaxBuff' },
    ];
    expect(getEffectiveMovementCaps(bumps).jumpSpeed).toBeCloseTo(
      MOVEMENT_CAPS.jumpSpeed + 1.65 * MPH_PER_SCALE, 2); // 101.80
  });

  it('Super Jump\'s cap raise IS combat-suppressible (unlike Super Speed\'s)', () => {
    const sj = getPowerPool('leaping')!.powers.find((p) => p.internalName === 'Long_Jump')!;
    const bump = (sj.effects?.movementCapBump as { jumpSpeed?: MovementEffect })?.jumpSpeed;
    expect(bump?.scale).toBeCloseTo(1.65, 3);
    expect(bump?.suppressible).toBe(true);
    expect(bump?.stackKey).toBe('TravelMaxBuff');
  });

  // ---- Suppression is NOT a Rule of 5 violation ----------------------------
  // A suppress-group loser (or combat-suppressed buff) must be flagged
  // `suppressed`, NOT `capped` — `capped` drives the Rule-of-5 warning ring,
  // and travel/stealth mutual suppression is normal game mechanics. This
  // regressed the moment TravelBuff grouping shipped: Combat Jumping + Super
  // Jump on nearly every build was tripping a spurious Rule of 5 warning.
  it('a suppress-group loser is marked `suppressed`, never `capped` (no false Rule of 5)', () => {
    const cj = poolPower('leaping', 'Combat_Jumping');
    const sj = poolPower('leaping', 'Long_Jump');
    const b = makeBuild({ pools: [{ id: 'leaping', powers: [cj, sj] }] });
    for (const stat of ['jumpHeight', 'jumpSpeed', 'runSpeed']) {
      const bd = breakdownOf(b, stat);
      for (const src of bd?.sources ?? []) {
        // Nothing in a travel suppress group may be `capped` (Rule of 5).
        expect(src.capped).toBeFalsy();
      }
      // The total must exclude any suppressed loser (not the naive sum).
      if (bd) {
        const naiveSum = bd.sources.reduce((s, x) => s + x.value, 0);
        const survivingSum = bd.sources.filter((x) => !x.suppressed && !x.capped).reduce((s, x) => s + x.value, 0);
        expect(bd.total).toBeCloseTo(survivingSum, 5);
        if (bd.sources.some((x) => x.suppressed)) expect(bd.total).toBeLessThan(naiveSum);
      }
    }
    // At least one jump stat actually has a suppressed loser (CJ vs SJ share
    // kTravelBuff), else this test proves nothing.
    const jh = breakdownOf(b, 'jumpHeight');
    expect(jh?.sources.some((s) => s.suppressed)).toBe(true);
  });

  it('combat-suppressed buffs are flagged `suppressed`, not `capped`', () => {
    const b = makeBuild({ pools: [{ id: 'speed', powers: [poolPower('speed', 'Super_Speed')] }] });
    const bd = breakdownOf(b, 'runSpeed', true);
    expect(bd?.sources.some((s) => s.capped)).toBeFalsy();
    expect(bd?.sources.some((s) => s.suppressed)).toBe(true);
    expect(bd?.total).toBeCloseTo(0, 5);
  });
});
