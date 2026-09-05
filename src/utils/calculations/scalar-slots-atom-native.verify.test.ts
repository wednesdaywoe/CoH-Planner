/**
 * BPORT11 cluster 1 — the seven scalar families, read off the atoms, graded against the bag
 * they replace while the bag still answers.
 *
 * This is the comparison BPORT7 destroys. The regen that empties `power.effects` also empties
 * the shadow oracle every one of these arms was checked against, so a carry landing after the
 * strip can only be checked against itself. Canonical hit exactly that on `shouldShowToggle`
 * and had to re-derive the roster from a pre-strip checkout. The order here is the lesson:
 * migrate first, grade against the incumbent, then strip.
 *
 * Six of the seven agree with the bag on every carrier of every fork. The two that do not are
 * the reason the comparison is worth running:
 *
 *  - **`maxEndBuffValue` credited the caster with the foe's drain.** Soul Consumption states
 *    `-1 Target` beside its `+1 Self` and the reader's `Math.abs` fold summed both, answering
 *    2 where the bag, the game and the Rust twin all say 1 — four powersets on two forks. Its
 *    Rust counterpart (`coh_math::appliers::resources::max_endurance_buff_value`) has carried
 *    the recipient test since ATOM8; the TypeScript half never grew it, and nothing compared
 *    the two until this carry. Fixed in `atom-query.ts`, pinned below.
 *  - **`rechargeBuffValue` answers for 25 powers the Thunderspy bag never held.** Atoms
 *    carrying MORE than the bag is the migration working, not a divergence — and here it also
 *    closes an oracle-vs-engine gap, because Rust has read this family from atoms since ATOM9
 *    while this oracle read a slot Thunderspy's converter never wrote.
 *
 * The seventh is `elusivity`, which BPORT1 filed as zero-supply. Both arms confirm it from
 * their own side: no power on any fork carries the bag entry, and no power carries an atom the
 * reader would return. The arm is kept rather than deleted precisely because it is empty — a
 * reader that answers the day a fork ships one beats a deletion somebody has to notice.
 */
import { describe, it, expect } from 'vitest';
import {
  accuracyBuffValue, rechargeBuffValue, rangeBuffValue, perceptionBuffValue,
  enduranceDiscountValue, maxEndBuffValue, elusivityValue, baseAtoms,
} from '@/data/core/atom-query';
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

type AnyPower = Record<string, unknown> & { name?: string; targetType?: string; effects?: Record<string, unknown> };
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
      for (const power of set?.powers ?? []) yield [`${label}/${setId}`, power];
}

/**
 * A slot value as the number it resolves to, independent of level and archetype: equal
 * `{scale, table}` pairs feed `resolveScaledEffect` the same two arguments, so comparing the
 * pair compares every number either arm could produce. `undefined` is "this arm declines".
 */
type Val = string | undefined;
const pair = (v: unknown): Val => {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'number') return `${v}@`;
  const o = v as { scale?: number; table?: string };
  if (typeof o.scale !== 'number') return `?${JSON.stringify(v)}`;
  return `${o.scale}@${(o.table ?? '').toLowerCase()}`;
};

type Split = { agree: string[]; differ: string[]; bagOnly: string[]; atomOnly: string[] };

/** One family's two arms over the whole corpus, split four ways. */
function grade(
  slot: string,
  atomArm: (p: AnyPower) => unknown,
  gate?: (p: AnyPower) => boolean,
): Split {
  const out: Split = { agree: [], differ: [], bagOnly: [], atomOnly: [] };
  for (const [where, power] of corpus()) {
    if (gate && !gate(power)) continue;
    const b = pair(power.effects?.[slot]);
    const a = pair(atomArm(power));
    if (b === undefined && a === undefined) continue;
    const id = `${where}/${power.name}`;
    if (b !== undefined && a !== undefined) (b === a ? out.agree : out.differ).push(`${id} bag=${b} atom=${a}`);
    else if (b !== undefined) out.bagOnly.push(`${id} bag=${b}`);
    else out.atomOnly.push(`${id} atom=${a}`);
  }
  return out;
}

describe('BPORT11 cluster 1 — the scalar families against the bag they replace', () => {
  it.each([
    ['accuracyBuff', (p: AnyPower) => accuracyBuffValue(p as never), undefined, 56],
    ['enduranceDiscount', (p: AnyPower) => enduranceDiscountValue(p as never), undefined, 103],
    ['perceptionBuff', (p: AnyPower) => perceptionBuffValue(p as never), undefined, 256],
    // The oracle only credits a `rangeBuff` on a Self-target power (the Fast Snipe range bump
    // is not a persistent caster buff), so the comparison runs under the same gate — grading
    // an arm on a population its call site never reaches proves nothing about the call site.
    ['rangeBuff', (p: AnyPower) => rangeBuffValue(p as never),
      (p: AnyPower) => p.targetType?.toLowerCase() === 'self', 45],
    ['maxEndBuff', (p: AnyPower) => maxEndBuffValue(p as never), undefined, 48],
  ])('%s: every carrier the bag holds, the atoms hold identically', (slot, arm, gate, expected) => {
    const g = grade(slot as string, arm as (p: AnyPower) => unknown, gate as ((p: AnyPower) => boolean) | undefined);
    expect(g.differ, `${slot} differ`).toEqual([]);
    expect(g.bagOnly, `${slot} bag-only`).toEqual([]);
    expect(g.atomOnly, `${slot} atom-only`).toEqual([]);
    expect(g.agree.length, `${slot} carriers`).toBe(expected);
  });

  it('recovers 25 Thunderspy recharge buffs the bag never held, and matches on the rest', () => {
    const g = grade('rechargeBuff', (p) => rechargeBuffValue(p as never));
    expect(g.differ).toEqual([]);
    // Nothing is LOST: every bag carrier is also an atom carrier. That is the direction that
    // matters — the other one is a value the migration would drop.
    expect(g.bagOnly).toEqual([]);
    expect(g.agree).toHaveLength(309);
    // The gains are Thunderspy's alone, which is what a converter gap looks like from the atom
    // side: the templates are on the wire, the bag slot was never written from them.
    expect(g.atomOnly).toHaveLength(25);
    expect(g.atomOnly.every((s) => s.startsWith('thunderspy/'))).toBe(true);
    expect(g.atomOnly.some((s) => s.includes('Time Wall'))).toBe(true);
  });

  it('leaves elusivity empty from both sides, which is why the reader stays', () => {
    const g = grade('elusivity', (p) => elusivityValue(p as never));
    expect(g).toEqual({ agree: [], differ: [], bagOnly: [], atomOnly: [] });
  });
});

describe('BPORT11 — the recipient test maxEndBuffValue was missing', () => {
  /** Soul Consumption: an AoE that drains foes and hands the caster what it took. */
  const soulConsumption = () => {
    const p = (HCE as unknown as Tree)['blaster_dark_mastery']?.powers
      ?.find((x) => x.name === 'Soul Consumption');
    expect(p, 'Soul Consumption is the fixture; a rename must red here').toBeDefined();
    return p!;
  };

  it('reads the caster half of a drain, not the sum of both halves', () => {
    const p = soulConsumption();
    const rows = baseAtoms(p as never)
      .filter((a) => a.effectType === 'MaxEndurance' && a.aspect === 'Max');
    // Stated on the atoms rather than on the answer: the two rows differ ONLY in recipient and
    // sign, which is the collapse the whole model exists to prevent. If a future export stops
    // shipping the pair, this test should say so rather than quietly grading one row.
    expect(rows.map((a) => `${a.toWho}:${a.scale}`).sort()).toEqual(['Self:1', 'Target:-1']);
    expect(maxEndBuffValue(p as never)).toEqual({ scale: 1, table: 'Ranged_EndDrain' });
  });

  it('keeps a SELF debuff, which is the crash a power really does inflict', () => {
    // The predicate is `to_who === Target && isDebuff`, not `isDebuff` — narrower at both ends,
    // and both ends carry powers. Burnout's −25 MaxEnd lands on the caster and the bag counts
    // it, so dropping every debuff would have been a second wrong answer in the other
    // direction. (Whether |−25| should be credited as +25 at all is older than this carry and
    // is what the bag, the atoms and the Rust engine all currently say.)
    const burnout = (HCP as unknown as Tree)['speed']?.powers?.find((x) => x.name === 'Burnout');
    expect(burnout).toBeDefined();
    const rows = baseAtoms(burnout as never)
      .filter((a) => a.effectType === 'MaxEndurance' && a.aspect === 'Max');
    expect(rows.map((a) => `${a.toWho}:${a.scale}`)).toEqual(['Self:-25']);
    expect(maxEndBuffValue(burnout as never)).toEqual({ scale: 25, table: 'Melee_Ones' });
  });
});
