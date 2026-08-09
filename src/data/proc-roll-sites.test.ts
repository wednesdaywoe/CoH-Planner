import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getAllPowersets } from '@/data/powersets';
import { getAllIOSets } from '@/data/io-sets';
import {
  powerFiresProcs,
  resolveProcRollSite,
  findProcData,
  getProcEffects,
} from './proc-data';
import { getProcPotential } from './proc-potential';
import { calculateSlottedProcDamagePerCast } from '@/utils/calculations/power-proc-damage';
import { Fault } from './datasets/homecoming/generated/powersets/brute/primary/stone-melee/fault';
import { Whitecap } from './datasets/homecoming/generated/powersets/defender/primary/marine-affinity/whitecap';
import { HypnotizingLights } from './datasets/homecoming/generated/powersets/controller/primary/pyrotechnic-control/hypnotizing-lights';
import { POWER_POOLS_RAW } from './datasets/homecoming/power-pools-raw';
import { FireImps } from './datasets/homecoming/generated/powersets/controller/primary/fire-control/fire-imps';
import type { Power } from '@/types/power';
import type { IOSet, IOSetEnhancement } from '@/types';

/**
 * `ProcSeparately` — the other half of `ProcAllowed kNone`.
 *
 * Ten Homecoming powers pair the two: the shell is barred from rolling, and the
 * `kExecutePower` template that does its work carries `ProcSeparately`, the
 * game's statement that the executed power rolls on its own. Reading only the
 * kNone half reported these four powers (Fault ×4 archetypes, Whitecap ×4,
 * Hypnotizing Lights ×2) as firing nothing — a confident zero on powers that do
 * fire, which is the bug this file exists to keep closed.
 *
 * What is pinned here, in order of how load-bearing it is:
 *
 *  - **The pairing is exact.** Every `ProcSeparately` template in the corpus
 *    sits under a kNone parent, so a site list never ADDS a roll to a power
 *    that already had one. If HC ever authors one on an unflagged power, the
 *    corpus sweep goes red and the model needs revisiting before the data ships.
 *  - **A proc rolls in the ONE child that accepts its set.** Fault's children
 *    partition its categories with no overlap: damage procs reach the 6s cone,
 *    stun and knockback procs the 20s sphere. Scoring either against the shell
 *    (20s recharge, radius 0, no AoE penalty) is the 90%-everywhere reading the
 *    flag was introduced to kill, so the numbers are pinned apart, not just
 *    asserted non-zero.
 *  - **A set no child accepts still fires nothing.** Hypnotizing Lights lists
 *    Sleep and neither child takes an IO set carrying a Sleep proc.
 *  - **Spring Attack does NOT move.** Its child has `CopyBoosts` and no
 *    `ProcSeparately`, so it stays at zero. It is the control: a fix keyed on
 *    "delegates to a child" rather than on the flag would light it up too.
 *
 * NOT pinned, because it is not known: whether the game rolls the child once or
 * once per executed child, and whether the window is the child's recharge or
 * the parent's. See DATA-GAP-REGISTER HC-4 — the residual is filed with a live
 * count as its exit condition.
 */

const HC = (p: unknown) => p as Power;

/** Spring Attack, which lives in a pool and so has no generated module. */
function springAttack(): Power {
  const leaping = (POWER_POOLS_RAW as unknown as Record<string, { powers?: Power[] }>).leaping;
  const power = leaping?.powers?.find((p) => p.name === 'Spring Attack');
  if (!power) throw new Error('Leaping has no Spring Attack');
  return power;
}

/** A slotted piece of `set`, standing in for what the picker would produce. */
function slotted(set: IOSet, pieceName: string): IOSetEnhancement {
  const piece = set.pieces.find((p) => p.name === pieceName);
  if (!piece) throw new Error(`${set.name} has no piece "${pieceName}"`);
  return {
    id: `${set.id}-${piece.num}`,
    type: 'io-set',
    name: piece.name,
    setId: set.id!,
    setName: set.name,
    pieceNum: piece.num,
    isProc: true,
    level: 50,
  } as unknown as IOSetEnhancement;
}

/**
 * A set of this category holding a foe-damage proc — derived rather than named,
 * so the gate keeps working when HC adds or renames a set. Returns the set and
 * the proc piece's name.
 */
function damageProcOfCategory(category: string): { set: IOSet; piece: string } {
  for (const set of Object.values(getAllIOSets())) {
    if (set.type !== category) continue;
    for (const piece of set.pieces) {
      if (!piece.proc) continue;
      const data = findProcData(piece.name, set.name);
      if (!data || data.ppm == null) continue;
      const dmg = getProcEffects(data).find(
        (e) => e.category === 'Damage' && e.value !== undefined && e.valueMax !== undefined,
      );
      if (dmg) return { set, piece: piece.name };
    }
  }
  throw new Error(`no damage proc in any "${category}" set`);
}

const DAMAGE_INPUT = {
  baseRecharge: 20,
  castTime: 2.1,
  radius: 0,
  arcDegrees: 360,
  rechargeEnh: 0,
  buildLevel: 50,
};

describe('ProcSeparately roll sites', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  describe('the sites survive the converter', () => {
    it('Fault carries both of its executed children', () => {
      const sites = HC(Fault).procRollSites ?? [];
      expect(sites.map((s) => s.power)).toEqual([
        'Redirects.Stone_Melee.Fault_Brute',
        'Redirects.Stone_Melee.Fault_Cone_Brute',
      ]);
      // The windows the children actually roll in, which is the whole point:
      // neither matches the shell's 20s / radius 0.
      expect(sites.map((s) => [s.baseRecharge, s.radius])).toEqual([[20, 15], [6, 20]]);
    });

    it('the children partition the shell categories — no set has two windows', () => {
      const sites = HC(Fault).procRollSites!;
      const all = sites.flatMap((s) => s.setCategories);
      expect(new Set(all).size).toBe(all.length);
      // The union IS the shell's list: every set the picker offers reaches a
      // child, which is CopyBoosts filtering by the child's own allowed list.
      expect([...all].sort()).toEqual([...(HC(Fault).allowedSetCategories ?? [])].sort());
    });

    it('reports the power as firing, despite the kNone flag', () => {
      for (const power of [Fault, Whitecap, HypnotizingLights]) {
        expect({ name: HC(power).name, flagged: HC(power).procsAllowed, fires: powerFiresProcs(HC(power)) })
          .toEqual({ name: HC(power).name, flagged: false, fires: true });
      }
    });

    it('CONTROL: Spring Attack has no site and still fires nothing', () => {
      // Its child carries CopyBoosts and NOT ProcSeparately — the one flag that
      // separates it from Fault.
      expect(springAttack().procRollSites).toBeUndefined();
      expect(powerFiresProcs(springAttack())).toBe(false);
    });

    it('CONTROL: a pet summon has no site and still fires nothing', () => {
      expect(HC(FireImps).procRollSites).toBeUndefined();
      expect(powerFiresProcs(HC(FireImps))).toBe(false);
    });
  });

  describe('routing a proc to its window', () => {
    it('sends a damage proc to the cone and a stun proc to the sphere', () => {
      const sites = HC(Fault).procRollSites!;
      const damage = resolveProcRollSite(sites, 'Ranged AoE Damage');
      const stun = resolveProcRollSite(sites, 'Stuns');
      expect(damage?.power).toBe('Redirects.Stone_Melee.Fault_Cone_Brute');
      expect(stun?.power).toBe('Redirects.Stone_Melee.Fault_Brute');
      // Two genuinely different windows, which is why one site per power would
      // have been wrong: 6s/20ft cone against 20s/15ft sphere.
      expect(damage!.baseRecharge).not.toBe(stun!.baseRecharge);
    });

    it('sends a set no child accepts nowhere', () => {
      // Hypnotizing Lights lists Sleep; its wide child accepts no IO sets at
      // all and its narrow child accepts Confuse / Ranged AoE / Universal
      // Damage. Nothing rolls a Sleep proc here.
      const sites = HC(HypnotizingLights).procRollSites!;
      expect(resolveProcRollSite(sites, 'Sleep')).toBeNull();
      expect(resolveProcRollSite(sites, 'Confuse')?.power)
        .toBe('Redirects.Pyrotechnic_Control.HypnotizingLights_Narrow');
    });
  });

  describe('proc damage', () => {
    it('pays out in Fault, scored on the cone child and not on the shell', () => {
      const { set, piece } = damageProcOfCategory('Ranged AoE Damage');
      const slots = [slotted(set, piece)];
      const paid = calculateSlottedProcDamagePerCast({
        ...DAMAGE_INPUT, slots, procsAllowed: false, procRollSites: HC(Fault).procRollSites,
      });
      expect(paid).toBeGreaterThan(0);

      // The shell's window (20s recharge, radius 0 ⇒ area factor 1.0) pins a
      // 3.5 PPM proc at the 90% cap. The cone's (6s, 20ft, 55° ⇒ ÷1.57) does
      // not, so the honest number is materially SMALLER — a fix that merely
      // un-flagged the power would land on the larger one.
      const asShell = calculateSlottedProcDamagePerCast({ ...DAMAGE_INPUT, slots });
      expect(paid).toBeLessThan(asShell);
    });

    it('pays out in Whitecap, whose single child takes everything', () => {
      const { set, piece } = damageProcOfCategory('Melee AoE Damage');
      const paid = calculateSlottedProcDamagePerCast({
        ...DAMAGE_INPUT,
        slots: [slotted(set, piece)],
        procsAllowed: false,
        procRollSites: HC(Whitecap).procRollSites,
      });
      expect(paid).toBeGreaterThan(0);
    });

    it('MUTANT: the same slotting pays nothing once the sites are gone', () => {
      // The sites, not the un-flagging, are what pays out. Drop them and the
      // kNone flag is back in sole charge.
      const { set, piece } = damageProcOfCategory('Ranged AoE Damage');
      expect(calculateSlottedProcDamagePerCast({
        ...DAMAGE_INPUT, slots: [slotted(set, piece)], procsAllowed: false,
      })).toBe(0);
    });
  });

  describe('the proc-potential lens', () => {
    it('badges Fault off its children, and says so', () => {
      const p = getProcPotential(HC(Fault))!;
      expect(p.procsDisallowed).toBe(false);
      expect(p.rollsInExecutedChildren).toBe(true);
      expect(p.total).toBeGreaterThan(0);
      // Every entry names the child that scored it — nothing was quietly
      // scored against the shell.
      expect(p.entries.every((e) => !!e.viaPower)).toBe(true);
    });

    it('CONTROL: Spring Attack stays empty', () => {
      const p = getProcPotential(springAttack())!;
      expect({ total: p.total, disallowed: p.procsDisallowed, children: p.rollsInExecutedChildren })
        .toEqual({ total: 0, disallowed: true, children: false });
    });
  });

  describe('the corpus', () => {
    it('every power with sites is flagged kNone, and vice versa is not assumed', () => {
      let withSites = 0;
      for (const set of Object.values(getAllPowersets())) {
        for (const power of set.powers ?? []) {
          if (!power.procRollSites?.length) continue;
          withSites++;
          // A site list on an unflagged power would mean parent AND child roll
          // — a shape this model does not express.
          expect({ name: power.name, flagged: power.procsAllowed })
            .toEqual({ name: power.name, flagged: false });
        }
      }
      // Fault ×4 archetypes, Whitecap ×4, Hypnotizing Lights ×2.
      expect(withSites).toBe(10);
    });

    it('no power routes one set category to two windows', () => {
      for (const set of Object.values(getAllPowersets())) {
        for (const power of set.powers ?? []) {
          const sites = power.procRollSites;
          if (!sites?.length) continue;
          const all = sites.flatMap((s) => s.setCategories);
          expect({ name: power.name, distinct: new Set(all).size })
            .toEqual({ name: power.name, distinct: all.length });
        }
      }
    });
  });
});
