import { describe, it, expect } from 'vitest';
import { statCapFor, capReplacesTotal, type StatCap } from './stat-caps';
import { STAT_DEFINITIONS, STAT_CATEGORY } from '@/data/core/stat-definitions';
import { DETAILED_STATS } from '@/utils/detailed-totals';
import { getDefenseSoftcap } from '@/data/datasets/homecoming/purple-patch';
import { ARCHETYPES } from '@/data/datasets/homecoming/archetypes';

// The dashboard once carried a stat's ceiling as a bare number and rendered it in place of
// the total whenever the total reached it. That is correct for resistance and wrong for
// defense, and a bare number cannot tell you which you have.
//
// The engine already draws the line and guards it: `finalize.rs` clamps `res_*` to
// `resistanceCap × 100` and deliberately leaves `def_*` raw, asserted by
// `resistance_cap_binds_but_defense_softcap_does_not`. What follows is the display half of
// that same statement — the half that was missing, which is why a 77.5% melee defense build
// read `45.00%`.

const DEF_CAP = 45;
const RES_CAP = 75;

describe('stat ceilings carry their kind', () => {
  it('a defense softcap never replaces the total', () => {
    const cap = statCapFor('def_melee', DEF_CAP, RES_CAP);
    expect(cap).toEqual<StatCap>({ value: DEF_CAP, kind: 'soft' });
    // At the softcap, over it, and far over it — the total survives in every case.
    for (const total of [DEF_CAP, DEF_CAP + 0.01, 77.5, 200]) {
      expect(capReplacesTotal(cap, total)).toBe(false);
    }
  });

  it('a resistance hard cap replaces the total once reached', () => {
    const cap = statCapFor('res_smashing', DEF_CAP, RES_CAP);
    expect(cap).toEqual<StatCap>({ value: RES_CAP, kind: 'hard' });
    expect(capReplacesTotal(cap, RES_CAP - 0.01)).toBe(false);
    expect(capReplacesTotal(cap, RES_CAP)).toBe(true);
    expect(capReplacesTotal(cap, RES_CAP + 10)).toBe(true);
  });

  it('a stat with no ceiling is never overwritten', () => {
    expect(statCapFor('recharge', DEF_CAP, RES_CAP)).toBeUndefined();
    expect(capReplacesTotal(undefined, 500)).toBe(false);
  });

  // The partition is prefix-matched, so a new stat id in either family inherits the right
  // kind only if it keeps the family's prefix. Grade the real roster rather than a sample:
  // a `defense_ranged_total` added tomorrow must not fall through to `undefined` and lose
  // its softcap marker, and nothing outside the resistance family may claim a hard cap.
  it('every real defense stat is soft and every real resistance stat is hard', () => {
    const ids = Object.keys(STAT_DEFINITIONS);
    const defense = ids.filter((id) => STAT_CATEGORY[id] === 'defense');
    const resistance = ids.filter((id) => STAT_CATEGORY[id] === 'resistance');
    expect(defense.length).toBeGreaterThan(0);
    expect(resistance.length).toBeGreaterThan(0);

    for (const id of defense) {
      expect(statCapFor(id, DEF_CAP, RES_CAP), id).toEqual({ value: DEF_CAP, kind: 'soft' });
    }
    for (const id of resistance) {
      expect(statCapFor(id, DEF_CAP, RES_CAP), id).toEqual({ value: RES_CAP, kind: 'hard' });
    }

    // And the prefixes must not reach past those two families. This is the half that would
    // catch the mirror of the original bug — a stat handed a ceiling it does not have, or
    // handed the wrong kind. `debuff_defense` is the near miss the prefixes already clear.
    for (const id of ids) {
      if (!STAT_CATEGORY[id]) continue; // unplaced; pinned separately below
      const got = statCapFor(id, DEF_CAP, RES_CAP);
      if (got === undefined) continue;
      expect(STAT_CATEGORY[id], `${id} was given a ${got.kind} cap`).toBe(
        got.kind === 'hard' ? 'resistance' : 'defense',
      );
    }
    expect(statCapFor('debuff_defense', DEF_CAP, RES_CAP)).toBeUndefined();
  });

  // Ten definitions have no section placement and no reference outside stat-definitions —
  // paired tiles (S/L, F/C, …) that nothing renders. They matter here because reviving one
  // would land on the wrong side of the prefixes silently: `defense_smashing` would collect
  // a softcap it never asked about, and `resist_smashing` would get NO cap at all, since the
  // resistance prefix is `res_`. Pinned as a set rather than skipped, so the day someone
  // places one this fails and they have to state the kind.
  it('the unplaced paired tiles are still unreachable', () => {
    const unplaced = Object.keys(STAT_DEFINITIONS).filter((id) => !STAT_CATEGORY[id]);
    expect(unplaced).toEqual([
      'defense_smashing', 'defense_fire', 'defense_energy', 'defense_psionic', 'defense_toxic',
      'resist_smashing', 'resist_fire', 'resist_energy', 'resist_psionic', 'resist_toxic',
    ]);
    // The asymmetry the pin exists to remember.
    expect(statCapFor('defense_smashing', DEF_CAP, RES_CAP)?.kind).toBe('soft');
    expect(statCapFor('resist_smashing', DEF_CAP, RES_CAP)).toBeUndefined();
  });

  // The dashboard tile was fixed first and the two other ceiling surfaces — the Detailed
  // Totals sheet and the exported build poster — kept a bare number, sourced from the
  // ARCHETYPE's `defenseCap`. That is the even-level row only, so the sheet and the tile
  // beside it disagreed the moment a user set Target Level to +6. Both now read the same
  // `getDefenseSoftcap`, and this is the divergence that makes the difference observable.
  it('the archetype defense cap is not the softcap, once the target level moves', () => {
    const atCap = (ARCHETYPES.blaster?.stats.defenseCap ?? 0) * 100;
    expect(atCap).toBe(45);
    expect(getDefenseSoftcap(0, 'standard')).toBe(atCap);
    // Where a surface pinned to the archetype value is provably wrong:
    expect(getDefenseSoftcap(6, 'standard')).toBe(50);
    expect(getDefenseSoftcap(0, 'incarnate')).toBe(59);
  });

  // The sheet and the poster build their rows from DETAILED_STATS, a different roster from
  // the dashboard's. Grade it too, so a defense row added to one roster and not the other
  // cannot pick up the wrong kind — or a hard cap, which would let a meter present a
  // threshold as a total.
  it('every ceiling on the detailed sheet carries the right kind', () => {
    const DEF = 50; // a softcap that is NOT the archetype's 45, so a fallback would show
    const RES = 75;
    const defense = DETAILED_STATS.filter((id) => STAT_CATEGORY[id] === 'defense');
    const resistance = DETAILED_STATS.filter((id) => STAT_CATEGORY[id] === 'resistance');
    expect(defense.length).toBeGreaterThan(0);
    expect(resistance.length).toBeGreaterThan(0);

    for (const id of defense) {
      const cap = statCapFor(id, DEF, RES);
      expect(cap, id).toEqual({ value: DEF, kind: 'soft' });
      expect(capReplacesTotal(cap, 77.5), id).toBe(false);
    }
    for (const id of resistance) {
      expect(statCapFor(id, DEF, RES), id).toEqual({ value: RES, kind: 'hard' });
    }
    for (const id of DETAILED_STATS) {
      const got = statCapFor(id, DEF, RES);
      if (got === undefined) continue;
      expect(STAT_CATEGORY[id], `${id} was given a ${got.kind} cap`).toBe(
        got.kind === 'hard' ? 'resistance' : 'defense',
      );
    }
  });
});
