import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getAllPowersets } from '@/data/powersets';
import { powerFiresProcs } from './proc-data';
import { getProcPotential, procPotentialTier } from './proc-potential';
import { calculateSlottedProcDamagePerCast } from '@/utils/calculations/power-proc-damage';
import { FireImps } from './datasets/homecoming/generated/powersets/controller/primary/fire-control/fire-imps';
import { Fault } from './datasets/homecoming/generated/powersets/brute/primary/stone-melee/fault';
import { ParalyzingBlast } from './datasets/homecoming/generated/powersets/controller/primary/electric-control/paralyzing-blast';
import { IceStorm } from './datasets/homecoming/generated/powersets/corruptor/primary/ice-blast/ice-storm';
import { Blizzard } from './datasets/homecoming/generated/powersets/defender/secondary/ice-blast/blizzard';
import { Sleet } from './datasets/homecoming/generated/powersets/defender/primary/cold-domination/sleet';
import { Caltrops } from './datasets/homecoming/generated/powersets/defender/primary/traps/caltrops';
import type { Power } from '@/types/power';
import type { IOSetEnhancement } from '@/types';

/**
 * `ProcAllowed kNone` — HC's per-power "no PPM proc rolls here" switch.
 *
 * The flag was decoded in the parser and emitted by the exporter, but no
 * converter carried it, so nothing downstream could see it. That is a silent
 * failure by construction: the PPM formula happily computes a chance from any
 * recharge, and the flagged powers are disproportionately LONG-recharge ones
 * (Paralyzing Blast 240s, Spring Attack 120s, the pet summons 60–240s), where
 * every proc in the pool pins to the 90% ceiling. The proc-potential badge was
 * therefore loudest exactly where the game fires nothing.
 *
 * Two halves are pinned here, and both matter:
 *  - the flagged powers ARE flagged, and the gates act on it;
 *  - the RAINS ARE NOT flagged. Ice Storm and its kin summon a patch whose
 *    pulsing power HC left proc-enabled while explicitly disabling Burn's
 *    (`Pets.Burn.Burn` carries `ProcAllowed kNone`). Anyone tempted to treat
 *    "summons a pseudo-pet" as the rule would break the rains, which are the
 *    single most popular proc vehicle in the game.
 */

const HC = (p: unknown) => p as Power;

/** A slotted damage proc, enough for calculateSlottedProcDamagePerCast. */
const DAMAGE_PROC = {
  id: 'test-proc',
  type: 'io-set',
  name: 'Chance for Fire Damage',
  setName: 'Bombardment',
  isProc: true,
  level: 50,
  pieceNum: 6,
} as unknown as IOSetEnhancement;

const PROC_DAMAGE_INPUT = {
  slots: [DAMAGE_PROC],
  baseRecharge: 60,
  castTime: 2,
  radius: 0,
  arcDegrees: 360,
  rechargeEnh: 0,
  buildLevel: 50,
};

describe('ProcAllowed kNone', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  describe('the flag survives the converter', () => {
    it('is carried onto the powers HC authors it on', () => {
      // One from each converter path that can see it: a pet summon and an
      // ordinary attack (convert-powerset), and a long-recharge control.
      expect(HC(FireImps).procsAllowed).toBe(false);
      expect(HC(Fault).procsAllowed).toBe(false);
      expect(HC(ParalyzingBlast).procsAllowed).toBe(false);
    });

    it('is sparse — absent, not `true`, on ordinary powers', () => {
      // Sparse-false mirrors the exporter. A converter that wrote `true`
      // everywhere would double the size of every generated file for nothing.
      expect(HC(IceStorm).procsAllowed).toBeUndefined();
      expect(powerFiresProcs(HC(IceStorm))).toBe(true);
    });

    it('leaves the RAINS alone — they are proc vehicles, not pet summons', () => {
      // The distinction is HC's, not ours: `Pets.Burn.Burn` carries the flag
      // and `Pets.Corruptor_IceStorm.IceStorm` does not.
      for (const rain of [IceStorm, Blizzard, Sleet, Caltrops]) {
        expect({ name: HC(rain).name, fires: powerFiresProcs(HC(rain)) })
          .toEqual({ name: HC(rain).name, fires: true });
      }
    });
  });

  describe('the proc-potential lens', () => {
    it('reports no PPM procs for a flagged power', () => {
      const p = getProcPotential(HC(ParalyzingBlast))!;
      expect({ total: p.total, atCap: p.atCap, disallowed: p.procsDisallowed })
        .toEqual({ total: 0, atCap: 0, disallowed: true });
      expect(p.entries).toEqual([]);
      expect(procPotentialTier(p)).toBe(0);
    });

    it('MUTANT: a Fault scored on its own window is a top-tier badge', () => {
      // The gate is worthless unless it can go red. Fault has no window of its
      // own — it delegates to two children — but scored as if it did (20s
      // recharge, radius 0, no AoE penalty) it caps against a 6-slot ceiling
      // and reads as an exceptional proc bomb. That is the badge users were
      // shown before the flag landed, and it is what routing to the children
      // must not reproduce.
      //
      // Paralyzing Blast is deliberately NOT the subject here even though it is
      // the loudest example. It is also a 60s pulsing pseudo-pet, so the patch
      // roll schedule zeroes its cap count independently — belt and braces on
      // the power, but a mutation target where the mutation proves nothing.
      const ownWindow = {
        ...HC(Fault), procsAllowed: undefined, procRollSites: undefined,
      } as Power;
      const p = getProcPotential(ownWindow)!;
      expect(p.procsDisallowed).toBe(false);
      expect(p.rolls).toBe(1);
      expect(p.atCap).toBeGreaterThanOrEqual(p.maxSlots);
      expect(procPotentialTier(p)).toBe(2);
    });

    it('MUTANT: an unflagged Paralyzing Blast still enumerates a pool', () => {
      // The narrower half of the same gate: the flag, not the patch schedule,
      // is what empties `entries`. Removing it restores the pool even though
      // the patch schedule keeps the badge off.
      const unflagged = { ...HC(ParalyzingBlast), procsAllowed: undefined } as Power;
      const p = getProcPotential(unflagged)!;
      expect(p.procsDisallowed).toBe(false);
      expect(p.total).toBeGreaterThan(0);
    });

    it('keeps always-on globals — they are not rolled', () => {
      // Fire Imps still hosts Call to Arms +Def(All) and Expedient
      // Reinforcement +Res(All). Zeroing those too would be the opposite error.
      const p = getProcPotential(HC(FireImps))!;
      expect(p.total).toBe(0);
      expect(p.globalCount).toBeGreaterThan(0);
    });

    it('no flagged power anywhere in Homecoming carries a badge', () => {
      let flagged = 0;
      let badged = 0;
      for (const set of Object.values(getAllPowersets())) {
        for (const power of set.powers ?? []) {
          if (powerFiresProcs(power)) continue;
          flagged++;
          const potential = getProcPotential(power);
          if (potential && procPotentialTier(potential) > 0) badged++;
        }
      }
      // The `badged: 0` half passes trivially if the sweep matched nothing, so
      // the flagged count is asserted too. 91 generated HC powers carry the
      // flag today, of which the ten with `procRollSites` DO fire and are
      // excluded by powerFiresProcs; the floor is loose enough to survive an HC
      // patch and tight enough to catch a converter that quietly stopped
      // writing it.
      expect(badged).toBe(0);
      expect(flagged).toBeGreaterThanOrEqual(70);
    });
  });

  describe('proc damage', () => {
    it('adds nothing on a flagged power', () => {
      expect(calculateSlottedProcDamagePerCast({ ...PROC_DAMAGE_INPUT, procsAllowed: false }))
        .toBe(0);
    });

    it('MUTANT: the same slotting pays out without the flag', () => {
      expect(calculateSlottedProcDamagePerCast(PROC_DAMAGE_INPUT)).toBeGreaterThan(0);
    });
  });
});
