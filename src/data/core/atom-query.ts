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
import { decodeAtoms, landsOnCaster, type AtomicEffect, type EffectType } from './atomic-effect';

/**
 * The atom helpers only touch `power.atoms`, so they accept anything carrying it
 * — a full `Power`, a `PowerWithToggle` in the calc loop, a redirect variant.
 * Narrowing the parameter here avoids forcing callers to hold a complete `Power`.
 */
/**
 * What a reader here needs off a Power: its atom list, and the targets that resolve the
 * pronoun in an `AnyAffected` atom ({@link reachesCaster}). `targetsAffected` is optional on
 * `Power` and present on 100% of the generated corpus; a hand-built source that omits it
 * reads as a power affecting nobody, so every `toWho: 'Target'` atom on it answers "does not
 * reach the caster". That is the safe direction, and `scripts/planb-shadow-targets3.cjs`
 * asserts the corpus never relies on it.
 */
type AtomSource = Pick<Power, 'atoms' | 'targetsAffected'> & Partial<Pick<Power, 'name'>>;
// `name` is optional because a hand-built source is allowed to omit it; the one reader is a
// Rule 1 throw, where a missing name costs a less specific message and nothing else.

// ============================================================================
// Access
// ============================================================================

/**
 * Decoded atoms are cached per `Power` object. Generated powers are frozen
 * module-level constants with stable identity, so this is a process-lifetime
 * memo keyed on the power itself — a `WeakMap` so a dynamically-built or
 * discarded Power (imported build, redirect variant) is still collectable.
 */
const atomCache = new WeakMap<AtomSource, readonly AtomicEffect[]>();

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
export function atomsOf(power: AtomSource): readonly AtomicEffect[] {
  const cached = atomCache.get(power);
  if (cached) return cached;
  const atoms: readonly AtomicEffect[] = Object.freeze(decodeAtoms(power.atoms));
  atomCache.set(power, atoms);
  return atoms;
}

/** The power's atoms of one effectType, in list order. */
export function atomsOfType(power: AtomSource, effectType: EffectType): AtomicEffect[] {
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
 *
 * An archetype-forked atom is excluded here because these readers have no build to
 * resolve it against: it is base for ONE archetype and absent from every other's (see
 * `AtomicEffect.casterArchetypes`). The Rust gather, which does know the build, keeps it
 * and filters by class (AT-FORK-1).
 *
 * The bag is no longer blind in quite the same way. The CONVERTER holds the archetype
 * roster, so it can resolve a fork the readers here cannot and state the slot whenever
 * every archetype comes out the same (`convert-powerset._addUnanimousForkedSlots`) —
 * Rebirth Combat Jumping forks only to carve out a Kheldian hover clause and buffs
 * defense .25 either way. A slot like that reads `undefined` here and populated in the
 * bag, which is agreement rather than divergence; `planb-shadow-sweep.forkResolvedViews`
 * is how the shadow gates check it instead of scoring two silences as a match.
 */
export function baseAtoms(power: AtomSource): AtomicEffect[] {
  return atomsOf(power).filter(isBagBase);
}

/**
 * Is this atom part of the base every build sees, whatever its archetype?
 *
 * Not gated, and not archetype-forked. See {@link baseAtoms} for why the fork is
 * excluded from every reader here rather than resolved, and for the one way the bag
 * now says more than this does.
 */
export function isBagBase(a: AtomicEffect): boolean {
  return !a.gated && !a.casterArchetypes;
}

/**
 * The power's gated atoms — everything that applies only under a condition
 * (mode/stance, PvP, hidden-state, `rand()`, chance-0 proc trigger). Each
 * carries its own gate in `requiresExpression` / `specialCase` / `pvMode` /
 * `baseProbability`. The bag surfaces a curated subset of these as
 * `conditionalEffects`; the atom list keeps them all.
 */
export function gatedAtoms(power: AtomSource): AtomicEffect[] {
  return atomsOf(power).filter((a) => a.gated);
}

/** The power's BASE atoms of one effectType — the Phase 2 applier entry point. */
export function baseAtomsOfType(power: AtomSource, effectType: EffectType): AtomicEffect[] {
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
 * Which recipients count is {@link landsOnCaster}'s call, not this one's — the reading
 * used to be spelled out here and differently at a dozen other doors (TARGETS-2).
 */
export function selfDirected(atoms: readonly AtomicEffect[]): AtomicEffect[] {
  return atoms.filter(landsOnCaster);
}

/** The complement of {@link selfDirected} — values that land on the target only. */
export function targetDirected(atoms: readonly AtomicEffect[]): AtomicEffect[] {
  return atoms.filter((a) => !landsOnCaster(a));
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

/**
 * The perTarget axis. An AoE self-buff that grows with foes hit — Soul Drain's
 * +ToHit (1.0 flat + 0.2/foe), Invincibility's +ToHit (0.2/foe), Consume
 * Psyche's +Regen — is stored by the bag as a single `{ scale, table, perTarget }`,
 * where `scale` is the value at ONE target and `perTarget` the increment per
 * additional foe. The calc applies `scale + perTarget × (N − 1)`.
 *
 * Reconstructs that value object from a group of same-slot atoms:
 *   - per-target increments present → {@link perTargetFromGroup} (dedup by
 *     `(|scale|, table)`, base + caster-side increments at N=1);
 *   - otherwise the longest-lived instance (the burst/tail primary, so Inner
 *     Light reads its 0.77 tail, not the 2.77 overlap sum).
 *
 * Returns `undefined` for an empty group. Corpus-verified bag-equal for tohitBuff
 * by `scripts/planb-shadow-pertarget.cjs`.
 */
export function perTargetValueOf(
  atoms: readonly AtomicEffect[],
  power: AtomSource,
): { scale: number; table: string; perTarget?: number } | undefined {
  if (!atoms.length) return undefined;
  const table = atoms.find((a) => a.modifierTable)?.modifierTable ?? '';
  const pt = perTargetFromGroup(atoms, table, power);
  if (pt) return pt;
  // No per-target increment: the sustained value is the longest-lived instance
  // (a burst+tail power's primary bucket), never the overlap sum.
  const buckets = durationBuckets(atoms);
  // Buckets tied at the longest duration are ordered by their identity key, so
  // which one wins depends on how the scale happens to SPELL. That only matters
  // when the tie is between genuine same-slot DUPLICATES — same recipient, all
  // `Replace` — which is the shape the bag collapses by `Math.max`
  // (`foldResourceSlot`). Thunderspy Grace is the first fork to ship one (a 1.0
  // base beside a 0.5 NearGround variant). A tie across different recipients is
  // not a duplicate at all (Thermal Radiation's Fire Shield buffs the target at 2
  // and the caster at 1), so it keeps the bucket-order pick.
  const tied = buckets.filter((b) => b.duration === buckets[0].duration);
  const atomsTied = tied.flatMap((b) => b.atoms);
  const sameRecipient = atomsTied.every((a) => a.toWho === atomsTied[0].toWho);
  // A `Replace` base beside a `Stack` increment on the same recipient is the
  // engine's CO-APPLICATION idiom, not two spellings of one value — both land,
  // so the value at one target is their sum, which is what the bag accumulates
  // and what `computeAoePerTargetPatches` calls `replaceScale + stackScale`.
  // Reached only when the converter did not stamp `perTarget`: Memento Mori's
  // +MaxHP (Replace 3 beside Stack 0.15, both 30s) arrives through a redirect,
  // and the redirect path deliberately withholds the per-foe stamp. Without
  // this the tie fell through to "pick a bucket" and read 0.15 for a 3.15 buff.
  const coApplied = sameRecipient
    && atomsTied.some((a) => a.stacking === 'Replace')
    && atomsTied.some(
      (a) => a.stacking === 'Stack' || a.stacking === 'Continuous'
        || a.stacking === 'RefreshToCount',
    );
  if (coApplied) {
    // Dedup by (|scale|, table) for the same reason `perTargetFromGroup` does:
    // a by-type buff repeats one value across N atoms.
    const distinct = new Map<string, number>();
    for (const a of atomsTied) {
      distinct.set(`${Math.abs(a.scale)}|${a.modifierTable}`, Math.abs(a.scale));
    }
    let sum = 0;
    for (const v of distinct.values()) sum += v;
    return { scale: sum, table };
  }
  const duplicates = sameRecipient
    && atomsTied.every((a) => a.stacking === 'Replace');
  const scale = duplicates
    ? Math.max(...atomsTied.map((a) => Math.abs(a.scale)))
    : Math.abs(buckets[0].atoms[0].scale);
  return { scale, table };
}

/**
 * The per-target `{ scale, perTarget }` of a same-slot atom group, or `undefined`
 * when the group carries no per-target increment. Shared by {@link perTargetValueOf}
 * (ToHit) and {@link damageBuffValue} so the two can't drift from each other or
 * from the converter's `computeAoePerTargetPatches`:
 *   - `perTarget` = Σ DISTINCT increment (dedup `(|scale|, table)`) — a by-type or
 *     burst/tail buff repeats the same increment across N atoms; summing raw would
 *     N×-inflate (the Rebirth per-type-template bug), so the converter and this
 *     both count each distinct increment once.
 *   - N=1 `scale` = base (Replace) + only the increments landing on the CASTER
 *     (`toWho` Self/All). That toWho test is what separates AAO (Self increment →
 *     N=1 = base+increment) from Fulcrum Shift (Target increment → N=1 = base).
 */
function perTargetFromGroup(
  atoms: readonly AtomicEffect[],
  table: string,
  power: AtomSource,
): { scale: number; table: string; perTarget: number } | undefined {
  const increments = atoms.filter((a) => a.perTarget);
  if (!increments.length) return undefined;
  const perTarget = sumDistinctAbs(increments, (a) => a.perTarget ?? 0);
  const bases = atoms.filter((a) => !a.perTarget);
  const selfIncrements = increments.filter((a) => reachesCaster(a, power));
  const scale = sumDistinctAbs(bases, (a) => a.scale) + sumDistinctAbs(selfIncrements, (a) => a.scale);
  return { scale, table, perTarget };
}

/**
 * The atom-native `tohitBuff` / `tohitBuffUnenhanced` value — the +ToHit buff the
 * calc reads today off `effects.tohitBuff`, reconstructed from atoms (scale +
 * perTarget + burst/tail collapse). Mirrors the projection's toHit routing: a
 * ToHit atom lands here when its aspect is neither `Res` (→ debuffResistance) nor
 * `Str` (→ specialBuff strength), it is not a debuff, and its `ignoreStrength`
 * matches the requested half (`false` → `tohitBuff`, `true` → `tohitBuffUnenhanced`).
 *
 * Returns `undefined` when the power has no such atom — the caller then falls
 * back to the bag (an atom-less legacy power keeps its `effects.tohitBuff`; see
 * {@link atomsOf}). Verified bag-equal by `scripts/planb-shadow-pertarget.cjs`.
 */
export function toHitBuffValue(
  power: AtomSource,
  opts: { ignoreStrength?: boolean } = {},
): { scale: number; table: string; perTarget?: number } | undefined {
  const wantIgnoreStrength = opts.ignoreStrength ?? false;
  const atoms = baseAtoms(power).filter(
    (a) =>
      a.effectType === 'ToHit' &&
      a.aspect !== 'Res' &&
      a.aspect !== 'Str' &&
      !!a.ignoreStrength === wantIgnoreStrength &&
      a.scale > 0 &&
      !(a.modifierTable || '').toLowerCase().includes('debuff'),
  );
  return perTargetValueOf(atoms, power);
}

/**
 * True when this atom belongs to a `Defiance`-tagged effect group — the Blaster
 * inherent, which the game data names on the group itself.
 *
 * Defiance is a PER-CAST transient: every Blaster attack grants a few seconds of
 * self +Damage, so what a Blaster actually has is a rotation-dependent ramp, not a
 * sustained total. A totals dashboard reports the sustained value, which is why the
 * engine's `inherents` pass does not model Defiance at all and why
 * `TRANSIENT_UNMODELED_ADJUSTERS` leaves the same class of combat state (Storm's
 * clear skies, Dual Pistols ammo, Staff perfection) out.
 *
 * It reached the total anyway, because the converter routes the tagged group into
 * the ordinary `damageBuff` slot like any Build Up: End of Time (+5.4%) and Future
 * Pain (+11%) read as +16.4% global damage on a Blaster with no +Damage set bonus
 * anywhere, permanently, at one stack, for whichever attacks happened to be flagged
 * active — a number matching no game state. Reported 2026-08-05.
 *
 * Rejected here rather than at the converter because the atom is REAL and the power
 * info panel is right to show it; only the caster's sustained totals must ignore it,
 * exactly as {@link AtomicEffect.notOnCaster} is stamped rather than dropped. 115
 * Homecoming powers carry a Defiance atom; on 31 of them it IS the whole `damageBuff`,
 * and the one power that mixes it with a genuine +Damage buff (Soul Drain, whose
 * `Melee_Ones` rider sits beside a `Melee_Buff_Dmg` per-foe increment) is already
 * settled by the dominant-table filter in {@link damageBuffValue}. So this takes
 * nothing else with it — Build Up, Aim, Soul Drain, AAO and Fulcrum Shift are
 * untouched.
 *
 * Homecoming-only by the same schema fact that governs every tag: Parse6 has no group
 * to hang one on, so a Rebirth/Thunderspy Defiance rider is caught only by that
 * dominant-table filter.
 */
function isDefianceAtom(a: AtomicEffect): boolean {
  return (a.tags ?? '').split(',').some((tag) => tag.trim() === 'Defiance');
}

/** The `DamageBuff` strength-atom test {@link damageBuffValue} and
 *  {@link damageBuffIsDefianceOnly} share, so the set one reads and the set the
 *  other judges cannot drift apart. */
function isDamageBuffAtom(a: AtomicEffect): boolean {
  return (
    a.effectType === 'DamageBuff' &&
    a.aspect === 'Str' &&
    a.scale > 0 &&
    !(a.modifierTable || '').toLowerCase().includes('debuff')
  );
}

/**
 * True when this power carries `DamageBuff` strength atoms and EVERY one of them is
 * Defiance — i.e. {@link damageBuffValue} found the slot and rejected all of it.
 *
 * Callers need this because the `?? effects.damageBuff` bag fallback would otherwise
 * undo the rejection: the bag slot holds the same Defiance value, and an absent atom
 * read is exactly the "atom-less legacy power" signal that fallback exists to serve.
 * Distinguishing "no +damage buff here" from "a +damage buff we decline to count" is
 * the whole job.
 */
export function damageBuffIsDefianceOnly(power: AtomSource): boolean {
  const atoms = baseAtoms(power).filter(isDamageBuffAtom);
  return atoms.length > 0 && atoms.every(isDefianceAtom);
}

/**
 * The atom-native `damageBuff` value — the +Damage strength buff the calc reads
 * off `effects.damageBuff` (Build Up, Assault, Soul Drain, AAO, Fulcrum Shift),
 * reconstructed from atoms. Harder than {@link toHitBuffValue} because a +damage
 * buff is not scalar: it explodes into ONE atom per damage type (8–13 siblings
 * with identical scale), so a naive sum would 8–13× inflate. Four axes are
 * handled, all derivable from the atoms:
 *
 *   - **damage-type collapse** — dedup by `(|scale|, table)` so the per-type (and
 *     same-scale burst/tail) siblings count once, matching the converter's own
 *     `sumDistinctScale` in `computeAoePerTargetPatches` (the two must agree, and
 *     the shadow gate proves it).
 *   - **dominant table** — keep only atoms on the table carrying the most |scale|,
 *     dropping an off-table rider (a blaster's `Melee_Ones` Defiance increment,
 *     which the converter excludes via its `isDefiance` filter).
 *   - **per-target (N=1) via toWho** — `perTarget = Σ distinct increment`; the
 *     N=1 scale adds the base (Replace) plus only those increments that land on
 *     the CASTER (`toWho` Self/All). That one test separates AAO (Self increment,
 *     N=1 = base+increment = 1.55) from Fulcrum Shift (Target increment, N=1 =
 *     base 4, increment 2 applies per foe) with no extra flag.
 *   - **non-uniform primary** — when types differ (Embrace of Fire: +10 Fire/30s
 *     vs +8 all/10s), the headline is the value covering the MOST damage types
 *     (ties broken by longest duration), which is what a single global +damage
 *     slot represents — matching the bag's pick.
 *
 * A fifth axis is a REJECTION rather than a reconciliation: a `Defiance`-tagged
 * atom is dropped outright — see {@link isDefianceAtom}.
 *
 * Returns `undefined` for a power with no +damage atom (→ bag fallback; see
 * {@link atomsOf}). Verified bag-equal corpus-wide by
 * `scripts/planb-shadow-pertarget.cjs`.
 */
export function damageBuffValue(
  power: AtomSource,
): { scale: number; table: string; perTarget?: number } | undefined {
  let atoms = baseAtoms(power).filter((a) => isDamageBuffAtom(a) && !isDefianceAtom(a));
  if (!atoms.length) return undefined;

  // Dominant table: the one carrying the most total |scale|. Off-table riders
  // (Defiance on `Melee_Ones`) are excluded by the converter and must be here too.
  const tableWeight = new Map<string, number>();
  for (const a of atoms) {
    tableWeight.set(a.modifierTable, (tableWeight.get(a.modifierTable) ?? 0) + Math.abs(a.scale));
  }
  let table = '';
  let best = -Infinity;
  for (const [t, w] of tableWeight) if (w > best) ((best = w), (table = t));
  atoms = atoms.filter((a) => a.modifierTable === table);

  // per-target increments present → shared reconstruction (dedup + toWho N=1).
  const pt = perTargetFromGroup(atoms, table, power);
  if (pt) return pt;

  // No per-target increment: the headline is the value shared by the most damage
  // types (ties → longest-lived), the burst/tail primary for a uniform buff.
  const groups = new Map<string, { types: Set<string>; duration: number; scale: number }>();
  for (const a of atoms) {
    const k = `${Math.abs(a.scale)}|${a.duration}`;
    let g = groups.get(k);
    if (!g) groups.set(k, (g = { types: new Set(), duration: a.duration, scale: Math.abs(a.scale) }));
    g.types.add(a.subType ?? '');
  }
  let primary = { types: new Set<string>(), duration: -1, scale: 0 };
  for (const g of groups.values()) {
    if (
      g.types.size > primary.types.size ||
      (g.types.size === primary.types.size && g.duration > primary.duration) ||
      (g.types.size === primary.types.size && g.duration === primary.duration && g.scale > primary.scale)
    ) {
      primary = g;
    }
  }
  return { scale: primary.scale, table };
}

/**
 * The eight standard damage-type resistance globals (`resSmashing`…`resPsionic`)
 * — the ONLY resistance types the calc totals. Restricting the resistance helpers
 * to these sidesteps the atom-bridge/bag routing disagreements on every OTHER
 * subType, none of which reaches a `res<Type>` total anyway:
 *   - `All` (from a `base_defense`@Res template) — the atom bridge labels it
 *     `Resistance`/`All`, but the bag routes `base_defense`@resistance to
 *     `debuffResistance.defense` (defense-debuff resistance), not `resistance`.
 *   - `Radiation`/`Electrical`/`Sonic`/`Quantum`/`Unique*` — the atom bridge
 *     covers these Kheldian/signature types; the bag's `DAMAGE_TYPES` does not,
 *     so it drops them (and there is no `resRadiation` global regardless).
 *   - `Heal` (from `heal_dmg`@Res) — the atom bridge maps it to `HealResistance`;
 *     the bag keys `resistance.heal`, but `resHeal` is not a global either.
 *   - `Special` — no `resSpecial` global.
 * All are behavior-irrelevant to the caster's resistance totals, so excluding
 * them is behavior-preserving and makes the shadow a clean per-type equality.
 */
const RESIST_STD_SUBTYPES = new Set([
  'Smashing', 'Lethal', 'Fire', 'Cold', 'Energy', 'Negative', 'Toxic', 'Psionic',
]);

/** True when an atom is a DEBUFF (the bag's `isDebuff`): negative scale, or a
 *  `*_debuff` table (a −resistance/−defense at scale ≥ 0 on a debuff table still
 *  debuffs). Shared by the resistance and defense buff/penalty helpers, which must
 *  split buffs from debuffs exactly as the converter's routing does. */
function isDebuffAtom(a: AtomicEffect): boolean {
  return a.scale < 0 || (a.modifierTable || '').toLowerCase().includes('debuff');
}

/**
 * The RPN clause `target ≠ source` — the game's way of saying "everyone the power
 * reaches EXCEPT the one who cast it". Both operand orders and both equality tokens
 * appear in the export.
 *
 * The `.owner` variants (`entref target.owner> entref source> eq !`) are deliberately
 * not matched: those compare the target's OWNER, which is a question about pets, and
 * no oracle here settles what the caster should get from one.
 */
function requiresExcludesSelf(req: string[]): boolean {
  // Joined only to ask a question of it — a token boundary can neither create
  // nor destroy this clause. Never split the result back apart (COND-8).
  const squashed = req.join(' ');
  return [
    'entref target> entref source> eq !',
    'entref source> entref target> eq !',
    'entref target> entref source> == !',
    'entref source> entref target> == !',
  ].some((clause) => squashed.includes(clause));
}

/**
 * Does this atom reach everyone the power hits EXCEPT the caster?
 *
 * Two fields have to agree, and reading either alone gets it wrong. Shield Defense's
 * Grant Cover and Shield Defense's Phalanx Fighting both carry the `target ≠ source`
 * clause, but Grant Cover's defense rows are aimed at `Target` (the ally standing in
 * the sphere) while Phalanx's are aimed at `Self` — Phalanx counts nearby allies to
 * size a buff it then hands to the caster. So the clause alone would delete Phalanx,
 * and the recipient alone would keep Grant Cover.
 *
 * `Unspecified` is not treated as `Target`: an unstated recipient is unstated, and
 * guessing one here would fabricate the very discriminator this function reads.
 */
export function excludesCaster(a: AtomicEffect): boolean {
  return (
    !landsOnCaster(a) && a.toWho !== 'Unspecified' &&
    !!a.requiresExpression?.length &&
    requiresExcludesSelf(a.requiresExpression)
  );
}

/**
 * Does this atom's gate say the target is somebody the caster is not?
 *
 * The power's `targetsAffected` is a union over the whole power, so it says the caster is
 * somewhere in the target list, never that THIS mod lands on him. What narrows it is the mod's
 * own `Requires`, and three clause families in the corpus do that. Measured over every gate
 * carried by a `Target` atom of a power whose targets name `Self` (54 distinct gates across the
 * three forks), these three are the whole vocabulary of clauses that speak about who the target
 * IS:
 *
 *  - `target != source` — the caster by name, {@link requiresExcludesSelf}.
 *  - `enttype target> critter eq` — the target is a critter, and a player caster is not. This is
 *    how Homecoming writes Force of Thunder's knockdown and Reaction Time's `-1` run cap, both on
 *    `['Foe', 'Self']` powers.
 *  - `target.isFriend? !` — the target is not an ally, and you are your own ally. Thunderspy's
 *    Anguishing Cry debuffs eight resistances this way on an `['Any', 'Self']` power, so without
 *    this term the caster reads `-3` resistance to everything.
 *
 * Every other gate in that corpus is about WHEN the mod fires or about the caster's own state
 * (`isPVPMap?`, `arch source>`, the mode and token gates, the event timers), which is a question
 * no recipient test should be answering.
 */
function gateExcludesCaster(a: AtomicEffect): boolean {
  const req = a.requiresExpression;
  if (!req?.length) return false;
  // Joined only to ask a question of it — never split back apart (COND-8).
  const squashed = req.join(' ');
  return (
    requiresExcludesSelf(req) ||
    squashed.includes('enttype target> critter eq') ||
    squashed.includes('target.isFriend? !')
  );
}

/**
 * Does this atom land on the CASTER once the power resolves the pronoun in it?
 *
 * {@link landsOnCaster} can only answer for the recipients that name somebody. `AnyAffected`
 * (the atom's `'Target'`) names nobody: it means "whoever this power affects", so the identical
 * spelling is the caster on Maneuvers and the yanked foe on Wormhole. What settles it is the
 * power's own `targetsAffected`, which no atom carries because it is a POWER-level field
 * (TARGETS-3) — except when a collector pulled the atom out of another power's file, and then
 * {@link AtomicEffect.ownerTargets} carries that power's list instead.
 *
 * Not every site wants this question. A reader rebuilding what a power GRANTS (the defense a
 * team buff hands its targets, shown on the power card) is not asking about the caster, and the
 * ally-buff powers are exactly where the two questions come apart.
 */
export function reachesCaster(a: AtomicEffect, power: AtomSource): boolean {
  if (a.toWho !== 'Target' && a.toWho !== 'TargetOnly') return landsOnCaster(a);
  const targets = a.ownerTargets ?? power.targetsAffected ?? [];
  return targets.includes('Self') && !gateExcludesCaster(a);
}

/**
 * The atom-native `effects.resistance` — the per-damage-type +resistance BUFF the
 * calc reads today (line ~1258 of character-totals.ts), reconstructed from atoms.
 * Returns an object keyed by lowercase damage type (`{ smashing: { scale, table,
 * perTarget? }, … }`), the SAME shape the applier already iterates, so the applier
 * body is unchanged — only its source swaps to `resistanceBuffValue(power) ??
 * effects.resistance`.
 *
 * Mirrors the bag's routing exactly for the eight standard types
 * ({@link RESIST_STD_SUBTYPES}): a `Resistance`/aspect-`Res` atom is a BUFF when it
 * is not a debuff ({@link isResistanceDebuff} — so scale-0 "expression" entries on
 * a non-debuff table are kept, matching the bag). Per type, the value is rebuilt
 * by the shared {@link perTargetValueOf}: an AoE self-resistance that grows per foe
 * (Bio Armor's Evolving Armor: +0.5 base +0.05/foe → `{ scale: 0.55, perTarget:
 * 0.05 }`) reconstructs from its converter-stamped increment atom; a plain buff is
 * its `|scale|`. `toWho` is NOT filtered — an ally-cast resistance buff routes to
 * `effects.resistance` too, and the applier adds it to the caster's totals.
 *
 * Returns `undefined` when no standard-type buff atom exists (→ bag fallback; see
 * {@link atomsOf}). Verified bag-equal corpus-wide by
 * `scripts/planb-shadow-resistance.cjs`.
 */
export function resistanceBuffValue(
  power: AtomSource,
): Record<string, { scale: number; table: string; perTarget?: number }> | undefined {
  const atoms = baseAtomsOfType(power, 'Resistance').filter(
    (a) => a.aspect === 'Res' && RESIST_STD_SUBTYPES.has(a.subType ?? '') && !isDebuffAtom(a),
  );
  if (!atoms.length) return undefined;
  const out: Record<string, { scale: number; table: string; perTarget?: number }> = {};
  for (const [type, group] of bySubType(atoms)) {
    const v = perTargetValueOf(group, power);
    if (v) out[type.toLowerCase()] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * The atom-native self-directed −resistance PENALTY — the caster's own resistance
 * loss the calc reads today off the `toWho:'Self'` entries of
 * `effects.resistanceDebuff` (Bio Armor Offensive Adaptation's −7.5% Res(all);
 * line ~1282). Returns `{ smashing: { scale, table, toWho:'Self' }, … }` keyed by
 * lowercase standard type — the applier still runs its `isSelfDirectedEffect`
 * filter (a no-op here since every entry is already self-directed, but it keeps the
 * bag-fallback path correct, where foe debuffs share the slot).
 *
 * A resistance atom is a self-penalty when it is a debuff ({@link isResistanceDebuff})
 * landing on the caster (`toWho` Self/All). Per type the value is `|scale|` of the
 * last such atom (last-write-wins, matching the bag's direct slot assignment).
 *
 * Returns `undefined` when the power has no standard-type self-penalty atom (→ bag
 * fallback). Verified bag-equal corpus-wide by `scripts/planb-shadow-resistance.cjs`.
 */
export function resistanceSelfDebuffValue(
  power: AtomSource,
): Record<string, { scale: number; table: string; toWho: 'Self' }> | undefined {
  const atoms = baseAtomsOfType(power, 'Resistance').filter(
    (a) =>
      a.aspect === 'Res' &&
      RESIST_STD_SUBTYPES.has(a.subType ?? '') &&
      isDebuffAtom(a) &&
      reachesCaster(a, power),
  );
  if (!atoms.length) return undefined;
  const out: Record<string, { scale: number; table: string; toWho: 'Self' }> = {};
  for (const [type, group] of bySubType(atoms)) {
    const last = group[group.length - 1];
    out[type.toLowerCase()] = { scale: Math.abs(last.scale), table: last.modifierTable, toWho: 'Self' };
  }
  return out;
}

/**
 * The eleven standard defense globals the calc totals: the three positions
 * (`defMelee`/`defRanged`/`defAoE`) and the eight damage types
 * (`defSmashing`…`defPsionic`). Restricting the defense helpers to these dodges
 * the atom-bridge/bag labelling gaps the resistance restriction does.
 *
 * `All` (from a `base_defense` template) is NOT a twelfth entry here: it is one
 * value that lands on all eleven, and {@link defenseBuffByType} expands it so —
 * but only at `aspect: Cur`, the one arm of the filter that must read the aspect
 * (see {@link isAllCurDefense}). The bag stores such a row as a SCALAR
 * `defenseBuffSuppressible` ScaledEffect with no `def<Type>` key, which is why the
 * planb-shadow expands the scalar by the same rule before comparing (DEFALL-1).
 */
const DEFENSE_STD_SUBTYPES = new Set([
  'Melee', 'Ranged', 'AoE',
  'Smashing', 'Lethal', 'Fire', 'Cold', 'Energy', 'Negative', 'Toxic', 'Psionic',
]);

/**
 * The `All` arm of the defense-buff filter: a `Base_Defense` row at the attribute's
 * live value. The aspect is checked HERE, where the typed arm never needs to, because
 * `All` is the one defense subType whose other faces exist in bulk: `Defense/All` at
 * `Res` is defense-debuff-resistance (BRIDGE-1's reclassification — 229 Homecoming
 * atoms), and at `Str` it is defense strength (Adrenal Booster). Reading either as a
 * defense value would ship Wolf Spider Armor's 0.3 as +30% defense — DEFALL-1's
 * census is the warrant that `Cur` alone is the buff face.
 */
function isAllCurDefense(a: AtomicEffect): boolean {
  return a.subType === 'All' && a.aspect === 'Cur';
}

/**
 * Reconstruct ONE defense type's `{ scale, perTarget }` from its atoms, mirroring
 * the bag's `defenseBuff[type]` exactly. Defense exercises two reconstruction axes
 * that resistance's {@link perTargetValueOf} does not:
 *
 *   - **last-write-wins** — the bag assigns `effects.defenseBuff[type] = makeEffect()`
 *     directly, so when a power carries two same-type base buffs at one duration
 *     (Rebirth Hide: +0.25 then +0.5) the LAST written value survives, not the
 *     longest-lived. The atom list preserves routing order, so the last atom is that
 *     value. (This is behaviourally identical to resistance's last-write-wins; it
 *     only becomes observable here because defense has the colliding pairs.)
 *   - **gated firstTargetExcluded increments** — Phalanx Fighting's +0.3/ally rides
 *     a `target≠self` gate, so its increment atom is `gated` (dropped from the base
 *     set) yet the converter still folds its perTarget into the base slot (scale
 *     stays 0.5, self is not counted). `computeAoePerTargetPatches` stamps `perTarget`
 *     ONLY on increments it folds, so gathering every `perTarget`-stamped atom — base
 *     OR gated — captures exactly those and no mode/PvP variant. The N=1 base then
 *     adds only the NON-gated self/all increments (Invincibility +0.1/foe, AAO),
 *     never the gated firstTargetExcluded one (Phalanx), so `gated` on the increment
 *     is the runtime-visible "excluded at one target" signal.
 */
function defensePerTypeValue(
  group: readonly AtomicEffect[],
  power: AtomSource,
): { scale: number; table: string; perTarget?: number } | undefined {
  const base = group.filter(isBagBase);
  // A gated atom carrying a per-foe increment is Phalanx Fighting's: an untoggleable gate
  // (`target != source`) that the conditional extractor never surfaces, so the converter's base
  // per-foe pass reads it and the bag's slot holds its increment. An atom the extractor DID
  // surface belongs to its `conditionalEffects` entry, where the extractor recomputes the per-foe
  // scaling in the entry's own scope — crediting it to the base is Evolving Armor granting its
  // Defensive-stance +Def in every stance. The stamp only reaches such an atom since PERFOE-1's
  // conditional half, which is why this clause could be written without it and stay green.
  const gatedIncr = group.filter((a) => a.gated && a.perTarget && !a.conditionalId);
  if (!base.length && !gatedIncr.length) return undefined;
  const baseIncr = base.filter((a) => a.perTarget);
  const increments = [...baseIncr, ...gatedIncr];
  const table = (base.find((a) => a.modifierTable) ?? group.find((a) => a.modifierTable))?.modifierTable ?? '';
  if (increments.length) {
    const perTarget = sumDistinctAbs(increments, (a) => a.perTarget ?? 0);
    const bases = base.filter((a) => !a.perTarget);
    const selfIncr = baseIncr.filter((a) => reachesCaster(a, power));
    const scale = sumDistinctAbs(bases, (a) => a.scale) + sumDistinctAbs(selfIncr, (a) => a.scale);
    return { scale, table, perTarget };
  }
  // No per-target increment → last-write-wins (the bag's direct slot assignment).
  const last = base[base.length - 1];
  return { scale: Math.abs(last.scale), table: last.modifierTable };
}

/**
 * The atom-native +Defense buff for one half of the combat-suppression axis.
 * Shared by {@link defenseBuffValue} (always-on → `effects.defenseBuff`) and
 * {@link defenseBuffSuppressibleValue} (dropped in combat → `effects.defenseBuffSuppressible`).
 *
 * The `Defense` atoms that are BUFFS (not a −Def debuff — the bag's `isDebuff`
 * routes those to `defenseDebuff`), restricted to the eleven standard globals
 * ({@link DEFENSE_STD_SUBTYPES}), partitioned by the converter-stamped `suppressible`
 * flag ({@link AtomicEffect.suppressible}) — the ONLY thing that separated the two bag
 * slots and, until the stamp, was absent from the wire atom (Hide's attack-click
 * suppression lives in `suppress_events`, not on the atom). NB the group is drawn
 * from ALL atoms of the type (not just the base set) so {@link defensePerTypeValue}
 * can recover Phalanx's gated firstTargetExcluded increment; it re-filters `gated`
 * itself.
 *
 * {@link excludesCaster} drops the rows the power hands to everyone but the caster
 * (Grant Cover's team defense). Phalanx Fighting carries the same `target ≠ source`
 * clause and survives, because its rows are aimed at `Self` — see that function.
 */
function defenseBuffByType(
  power: AtomSource,
  wantSuppressible: boolean,
): Record<string, { scale: number; table: string; perTarget?: number }> | undefined {
  const atoms = atomsOfType(power, 'Defense').filter(
    (a) =>
      (DEFENSE_STD_SUBTYPES.has(a.subType ?? '') || isAllCurDefense(a)) &&
      !isDebuffAtom(a) &&
      !excludesCaster(a) &&
      !!a.suppressible === wantSuppressible,
  );
  if (!atoms.length) return undefined;
  const out: Record<string, { scale: number; table: string; perTarget?: number }> = {};
  for (const [type, group] of bySubType(atoms)) {
    const v = defensePerTypeValue(group, power);
    // A reconstruction of exactly 0 with no per-target growth is not a real buff and
    // the bag surfaces nothing for it (Thunderspy Fortify Pack's pet-granted defense
    // resolves to a scale-0 placeholder whose whole `effects` bag is empty). Dropping
    // it is behavior-neutral — 0 contributes 0 to any total — and keeps the shadow a
    // clean equality. (The shadow checks BOTH directions, so a bag that DID keep a
    // scale-0 defense would still be caught.)
    if (!v || (v.scale === 0 && !v.perTarget)) continue;
    // `All` is `Base_Defense` — one value on all eleven keys, not a twelfth key
    // (DEFALL-1; the Rust twin routes through `defense_total_keys`). No corpus power
    // carries an `All` base row beside a typed base row in one suppression half
    // (Personal Force Field's typed siblings are PvP-gated and reconstruct to
    // nothing), and this Record could not hold both — where the Rust twin's list
    // form would sum them, one assignment here would silently swallow the other.
    // Fail loud instead of shipping half a defense total (Rule 1).
    const keys = type === 'All' ? [...DEFENSE_STD_SUBTYPES].map((t) => t.toLowerCase()) : [type.toLowerCase()];
    for (const key of keys) {
      if (key in out) {
        throw new Error(
          `defenseBuffByType: '${power.name ?? '<unnamed>'}' lands two defense-buff groups on '${key}' ` +
          `(an All expansion beside a typed row?) — this Record cannot express their sum`,
        );
      }
      out[key] = v;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * The atom-native `effects.defenseBuff` — the always-on per-type +defense buff the
 * calc reads today (line ~1220 of character-totals.ts, alongside the pet-aura/override
 * `effects.defense`). Keyed by lowercase position/type (`{ melee: {scale,table,
 * perTarget?}, … }`) — the SAME shape the applier iterates. Returns `undefined` when
 * the power has no always-on standard-type defense atom (→ bag fallback; see
 * {@link atomsOf}). Verified bag-equal corpus-wide by `scripts/planb-shadow-defense.cjs`.
 */
export function defenseBuffValue(
  power: AtomSource,
): Record<string, { scale: number; table: string; perTarget?: number }> | undefined {
  return defenseBuffByType(power, false);
}

/**
 * The atom-native `effects.defenseBuffSuppressible` — the combat-suppressed per-type
 * +defense buff (Hide, Stealth, Cloaking Device) the calc reads today (line ~1239),
 * applied ONLY when not in combat mode. Same shape and fallback contract as
 * {@link defenseBuffValue}; the two are complementary halves of the same atom set,
 * split by `suppressible`. Verified bag-equal corpus-wide by `scripts/planb-shadow-defense.cjs`.
 */
export function defenseBuffSuppressibleValue(
  power: AtomSource,
): Record<string, { scale: number; table: string; perTarget?: number }> | undefined {
  return defenseBuffByType(power, true);
}

/**
 * Does this power buff defense for everyone it reaches EXCEPT the caster?
 *
 * The caller needs this because silence from {@link defenseBuffValue} is ambiguous at
 * the `?? effects.defenseBuff` seam. A power with no defense atoms at all is silent
 * and wants the bag; Grant Cover, whose every defense row is caster-excluded, is
 * silent and must NOT get the bag — its bag slot is real, it is just aimed at the
 * team. Without this the fallback would hand the caster back the number the applier
 * just declined to give.
 *
 * The bag keeps that slot on purpose: the power card shows what allies receive.
 */
export function defenseBuffIsTeamOnly(power: AtomSource): boolean {
  // Same atom population as `defenseBuffByType` (incl. the `All`-at-`Cur` arm,
  // DEFALL-1): this function disambiguates that filter's silence, so the two must
  // read the same rows or a team-only `Base_Defense` power would be reported as a
  // divergence instead of excused as an abstention.
  const defense = atomsOfType(power, 'Defense').filter(
    (a) => (DEFENSE_STD_SUBTYPES.has(a.subType ?? '') || isAllCurDefense(a)) && !isDebuffAtom(a),
  );
  return defense.length > 0 && defense.every(excludesCaster);
}

/**
 * The atom-native `maxHPBuff` — the +MaxHP buff the calc reads today off
 * `effects.maxHPBuff` (`{ ignoreStrength: true }` → the `maxHPBuffUnenhanced` twin).
 * This is the FIRST of the `*Unenhanced` twin family to fold back into a single
 * `ignoreStrength` filter, repaying the tax the parallel slots paid: the bag mints
 * `maxHPBuff` vs `maxHPBuffUnenhanced` as two hand-rolled slots purely so the +Healing
 * strength multiplier hits only the enhanceable half (Inexhaustible / High Pain
 * Tolerance / Dull Pain list their +MaxHP as an enhanceable + an IgnoreStrength
 * template that co-apply and SUM).
 *
 * Mirrors the bag's HitPoints routing (`convert-powerset.cjs` RESOURCES branch): a
 * MaxHP atom is a +MaxHP buff when its aspect is `Max` (a non-Max HitPoints atom is a
 * HEAL → `effects.healing`, not this slot), it is not a debuff ({@link isDebuffAtom} —
 * a −MaxHP is skipped), and its `ignoreStrength` matches the requested half. The value
 * is rebuilt by the shared {@link perTargetValueOf}; no MaxHP power in the corpus
 * carries a per-target increment, so this resolves to the bag's folded `scale`
 * (the maxHP applier reads `.scale` directly, ×10, with no table resolution).
 *
 * Returns `undefined` when the power has no such atom — the caller falls back to the
 * bag (an atom-less legacy power keeps its `effects.maxHPBuff`; see {@link atomsOf}).
 * Verified bag-equal corpus-wide by `scripts/planb-shadow-maxhp.cjs`.
 *
 * NB regen/recovery — the OTHER two `*Unenhanced` twins — are deliberately NOT handled
 * here: their bag values also depend on `foldResourceSlot`'s same-table SUM, a regen-only
 * `StackByAttribAndKey` skip (the flag itself is on the wire since STACK-5, but the skip
 * is still a rule the reader has to apply), and a description-text target-trap filter. They got their own slice and their own helpers — see
 * {@link regenBuffValue} / {@link recoveryBuffValue}, whose extra rules and two punts are
 * exactly that list.
 */
export function maxHPBuffValue(
  power: AtomSource,
  opts: { ignoreStrength?: boolean } = {},
): { scale: number; table: string; perTarget?: number } | undefined {
  const wantIgnoreStrength = opts.ignoreStrength ?? false;
  const atoms = baseAtomsOfType(power, 'MaxHP').filter(
    (a) =>
      a.aspect === 'Max' &&
      !!a.ignoreStrength === wantIgnoreStrength &&
      !isDebuffAtom(a),
  );
  return perTargetValueOf(atoms, power);
}

/**
 * The atom-native `regenBuff` / `regenBuffUnenhanced` and `recoveryBuff` /
 * `recoveryBuffUnenhanced` — the LAST two of the five `*Unenhanced` twin slots the
 * bag minted for the single `ignoreStrength` axis (Slice 5 folded `maxHPBuff`; ToHit's
 * and movement's remain). Shared by {@link regenBuffValue} and {@link recoveryBuffValue},
 * which differ only in `effectType`.
 *
 * These are the hardest resource slots to reconstruct because the bag's value depends
 * on several behaviors that never reach the wire atom. Two of those are recovered by a
 * converter stamp added in this slice ({@link AtomicEffect.notOnCaster}, and the
 * redirect-path `perTarget` stamp-gap fix); the rest are handled here, and the two that
 * cannot be settled without a game-correctness call are deliberately PUNTED to the bag:
 *
 *   1. **notOnCaster** — Thunderspy's resource target-trap (Equip Thugs, Disrupting
 *      Torrent): the bag deletes the slot, so the caster's total must skip these atoms.
 *   2. **increments are always enhanceable** — an atom carrying a converter-stamped
 *      `perTarget` routes to the ENHANCEABLE slot regardless of its own `ignoreStrength`,
 *      because the converter's classifier does (`mergeStackingPatches` patches
 *      `regenBuff`/`recoveryBuff`, never the twin). Reactive Regeneration's increment is
 *      an IgnoreStrength pseudo-pet buff; routing it by its own flag would both strip
 *      `regenBuff`'s `perTarget` and mint a phantom `regenBuffUnenhanced`.
 *   3. **N=1 excludes IgnoreStrength self-increments** — the `!ignoreStrength` test is
 *      the atom-derivable discriminator between **Consume/Devour Psyche** (a
 *      non-IgnoreStrength RefreshToCount self-increment, counted at one target → 0.85)
 *      and **Reactive Regeneration** (an IgnoreStrength pseudo-pet increment, not
 *      counted → 2, +per foe after).
 *   4. **`foldResourceSlot` SUM semantics** — unlike defense/resistance (last-write-wins)
 *      and maxHP (Replace-collapsed), a resource slot RAW-SUMS its same-table entries and
 *      RESETS on a table change (Obscure Sustenance's recovery: 0.6+0.38+0.1 = 1.08).
 *
 * ONE PUNT remains (return `undefined` → the applier keeps reading the unchanged bag):
 * **any `Expression`-typed resource atom.** The converter's RESOURCES guard drops
 * `Expression` templates whose `tick_chance` is 0 (Rebirth's Gravity/Penumbral armor
 * toggles) and keeps the rest (Gamma Boost, Defibrillate). `tick_chance` is not on the
 * wire, and `Expression ⟺ dropped` is FALSE, so the verdict is unrecoverable. Safe
 * either way: if the bag kept it we fall back to the bag's value; if the bag dropped it
 * the slot is absent and the fallback yields `undefined` too.
 *
 * A SECOND punt used to live here, on the `StackByAttribAndKey` burst/tail family (Icy
 * Bastion), because the bag answered that shape two different ways: regen's routing
 * skipped the lingering `4 @ 30s` (reporting +6, the 0.75s burst alone) while recovery,
 * which never had that skip, summed its `2 @ 0.75s` + `2 @ 30s` to +4. That
 * inconsistency was correctly read as a latent BAG BUG rather than a settled value, so
 * the helper declined to reconstruct it. **The bug is now fixed at the converter** (the
 * skip was keying on a flag that means "refresh, don't stack", not "ignore me" — see the
 * regen routing in `convert-powerset.cjs`), regen and recovery both sum, and the punt is
 * gone: this family reconstructs through {@link foldResourceSum} like any other. Icy
 * Bastion is +10 regen / +4 recovery while its toggle is up, confirmed in-game and by the
 * power's own `display_help`. The lesson generalizes — a punt that exists to dodge an
 * inconsistency is a bug report, not a design.
 *
 * Returns `undefined` for a power with no such atom, or for the Expression punt → bag
 * fallback (see {@link atomsOf}). Verified bag-equal corpus-wide for every value it DOES
 * return by `scripts/planb-shadow-resources.cjs` (punts are reported, not gated).
 */
function resourceBuffValue(
  power: AtomSource,
  effectType: EffectType,
  opts: { ignoreStrength?: boolean } = {},
): { scale: number; table: string; perTarget?: number } | undefined {
  const wantIgnoreStrength = opts.ignoreStrength ?? false;
  const atoms = baseAtomsOfType(power, effectType).filter(
    (a) => a.aspect !== 'Res' && !isDebuffAtom(a) && !a.notOnCaster,
  );
  if (!atoms.length) return undefined;
  // PUNT: the Expression + tick-chance-0 drop is not re-derivable (see above).
  if (atoms.some((a) => a.attribType === 'Expression')) return undefined;

  const increments = atoms.filter((a) => a.perTarget);
  // The flat base must LAND ON THE CASTER to count toward his own totals — the resources
  // family's PASS2B-1, the same exclusion `kbProtectionValue` below applies to offensive
  // knockback. Without it the reader credits the caster with a foe debuff or a teammate buff
  // written on a power he merely owns: Temporal Bomb's `Location` -Recovery patch read as
  // +37.5% recovery, Valiance summed its `Self` +80% and its `target ≠ source` +60% into
  // +140%. The apply loop's ally-only `targetType` skip cannot see either — both powers hit
  // the caster with something. Increments are NOT filtered here: a per-foe increment is
  // collected FROM foes and lands on the caster, and `selfIncrements` below asks the question
  // where it credits him.
  const flat = atoms.filter((a) => !a.perTarget && reachesCaster(a, power));

  // Per-target increments follow the FLAT BASE's slot, not their own
  // `ignoreStrength` — the converter patches whichever slot the base occupies
  // (`_remapUnenhancedPatchKeys`). That is the enhanceable one for every HC and
  // Rebirth power, and for a base-less increment; Thunderspy's Rise to the
  // Challenge is the first with an IgnoreStrength base, so its increment belongs
  // to the twin (bag: `regenBuffUnenhanced` 1.25 +0.25/foe, no `regenBuff`).
  const baseIsUnenhanced = flat.length > 0 && flat.every((a) => a.ignoreStrength);
  if (wantIgnoreStrength === baseIsUnenhanced && increments.length) {
    const table = (increments.find((a) => a.modifierTable) ?? flat.find((a) => a.modifierTable))
      ?.modifierTable ?? '';
    const perTarget = sumDistinctAbs(increments, (a) => a.perTarget ?? 0);
    // At one target: the flat base, plus only those self-increments belonging to
    // THIS slot. What disqualifies Reactive Regeneration's increment is not that it
    // is IgnoreStrength but that its base is not — it is a pseudo-pet buff riding an
    // enhanceable base, so it does not count at one target. Consume Psyche's matches
    // its base and counts; so does Thunderspy Rise to the Challenge's, where base and
    // increment are BOTH IgnoreStrength.
    const selfIncrements = increments.filter(
      (a) => reachesCaster(a, power) && !!a.ignoreStrength === wantIgnoreStrength,
    );
    const scale =
      sumDistinctAbs(
        flat.filter((a) => !!a.ignoreStrength === wantIgnoreStrength),
        (a) => a.scale,
      ) + sumDistinctAbs(selfIncrements, (a) => a.scale);
    return { scale, table, perTarget };
  }

  const mine = flat.filter((a) => !!a.ignoreStrength === wantIgnoreStrength);
  if (!mine.length) return undefined;
  return foldResourceSum(mine);
}

/**
 * The `effects.knockback` / `effects.knockup` PROTECTION slot, atom-native (ATOM15 / PASS2B-1).
 * `field ∈ {'knockback','knockup'}`. Reproduces the converter's KB accumulate fold
 * (`convert-powerset.cjs:4356`), restricted to SELF-DIRECTED PROTECTION atoms — the converter's
 * branches 2a (`Self` + aspect=Res + Res_Boolean) and 3 (`Self` + aspect≠Res). Branch 1
 * (`toWho ≠ 'Self'`) is EXCLUDED: that is offensive foe-knockback (Battle Axe Gash's 0.67), not
 * caster protection — the PASS2B-1 fix that retires the `effectArea + powerType` proxy. Spans BOTH
 * `Mez` AND `MezResist` effectTypes (the converter keys on the resolved attrib string, so a
 * `MezResist/Knockback` protection atom counts — Quantum/Evasive Maneuvers carry ONLY that). PvP-twin
 * atoms are dropped (the converter excludes them upstream). Accumulate `|scale|` with
 * reset-on-table-change, in list order; returns `{scale, table}` or `undefined`.
 */
export function kbProtectionValue(
  power: AtomSource,
  field: 'knockback' | 'knockup',
): { scale: number; table: string } | undefined {
  const subType = field === 'knockback' ? 'Knockback' : 'Knockup';
  let cur: { scale: number; table: string } | undefined;
  for (const a of baseAtoms(power)) {
    if (a.effectType !== 'Mez' && a.effectType !== 'MezResist') continue;
    if (a.subType !== subType) continue;
    if (!reachesCaster(a, power)) continue; // branch 1 (foe) excluded → PASS2B-1
    if (a.pvMode === 'PvP') continue; // the converter drops the PvP twin upstream
    // branch 2b: a Self aspect=Res KB atom on a NON-Res_Boolean table is KB *resistance*, not protection
    if (a.aspect === 'Res' && !(a.modifierTable || '').toLowerCase().includes('res_boolean')) continue;
    if (!a.modifierTable) continue;
    const table = a.modifierTable;
    const scale = Math.abs(a.scale || 0);
    if (cur && cur.table === table) cur.scale += scale;
    else cur = { scale, table };
  }
  return cur;
}

/**
 * The converter's `foldResourceSlot` SUM semantics, in atom form: walk the atoms in
 * routing order accumulating `Σ|scale|` while the table holds, and RESET to a fresh
 * accumulator on a table change (last-table-wins). Resource slots always sum — the
 * fold's `Replace`-collapse branch is maxHP-scoped (`stack` is carried only on the
 * maxHP queue entries) and its `durationVariants` branch is debuff-only, so neither
 * applies to a regen/recovery BUFF.
 *
 * Summing is also right for a burst/tail pair, which is what makes the old punt
 * unnecessary: the two instances OVERLAP rather than replace, so the power's value while
 * it is doing its job is their sum. Icy Bastion / Hibernate (`6 @0.75s` toggle-refreshed
 * + `4 @30s` lingering → +10) and Geode (`7.5 @0.2s` + `2.5 @30s` → +10) are temp toggles
 * whose short instance is re-applied every tick while active; Obscure Sustenance's
 * `1.72 @10s + 1.72 @20s + 1 @60s → 4.44` is a decay chain whose three instances all
 * start at cast. Same additive-overlap shape the converter already ships for Inner
 * Light's ToHit burst/tail and EMP Arrow's −500% regen at 15s *and* 45s.
 */
function foldResourceSum(atoms: readonly AtomicEffect[]): { scale: number; table: string } {
  let cur = { scale: 0, table: atoms[0].modifierTable };
  for (const a of atoms) {
    if (a.modifierTable === cur.table) cur.scale += Math.abs(a.scale);
    else cur = { scale: Math.abs(a.scale), table: a.modifierTable };
  }
  return cur;
}

/**
 * The atom-native `regenBuff` (`{ ignoreStrength: true }` → the `regenBuffUnenhanced`
 * twin) — the +Regeneration buff the calc reads today off `effects.regenBuff`
 * (Health, Fast Healing, Consume Psyche, Reactive Regeneration, Rise to the Challenge).
 * See {@link resourceBuffValue} for the reconstruction rules and the two punts.
 */
export function regenBuffValue(
  power: AtomSource,
  opts: { ignoreStrength?: boolean } = {},
): { scale: number; table: string; perTarget?: number } | undefined {
  return resourceBuffValue(power, 'Regeneration', opts);
}

/**
 * The atom-native `recoveryBuff` (`{ ignoreStrength: true }` → the
 * `recoveryBuffUnenhanced` twin) — the +Recovery buff the calc reads today off
 * `effects.recoveryBuff` (Stamina, Quick Recovery, Consume Psyche, Bio Armor's
 * adaptation ride-along). See {@link resourceBuffValue} for the rules and punts.
 */
export function recoveryBuffValue(
  power: AtomSource,
  opts: { ignoreStrength?: boolean } = {},
): { scale: number; table: string; perTarget?: number } | undefined {
  return resourceBuffValue(power, 'Recovery', opts);
}

/**
 * Movement axis (`AtomicEffect.subType`) → the bag's `effects.movement` key, for the
 * FOUR axes that reach a character total.
 *
 * Deliberately partial. The bag's movement map also holds `fly`, `movementControl` and
 * `movementFriction`, and the applier's own `movementKeyMap` ignores all three, so they
 * add zero on both sides — the "compare only what survives to a total" doctrine from
 * Slice 3. `fly` matters most: it is the kFly flight-MODE grant, and reading its mode
 * magnitude as a speed buff double-counts Fly by +200% (see character-totals.ts). It is
 * excluded here structurally rather than by a scale/table guess, because the atom now
 * carries it as its own `FlyMode` axis — before that split, kFly and FlyingSpeed shared
 * subType `Fly` and Hover's pair (kFly 2.0 / FlyingSpeed 0, both `Melee_Ones`) was
 * genuinely unrecoverable from the wire.
 */
const MOVEMENT_AXIS_TO_KEY: Record<string, string> = {
  Run: 'runSpeed', Fly: 'flySpeed', Jump: 'jumpSpeed', JumpHeight: 'jumpHeight',
};

/**
 * The same map for the PENALTY side — `effects.slow` → the movement global
 * (`slowKeyMap`, character-totals.ts). Wider than the buff side by the two axes that
 * carry a modelled global here and none there (MOVE-1).
 *
 * `fly` is absent here for the reason it is absent above, and that absence is a fix
 * rather than a tidy-up: `slowKeyMap` sends both `flySpeed` and `fly` to `flySpeed`,
 * so the kFly mode kill a grounding power states — Granite Armor and Rooted at
 * `10 x Melee_Ones`, Hibernate, Icy Bastion and Geode at `10000` — was being spent as
 * a flight-SPEED percentage. A Granite tanker's flySpeed total read -1000%, a
 * Hibernating one -1,000,000%. It is the +200% Fly double-count in the debuff
 * direction: a mode magnitude read as a speed.
 */
const SLOW_AXIS_TO_KEY: Record<string, string> = {
  ...MOVEMENT_AXIS_TO_KEY,
  Control: 'movementControl', Friction: 'movementFriction',
};

/**
 * An atom from a `chance: 0` group that names no mode to be gated on.
 *
 * A chance-0 group is a mode-gate sentinel rather than a literal 0% (METHOD-1). When this
 * rule was written the corpus split 24 movement-routed sentinels into 8 that carried a
 * group `Tag` naming their mode and 16 — every Rebirth fly power — that carried nothing,
 * because the Parse6 export dropped the field the tag lives in; with those 16 left in,
 * Rebirth's Fly read -5.2% where the game gives +161%.
 *
 * The population is now ZERO on all three forks (measured over the contract bundles,
 * 2026-08-18): COND-11 put the Parse6 tags on the wire and COND-12's corpus-wide
 * chance-mod pass gates every tagged sentinel on its minted mode, so a chance-0 atom
 * either carries its gate and arrives `gated` (dropped by `baseAtoms` before this
 * routing sees it) or does not exist. The rule stays as the backstop it always was: a
 * sentinel that names no mode cannot be a gate on one, and a NEW one appearing means an
 * export regressed — `planb-shadow-movement.cjs`'s abstention pin is what surfaces it.
 */
function isUnmodedSentinel(a: AtomicEffect): boolean {
  return a.baseProbability === 0
    && !a.tags
    && !(a.requiresExpression && a.requiresExpression.length)
    && !a.specialCase;
}

/**
 * One movement-buff contribution. More than one can share an `axis` — a power
 * can buff an axis twice and mean it, and `ignoreStrength` / `suppressible` are
 * what tell the copies apart. `ignoreStrength` marks the half the caster's
 * Run/Fly/Jump enhancements do not multiply.
 */
export interface MovementBuffEntry {
  axis: string;
  scale: number;
  table: string;
  stackKey?: string;
  suppressible?: boolean;
  ignoreStrength?: boolean;
}

/** A movement atom the bag routes to `slow` rather than `movement`. */
function isSlowAtom(a: AtomicEffect): boolean {
  return isDebuffAtom(a) || (a.modifierTable || '').toLowerCase().includes('slow');
}

/**
 * Which of the two movement maps an atom belongs to, or `undefined` when an earlier
 * branch of the routing chain claims it or nothing does.
 *
 * Mirrors the bag's MOVEMENT routing (`convert-powerset.cjs`), whose branches are a
 * chain of aspect tests peeling other slots off before `movement` gets the remainder:
 *   - aspect `Res` → `debuffResistance.movement`;
 *   - self + aspect `Str` → `specialBuff.movement`;
 *   - self + aspect `Max` + scale > 0 → `movementCapBump` (a travel-CAP raise, not a
 *     speed buff — this is the split that stopped Super Speed reporting 1.938×Melee_Ones
 *     instead of its real 1.0×Melee_SpeedRunning);
 *   - aspect `Max` + slow → `movementCapDebuff` (the debuff direction of that same split;
 *     it shared `slow`'s axis slot until ENT-5 and overwrote the speed debuff there);
 *   - slow (negative scale, or a `debuff`/`slow` table) → `slow`;
 *   - self → `movement`; non-self → `movement` ONLY via the trailing `aspect === 'current'`
 *     branch (a foe-targeted Absolute/Maximum movement effect is dropped entirely).
 *
 * One function because the chain is one chain: the branches are ordered, and a reader
 * that reproduces only its own branch re-derives the ones above it and drifts from them.
 */
function routeMovementAtom(a: AtomicEffect, power: AtomSource): 'movement' | 'slow' | undefined {
  if (isUnmodedSentinel(a)) return undefined;
  const self = reachesCaster(a, power);
  if (a.aspect === 'Res') return undefined;
  if (self && a.aspect === 'Str') return undefined;
  if (self && a.aspect === 'Max' && a.scale > 0) return undefined;
  if (a.aspect === 'Max' && isSlowAtom(a)) return undefined;
  // Only the caster's own penalty reaches a caster total; a foe slow shares the map
  // (`isSelfDirectedEffect` filters it there) and is not ours.
  if (isSlowAtom(a)) return self ? 'slow' : undefined;
  return self ? 'movement' : undefined;
}

/**
 * One entry per (axis, `ignoreStrength`, `suppressible`), in first-seen order.
 *
 * Two atoms are the same entry when they agree on the axis AND on the two things that
 * change how the axis reads them: whether the caster's enhancements multiply the value,
 * and whether it drops in combat. Sprint's two `RunningSpeed 0.5 Melee_Ones` halves
 * differ on the first and nothing else; Thunderspy folds a third, suppressible travel
 * row onto the same axis. Keying on the axis alone made each of those the last one
 * written, which is how Sprint came to report +50% run where the game gives +100%.
 *
 * The key is deliberately no finer. Adding the modifier table separates nothing the
 * corpus states — measured over both maps and all four axes, zero slots change — and
 * dropping the dedup entirely splits twelve more that no oracle has been asked about
 * (Homecoming's Group Fly and the Dwarf Steps, Thunderspy's Speed Boost).
 */
function keyedMovementEntries(
  atoms: readonly AtomicEffect[],
  axisMap: Record<string, string>,
): MovementBuffEntry[] {
  const out: MovementBuffEntry[] = [];
  for (const a of atoms) {
    const axis = axisMap[a.subType ?? ''];
    if (!axis) continue;
    const value: MovementBuffEntry = {
      axis,
      scale: Math.abs(a.scale),
      table: a.modifierTable,
      ...(a.stacking === 'Suppress' && a.stackKey ? { stackKey: a.stackKey } : {}),
      ...(a.suppressible ? { suppressible: true } : {}),
      ...(a.ignoreStrength ? { ignoreStrength: true } : {}),
    };
    const at = out.findIndex(
      (e) =>
        e.axis === axis &&
        Boolean(e.ignoreStrength) === Boolean(value.ignoreStrength) &&
        Boolean(e.suppressible) === Boolean(value.suppressible),
    );
    // Replace, never merge: `suppressible` and `ignoreStrength` are absent rather than
    // false, so `Object.assign` would leave a previous entry's `true` behind and report
    // a flag the winning atom does not carry.
    if (at >= 0) out[at] = value;
    else out.push(value);
  }
  return out;
}

/**
 * The atom-native `effects.movement` — the self/current movement BUFF the calc reads
 * (character-totals.ts ~1483). Returns `undefined` when the power has no contributing
 * movement atom (→ bag fallback).
 *
 * `stackKey` and `suppressible` ride along per entry: both are travel-suppression
 * metadata the applier reads via `movementMeta` (mutual suppression within a
 * `TravelBuff` group; combat suppression of Super Speed / Fly / Super Jump). `stackKey`
 * is only meaningful with `stacking: 'Suppress'`, which is how the bag gates it too.
 *
 * Every axis splits, fly included. It was held back once, and both reasons on record
 * for holding it turned out not to be reasons:
 *
 *   - A Parse6 `Fly`/`FlyMode` conflation — measured false. All three exports name the
 *     flight-mode grant `Fly` and the speed buff `FlyingSpeed`, with no other spelling
 *     in the corpus; the axis map has always sent them to `FlyMode` and `Fly`, and
 *     `MOVEMENT_AXIS_TO_KEY` drops `FlyMode` before it reaches here.
 *   - The ± pairs on Rebirth and Thunderspy — real, but they are held together by
 *     {@link selfSlowValue} keying the minus exactly as this keys the plus, not by
 *     refusing to split. Refusing cost Combat Flight -51% where the game gives -1%,
 *     and Rebirth's Fly -18% where it gives +161%.
 *
 * Returns an array — possibly EMPTY — for any power carrying a base movement atom, and
 * `undefined` only for one carrying none. The difference is the atom-vs-bag seam: "I
 * looked and the answer is nothing" is not "I have nothing to look at", and collapsing
 * the two hands the question back to the bag, which still holds the rows this reader
 * exists to drop. Geode, Icy Bastion and Hibernate state a kFly mode kill and no other
 * self slow, so an empty-means-absent reader fell straight back to the bag and spent the
 * -1,000,000% again. Both maps take the verdict from the same side for the same reason
 * they are keyed alike — they are two halves of one authored thing.
 */
export function movementBuffValue(power: AtomSource): MovementBuffEntry[] | undefined {
  const movement = baseAtomsOfType(power, 'Movement');
  if (!movement.length) return undefined;
  return keyedMovementEntries(movement.filter((a) => routeMovementAtom(a, power) === 'movement'),
    MOVEMENT_AXIS_TO_KEY);
}

/**
 * The atom-native `effects.slow`, self-directed entries only — a movement penalty the
 * caster inflicts on itself. Granite Armor's -70% run and Hibernate are the plain
 * cases; on the Parse6 forks it is also the minus half of a travel power's ± pair.
 *
 * Keyed exactly as {@link movementBuffValue} keys the plus, because the pair is one
 * authored thing split across two maps: Rebirth's Group Fly states `+0.5 / -0.5` and
 * again `+0.5 / -0.5 IgnoreStrength`, and a map holding one value per axis kept one of
 * each — which cancelled, by luck. Split the plus alone and the cancel breaks.
 *
 * `movementCapDebuff` is NOT read here. ENT-5 moved the Maximum-aspect rows into their
 * own slot so a cap debuff would stop overwriting the speed debuff on the same axis,
 * and the caller still spends that slot from the bag; re-aiming it is a different
 * number and a separate question.
 *
 * Returns an array — possibly EMPTY — for any power carrying a base movement atom, and
 * `undefined` only for one carrying none. The difference is the atom-vs-bag seam: "I
 * looked and the answer is nothing" is not "I have nothing to look at", and collapsing
 * the two hands the question back to the bag, which still holds the rows this reader
 * exists to drop. Geode, Icy Bastion and Hibernate state a kFly mode kill and no other
 * self slow, so an empty-means-absent reader fell straight back to the bag and spent the
 * -1,000,000% again. Both maps take the verdict from the same side for the same reason
 * they are keyed alike — they are two halves of one authored thing.
 */
export function selfSlowValue(power: AtomSource): MovementBuffEntry[] | undefined {
  const movement = baseAtomsOfType(power, 'Movement');
  if (!movement.length) return undefined;
  return keyedMovementEntries(
    movement.filter(
      (a) => routeMovementAtom(a, power) === 'slow' && !isCancelledPair(a, movement),
    ),
    SLOW_AXIS_TO_KEY,
  );
}

/**
 * One half of an authored +/- pair on a single axis and table: two rows the game states
 * together so they net zero for whoever receives both.
 *
 * Reaction Time is the shape and, with Thunderspy's Increase Density, one of only two powers in
 * the corpus stating a self and a non-self slow on one axis. It slows
 * `RunningSpeed`/`FlyingSpeed`/`JumpingSpeed` by `0.7 x Melee_Slow` at `AnyAffected` and then
 * states `-0.7 x Melee_Slow` at `Self` to hand it back. The help text is explicit that only
 * enemies are slowed.
 *
 * The bag arrived at that zero by accident: both rows land in one `slow[axis]` slot, the aura's
 * copy happened to be written last, and `isSelfDirectedEffect` then rejected it. A keyed reader
 * separates them, and it holds MAGNITUDES, so the pair cannot cancel by arithmetic here — it has
 * to be recognised and dropped whole.
 *
 * The rule reads both rows and not their recipients, which is what TARGETS-3 changed. It used to
 * test that the negating row was NOT the caster's, standing in for a question about the power;
 * with the join in place that test flips per fork and gets the pair wrong on the fork it was
 * written for. Homecoming's aura row has no gate, so it reaches the caster and the pair is two
 * rows he gets; Rebirth and Thunderspy gate the same row `target != source`, so he gets only the
 * minus. Both forks want the same answer, which is that neither row is his.
 *
 * Increase Density is deliberately NOT matched: its `0.05` self row is half its `0.1` aura row,
 * not a negation, so it is a real self penalty. The bag already states it with `toWho: 'Self'`
 * and it already reaches the total.
 */
function isCancelledPair(a: AtomicEffect, siblings: readonly AtomicEffect[]): boolean {
  const axis = SLOW_AXIS_TO_KEY[a.subType ?? ''];
  if (!axis || !a.scale) return false;
  return siblings.some(
    (o) =>
      SLOW_AXIS_TO_KEY[o.subType ?? ''] === axis &&
      o.modifierTable === a.modifierTable &&
      o.scale === -a.scale &&
      isSlowAtom(o),
  );
}

/** Σ of `val(a)` over atoms with a DISTINCT `|val|` (dedup the type/duration copies). */
function sumDistinctAbs(atoms: readonly AtomicEffect[], val: (a: AtomicEffect) => number): number {
  const seen = new Set<number>();
  let s = 0;
  for (const a of atoms) {
    const v = Math.abs(val(a));
    if (seen.has(v)) continue;
    seen.add(v);
    s += v;
  }
  return s;
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
