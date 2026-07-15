/**
 * Plan B, Phase 1 — atom-native read primitives for the calc.
 *
 * The calc currently asks the `PowerEffects` bag "what is in slot X". Every slot
 * is single-valued, so whenever two distinct game effects route to the same slot
 * the projection must either pick a winner (collapse — the bug family) or mint a
 * discriminator: a parallel slot (`*Unenhanced`), or a flag bolted onto the value
 * (`unresistable`, `durationVariants`, `toWho`). Each such discriminator is a
 * property of the *atom*; the bag forces it to be re-materialized once per effect
 * type, by hand, forever.
 *
 * These helpers let the calc ask the other question instead — "give me the atoms
 * of effectType X" — and handle the discriminators explicitly. Each helper below
 * encapsulates exactly ONE of the axes the bag flattens:
 *
 *   bag representation            axis                    helper
 *   ───────────────────────────── ─────────────────────── ──────────────────────
 *   `*Unenhanced` parallel slots  IgnoreStrength          `enhanceableVsNot`
 *   `unresistable: true` flag     resistible              `resistibleTwins`
 *   `durationVariants[]`          duration                `durationBuckets`
 *   `toWho: 'Self'` flag          eToWho                  `selfDirected`
 *   slot name                     effectType/subType      `byType` / `atomsOfType`
 *
 * Read-only and side-effect free: nothing here mutates a `Power` or an atom.
 * Phase 1 adds no calc consumer — the appliers migrate one at a time in Phase 2,
 * each behind the shadow compare (`scripts/planb-shadow-bag.cjs`).
 */

import type { Power } from '@/types/power';
import { decodeAtoms, type AtomicEffect, type EffectType } from './atomic-effect';

// ============================================================================
// Access
// ============================================================================

/**
 * Decoded atoms are cached per `Power` object. Generated powers are frozen
 * module-level constants with stable identity, so this is a process-lifetime
 * memo keyed on the power itself — a `WeakMap` so a dynamically-built or
 * discarded Power (imported build, redirect variant) is still collectable.
 */
const atomCache = new WeakMap<Power, readonly AtomicEffect[]>();

/**
 * The power's atom list — its effects as the flat, pre-projection DSH4 record
 * array, decoded from the compact `Power.atoms` wire form.
 *
 * Returns `[]` for a power with no atoms. NB that is NOT the same as "no
 * effects": a power converted before Plan B Phase 0, or one whose effects are
 * entirely entity-creation (`summon` stays template-owned), legitimately has an
 * empty atom list while carrying a populated bag. Callers migrating an applier
 * must treat an empty atom list as "fall back to the bag", never as "zero".
 */
export function atomsOf(power: Power): readonly AtomicEffect[] {
  const cached = atomCache.get(power);
  if (cached) return cached;
  const atoms: readonly AtomicEffect[] = Object.freeze(decodeAtoms(power.atoms));
  atomCache.set(power, atoms);
  return atoms;
}

/** The power's atoms of one effectType, in list order. */
export function atomsOfType(power: Power, effectType: EffectType): AtomicEffect[] {
  return atomsOf(power).filter((a) => a.effectType === effectType);
}

/**
 * The power's ALWAYS-ON atoms — those with no gate. This is the atom-native
 * equivalent of "what the `PowerEffects` bag holds": the bag's collector drops
 * every gated group, because a single-valued slot cannot carry both the base
 * and the gated variant.
 *
 * **Phase 2 appliers should read this, not `atomsOf`.** `power.atoms` is the
 * complete effect list — it deliberately includes mode/stance, PvP,
 * hidden-state and chance-0 proc atoms that do NOT apply by default. Summing
 * `atomsOf` directly would over-count every stance-gated armor and every PvP
 * variant. `gated` is stamped by the converter (see `AtomicEffect.gated`) and
 * `baseAtoms(power)` is verified corpus-wide to reproduce the converter's own
 * base set exactly (`scripts/planb-shadow-bag.cjs`).
 */
export function baseAtoms(power: Power): AtomicEffect[] {
  return atomsOf(power).filter((a) => !a.gated);
}

/**
 * The power's gated atoms — everything that applies only under a condition
 * (mode/stance, PvP, hidden-state, `rand()`, chance-0 proc trigger). Each
 * carries its own gate in `requiresExpression` / `specialCase` / `pvMode` /
 * `baseProbability`. The bag surfaces a curated subset of these as
 * `conditionalEffects`; the atom list keeps them all.
 */
export function gatedAtoms(power: Power): AtomicEffect[] {
  return atomsOf(power).filter((a) => a.gated);
}

/** The power's BASE atoms of one effectType — the Phase 2 applier entry point. */
export function baseAtomsOfType(power: Power, effectType: EffectType): AtomicEffect[] {
  return baseAtoms(power).filter((a) => a.effectType === effectType);
}

/** Index atoms by `effectType` (list order preserved within each bucket). */
export function byType(atoms: readonly AtomicEffect[]): Map<EffectType, AtomicEffect[]> {
  const m = new Map<EffectType, AtomicEffect[]>();
  for (const a of atoms) {
    const bucket = m.get(a.effectType);
    if (bucket) bucket.push(a);
    else m.set(a.effectType, [a]);
  }
  return m;
}

/** Index atoms by `subType` (`''` for scalar effects, which carry none). */
export function bySubType(atoms: readonly AtomicEffect[]): Map<string, AtomicEffect[]> {
  const m = new Map<string, AtomicEffect[]>();
  for (const a of atoms) {
    const k = a.subType ?? '';
    const bucket = m.get(k);
    if (bucket) bucket.push(a);
    else m.set(k, [a]);
  }
  return m;
}

// ============================================================================
// Discriminator axes
// ============================================================================

/**
 * The eToWho axis. `toWho: 'Self'` marks a value that lands on the CASTER —
 * Granite Armor's -damage/-recharge, Rage's -20% defense crash, Offensive
 * Adaptation's -7.5% resistance — as opposed to a foe debuff, which the caster's
 * own totals must ignore. The bag carries this as an optional per-value flag
 * (`ScaledEffect.toWho`), which only works because the converter re-stamps it at
 * every routing site; miss one and a self-penalty silently becomes a foe debuff
 * (the Rage crash bug, found mechanically by the DSH6c gate — no user reported it).
 *
 * `'All'` (self *and* pets/allies) also lands on the caster and is included.
 */
export function selfDirected(atoms: readonly AtomicEffect[]): AtomicEffect[] {
  return atoms.filter((a) => a.toWho === 'Self' || a.toWho === 'All');
}

/** The complement of {@link selfDirected} — values that land on the target only. */
export function targetDirected(atoms: readonly AtomicEffect[]): AtomicEffect[] {
  return atoms.filter((a) => a.toWho !== 'Self' && a.toWho !== 'All');
}

/**
 * The IgnoreStrength axis — the one the bag taxed hardest, with FIVE hand-rolled
 * parallel slots (`maxHPBuffUnenhanced`, `recoveryBuffUnenhanced`,
 * `regenBuffUnenhanced`, `tohitBuffUnenhanced`, `runSpeedUnenhanced`) for a
 * single boolean. An `ignoreStrength` atom is not boosted by slotted enhancement
 * or global strength buffs; it still applies at full base value, and it SUMS
 * with its enhanceable twin (verified on the Bio Armor +MaxHP pair — both halves
 * apply, 66.93 × 2).
 *
 * Splitting here is what lets Phase 2 delete those five slots: an applier reads
 * `enhanceableVsNot(atomsOfType(power, 'MaxHP'))` and enhances one side.
 */
export function enhanceableVsNot(atoms: readonly AtomicEffect[]): {
  enhanceable: AtomicEffect[];
  unenhanceable: AtomicEffect[];
} {
  const enhanceable: AtomicEffect[] = [];
  const unenhanceable: AtomicEffect[] = [];
  for (const a of atoms) (a.ignoreStrength ? unenhanceable : enhanceable).push(a);
  return { enhanceable, unenhanceable };
}

/**
 * The `resistible` axis. HC splits many foe debuffs into two sibling atoms that
 * are identical but for the `IgnoreResistance` flag: one half the target's debuff
 * resistance can reduce, one half that bypasses it. **Both apply in game** — the
 * atom list needs no special handling to be correct, which is precisely the point.
 * The bag cannot hold two values in one slot, so it stores one half and tags it
 * `unresistable: true`, leaving the calc to reconstruct the other.
 *
 * Returns the sibling atoms grouped: each `twins` entry is a `{ resistible,
 * unresistible }` pair, `rest` is every atom with no counterpart. Pairing is on
 * full identity minus the flag — same effectType/subType/pvMode/toWho/
 * attribType/aspect/table/|scale|/duration. Scale is compared by MAGNITUDE
 * because a twin pair carries the same value; the sign is a property of the
 * effect, not of the twin split.
 *
 * NB the bag restricts twin coalescing to debuffs (a `+MaxHP` or heal twin is
 * left to sum) — that restriction is an artifact of the single-valued slot, not
 * a game rule, so it is deliberately NOT applied here. Callers wanting the bag's
 * behavior filter on sign/table themselves.
 */
export function resistibleTwins(atoms: readonly AtomicEffect[]): {
  twins: { resistible: AtomicEffect; unresistible: AtomicEffect }[];
  rest: AtomicEffect[];
} {
  const groups = new Map<string, AtomicEffect[]>();
  for (const a of atoms) {
    const k = twinKey(a);
    const bucket = groups.get(k);
    if (bucket) bucket.push(a);
    else groups.set(k, [a]);
  }
  const twins: { resistible: AtomicEffect; unresistible: AtomicEffect }[] = [];
  const rest: AtomicEffect[] = [];
  for (const bucket of groups.values()) {
    // Pair off greedily: a group may hold several of each side (a power applying
    // the same debuff twice), and each resistible half has exactly one bypassing
    // partner. Leftovers on either side are genuinely unpaired.
    const res = bucket.filter((a) => a.resistible);
    const unres = bucket.filter((a) => !a.resistible);
    const n = Math.min(res.length, unres.length);
    for (let i = 0; i < n; i++) twins.push({ resistible: res[i], unresistible: unres[i] });
    rest.push(...res.slice(n), ...unres.slice(n));
  }
  return { twins, rest };
}

/** Full atom identity minus `resistible` — the twin-pairing key. */
function twinKey(a: AtomicEffect): string {
  return [
    a.effectType,
    a.subType ?? '',
    a.pvMode,
    a.toWho,
    a.attribType,
    a.aspect,
    a.modifierTable.toLowerCase(),
    Math.abs(a.scale).toFixed(4),
    a.duration.toFixed(4),
  ].join('|');
}

/**
 * The duration axis. CoH sometimes applies the SAME debuff twice at distinct
 * durations — EMP Arrow's -500% regen at both 15s and 45s, Thunderous Blast's
 * -100% recovery at 10s and 20s. These are genuinely separate applications that
 * expire at different times, so summing them into one value overstates the tail
 * and understates nothing (the bag's original collapse), while dropping one
 * understates the head. The bag's answer is `durationVariants[]` hung off the
 * primary value; atoms just carry their own duration.
 *
 * Buckets otherwise-identical atoms by duration, longest-lived first (the bag's
 * primary-slot convention). `key` is the shared identity; each bucket's `atoms`
 * all share it and differ only in duration.
 */
export function durationBuckets(atoms: readonly AtomicEffect[]): {
  key: string;
  duration: number;
  atoms: AtomicEffect[];
}[] {
  const groups = new Map<string, Map<number, AtomicEffect[]>>();
  for (const a of atoms) {
    const k = durationlessKey(a);
    let byDur = groups.get(k);
    if (!byDur) groups.set(k, (byDur = new Map()));
    const bucket = byDur.get(a.duration);
    if (bucket) bucket.push(a);
    else byDur.set(a.duration, [a]);
  }
  const out: { key: string; duration: number; atoms: AtomicEffect[] }[] = [];
  for (const [key, byDur] of groups) {
    for (const [duration, bucket] of byDur) out.push({ key, duration, atoms: bucket });
  }
  // Longest-lived first, then a stable tiebreak on the identity key so the order
  // never depends on Map insertion (i.e. on converter emit order).
  out.sort((x, y) => y.duration - x.duration || (x.key < y.key ? -1 : x.key > y.key ? 1 : 0));
  return out;
}

/** Atom identity minus `duration` — the duration-bucketing key. */
function durationlessKey(a: AtomicEffect): string {
  return [
    a.effectType,
    a.subType ?? '',
    a.pvMode,
    a.resistible ? 'R' : 'U',
    a.toWho,
    a.attribType,
    a.aspect,
    a.modifierTable.toLowerCase(),
    a.scale.toFixed(4),
  ].join('|');
}
