/**
 * BPORT11 cluster 4 — the movement cluster, read off the atoms and graded against the bag.
 *
 * Three separate reads that had to move together, because they share one axis vocabulary and
 * two of them are halves of the same authored pair.
 *
 * **The five scalar slots go, and they were never carriers.** `runSpeed`, `runSpeedUnenhanced`,
 * `flySpeed`, `jumpHeight` and `jumpSpeed` have 0 powers on all four forks. The comment those
 * blocks carried named Sprint, Ninja Run and Beast Run as the powers reaching the calc that way;
 * those hand-authored inherents carry no bag at all and their movement is atom-native through
 * the axis map. BPORT1 had already filed `flySpeed` as zero-supply and left the other four as
 * `leave`, because the supply census could not see that their only supplier was a display mint
 * the totals path never reaches.
 *
 * **The axis map's data branch had exactly one carrier, and fork resolution takes it.**
 * `movementBuffValue` returns an ARRAY — usually empty — for any power with a movement atom,
 * and `??` keeps an empty array, so the bag branch only ever fired where the reader answered
 * `undefined`. Across 14,249 powers that is one power: rebirth Acrobatics, whose atoms fork by
 * class (AT-FORK-1), so a build-agnostic read saw none of them. Read through `mezSourceFor` it
 * answers with the same jumpHeight/jumpSpeed the bag holds, and the data branch is left with no
 * carrier at all.
 *
 * **The combat-debuff gate is a swap of instrument, not of verdict.** It asked whether two
 * sibling SLOTS were absent; `carries_combat_debuff` asks the atoms on the discriminators that
 * decide it. They agree on all 18,239 power×class views.
 *
 * **The self-penalty pair is where numbers actually move**, and every move is a self penalty the
 * converter's `toWho` tagging lost rather than a value the reader invented. Rebirth and
 * Thunderspy's Granite Armor and Rooted state their jump root as `JumpHeight -500 toWho:Target`
 * on a Self-target toggle — the "target" of a self-cast toggle IS the caster, which is why
 * `reachesCaster` consults the power's recipients — and the bag's untagged entry was dropped by
 * the `isSelfDirectedEffect` gate. So the root those two powers are named for reached no total
 * on two of the four forks. The block also grew its second half: `movementCapDebuff` is the
 * Maximum face of the same penalty, split out of `slow` by ENT-5, and this calc never grew the
 * read — 312 powers carry the slot and none was ever spent.
 *
 * Mutation-tested four ways, all red: routing the recipient question off the ROW rather than the
 * power (which is what loses Granite's root), routing the cap debuff off the Current face,
 * dropping `capEntries`' self-only gate, and stopping `carries_combat_debuff` discriminating on
 * aspect so ToHit-debuff RESISTANCE reads as a ToHit debuff.
 */
import { describe, it, expect } from 'vitest';
import { movementBuffValue, selfSlowValue, selfMovementCapDebuffValue } from '@/data/core/atom-query';
import { ATOM_TUPLE_FIELDS } from '@/data/core/atomic-effect';
import { isSelfDirectedEffect } from '@/types';
import { mezSourceFor, carries_combat_debuff } from './character-totals';
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
import { ARCHETYPES as HCA } from '@/data/datasets/homecoming/archetypes';
import { ARCHETYPES as RBA } from '@/data/datasets/rebirth/archetypes';
import { ARCHETYPES as TSA } from '@/data/datasets/thunderspy/archetypes';
import { ARCHETYPES as BSA } from '@/data/datasets/brainstorm/archetypes';

type AnyPower = Record<string, unknown> & { name?: string; atoms?: unknown[]; effects?: Record<string, unknown> };
type Tree = Record<string, { powers?: AnyPower[] }>;

const classTokens = (reg: unknown): string[] => [...new Set(
  Object.values(reg as Record<string, { stats?: { className?: string } }>)
    .map((a) => a?.stats?.className).filter((t): t is string => !!t),
)];

const FORKS = [
  { fork: 'homecoming', tokens: classTokens(HCA), trees: [['set', HC], ['pool', HCP], ['epic', HCE]] },
  { fork: 'rebirth', tokens: classTokens(RBA), trees: [['set', RB], ['pool', RBP], ['epic', RBE]] },
  { fork: 'thunderspy', tokens: classTokens(TSA), trees: [['set', TSPY], ['pool', TSP], ['epic', TSE]] },
  { fork: 'brainstorm', tokens: classTokens(BSA), trees: [['set', BS], ['pool', BSP], ['epic', BSE]] },
] as unknown as { fork: string; tokens: string[]; trees: [string, Tree][] }[];

const FORK_IDX = ATOM_TUPLE_FIELDS.indexOf('casterArchetypes');
const isForked = (p: AnyPower) => (p.atoms ?? []).some((t) => !!(t as unknown[])[FORK_IDX]);

function* powers(): Generator<[string, AnyPower]> {
  for (const { fork, trees } of FORKS)
    for (const [label, tree] of trees)
      for (const [setId, set] of Object.entries(tree))
        for (const p of set?.powers ?? []) yield [`${fork}/${label}/${setId}/${p.name}`, p];
}
function* views(): Generator<[string, AnyPower, AnyPower]> {
  for (const { fork, trees, tokens } of FORKS)
    for (const [label, tree] of trees)
      for (const [setId, set] of Object.entries(tree))
        for (const p of set?.powers ?? []) {
          const at = `${fork}/${label}/${setId}/${p.name}`;
          if (!isForked(p)) { yield [at, p, p]; continue; }
          for (const tok of tokens) yield [`${at} [${tok}]`, p, mezSourceFor(p as never, tok) as AnyPower];
        }
}

/** The four axes `movementKeyMap` routes to a global. `fly` is the flight-MODE grant and is
 *  deliberately unmapped; `movementControl` / `movementFriction` have no global at all. */
const ROUTED = new Set(['runSpeed', 'flySpeed', 'jumpHeight', 'jumpSpeed']);

describe('BPORT11 cluster 4 — the movement cluster against the bag it replaces', () => {
  it('retires five scalar slots that no power on any fork carries', () => {
    const carriers: Record<string, string[]> = {};
    for (const [id, p] of powers())
      for (const slot of ['runSpeed', 'runSpeedUnenhanced', 'flySpeed', 'jumpHeight', 'jumpSpeed'])
        if (p.effects?.[slot] !== undefined) (carriers[slot] ??= []).push(id);
    expect(carriers).toEqual({});
  });

  it('leaves the axis map with no data carrier once the fork is resolved', () => {
    // Two facts, and the second is the one that closes the branch. The reader returning an
    // empty array is NOT the same as returning undefined: `??` keeps the empty array, so the
    // bag branch was already unreachable for every power that has a movement atom at all.
    let undefinedReaders = 0;
    const strandedRaw: string[] = [];
    const strandedResolved: string[] = [];
    for (const { fork, trees, tokens } of FORKS)
      for (const [label, tree] of trees)
        for (const [setId, set] of Object.entries(tree))
          for (const p of set?.powers ?? []) {
            const id = `${fork}/${label}/${setId}/${p.name}`;
            const routed = Object.keys(p.effects?.movement ?? {}).filter((k) => ROUTED.has(k));
            if (movementBuffValue(p as never) === undefined) {
              undefinedReaders++;
              if (routed.length) strandedRaw.push(id);
            }
            if (!routed.length) continue;
            // Fork-resolved, as the call site reads it: every class view must answer.
            const views_ = isForked(p) ? tokens.map((t) => mezSourceFor(p as never, t)) : [p as never];
            if (views_.some((v) => movementBuffValue(v) === undefined)) strandedResolved.push(id);
          }
    expect(undefinedReaders).toBeGreaterThan(0); // the branch was reachable in principle
    // Raw: one power, and it is the forked one. Stated so the fix is attributed, not assumed.
    expect(strandedRaw).toHaveLength(1);
    expect(strandedRaw[0]).toBe('rebirth/pool/leaping/Acrobatics');
    // Resolved: none. That is what retires the data branch.
    expect(strandedResolved).toEqual([]);
  });

  it('swaps the combat-debuff gate without swapping its verdict', () => {
    const disagree: string[] = [];
    for (const [id, p] of views()) {
      const bagGate = p.effects?.tohitDebuff === undefined && p.effects?.damageDebuff === undefined;
      if (bagGate === !carries_combat_debuff(p as never)) continue;
      disagree.push(id);
    }
    expect(disagree).toEqual([]);
  });

  it('restores the jump root two forks lost to an untagged bag entry', () => {
    // The atom arms stamp `toWho: 'Self'` because they have already answered the recipient
    // question; the bag entry carried whatever the converter tagged, and on these it tagged
    // nothing. Asserted on the powers by name, because a silent change of population here is
    // the failure this whole comparison exists to catch.
    const selfAxes = (rows: { axis: string; scale: number }[] | undefined) =>
      (rows ?? []).filter((e) => ROUTED.has(e.axis)).map((e) => `${e.axis}=${e.scale}`).sort().join(',');
    const bagSelfAxes = (m: unknown) => {
      if (!m || typeof m !== 'object') return '';
      return Object.entries(m as Record<string, unknown>)
        .filter(([k, v]) => ROUTED.has(k) && isSelfDirectedEffect(v))
        .map(([k, v]) => `${k}=${(v as { scale: number }).scale}`).sort().join(',');
    };
    const gained: string[] = [];
    const lost: string[] = [];
    for (const [id, p] of powers()) {
      const bag = bagSelfAxes(p.effects?.slow);
      const atom = selfAxes(selfSlowValue(p as never) as { axis: string; scale: number }[] | undefined);
      if (bag === atom) continue;
      const bagSet = new Set(bag ? bag.split(',') : []);
      const atomSet = new Set(atom ? atom.split(',') : []);
      for (const a of atomSet) if (!bagSet.has(a)) gained.push(`${id} +${a}`);
      for (const b of bagSet) if (!atomSet.has(b)) lost.push(`${id} -${b}`);
    }
    // Nothing is dropped: every self-tagged bag axis is also an atom axis.
    expect(lost).toEqual([]);
    // Eight are Granite Armor and Rooted's jump root on rebirth and Thunderspy; three are Team
    // Teleport's own flight suppression, which is a click and so never reaches an active pass.
    expect(gained.filter((g) => g.includes('jumpHeight=500'))).toHaveLength(8);
    for (const named of ['Granite Armor', 'Rooted']) {
      expect(gained.some((g) => g.includes(named)), named).toBe(true);
    }
    expect(gained.every((g) => /Granite Armor|Rooted|Team Teleport/.test(g))).toBe(true);
  });

  it('gives the Maximum face of the penalty a reader for the first time', () => {
    // 312 powers carry `movementCapDebuff` and this calc read none of them: the slot was split
    // out of `slow` by ENT-5 and only the Current-face read was ever written here. Nothing
    // moves today — only 4 views are self-tagged and both arms agree on all 4 — but the axis
    // now has a reader on both faces, which is what stops the next cap debuff being silent.
    const slotCarriers = [...powers()].filter(([, p]) => p.effects?.movementCapDebuff !== undefined);
    expect(slotCarriers.length).toBe(312);
    const differ: string[] = [];
    let agree = 0;
    for (const [id, p] of powers()) {
      const bag = Object.entries((p.effects?.movementCapDebuff ?? {}) as Record<string, unknown>)
        .filter(([k, v]) => ROUTED.has(k) && isSelfDirectedEffect(v))
        .map(([k, v]) => `${k}=${(v as { scale: number }).scale}`).sort().join(',');
      const atom = (selfMovementCapDebuffValue(p as never) ?? [])
        .filter((e) => ROUTED.has(e.axis)).map((e) => `${e.axis}=${e.scale}`).sort().join(',');
      if (!bag && !atom) continue;
      if (bag === atom) agree++; else differ.push(`${id} bag=[${bag}] atom=[${atom}]`);
    }
    expect(differ).toEqual([]);
    expect(agree).toBe(4);
  });
});
