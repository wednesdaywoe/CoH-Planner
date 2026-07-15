# Plan B — Retire the `PowerEffects` bag: consumers read the atom list

> Status: **in progress** on branch `converter-atom-array` (as of 2026-07-15).
> Phase 0 ✅ · Phase 1 ✅ · Phase 2 Slice 0 ✅ · **Slice 1 (ToHit) ✅ · Slice 2
> (Damage) ✅ — the ToHit and +Damage appliers now read atoms, not the bag** ·
> Phase 3 not started. Slice 1 shipped in two parts: (a) the Inner Light burst/tail
> fix (durationVariants on `tohitBuff`), and (b) the applier migration itself —
> `character-totals.ts` sources +ToHit from `toHitBuffValue(power)` (atoms),
> including a converter-STAMPED `perTarget` so the per-foe sliders (Soul Drain 1 vs
> 8 targets) keep working. Behavior-preserving by construction: the atom value is
> verified bag-equal corpus-wide (`scripts/planb-shadow-pertarget.cjs`) and the
> applier falls back to the bag for any atom-less power. Slice 2 does the same for
> `damageBuff` (see §Slice 2), and additionally root-fixes a per-foe over-count
> that had inflated Rebirth's +Damage/+Def/+Regen ~8× — the shadow now gates both
> slots at **1252/1252 agree, 0 diverge**
>
> Companion to the shipped interim guard (DSH6c discriminator gate, 2026-07-14).
> See [[converter-bag-vs-array-rootcause]], [[dsh6-collapse-detector]],
> `docs/converter-unification-direction.md`.

## Resolved: Inner Light STACKS (in-game verified 2026-07-15) — converter fix landed

**Peacebringer Inner Light** (internally `Build_Up`, source
`peacebringer_offensive/luminous_blast/build_up.json`) has four templates — a
short burst and a long tail, all `stack=Stack`, `target=Self`, all `Immediate`
with `delay=0`:

| attrib | burst | tail | bag kept (before) |
|---|---|---|---|
| ToHit (Current, `Melee_Buff_ToHit`) | **2.0 @ 10s** | 0.77 @ 30s | 0.77 |
| 8× `*_Dmg` (Strength, `Melee_Buff_Dmg`) | **8.0 @ 10s** | 3.2 @ 30s | 3.2 |

Both slots were last-write-wins assignments and the 30s template is emitted last,
so both silently dropped the burst — the planner showed Inner Light's tail as if
it were the whole power.

**Answer (STACK):** the user verified in-game — casting Inner Light applies TWO
simultaneous self-buffs ("Inner Light" the 30s lingering + "Boost Up" the short
burst); both are active together and both contribute to stats, the burst just
expires first. Both apply from cast (source data confirms `Immediate`/`delay=0`
on the tail, so it overlaps the burst). ⇒ peak +2.77 ToHit / +11.2 dmg for the
first 10s, then +0.77 / +3.2 for the remaining 20s. **Not** a replace (peak is
2.77, not 2.0); and **not** a naive sum (0.77 is the sustained value, 2.77 only
holds for 10s). This is the same additive-overlap shape the converter already
ships for EMP Arrow's −500% regen at 15s *and* 45s.

**Converter fix (LANDED, ToHit only).** New `accumulateBuffSlot` helper in
`convert-powerset.cjs` gives the `tohitBuff` projection the duration-aware
accumulate the resource-slot fold (`foldResourceSlot`) already had for debuffs:
a same-table, different-duration second instance becomes a `durationVariants`
entry (longest-lived = primary) instead of clobbering the slot. Inner Light's
`tohitBuff` is now `{scale: 0.77, table, durationVariants: [{duration: 10,
scale: 2}]}`; the InfoPanel (`tohitBuff` is `format: 'percent'`) renders both
the +ToHit(30s) tail and the +ToHit(10s) burst rows. Verified: a full
three-dataset regen changes **exactly the four** Inner Light / Inner Umbra
powers and nothing else (every per-foe ToHit power — Sunless Mire, Soul Drain —
byte-unchanged, because their longest instance is emitted last and still wins
the recorded duration the perTarget reshape reads); `planb-shadow-tohit.cjs`
now **603/603 agree, 0 divergences** (its bag side counts `durationVariants`);
DSH6 gate PASS, `planb-shadow-bag.cjs` 0 divergences, regen idempotent.

**Damage (`damageBuff`) deferred to the damage slice.** The same burst+tail gap
exists on `damageBuff` (Inner Light, Moment of Glory's 1/1/0.5 @ 5/10/15s decay,
Fiery Embrace), but `damageBuff` *also* carries flat + per-foe pairs (Against
All Odds: 1.0 flat @1.25s + 0.55/foe @1s) that the perTarget post-pass
(`computeAoePerTargetPatches`) reshapes into `{scale, perTarget}`. Routing those
different durations through `accumulateBuffSlot` mints a spurious variant and
leaks a `durations` change past the reshape (observed: AAO buffDuration 1→1.25).
So the damage variants wait for a slice that first excludes per-foe groups.

## Why this must get done (and why "no observable bug" is a broken gate)

The effect-collapse bug family has been "closed" several times. It keeps
reopening because the deferral test was **"does a user observe a bug?"** That
test is invalid for this project:

- The CoH community is small; the Sidekick user base is a fraction of it; the
  fraction who report numeric mismatches is a handful of people.
- There are **5,277 player powers** × dozens of attributes each. No one — not
  even the maintainer — can hand-verify them all.
- Therefore **silent-and-wrong is the default state of an un-guarded collapse**,
  not the exception. "CI is green and nobody complained" measures reporting
  volume, not correctness.

Every recent instance proves it: the +MaxHP twin was half-wrong across ~40 armor
powers for months; Offensive Adaptation's −7.5% Res never applied; Rage's −20%
defense crash was mislabeled as a foe debuff — and that last one **no user
reported**; the DSH6c gate found it mechanically on its first run. The interim
guard converts *known* discriminator classes from "ships silently" to "fails
CI." Plan B removes the class of defect entirely, so new discriminators can't
silently collapse in the first place.

## Where we are (the door is ~80% shut)

The `converter-rewrite` (merged to `main`) already fixed the **input** side:

```
templatesToAtoms()  →  [immutable atom list]  →  projectAtomsToEffects()  →  PowerEffects
     ✅ clean, one atom per atomic game effect        ⚠️ the bag is minted here
                              │
                              └─ Phase 0/1: also emitted as `Power.atoms`, read
                                 at runtime via atom-query.ts. Nothing consumes
                                 it yet — the calc still reads only the bag.
```

`AtomicEffect` (`src/data/core/atomic-effect.ts`) is a closed record with every
discriminator intact: `effectType`, `subType`, `sign`, `aspect`, `toWho`,
`ignoreStrength`, `resistible`, `stack`, `modifierTable`, `pvMode`, scale,
duration, `_tmplIdx`. **Nothing downstream sees raw templates anymore.**

The bag survives **only as the output type**, `PowerEffects` (88 keys). Collapse
now happens exclusively at *projection time*, when two distinct atoms route to
the same named slot. The mitigation each time is to mint a discriminator:

- **Parallel slots:** `maxHPBuffUnenhanced`, `recoveryBuffUnenhanced`,
  `regenBuffUnenhanced`, `tohitBuffUnenhanced`, `runSpeedUnenhanced` — **five
  hand-rolled slots for the one `IgnoreStrength` axis.**
- **Per-value flags bolted onto `ScaledEffect`:** `toWho`, `unresistable`,
  `durationVariants`, `perTarget`, `stackKey`, `suppressible`.

This is the tax. The discriminator is a property of the *atom*; the bag forces
us to re-materialize it as a sibling slot or a flag, once per effect type,
forever — and to notice we need to, one bug at a time.

## The goal

Make the effect-application consumers read the **atom list** (or a thin,
lossless grouping of it), so no discriminator can be lost by projection. The bag
becomes a **UI-only convenience projection** (or is deleted). The invariant we
want: *the calc never asks "what's in slot X"; it asks "give me the atoms of
effectType X" and handles their discriminators explicitly.*

## Blast radius (measured 2026-07-14, before Phase 0)

Asymmetric — concentrated in one file.

| Layer | Reads | Shape | Cost |
|---|---|---|---|
| **Calc** `character-totals.ts` | ~195 (`~45` distinct slots after removing 66 stacking-meta reads) | procedural `if (effects.<slot>)` chains across ~12 appliers (active-power, proc, PPM, incarnate, fitness, movement, stealth) | **the mass** — near-total rewrite of the effect-application core |
| `calculations/damage.ts` | 14 | named slots (`damage`/`dot`/`maxTargets`) | small |
| **UI display** (`InfoPanel`, `powerDisplayUtils`, `MechanicAdjusters`, `SharedPowerComponents`, set-bonus/dashboard) | ~80 total | **already ~80% generic**: `Object.entries(effects)` through `EFFECT_REGISTRY` (`src/data/core/effect-registry.ts`, ~76 entries) | cheap — survives on a projection shim |

~~`AtomicEffect` is currently converter/test-only; **no runtime path imports it.**
That's the seam to open.~~ **Opened (Phase 0/1).** `AtomicEffect` now ships on
every generated `Power` as `atoms` and is read at runtime through
`src/data/core/atom-query.ts`. The table above still describes the work
remaining, though: no calc applier reads atoms yet, so every one of those ~195
`effects.<slot>` reads is still live.

## Phased plan (incremental, each phase independently shippable & gated)

Guiding principle: **never a big-bang cutover.** Keep `projectAtomsToEffects`
producing the identical bag throughout, add the atom list *alongside*, migrate
consumers one applier at a time behind a shadow-comparison, delete the bag last.

### Phase 0 — Expose atoms at runtime (no behavior change) ✅ DONE (2026-07-14)
- Emit the atom list on the generated `Power` (e.g. `power.atoms: AtomicEffect[]`),
  produced by the same `templatesToAtoms` the projection already runs. Gate on
  size/byte budget — this roughly doubles per-power effect data; measure, and if
  needed emit a compacted encoding decoded at load.
- Add `AtomicEffect` to the runtime type barrel; keep it unused by calc/UI.
- **DoD:** builds, no diff in computed totals, generated tree grows by a bounded,
  reviewed amount.

  **Shipped:** measured the encoding cost on the HC corpus (full objects 619
  B/atom → 13.8 MB/dataset; positional tuple 124 B/atom → 2.75 MB) and chose a
  **positional-tuple wire form** decoded at load. Codec + single source-of-truth
  field order (`ATOM_TUPLE_FIELDS`, `encodeAtom`, `decodeAtoms`, `EncodedAtom`)
  live in `src/data/core/atomic-effect.ts`; `Power.atoms?: EncodedAtom[]` added
  and the atom types re-exported from the `@/types` barrel. The converter emits
  `power.atoms` from the same `templatesToAtoms(allTemplates)` that feeds the bag
  (`encodeAtomsForEmit` + a custom `serializePower` that renders one tuple per
  line so the compact form survives the pretty-printer). Verified: additive-only
  diff (every `effects`/`damage`/`stats` bag byte-identical modulo an append
  comma), lossless round-trip across all 22,293 HC atoms, generated tree +~5–6 MB
  total (HC 15→17 MB), `tsc` clean, 1051 tests green, DSH6 gate PASS, and the
  runtime seam confirmed (committed tuple → `decodeAtoms` → `AtomicEffect` with
  signed scale / aspect / `ignoreStrength` / `toWho` intact). Calc/UI still read
  only the bag.

  **Superseded in part by Phase 1:** this phase's DoD ("no diff in computed
  totals, generated tree grows by a bounded amount") was satisfiable by an atom
  list that was silently INCOMPLETE, and was — it covered only the base bag.
  Nothing here could catch that, because the DoD never asked whether the atoms
  were *sufficient*, only whether they were cheap and harmless. Phase 1's shadow
  compare asked, and the answer was no; see the Phase 1 note.

### Phase 1 — Atom-native calc primitives + shadow compare ✅ DONE (2026-07-14)
- Build read helpers the calc will use: `atomsOf(power, effectType)`,
  `byType(atoms)`, `selfDirected(atoms)`, `enhanceableVsNot(atoms)`,
  `resistibleTwin(atoms)`, `durationBuckets(atoms)`. These encapsulate exactly
  the discriminators the bag flattened.
- Stand up a **shadow harness**: for every power, compute each character-total
  twice — once from the bag (current), once from atoms (new) — and assert
  equality across the whole HC/Rebirth/Thunderspy corpus. This is the Phase-0b
  proof pattern the converter rewrite already used successfully (`DSH6_SHADOW`).
- **DoD:** shadow harness green corpus-wide; zero divergence.

  **Shipped:** helpers live in `src/data/core/atom-query.ts` (`atomsOf` —
  WeakMap-memoized decode, `atomsOfType`, `byType`, `bySubType`, `selfDirected`
  /`targetDirected`, `enhanceableVsNot`, `resistibleTwins`, `durationBuckets`),
  each documenting the one bag discriminator it replaces; unit-guarded by
  `atom-query.test.ts` (19 cases). No calc consumer yet — that is Phase 2.

  The shadow harness is `scripts/planb-shadow-bag.cjs`, wired into `npm run
  regen` (~4s) so it gates CI beside the DSH6 detector. **Scope note:** it
  asserts `bag ⊆ atoms` — every discriminator the bag carries is recoverable
  from the atom list — rather than comparing character-totals, because no
  atom-native applier exists to compare against until Phase 2. That is the
  precondition Phase 2 actually needs (an atom list missing a bag fact would
  drop it silently). The converse is deliberately NOT asserted: atoms carrying
  more than the bag is the point, and that residual is DSH6c's job. Green at
  8,913 powers / 9,533 checks / 0 divergences across all three datasets.

  **The harness immediately found a Phase-0 gap, which is why Phase 0's DoD was
  wrong.** `power.atoms` was emitted from `collectAllTemplates` — the *bag's*
  collector, which drops eight classes of gated group (PvP-only, PvP `enttype`
  twin, chance-0 procs, Containment, dead-state, `kMeter` hidden-state, `rand()`,
  mode/stance). Those drops exist solely because a single-valued slot would be
  clobbered by the gated variant — a bag-era workaround, not a claim the effects
  are unreal. Consequence: all 49 conditional/stance bags (`conditionalEffects` —
  Bio Armor's adaptations, Sky Splitter, Parasitic Aura…) had **no atoms behind
  them**, which would have silently blocked Phase 2 from migrating the resource
  appliers Bio Armor feeds. Fixed with `collectAtomTemplates` (drops nothing;
  every drop reason survives as a first-class atom field — `pvMode`,
  `requiresExpression`, `specialCase`, `baseProbability`), unioned with
  `allTemplates` so redirect-/`activation_effects`-sourced powers (Dull Pain,
  Fault, Remote Bomb) keep theirs. Atoms 22,293 → 34,733 (+56%); generated tree
  HC 17→19 MB, Rebirth 14→16 MB, tspy 13 MB. Known residual: gated groups nested
  inside a redirect chain or under `activation_effects` are still uncollected.
  `collectAllTemplates` is untouched, so the bag is unchanged — verified by
  stripping the `atoms` block from all 6,215 changed files and confirming every
  one is byte-identical (regen also idempotent, so the CI byte gate holds).

  **The harness was mutation-tested, not just observed green** (the
  [[dsh6c-discriminator-gate]] lesson: verify the diff, not the gate). Breaking
  each helper in turn must turn it red: `ignoreStrength` → 153 UNENHANCED,
  `toWho` → 98 SELF, duration key → 10 DURATIONS. A fourth mutant (corrupting
  `twinKey`) initially **survived** — the UNRESISTABLE check only asked whether
  *some* twin carried the bag's magnitude, so it was blind to mis-pairing. Closed
  with a TWIN-INTEGRITY invariant asserting each returned pair differs in nothing
  but `resistible` (now kills that mutant: 40 / 32). Two harness self-bugs were
  found the same way: it walked only `power.effects` (missing every conditional/
  special discriminator — ~half the corpus), and it silently swallowed
  `require` failures (an unloadable power read as a pass, not a gap).

### Phase 2 — Migrate appliers one at a time (behind the shadow)

**Slice 0 — the base/gated split (DONE 2026-07-15).** A prerequisite Phase 1
surfaced: after Phase 1 made `power.atoms` the COMPLETE effect list, an applier
can no longer just sum `atomsOf(power)` — that list deliberately includes
mode/stance, PvP, hidden-state and chance-0 proc atoms which do not apply by
default. Summing them would over-count every stance-gated armor (the
[[adaptation-stance-leak-fix]] bug, reintroduced by the front door).

The filter cannot be re-derived at runtime from the gate expression alone:
base-ness also depends on collection PROVENANCE (a template reached via a
redirect chain or `activation_effects` passes Self-only / IgnoreStrength-dupe
filters that no expression records). So the converter — the only scope holding
`allTemplates` — stamps the verdict: `AtomicEffect.gated` (last in the tuple, so
the ~64% base case trims to zero bytes). Runtime reads it via `baseAtoms(power)`
/ `gatedAtoms(power)` / `baseAtomsOfType(power, type)`.
**Phase 2 appliers read `baseAtoms`, never `atomsOf`.**

Guarded two ways, because neither alone suffices:
- The shadow harness's UNENHANCED check is now **path-aware** — `power.effects`
  must be backed by a BASE atom, `conditionalEffects[].effects` by a GATED one.
  This is what proves the stamping is right way round.
- A **hard converter assert** at the emit site: unstamped atoms must number
  exactly `templatesToAtoms(allTemplates)`. This covers what the harness
  structurally cannot — the harness checks `bag ⊆ atoms` by existence, which is
  insensitive to OVER-inclusion (mutation-verified: marking every atom base
  still passes every existence check, so only this assert catches it). The
  assert itself is mutation-verified to fire on both over- and under-stamping.

Corpus: 53,767 base / 29,386 gated atoms across the three datasets; shadow green
(8,913 powers, 0 divergences), regen idempotent, diff still `atoms`-only (29,386
insertions = 29,386 deletions = exactly the gated atoms gaining their flag).

**Slice 1+ — the appliers.**
Order by isolation, simplest first. For each applier (resistance, defense,
movement, resources incl. the `*Unenhanced` twins, mez, combat mods, procs,
incarnate, self-penalties):
1. Rewrite it to read atoms via the Phase-1 helpers.
2. Keep the shadow compare asserting bag==atoms for that total.
3. Ship when its slice is divergence-free; move to the next.
- The `*Unenhanced` five-slot family collapses back into a single
  `enhanceableVsNot(atoms)` split at this step — the tax is repaid.
- **DoD:** every character-total sourced from atoms; shadow still green.

  **Slice 1 — ToHit: divergence resolved, converter fix landed, applier migration
  reshaped (2026-07-15).** `scripts/planb-shadow-tohit.cjs` (committed, non-gating
  — a triage report, per §Risks) compares, per power, the bag (`tohitBuff` +
  `tohitBuffUnenhanced`, now counting `durationVariants`) against the BASE atoms
  of `effectType:'ToHit'` minus what the bag routes elsewhere (aspect `Res` →
  `debuffResistance`, `Str` → `specialBuff`, negative/debuff-table →
  `tohitDebuff`), split by `ignoreStrength`. It first found **603 powers carry
  +ToHit, 599 agree, 4 diverge** — all Inner Light / Inner Umbra. After the
  in-game STACK confirmation and the `accumulateBuffSlot` converter fix (see the
  Resolved section up top): **603/603 agree**.

  **The applier now reads atoms — via a converter-stamped `perTarget` (2026-07-15).**
  The blocker was that a truly atom-native total can't come from `durationBuckets`
  alone: Sunless Mire / Soul Drain / Invincibility are per-foe, and their
  `{scale, perTarget}` is derived by `computeAoePerTargetPatches` from AoE geometry
  (`max_targets_hit`, `targets_affected`), redirect `number_allowed`, Defiance
  tags, and the raw `Continuous` stack flavor — **none of which survives to the
  runtime.** Decisive proof: Invincibility's per-foe increment is `Continuous`, but
  `mapStacking` has no `Continuous` case so the atom encodes `stacking:'No'` — a
  runtime re-derivation off `stacking` would silently score its perTarget as 0.

  So, exactly like `gated` (Slice 0), **the converter stamps the verdict.** New
  `AtomicEffect.perTarget` (last in the tuple → trailing-trims to zero bytes on the
  non-increment majority) carries each increment atom's contribution;
  `computeAoePerTargetPatches` stamps `template._perTargetIncrement`, and
  `encodeAtomsForEmit` copies it onto the atom. The runtime recovers the bag value
  with `perTargetValueOf` (`perTarget = Σ atom.perTarget`, `scale = Σ |atom.scale|`)
  behind `toHitBuffValue(power)`, which `character-totals.ts` now reads in place of
  `effects.tohitBuff` (`?? effects.tohitBuff` for atom-less powers). The stamp is
  additive-only: a full regen leaves the **bag byte-identical** (only increment atom
  tuples grow). Gated corpus-wide by `scripts/planb-shadow-pertarget.cjs` (603
  ToHit / 21 per-target / 0 diverge, wired into `npm run regen`) and pinned in CI by
  `tohit-atom-native.verify.test.ts` (Soul Drain scales to 8 foes, Invincibility's
  stamp survives, Inner Light reads its 0.77 tail). The general axis (damage,
  regen/recovery, defense, endurance — 513 perTarget slots total) reuses the same
  stamp; its redirect (Fulcrum Shift) and self-counted (Phalanx `firstTargetExcluded`)
  residuals live in those slices, not ToHit.

  **What comparing correctly turned out to mean.** The first cut compared the
  MULTISET of (|scale|, table, enhanceable) and falsely flagged Soul Drain and
  Sunless Mire. Their two templates are a flat + per-foe pair the converter
  legitimately RESHAPES into one slot (Soul Drain: 1.0 flat + 0.2 per foe →
  `{scale: 1.2, perTarget: 0.2}`). The bag transforms as well as drops, so
  "different shape" ≠ "lost data". The shape that survives the reshaping is
  **summed scale per (table, enhanceable) at ONE target** — a resolved number
  would have been wrong too, since the AT table applies identically on both
  sides and only adds archetype noise to a routing question.

  **Known interim compromise:** self-STACK meta (`stacksLinear` / `maxStacks` /
  `stackCaps`, the repeated-cast axis — Siphon Speed) is keyed by SLOT NAME, so
  the applier still passes the bag for it — `adjustForStacking(atomValue, …,
  'tohitBuff', effects.maxStacks, …)`. Re-keying that onto atoms is deferred; it
  is not the same axis as the discriminators Plan B targets. NB the per-FOE axis
  (`perTarget`) is now fully atom-native (stamped, above) — do not conflate the
  two; `adjustForStacking` routes to `adjustForPerTarget` when the (atom-derived)
  value carries `perTarget`, and only falls through to slot-keyed self-stacking
  otherwise. (`AtomicEffect.stacking`/`stackCap` are per-template bin fields, NOT
  the converter's `detectStackingEffects` output — do not conflate those either.)

  **Slice 2 — Damage: applier migrated + a per-foe over-count root-fixed
  (2026-07-15).** `character-totals.ts` now sources +Damage from
  `damageBuffValue(power) ?? effects.damageBuff`. Harder than ToHit because a
  +Damage buff is not scalar — it explodes into one atom per damage type (8–13
  siblings, identical scale), so `damageBuffValue` (`atom-query.ts`) collapses that
  dimension and reconstructs perTarget over four atom-derivable axes:
  - **damage-type collapse** — dedup by `(|scale|, table)` (a by-type buff is one
    increment; summing raw 8–13×-inflated it);
  - **dominant table** — keep the table carrying the most |scale|, dropping an
    off-table rider (a blaster's `Melee_Ones` Defiance increment);
  - **per-target N=1 via `toWho`** — `perTarget = Σ distinct increment`; the N=1
    scale adds base (Replace) plus only increments landing on the CASTER (Self/All).
    That one test separates AAO (Self increment → N=1 = base+increment = 1.55) from
    **Fulcrum Shift** (Target increment → N=1 = base 4, +2/foe), no extra flag;
  - **non-uniform primary** — Embrace of Fire (+10 Fire/30s vs +8 all/10s) reports
    +8, the value covering the most damage types (what one global slot represents).
  `perTargetFromGroup` is shared with `toHitBuffValue` so the two can't drift.

  **Fulcrum Shift** needed a stamp like ToHit's, but its increment rides a
  redirect chain (`KineticTransferBuff` +2/foe) whose templates aren't the base
  power's atoms — so `detectStackingEffects` returns the increment `(scale,table)`
  signatures and the caller stamps the matching `allTemplates` atoms.

  **The root-fix (the reason this slice changed data).** `computeAoePerTargetPatches`
  summed *raw* per-foe templates, so datasets that encode a by-type buff as N
  single-attrib templates (Rebirth) — or a burst/tail as two duration blocks —
  read the per-foe increment N× too high (Rebirth Sunless Mire's +1.25/foe → +20;
  Invincibility's +Def, Rise to the Challenge's +Regen likewise). Fixed by summing
  DISTINCT `(scale, table)` + the same dominant-table filter, so the bag matches
  HC (which uses multi-attrib templates and was already correct) AND the atom
  reconstruction. HC bags are unchanged (dedup is a no-op on multi-attrib data);
  the corrected values were **cross-validated to equal HC's** for every changed
  Rebirth power. The one HC change — **Thunderous Blast** `enduranceGain` per-foe
  13.86 → 6.93 (two byte-identical redirect-sourced self-restore templates that
  were being double-counted) — was **confirmed in-game (2026-07-15): the self
  restore is 6.93**, so the dedup is a genuine fix here too.

  Gated corpus-wide by `scripts/planb-shadow-pertarget.cjs` (now tohit + damage,
  **1252/1252 agree, 0 diverge**) and pinned by `tohit-atom-native.verify.test.ts`
  (Soul Drain scales to 8 foes; AAO 1.55/0.55; Fulcrum 4/2; Inner Light 3.2 tail;
  Embrace of Fire +8 not +10).

  **The Inner Light damage-burst display (durationVariants) shipped too.** A
  post-pass in `projectAtomsToEffects` (mirroring the `tohitBuff` half) adds a
  `durationVariants` row for a UNIFORM burst/tail — a non-primary `(scale,duration)`
  group covering the SAME damage-type count as the primary — while leaving the
  primary (== `damageBuffValue`) untouched, so it is display-only with no total
  change and the shadow stays green. It admits Inner Light / Inner Umbra (both
  durations carry all 8 types) and Moment of Glory's 1/1/0.5 @ 5/10/15s decay, but
  skips a non-uniform buff (Embrace of Fire's Fire-only +10 is 1 type ≠ 8) and a
  per-foe damageBuff (the reshape rebuilds that slot as `{scale, perTarget}`,
  dropping the variant). Regen changes exactly those burst/tail powers, nothing else.

### Phase 3 — Bag becomes UI-only; then delete
- Point the calc entirely at atoms; the bag is produced solely for the
  `EFFECT_REGISTRY`-driven display layer.
- Optionally re-express the display projection as `atoms → registry rows`
  directly and delete `PowerEffects` + `projectAtomsToEffects` + the bolt-on
  slots (`unresistable`, `durationVariants`, `*Unenhanced`, per-value `toWho`)
  entirely. This is the deletion the whole exercise buys.
- **DoD:** `PowerEffects` either deleted or demoted to a generated display view
  with no calc consumer; DSH6c/DSH3 gates retired as redundant (the bag they
  guard no longer feeds the calc).

## Risks & mitigations
- **Silent numeric drift during migration** → the corpus-wide shadow compare is
  mandatory and gating at every phase; no applier ships without its slice green.
- **Data-size blowup from emitting atoms** → measure in Phase 0; compact encode
  if needed; atoms can be lazily derived at load rather than stored if size wins.
- **Scope creep / stall** → phases are independently shippable; the interim
  DSH6c/DSH3 gates keep `main` correct throughout, so B can land over many small
  PRs without a risky long-lived branch.
- **The shadow "proves equality" but the bag was wrong** → where a known bag bug
  exists (a collapse), the shadow will *diverge*; that divergence is the fix
  landing, and each is verified against Mids/in-game as usual, not auto-accepted.

## Definition of done
No character-total is computed from a named `PowerEffects` slot. Adding a new
game effect discriminator requires handling it in one atom helper, not minting a
new slot — and forgetting to handle it is impossible to do *silently*, because
the atom carries it and the calc must consume it explicitly.
