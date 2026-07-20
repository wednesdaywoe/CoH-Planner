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

/**
 * The atom helpers only touch `power.atoms`, so they accept anything carrying it
 * — a full `Power`, a `PowerWithToggle` in the calc loop, a redirect variant.
 * Narrowing the parameter here avoids forcing callers to hold a complete `Power`.
 */
type AtomSource = Pick<Power, 'atoms'>;

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
 */
export function baseAtoms(power: AtomSource): AtomicEffect[] {
  return atomsOf(power).filter((a) => !a.gated);
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
): { scale: number; table: string; perTarget?: number } | undefined {
  if (!atoms.length) return undefined;
  const table = atoms.find((a) => a.modifierTable)?.modifierTable ?? '';
  const pt = perTargetFromGroup(atoms, table);
  if (pt) return pt;
  // No per-target increment: the sustained value is the longest-lived instance
  // (a burst+tail power's primary bucket), never the overlap sum.
  const primary = durationBuckets(atoms)[0];
  return { scale: Math.abs(primary.atoms[0].scale), table };
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
): { scale: number; table: string; perTarget: number } | undefined {
  const increments = atoms.filter((a) => a.perTarget);
  if (!increments.length) return undefined;
  const perTarget = sumDistinctAbs(increments, (a) => a.perTarget ?? 0);
  const bases = atoms.filter((a) => !a.perTarget);
  const selfIncrements = increments.filter((a) => a.toWho === 'Self' || a.toWho === 'All');
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
  return perTargetValueOf(atoms);
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
 * Returns `undefined` for a power with no +damage atom (→ bag fallback; see
 * {@link atomsOf}). Verified bag-equal corpus-wide by
 * `scripts/planb-shadow-pertarget.cjs`.
 */
export function damageBuffValue(
  power: AtomSource,
): { scale: number; table: string; perTarget?: number } | undefined {
  let atoms = baseAtoms(power).filter(
    (a) =>
      a.effectType === 'DamageBuff' &&
      a.aspect === 'Str' &&
      a.scale > 0 &&
      !(a.modifierTable || '').toLowerCase().includes('debuff'),
  );
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
  const pt = perTargetFromGroup(atoms, table);
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
    const v = perTargetValueOf(group);
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
): Record<string, { scale: number; table: string; toWho: 'Self'; resistible: boolean }> | undefined {
  const atoms = baseAtomsOfType(power, 'Resistance').filter(
    (a) =>
      a.aspect === 'Res' &&
      RESIST_STD_SUBTYPES.has(a.subType ?? '') &&
      isDebuffAtom(a) &&
      (a.toWho === 'Self' || a.toWho === 'All'),
  );
  if (!atoms.length) return undefined;
  const out: Record<string, { scale: number; table: string; toWho: 'Self'; resistible: boolean }> = {};
  for (const [type, group] of bySubType(atoms)) {
    const last = group[group.length - 1];
    // `resistible` drives same-type resistance mitigation in the calc: a -Res
    // debuff applied to the caster (Bio Offensive Adaptation's -7.5% Res) is
    // reduced by the caster's own resistance to that type. IgnoreResistance
    // (`resistible === false`) debuffs apply flat.
    out[type.toLowerCase()] = { scale: Math.abs(last.scale), table: last.modifierTable, toWho: 'Self', resistible: last.resistible !== false };
  }
  return out;
}

/**
 * The eleven standard defense globals the calc totals: the three positions
 * (`defMelee`/`defRanged`/`defAoE`) and the eight damage types
 * (`defSmashing`…`defPsionic`). Restricting the defense helpers to these dodges
 * the same atom-bridge/bag labelling gaps the resistance restriction does — chiefly
 * `All` (from a `base_defense` template), which the bag stores as a SCALAR
 * `defenseBuff` ScaledEffect whose `Object.entries` yield `scale`/`table`, never a
 * `def<Type>` key, and for which there is no `defAll` global regardless. Every
 * excluded subType adds zero to a `def<Type>` total on BOTH sides, so the
 * restriction is behavior-preserving and makes the shadow a clean per-type equality.
 */
const DEFENSE_STD_SUBTYPES = new Set([
  'Melee', 'Ranged', 'AoE',
  'Smashing', 'Lethal', 'Fire', 'Cold', 'Energy', 'Negative', 'Toxic', 'Psionic',
]);

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
): { scale: number; table: string; perTarget?: number } | undefined {
  const base = group.filter((a) => !a.gated);
  const gatedIncr = group.filter((a) => a.gated && a.perTarget);
  if (!base.length && !gatedIncr.length) return undefined;
  const baseIncr = base.filter((a) => a.perTarget);
  const increments = [...baseIncr, ...gatedIncr];
  const table = (base.find((a) => a.modifierTable) ?? group.find((a) => a.modifierTable))?.modifierTable ?? '';
  if (increments.length) {
    const perTarget = sumDistinctAbs(increments, (a) => a.perTarget ?? 0);
    const bases = base.filter((a) => !a.perTarget);
    const selfIncr = baseIncr.filter((a) => a.toWho === 'Self' || a.toWho === 'All');
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
 */
function defenseBuffByType(
  power: AtomSource,
  wantSuppressible: boolean,
): Record<string, { scale: number; table: string; perTarget?: number }> | undefined {
  const atoms = atomsOfType(power, 'Defense').filter(
    (a) =>
      DEFENSE_STD_SUBTYPES.has(a.subType ?? '') &&
      !isDebuffAtom(a) &&
      !!a.suppressible === wantSuppressible,
  );
  if (!atoms.length) return undefined;
  const out: Record<string, { scale: number; table: string; perTarget?: number }> = {};
  for (const [type, group] of bySubType(atoms)) {
    const v = defensePerTypeValue(group);
    // A reconstruction of exactly 0 with no per-target growth is not a real buff and
    // the bag surfaces nothing for it (Thunderspy Fortify Pack's pet-granted defense
    // resolves to a scale-0 placeholder whose whole `effects` bag is empty). Dropping
    // it is behavior-neutral — 0 contributes 0 to any total — and keeps the shadow a
    // clean equality. (The shadow checks BOTH directions, so a bag that DID keep a
    // scale-0 defense would still be caught.)
    if (v && (v.scale !== 0 || v.perTarget)) out[type.toLowerCase()] = v;
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
 * `StackByAttribAndKey` skip, and a description-text target-trap filter, none of which is
 * on the wire atom. They got their own slice and their own helpers — see
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
  return perTargetValueOf(atoms);
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
  const flat = atoms.filter((a) => !a.perTarget);

  // Per-target increments belong to the ENHANCEABLE slot whatever their own
  // `ignoreStrength` — the twin never receives one.
  if (!wantIgnoreStrength && increments.length) {
    const table = (increments.find((a) => a.modifierTable) ?? flat.find((a) => a.modifierTable))
      ?.modifierTable ?? '';
    const perTarget = sumDistinctAbs(increments, (a) => a.perTarget ?? 0);
    // At one target: the flat base, plus only those self-increments that are NOT
    // IgnoreStrength (Consume Psyche counts, Reactive Regeneration does not).
    const selfIncrements = increments.filter(
      (a) => (a.toWho === 'Self' || a.toWho === 'All') && !a.ignoreStrength,
    );
    const scale =
      sumDistinctAbs(flat.filter((a) => !a.ignoreStrength), (a) => a.scale) +
      sumDistinctAbs(selfIncrements, (a) => a.scale);
    return { scale, table, perTarget };
  }

  const mine = flat.filter((a) => !!a.ignoreStrength === wantIgnoreStrength);
  if (!mine.length) return undefined;
  return foldResourceSum(mine);
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

/** A movement atom the bag routes to `slow` rather than `movement`. */
function isSlowAtom(a: AtomicEffect): boolean {
  return isDebuffAtom(a) || (a.modifierTable || '').toLowerCase().includes('slow');
}

/**
 * The atom-native `effects.movement` — the self/current movement BUFF map the calc
 * reads today (line ~1483 of character-totals.ts), keyed exactly as the applier
 * iterates it (`{ runSpeed: {scale,table,stackKey?,suppressible?}, … }`). Returns
 * `undefined` when the power has no contributing movement atom (→ bag fallback).
 *
 * Mirrors the bag's MOVEMENT routing (`convert-powerset.cjs`), whose branches are a
 * chain of aspect tests peeling other slots off before `movement` gets the remainder:
 *   - aspect `Res` → `debuffResistance.movement`;
 *   - self + aspect `Str` → `specialBuff.movement`;
 *   - self + aspect `Max` + scale > 0 → `movementCapBump` (a travel-CAP raise, not a
 *     speed buff — this is the split that stopped Super Speed reporting 1.938×Melee_Ones
 *     instead of its real 1.0×Melee_SpeedRunning);
 *   - slow (negative scale, or a `debuff`/`slow` table) → `slow`;
 *   - self → `movement`; non-self → `movement` ONLY via the trailing `aspect === 'current'`
 *     branch (a foe-targeted Absolute/Maximum movement effect is dropped entirely).
 * Last-write-wins per axis, matching the bag's direct assignment.
 *
 * `stackKey` and `suppressible` ride along per entry: both are travel-suppression
 * metadata the applier reads via `movementMeta` (mutual suppression within a
 * `TravelBuff` group; combat suppression of Super Speed / Fly / Super Jump). `stackKey`
 * is only meaningful with `stacking: 'Suppress'`, which is how the bag gates it too.
 *
 * KNOWN GAP, and it is a gap in the DATA not this helper: Thunderspy contributes
 * nothing here, because no Thunderspy movement template reaches an atom at all — it
 * spells the attrib `SpeedRunning`/`SpeedJumping`/`SpeedFlying` where HC spells it
 * `RunningSpeed`, and neither the bag's `MOVEMENT_TYPES` nor the bridge's
 * `MOVEMENT_AXIS` maps that spelling. Every Thunderspy travel power therefore yields
 * +0 movement, in the bag and in the atoms alike. Both sides are equally empty, so the
 * shadow is silent about it by construction — a parser-side fix, tracked separately.
 * Verified bag-equal across HC+Rebirth by `scripts/planb-shadow-movement.cjs`.
 */
export function movementBuffValue(
  power: AtomSource,
): Record<string, { scale: number; table: string; stackKey?: string; suppressible?: boolean }> | undefined {
  const atoms = baseAtomsOfType(power, 'Movement').filter((a) => {
    if (!MOVEMENT_AXIS_TO_KEY[a.subType ?? '']) return false;
    const self = a.toWho === 'Self';
    if (a.aspect === 'Res') return false;
    if (self && a.aspect === 'Str') return false;
    if (self && a.aspect === 'Max' && a.scale > 0) return false;
    if (isSlowAtom(a)) return false;
    return self || a.aspect === 'Cur';
  });
  if (!atoms.length) return undefined;
  const out: Record<string, { scale: number; table: string; stackKey?: string; suppressible?: boolean }> = {};
  for (const a of atoms) {
    out[MOVEMENT_AXIS_TO_KEY[a.subType!]] = {
      scale: Math.abs(a.scale),
      table: a.modifierTable,
      ...(a.stacking === 'Suppress' && a.stackKey ? { stackKey: a.stackKey } : {}),
      ...(a.suppressible ? { suppressible: true } : {}),
    };
  }
  return out;
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
    if (a.toWho !== 'Self') continue; // branch 1 (foe) excluded → PASS2B-1
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
