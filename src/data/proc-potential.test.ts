import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getAllPowersets } from '@/data/powersets';
import { PROC_DATABASE, getProcEffects } from '@/data/proc-data';
import { getProcPotential, procPotentialTier, PROC_CHANCE_CAP } from './proc-potential';
import { IceArrow } from './datasets/homecoming/generated/powersets/defender/primary/trick-arrow/ice-arrow';
import { DarkConsumption } from './datasets/homecoming/generated/powersets/scrapper/primary/dark-melee/dark-consumption';
import { SeismicSmash } from './datasets/homecoming/generated/powersets/tanker/secondary/stone-melee/seismic-smash';
import { ShadowPunch } from './datasets/homecoming/generated/powersets/scrapper/primary/dark-melee/shadow-punch';
import { RainofFire } from './datasets/homecoming/generated/powersets/corruptor/primary/fire-blast/rain-of-fire';
import { Propel } from './datasets/homecoming/generated/powersets/dominator/primary/gravity-control/propel';
import { BitterFreezeRay } from './datasets/homecoming/generated/powersets/corruptor/primary/ice-blast/bitter-freeze-ray';
import type { Power } from '@/types/power';

/**
 * Proc-bomb POTENTIAL — the base-recharge proc pool a power could host.
 *
 * The thing under test is a JOIN plus a geometry decision, and both have a
 * silent failure mode:
 *
 *  - **The join.** Walking each slottable set's proc PIECES and matching their
 *    names against the proc catalogue drops procs whose binary piece name
 *    diverges from the catalogue's ioName ("Basilisk's Gaze :: Chance" vs
 *    "Chance for Recharge Slow") — 6 of Ice Arrow's 11. Joining loosely instead
 *    invents procs. The module joins on `ProcData.setName`, which sidesteps
 *    piece naming entirely, and the counts below pin that.
 *  - **The geometry.** Rains and patches carry radius 0 on the parent with the
 *    real footprint on the summon. Missing that scores 194 Homecoming powers as
 *    single-target and overstates every one of them.
 *
 * Both failures produce plausible numbers, so the anchors are exact.
 */

const HC_POWER = (p: unknown) => p as Power;

describe('proc potential', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  describe('the two shapes of a proc bomb', () => {
    it('Ice Arrow is the BREADTH case — a category union, single-target', () => {
      // 18s recharge, single target. Its value is the Holds ∪ Slow Movement
      // union, which pulls in damage procs a pure control power can't reach.
      const p = getProcPotential(HC_POWER(IceArrow))!;
      expect({ total: p.total, atCap: p.atCap, denom: p.areaDenominator }).toEqual({
        total: 11,
        atCap: 9,
        denom: 1,
      });
      expect(p.purpleSets).toEqual(['Unbreakable Constraint']);
    });

    it("Ice Arrow's low-PPM procs do NOT cap — 18s isn't long enough", () => {
      // The counterpoint to Dark Consumption below, and the reason recharge is a
      // threshold rather than a gradient: a 2.5 PPM hold and a 2 PPM absorb sit
      // well under the ceiling in a power where every 3.5 PPM proc is capped.
      const p = getProcPotential(HC_POWER(IceArrow))!;
      const belowCap = p.entries.filter((e) => !e.atCap);
      expect(belowCap.map((e) => e.ppm).sort()).toEqual([2, 2.5]);
      expect(belowCap.every((e) => e.chance < PROC_CHANCE_CAP)).toBe(true);
    });

    it('Dark Consumption is the GEOMETRY case — 180s caps everything despite an 8ft AoE', () => {
      // The AoE tax is real (÷1.9) and the recharge simply overwhelms it. This
      // is why loading it with 2.5 PPM knockdown procs works: long recharge
      // rescues the low-PPM utility procs a fast attack can't run.
      const p = getProcPotential(HC_POWER(DarkConsumption))!;
      expect({ total: p.total, atCap: p.atCap }).toEqual({ total: 12, atCap: 12 });
      expect(p.areaDenominator).toBeCloseTo(1.9, 3);
      expect(p.recharge).toBe(180);
      // Every proc, down to the 1.5 PPM Performance Shifter.
      expect(Math.min(...p.entries.map((e) => e.ppm))).toBe(1.5);
      expect(p.entries.every((e) => e.atCap)).toBe(true);
    });

    it('Dark Consumption caps its knockdown and -Res procs, not just damage', () => {
      // The composition is the whole point of the feature: a damage-weighted
      // score would score these zero and argue against the slotting that works.
      const p = getProcPotential(HC_POWER(DarkConsumption))!;
      const byCategory = Object.fromEntries(p.composition.map((r) => [r.category, r.atCap]));
      expect(byCategory).toMatchObject({ Control: 5, Damage: 4, Debuff: 1 });
      const control = p.composition.find((r) => r.category === 'Control')!;
      expect(control.effectTypes).toContain('Knockdown');
    });
  });

  describe('the negative case', () => {
    it('a 3s attack caps nothing, however large its proc pool', () => {
      // Shadow Punch can slot 14 procs and none of them clear ~29%. Ranking on
      // pool size alone would call this a proc bomb; it is the opposite.
      const p = getProcPotential(HC_POWER(ShadowPunch))!;
      expect({ total: p.total, atCap: p.atCap }).toEqual({ total: 14, atCap: 0 });
      expect(Math.max(...p.entries.map((e) => e.chance))).toBeLessThan(0.3);
      expect(procPotentialTier(p)).toBe(0);
    });
  });

  describe('roll geometry', () => {
    it('a rain rolls against its summoned patch, not the caster', () => {
      // Rain of Fire has radius 0 on the parent; the 25ft footprint is on the
      // pseudo-pet. Reading the parent alone would treat it as single-target.
      const p = getProcPotential(HC_POWER(RainofFire))!;
      expect({ radius: p.radius, fromPseudoPet: p.fromPseudoPet }).toEqual({
        radius: 25,
        fromPseudoPet: true,
      });
      expect(p.areaDenominator).toBeGreaterThan(3);
    });

    it('ProcMainTargetOnly forces single-target odds despite an AoE radius', () => {
      // Propel's 15ft radius is its knockback splash; procs land on the main
      // target only. Measured in game — see proc-main-target-only.test.ts.
      const p = getProcPotential(HC_POWER(Propel))!;
      expect({ mainTargetOnly: p.mainTargetOnly, radius: p.radius, denom: p.areaDenominator }).toEqual({
        mainTargetOnly: true,
        radius: 0,
        denom: 1,
      });
    });
  });

  describe('tier', () => {
    it('rates the examples the way the mechanic does', () => {
      const tier = (p: unknown) => procPotentialTier(getProcPotential(HC_POWER(p))!);
      expect({
        seismicSmash: tier(SeismicSmash),
        darkConsumption: tier(DarkConsumption),
        iceArrow: tier(IceArrow),
        shadowPunch: tier(ShadowPunch),
      }).toEqual({
        seismicSmash: 2, // 15 at cap across 5 categories
        darkConsumption: 2, // 12 at cap across 5 categories
        iceArrow: 1, // 9 at cap — clears its 6 slots but not 2×
        shadowPunch: 0,
      });
    });

    it('stays rare enough to be a signal (badges ~15% of powers, not most)', () => {
      // A tier that fires on half the catalogue is decoration. Bounds are wide
      // enough to survive a dataset regen and tight enough to catch a threshold
      // slip; the counts print on failure so the drift is visible.
      const counts = [0, 0, 0];
      const seen = new Set<Power>();
      for (const ps of Object.values(getAllPowersets())) {
        for (const raw of ps.powers) {
          const power = HC_POWER(raw);
          if (seen.has(power)) continue;
          seen.add(power);
          const potential = getProcPotential(power);
          if (!potential) continue;
          counts[procPotentialTier(potential)]++;
        }
      }
      const n = counts[0] + counts[1] + counts[2];
      const badged = ((counts[1] + counts[2]) / n) * 100;
      expect({ n, counts, badgedPct: Math.round(badged) }).toMatchObject({
        n: expect.any(Number),
      });
      expect(n).toBeGreaterThan(3000);
      expect(badged).toBeGreaterThan(8);
      expect(badged).toBeLessThan(25);
    });
  });

  describe('pool enumeration', () => {
    it('returns null for a power that accepts no IO sets', () => {
      expect(getProcPotential({ name: 'x', allowedSetCategories: [] } as unknown as Power)).toBeNull();
      expect(getProcPotential({ name: 'x' } as unknown as Power)).toBeNull();
    });

    it('lists each proc once even when the catalogue keys it twice', () => {
      const p = getProcPotential(HC_POWER(SeismicSmash))!;
      const identities = p.entries.map((e) => `${e.setName}::${e.ioName}`);
      expect(identities.length).toBe(new Set(identities).size);
    });

    it('counts always-on globals separately from PPM procs', () => {
      // Globals (LotG +Recharge, Steadfast +Def) are valuable but aren't PPM,
      // so folding them into the proc count would inflate every attack.
      const p = getProcPotential(HC_POWER(DarkConsumption))!;
      expect(p.globalCount).toBeGreaterThan(0);
      expect(p.entries.some((e) => e.ppm == null)).toBe(false);
    });

    it('admits ONLY type:Proc entries, catalogue-wide', () => {
      // A ppm-only filter looks equivalent but isn't: one Global carries a PPM
      // value, and 13 Proc120s exist. Neither uses the per-activation PPM
      // formula, so both would be counted as procs that fire on every cast.
      // Swept across every power because the offenders sit in few pools.
      const offenders = new Set<string>();
      const seen = new Set<Power>();
      for (const ps of Object.values(getAllPowersets())) {
        for (const raw of ps.powers) {
          const power = HC_POWER(raw);
          if (seen.has(power)) continue;
          seen.add(power);
          for (const entry of getProcPotential(power)?.entries ?? []) {
            const type = PROC_DATABASE[entry.key]?.type;
            if (type !== 'Proc') offenders.add(`${entry.key} [${type}]`);
          }
        }
      }
      expect({ scanned: seen.size, offenders: [...offenders] }).toMatchObject({ offenders: [] });
    });

    it('separates Build Up from procs that actually deal damage', () => {
      // The source data files all three Build Up procs under category "Damage"
      // with effectType "All" — a +100% Damage buff for 10s, listed alongside
      // procs that add Fire/Lethal/Smashing damage to the hit. Reading the
      // composition, "Damage 5/5 · Energy, Fire, Lethal, Smashing, All" implies
      // an all-types damage proc, which does not exist.
      //
      // Swept catalogue-wide: nothing in the Damage row may carry a duration
      // (that would be a buff), and nothing in Damage Buff may lack one.
      const misfiled: string[] = [];
      const seen = new Set<Power>();
      for (const ps of Object.values(getAllPowersets())) {
        for (const raw of ps.powers) {
          const power = HC_POWER(raw);
          if (seen.has(power)) continue;
          seen.add(power);
          for (const entry of getProcPotential(power)?.entries ?? []) {
            const primary = getProcEffects(PROC_DATABASE[entry.key])[0];
            if (entry.category === 'Damage' && primary?.duration != null) {
              misfiled.push(`${entry.key} deals damage over a duration?`);
            }
            if (entry.category === 'Damage Buff' && primary?.duration == null) {
              misfiled.push(`${entry.key} is an instant "buff"?`);
            }
            // The sub-type that gave the conflation away must be gone.
            if (entry.category === 'Damage' && entry.effectType === 'All') {
              misfiled.push(`${entry.key} still reads as Damage/All`);
            }
          }
        }
      }
      expect({ scanned: seen.size, misfiled: [...new Set(misfiled)] }).toMatchObject({ misfiled: [] });
    });

    it('a Build Up proc lands in Damage Buff, not Damage', () => {
      // Decimation is a Ranged Damage set, so any ranged attack can host its
      // Chance for Build Up. Anchored on a power that reaches tier 1 so the
      // composition is actually rendered.
      const p = getProcPotential(HC_POWER(BitterFreezeRay))!;
      const buff = p.entries.filter((e) => e.category === 'Damage Buff');
      expect(buff.map((e) => e.ioName)).toContain('Chance for Build Up');
      // And it is NOT double-counted into the damage row.
      expect(p.entries.filter((e) => e.category === 'Damage').map((e) => e.ioName))
        .not.toContain('Chance for Build Up');
      // Damage sub-types are all real damage types now.
      const damageTypes = new Set(
        p.entries.filter((e) => e.category === 'Damage').map((e) => e.effectType),
      );
      expect(damageTypes.has('All')).toBe(false);
    });

    it('every entry carries the category that admitted it', () => {
      const p = getProcPotential(HC_POWER(SeismicSmash))!;
      const allowed = new Set(SeismicSmash.allowedSetCategories ?? []);
      expect(p.entries.every((e) => allowed.has(e.viaCategory))).toBe(true);
    });
  });
});
