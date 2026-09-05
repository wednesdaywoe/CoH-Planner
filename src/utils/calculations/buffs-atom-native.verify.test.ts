/**
 * BPORT11 cluster 5 — the last families, read off the atoms and graded against the bag.
 *
 * ToHit, +Damage, the self damage and recharge penalties, regen, recovery, MaxHP, stealth, the
 * accolade +MaxEnd, and the toggle end cost. Six of them agree with the bag on every carrier;
 * the four that do not are the four worth reading twice.
 *
 * **Defiance was being credited as a permanent +damage buff.** 68 powers carry a `damageBuff`
 * the reader declines, and every single one is defiance-only — Blaster secondaries whose
 * Defiance rows the bag projected into a slot the totals spend flat. The rejection has to be
 * spoken at the call site as well as inside the reader, because an absent atom read is
 * indistinguishable from the atom-less case a fallback serves, and the bag held the same value
 * one line down.
 *
 * **Ally buffs were being credited to the caster.** Retiring the regen and recovery data arms
 * drops 46 + 76 credits, and every one is a `reachesCaster`-false row: Adrenalin Boost,
 * Painbringer, Temporal Selection, Speed Boost. The bag slot is toWho-blind, so an ally's
 * +regen landed on whoever owned the power.
 *
 * **The Expression punt was safe only while the bag was there.** `resourceBuffValue` abstained
 * on any Expression-typed resource atom because the converter drops the `tick_chance`-0 ones
 * and `Expression ⟺ dropped` is false. Its stated reason was "safe either way: if the bag kept
 * it we fall back to the bag's value" — and the strip is exactly the change that makes the
 * other way unsafe, because abstention stops meaning "ask the bag" and starts meaning zero.
 * Measured before closing it: every Expression resource atom reaching the reader belongs to a
 * power whose bag KEPT the slot, and the reconstructed value equals the bag's on all 36. The
 * casualty avoided is Gamma Boost's +regen and +recovery on all four forks.
 *
 * **One stealth carrier leaves and it is not a stealth row.** 106 powers carry a bag `stealth`
 * the reader declines; 105 are the teleport family's `{translucency: …}` under a key this block
 * never reads, credited 0. The 106th is Assassin's Strike, whose four atoms are a Meta, two
 * Damage and a GrantPower — no stealth row anywhere — so its bag `stealthPvE/PvP` came through
 * a grant edge the atom reader does not follow. That is the grant-crossing question RB5-d owns,
 * not a gap in this reader, and it is a Click either way.
 *
 * ABSORB is absent from this file on purpose: it is the one family BPORT11 declined to carry.
 * See the block comment in the oracle and the ABSORB-4 residual.
 */
import { describe, it, expect } from 'vitest';
import {
  toHitBuffValue, damageBuffValue, damageBuffIsDefianceOnly, selfDamageDebuffValue,
  selfRechargeDebuffValue, regenBuffValue, recoveryBuffValue, maxHPBuffValue, stealthValue,
  maxEndBuffValue, baseAtoms, reachesCaster, isDebuffAtom,
} from '@/data/core/atom-query';
import { isSelfDirectedEffect } from '@/types';
import { MODULAR_POWERSETS as HC } from '@/data/datasets/homecoming/powersets';
import { MODULAR_POWERSETS as RB } from '@/data/datasets/rebirth/powersets';
import { MODULAR_POWERSETS as TSPY } from '@/data/datasets/thunderspy/powersets';
import { MODULAR_POWERSETS as BS } from '@/data/datasets/brainstorm/powersets';
import { POWER_POOLS_RAW as HCP } from '@/data/datasets/homecoming/power-pools-raw';
import { EPIC_POOLS_RAW as HCE } from '@/data/datasets/homecoming/epic-pools-raw';
import { POWER_POOLS_RAW as RBP } from '@/data/datasets/rebirth/power-pools-raw';
import { EPIC_POOLS_RAW as RBE } from '@/data/datasets/rebirth/epic-pools-raw';
import { POWER_POOLS_RAW as TSP } from '@/data/datasets/thunderspy/power-pools-raw';
import { EPIC_POOLS_RAW as TSE } from '@/data/datasets/thunderspy/epic-pools-raw';
import { POWER_POOLS_RAW as BSP } from '@/data/datasets/brainstorm/power-pools-raw';
import { EPIC_POOLS_RAW as BSE } from '@/data/datasets/brainstorm/epic-pools-raw';
import { ACCOLADES_POWERSET as HCACC } from '@/data/datasets/homecoming/generated/accolades';
import { ACCOLADES_POWERSET as RBACC } from '@/data/datasets/rebirth/generated/accolades';
import { ACCOLADES_POWERSET as TSACC } from '@/data/datasets/thunderspy/generated/accolades';
import { ACCOLADES_POWERSET as BSACC } from '@/data/datasets/brainstorm/generated/accolades';

type AnyPower = Record<string, unknown> & { name?: string; powerType?: string; effects?: Record<string, unknown> };
type Tree = Record<string, { powers?: AnyPower[] }>;

const PARTITIONS: readonly (readonly [string, Tree])[] = [
  ['homecoming/set', HC as unknown as Tree], ['rebirth/set', RB as unknown as Tree],
  ['thunderspy/set', TSPY as unknown as Tree], ['brainstorm/set', BS as unknown as Tree],
  ['homecoming/pool', HCP as unknown as Tree], ['homecoming/epic', HCE as unknown as Tree],
  ['rebirth/pool', RBP as unknown as Tree], ['rebirth/epic', RBE as unknown as Tree],
  ['thunderspy/pool', TSP as unknown as Tree], ['thunderspy/epic', TSE as unknown as Tree],
  ['brainstorm/pool', BSP as unknown as Tree], ['brainstorm/epic', BSE as unknown as Tree],
];

function* corpus(): Generator<[string, AnyPower]> {
  for (const [label, tree] of PARTITIONS)
    for (const [setId, set] of Object.entries(tree))
      for (const p of set?.powers ?? []) yield [`${label}/${setId}/${p.name}`, p];
}

const pair = (v: unknown) => {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'number') return `${v}@`;
  const o = v as { scale?: number; table?: string; perTarget?: number };
  if (typeof o.scale !== 'number') return `?${JSON.stringify(v)}`;
  return `${o.scale}@${(o.table ?? '').toLowerCase()}${o.perTarget ? `+${o.perTarget}` : ''}`;
};

type Split = { agree: number; differ: string[]; bagOnly: string[]; atomOnly: string[] };
const grade = (
  slot: string,
  arm: (p: AnyPower) => unknown,
  bagArm?: (p: AnyPower) => unknown,
): Split => {
  const t: Split = { agree: 0, differ: [], bagOnly: [], atomOnly: [] };
  for (const [id, p] of corpus()) {
    const b = pair(bagArm ? bagArm(p) : p.effects?.[slot]);
    const a = pair(arm(p));
    if (b === undefined && a === undefined) continue;
    if (b !== undefined && a !== undefined) {
      if (b === a) t.agree++; else t.differ.push(`${id} bag=${b} atom=${a}`);
    } else if (b !== undefined) t.bagOnly.push(`${id} bag=${b}`);
    else t.atomOnly.push(`${id} atom=${a}`);
  }
  return t;
};

describe('BPORT11 cluster 5 — the last families against the bag they replace', () => {
  it.each([
    ['tohitBuff', (p: AnyPower) => toHitBuffValue(p as never), 874],
    ['tohitBuffUnenhanced', (p: AnyPower) => toHitBuffValue(p as never, { ignoreStrength: true }), 48],
    ['maxHPBuff', (p: AnyPower) => maxHPBuffValue(p as never), 293],
    ['maxHPBuffUnenhanced', (p: AnyPower) => maxHPBuffValue(p as never, { ignoreStrength: true }), 162],
  ])('%s: every carrier the bag holds, the atoms hold identically', (slot, arm, expected) => {
    const t = grade(slot as string, arm as (p: AnyPower) => unknown);
    expect(t.differ, `${slot} differ`).toEqual([]);
    expect(t.bagOnly, `${slot} bag-only`).toEqual([]);
    expect(t.atomOnly, `${slot} atom-only`).toEqual([]);
    expect(t.agree, `${slot} carriers`).toBe(expected as number);
  });

  it.each([
    ['damageDebuff', (p: AnyPower) => selfDamageDebuffValue(p as never), 43],
    ['rechargeDebuff', (p: AnyPower) => selfRechargeDebuffValue(p as never), 8],
  ])('%s: agrees on the self-tagged half, which is the only half spent', (slot, arm, expected) => {
    // The call site keeps only `isSelfDirectedEffect` entries, so the comparison does too.
    const t = grade(slot as string, arm as (p: AnyPower) => unknown,
      (p) => (isSelfDirectedEffect(p.effects?.[slot as string]) ? p.effects?.[slot as string] : undefined));
    expect(t.differ, slot).toEqual([]);
    expect(t.bagOnly, slot).toEqual([]);
    expect(t.atomOnly, slot).toEqual([]);
    expect(t.agree, slot).toBe(expected as number);
  });

  it('declines 68 damage buffs and every one of them is Defiance', () => {
    const t = grade('damageBuff', (p) =>
      (damageBuffIsDefianceOnly(p as never) ? undefined : damageBuffValue(p as never)));
    expect(t.bagOnly).toHaveLength(68);
    // The claim, on the reader rather than on a list of names: nothing is dropped for any
    // reason but Defiance. A future power dropped for some OTHER reason reds here.
    for (const row of t.bagOnly) {
      const [id] = row.split(' bag=');
      const p = [...corpus()].find(([k]) => k === id)![1];
      expect(damageBuffIsDefianceOnly(p as never), id).toBe(true);
    }
    // Fulcrum Shift's 8 rows differ on the bag's own terms and predate this row: the atom arm
    // has been primary on this slot since Plan B slice 2, so those numbers are already live.
    expect(t.differ.every((s) => s.includes('Fulcrum Shift'))).toBe(true);
  });

  it.each([
    ['regenBuff', (p: AnyPower) => regenBuffValue(p as never), 46],
    ['recoveryBuff', (p: AnyPower) => recoveryBuffValue(p as never), 76],
  ])('%s: drops only values the caster never receives', (slot, arm, expectedDropped) => {
    const t = grade(slot as string, arm as (p: AnyPower) => unknown);
    expect(t.differ, slot).toEqual([]);
    expect(t.atomOnly, slot).toEqual([]);
    expect(t.bagOnly, slot).toHaveLength(expectedDropped as number);
    // Stated as the property, not the roster: every dropped carrier has resource atoms and
    // none of them reaches the caster. An ally buff the bag projected onto its owner.
    const type = (slot as string).startsWith('regen') ? 'Regeneration' : 'Recovery';
    for (const row of t.bagOnly) {
      const [id] = row.split(' bag=');
      const p = [...corpus()].find(([k]) => k === id)![1];
      const atoms = baseAtoms(p as never)
        .filter((a) => a.effectType === type && a.aspect !== 'Res' && !isDebuffAtom(a) && !a.notOnCaster);
      expect(atoms.length, id).toBeGreaterThan(0);
      expect(atoms.some((a) => reachesCaster(a, p as never)), id).toBe(false);
    }
  });

  it('closes the Expression punt on the population that made it safe', () => {
    // Every Expression resource atom the reader still sees belongs to a power whose bag KEPT
    // the slot, so abstaining was never protecting a value — and the reconstructed value
    // equals the bag's on all of them.
    let agree = 0;
    const differ: string[] = [];
    const droppedTemplateCarriers: string[] = [];
    const routedToTwin: string[] = [];
    for (const [id, p] of corpus()) {
      for (const [slot, type, opts] of [
        ['regenBuff', 'Regeneration', {}], ['regenBuffUnenhanced', 'Regeneration', { ignoreStrength: true }],
        ['recoveryBuff', 'Recovery', {}], ['recoveryBuffUnenhanced', 'Recovery', { ignoreStrength: true }],
      ] as const) {
        const hasExpr = baseAtoms(p as never).some((a) => a.effectType === type
          && a.attribType === 'Expression' && a.aspect !== 'Res' && !isDebuffAtom(a) && !a.notOnCaster);
        if (!hasExpr) continue;
        const av = type === 'Regeneration'
          ? regenBuffValue(p as never, opts) : recoveryBuffValue(p as never, opts);
        const bag = pair(p.effects?.[slot]);
        const atom = pair(av);
        if (bag === undefined && atom === undefined) continue;
        if (bag === atom) { agree++; continue; }
        // An atom answering where the bag held nothing is the shape the punt existed to
        // prevent — a template the converter DROPPED being credited back.
        if (bag === undefined) droppedTemplateCarriers.push(`${id} ${slot} atom=${atom}`);
        // The reader declining where the bag held a value is the `ignoreStrength` routing, not
        // the punt: Defibrillate's and Disrupting Torrent's increments belong to the twin slot,
        // and Fortify Pack's is a scale-0 row. All three are Clicks, so no active pass reaches
        // them; they are named rather than counted so a real casualty cannot join the list.
        else if (atom === undefined) routedToTwin.push(`${id} ${slot}`);
        else differ.push(`${id} ${slot} bag=${bag} atom=${atom}`);
      }
    }
    expect(differ).toEqual([]);
    expect(agree).toBe(36);
    expect(routedToTwin).toHaveLength(15);
    expect(routedToTwin.every((r) => /Defibrillate|Disrupting Torrent|Fortify Pack/.test(r))).toBe(true);
    // The population the punt existed for: an Expression row the converter DROPPED that still
    // reaches this reader. Empty — the one corpus power carrying one (Thunderspy's Fortify
    // Pack) is `toWho: Target` and `notOnCaster`, declined for a reason the reader can state.
    expect(droppedTemplateCarriers).toEqual([]);
    // And the casualty the closure avoids, named so the closure has a subject.
    const gamma = [...corpus()].filter(([id]) => id.endsWith('/Gamma Boost'));
    expect(gamma.length).toBeGreaterThan(0);
    for (const [id, p] of gamma) {
      expect(regenBuffValue(p as never), id).toBeDefined();
      expect(recoveryBuffValue(p as never), id).toBeDefined();
    }
  });

  it('leaves 106 stealth carriers, 105 of them a key this block never reads', () => {
    // Compared by the keys the call site spends, not by the raw slot: `stealthValue` returns a
    // {stealthPvE, stealthPvP, stackKey} object and the bag's translucency carriers hold none
    // of those keys, so the question is which carriers HAVE them, not whether the shapes match.
    const declined = [...corpus()].filter(([, p]) => p.effects?.stealth && !stealthValue(p as never));
    expect(declined).toHaveLength(106);
    const withKeys = declined.filter(([, p]) => {
      const s = p.effects?.stealth as Record<string, unknown>;
      return s.stealthPvE !== undefined || s.stealthPvP !== undefined;
    });
    expect(withKeys).toHaveLength(1);
    expect(withKeys[0][0]).toContain("Assassin's Strike");
    // And it is not a stealth row that leaves: the power carries none.
    expect(baseAtoms(withKeys[0][1] as never).some((a) => a.effectType === 'Stealth')).toBe(false);
    expect((withKeys[0][1] as AnyPower).powerType).toBe('Click');
    // And every carrier the reader DOES answer for agrees with the bag on both keys.
    let agree = 0;
    for (const [id, p] of corpus()) {
      const a = stealthValue(p as never);
      if (!a) continue;
      const b = p.effects?.stealth as Record<string, unknown> | undefined;
      expect(pair(b?.stealthPvE), `${id} pve`).toBe(pair(a.stealthPvE));
      expect(pair(b?.stealthPvP), `${id} pvp`).toBe(pair(a.stealthPvP));
      agree++;
    }
    expect(agree).toBe(341);
  });

  it('reads the accolade +MaxEnd off the atoms, exactly as the bag stated it', () => {
    const accolades = [
      ['homecoming', HCACC], ['rebirth', RBACC], ['thunderspy', TSACC], ['brainstorm', BSACC],
    ] as unknown as [string, { powers?: AnyPower[] }][];
    let agree = 0;
    const differ: string[] = [];
    for (const [fork, set] of accolades)
      for (const p of set?.powers ?? []) {
        const bag = pair(p.effects?.maxEndBuff);
        const atom = pair(maxEndBuffValue(p as never));
        if (bag === undefined && atom === undefined) continue;
        if (bag === atom) agree++; else differ.push(`${fork}/${p.name} bag=${bag} atom=${atom}`);
      }
    expect(differ).toEqual([]);
    expect(agree).toBe(28);
  });

  it('retires effects.enduranceCost against a population of nothing', () => {
    const carriers = [...corpus()].filter(([, p]) => p.effects?.enduranceCost !== undefined);
    expect(carriers).toEqual([]);
  });
});
