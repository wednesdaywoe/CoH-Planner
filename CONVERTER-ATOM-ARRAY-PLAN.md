# Plan B — Retire the `PowerEffects` bag: consumers read the atom list

> Status: **planned, not started.** Companion to the shipped interim guard
> (DSH6c discriminator gate, 2026-07-14). See [[converter-bag-vs-array-rootcause]],
> [[dsh6-collapse-detector]], `docs/converter-unification-direction.md`.

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

## Blast radius (measured this session)

Asymmetric — concentrated in one file.

| Layer | Reads | Shape | Cost |
|---|---|---|---|
| **Calc** `character-totals.ts` | ~195 (`~45` distinct slots after removing 66 stacking-meta reads) | procedural `if (effects.<slot>)` chains across ~12 appliers (active-power, proc, PPM, incarnate, fitness, movement, stealth) | **the mass** — near-total rewrite of the effect-application core |
| `calculations/damage.ts` | 14 | named slots (`damage`/`dot`/`maxTargets`) | small |
| **UI display** (`InfoPanel`, `powerDisplayUtils`, `MechanicAdjusters`, `SharedPowerComponents`, set-bonus/dashboard) | ~80 total | **already ~80% generic**: `Object.entries(effects)` through `EFFECT_REGISTRY` (`src/data/core/effect-registry.ts`, ~76 entries) | cheap — survives on a projection shim |

`AtomicEffect` is currently converter/test-only; **no runtime path imports it.**
That's the seam to open.

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

### Phase 1 — Atom-native calc primitives + shadow compare
- Build read helpers the calc will use: `atomsOf(power, effectType)`,
  `byType(atoms)`, `selfDirected(atoms)`, `enhanceableVsNot(atoms)`,
  `resistibleTwin(atoms)`, `durationBuckets(atoms)`. These encapsulate exactly
  the discriminators the bag flattened.
- Stand up a **shadow harness**: for every power, compute each character-total
  twice — once from the bag (current), once from atoms (new) — and assert
  equality across the whole HC/Rebirth/Thunderspy corpus. This is the Phase-0b
  proof pattern the converter rewrite already used successfully (`DSH6_SHADOW`).
- **DoD:** shadow harness green corpus-wide; zero divergence.

### Phase 2 — Migrate appliers one at a time (behind the shadow)
Order by isolation, simplest first. For each applier (resistance, defense,
movement, resources incl. the `*Unenhanced` twins, mez, combat mods, procs,
incarnate, self-penalties):
1. Rewrite it to read atoms via the Phase-1 helpers.
2. Keep the shadow compare asserting bag==atoms for that total.
3. Ship when its slice is divergence-free; move to the next.
- The `*Unenhanced` five-slot family collapses back into a single
  `enhanceableVsNot(atoms)` split at this step — the tax is repaid.
- **DoD:** every character-total sourced from atoms; shadow still green.

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
