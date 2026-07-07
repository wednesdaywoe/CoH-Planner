---
project: coh-sidekick
kind: archive
title: Deductive Schema Harness — Shipped Work Archive
relates:
  - DEDUCTIVE_SCHEMA_HARNESS.md
---

# Deductive Schema Harness — Shipped Work Archive

Full narratives for **completed** DSH items, moved out of the live plan
([DEDUCTIVE_SCHEMA_HARNESS.md](DEDUCTIVE_SCHEMA_HARNESS.md)) so it holds only open
work. This is the verify-don't-assume audit trail — kept verbatim and deliberately
dense on purpose: when a folded canonicalization or a retired bolt-on is later
questioned, its grounding (the concrete power it was verified against) must stay
retrievable here rather than be re-litigated. Nothing here is open.

## DSH1–DSH3 — oracle-reader PoC + the two dependency-free self-check gates

- [x] **DSH1** — Oracle-reader PoC. **Shipped 2026-07-05** as
  [`tools/mids-oracle/read_i12.py`](tools/mids-oracle/read_i12.py) (reader) +
  [`diff_oracle.py`](tools/mids-oracle/diff_oracle.py) (PoC comparator) +
  [`README.md`](tools/mids-oracle/README.md). The reader ports the `I12.mhd`
  BinaryReader layout verbatim (top-level `LoadMainDatabase`; `Power.cs:213`;
  `Effect.cs:87`; `Requirement.cs:67`; `Enums.cs` ordinals), seeks `\x0cBEGIN:POWERS`,
  reads `count+1` Powers with inline `count+1` Effects, and emits one JSON line per
  power at template granularity. **All three exit gates met:**
  **(1)** parses the full HC DB — **10,986 powers / 73,553 effects** — and lands
  exactly on `BEGIN:SUMMONS`, proving the `+1`/`setTypeCount <=` layout is byte-correct
  (a single misread field would desync across 73k effects).
  **(2)** oracle vs parser export on the known-answer cohort: Single Shot, Flash
  Arrow, Poison Gas Arrow match **exactly** under combat canonicalization; every
  other divergence buckets into an enumerated *modeling* class (PVP_MODELING,
  MULTI_TYPE_GRANULARITY, MEZ_PVP_RESIDUAL, INHERENT_EXTRA, REDIRECT, small OTHER) —
  **zero Sidekick/parser defects.** These buckets are DSH5's canonicalizer worklist
  (README table).
  **(3)** the resistible/unresistable-twin cohort (Flash Arrow, Poison Gas Arrow —
  the 2026-07-05 converter-fix targets) matches the oracle exactly; Mids independently
  shows Flash Arrow's resistible + `IgnoreResistance` ToHit twin, and the pre-fix
  generated output (`d94431fe0d^`) had **0** `unresistable` markers vs **1** post-fix —
  the oracle reproduces exactly the effect the collapse dropped.
  **Discovery:** the export is NOT as atomic as Mids for multi-damage-type buff/debuff
  (one multi-attrib record vs Mids' one-record-per-type) — reconciling that in the
  harness (MULTI_TYPE_GRANULARITY) **needs the DSH4 attrib→type bridge**, confirming
  the DSH5-after-DSH4 sequencing. Local-only: `MidsReborn-master/`+`.mhd` are
  gitignored, so these do not run in CI (that is DSH5/DSH7).
  verify: file:tools/mids-oracle/read_i12.py, file:tools/mids-oracle/diff_oracle.py
- [x] **DSH2** — SC-1 AT-table referential integrity. **Shipped 2026-07-05** as a
  vitest guard [`converter-table-integrity.test.ts`](src/data/converter-table-integrity.test.ts)
  (decision: a `.test.ts`, not the planned `.cjs` — it imports the REAL
  `getTableValue`/`getTableBaseValue`/`EFFECT_REGISTRY`, so zero cascade drift, and
  rides `npm test` → already gated by `ci.yml`). Registry-driven and **slot-aware**:
  validates a table only on slots the app resolves as `scale × table` (buff/debuff-%
  + by-type protection), skipping magnitude/damage slots whose table is vestigial
  (repel `Ones`, taunt, Kheldian InherentDamage) — FP-free. **Found + fixed a real
  bug on first run:** [`extract-at-tables.cjs`](scripts/extract-at-tables.cjs)'s
  fixed allowlist (45 of 110 binary tables) omitted real tables — `Melee_Debuff_Dam`
  (the melee twin of the ranged `_dam` bug; a binary spelling asymmetry melee-`_Dam`
  vs ranged-`_Dmg`, hidden behind a misleading "no melee_debuff_dmg exists" comment)
  and `Melee_EndDrain`/`Ranged_EndDrain`. Fixed at root (added them, re-extracted —
  purely additive; corrected the comment). The hand-maintained allowlist is itself
  an inductive-schema smell → backlog.
  verify: file:src/data/converter-table-integrity.test.ts
- [x] **DSH3** — SC-2 collapse detector. **Shipped 2026-07-05** as
  [`validate-converter-output.cjs`](scripts/validate-converter-output.cjs) (npm
  `validate:converter`, wired into `ci.yml`, all 3 datasets). Two tiers. **GATE** =
  resistible/unresistable-twin regression: mirrors the converter's own twin
  detection ([convert-powerset.cjs](scripts/convert-powerset.cjs) L3403-3452) on the
  input — if a debuff twin exists, output MUST carry `unresistable`, else fail.
  Green on an 8-power cohort = the exact Trick Arrow Flash/Poison-Gas-Arrow powers
  the 2026-07-05 fix touched (real teeth). Made FP-free by archetype-disambiguated
  matching + excluding pseudo-pets/pools (killed a Dimension_Shift name-collision
  false positive). **REPORT** = collapse-risk groups (~4,800 HC powers) for triage,
  non-failing. **Discovery:** a *fully-general* per-slot detector is blocked on the
  DSH4 attrib→slot routing map — output has already discarded the attrib identity,
  so input siblings can't be re-aligned to output slots black-box. The general
  detector therefore folds into **DSH6** (which already `needs` DSH4).
  verify: file:scripts/validate-converter-output.cjs, fn:hasResistibleTwin

## DSH4–DSH5 — closed atomic-effect schema + oracle-backed differential harness

- [x] **DSH4** — Closed effect schema. **Shipped 2026-07-05** as
  [`src/data/core/atomic-effect.ts`](src/data/core/atomic-effect.ts) + guard
  [`atomic-effect.test.ts`](src/data/atomic-effect.test.ts) (rides `npm test` → CI).
  Defines the `AtomicEffect` record (one atom = one attrib × damage/mez subType ×
  pvMode × resistibility) with the fields Sidekick's bag-of-slots lacked — `pvMode`,
  first-class `resistible`, per-type `subType`, `effectType`, `attribType`, `aspect`,
  `toWho` (retires `selfPenalty`), `modifierTable`, `stacking`+`stackCap`,
  `specialCase`+`requiresExpression` (retires the `domination` bolt-on), enh flags —
  and keeps SIGNED `scale` (stops the converter's `Math.abs` at ingest). Two keys:
  full `identityKey` (incl. `round(scale,4)` — for dedup/collapse) and reduced
  `structuralKey` `(effectType, subType, pvMode, resistible, modifierTable)` (for the
  DSH5 oracle diff, scale-agnostic). Includes the **attrib→(effectType,subType)
  bridge** (the [[DSH1]] blocker) grounded in the committed HC export's 95-attrib
  vocabulary + a reference `ingestExportPower`. **Verified against the Mids oracle**
  (`tools/mids-oracle/crosscheck_bridge.ts`): the cross-check found + fixed real
  mis-maps — `aspect=Str` is a *buff* discriminator (`_Dmg`+Str ⇒ DamageBuff not
  Damage; mez+Str ⇒ Enhancement; mez+Res ⇒ MezResist), lifting agreement to 88.5% and
  mapped-coverage to 98.8% of 67,409 HC atomic records. **Known residual (documented,
  not a defect):** the `aspect=Str` scalar/movement Enhancement-vs-keep-type split is
  a Mids-internal table-context call not cleanly derivable from (attrib,aspect,table)
  — deferred to DSH6 rather than over-fit. This unblocks DSH5 (both its `needs` are
  now met).
  verify: file:src/data/core/atomic-effect.ts, file:src/data/atomic-effect.test.ts
- [x] **DSH5** — Oracle-backed differential harness. **Shipped 2026-07-05** as
  [`tools/mids-oracle/emit_canonical.ts`](tools/mids-oracle/emit_canonical.ts) (export-side
  canonicalizer — reuses the tested DSH4 `ingestExportPower`, so the app schema and the
  oracle diff can never drift; resolves redirect shells) +
  [`diff_harness.py`](tools/mids-oracle/diff_harness.py) (joins all **5,668** HC powers to
  the Mids oracle by `full_name`, keys effects by the DSH4 `(effectType,subType,resistible)`
  identity, tiered classifier → `oracle_divergence_rules.json` schema
  `dsh5-oracle-divergence-rules/1` + coverage manifest). Filters oracle to HC; Thunderspy/
  Rebirth excluded on the export side (Mids has no answer) with the exclusion tracked.
  **Structural invariants implemented** with FOUR modeling-difference canonicalizations,
  each verified against a concrete power before folding (verify-don't-assume, no
  over-fit): **complete-type-set fold** (Poison Gas Arrow — Mids' all-damage `None` record
  vs our per-attrib split; twin folded independently so R/U stay distinct),
  **ResEffect fold** (Acid Arrow — Mids' secondary-attrib resistance catch-all ↔ our
  `aspect=Res` scalars, the DSH4/DSH6 boundary), **set-not-multiset INV1** (Claw Swipe —
  Mids enumerates conditional/DoT scale-tiers on one key; collapse drops a whole *distinct*
  sibling key, never duplicate copies → compare presence, count-deltas are advisory
  MULTIPLICITY), and **INV4 resistibility-flip** as its own class (Power Surge). Table-name
  (INV5, 97.0% agree) + numeric are advisory-only against the ~5-wk-stale oracle — gating on
  them would be a false positive (the cardinal sin). **Gate green:** the known-answer cohort
  matches (Flash Arrow + Poison Gas Arrow twin-exact; Single Shot/Acid Arrow/Build Up zero
  UNCLASSIFIED) and `--baseline` regression-gates on any *new* UNCLASSIFIED signature (both
  PASS, exit 0). **Result:** BY_DESIGN 1,156 / RELABEL 547 / **UNCLASSIFIED 6,107** (the
  headline drifts across this doc — it was 6,245 at DSH5 ship, then DSH8's bridge fix
  resolved 138 oracle-only Defense residuals → **6,107 is current**, per the live
  `oracle_divergence_rules.json`). **FROZEN, NOT a burn-down worklist** (decision
  2026-07-06, review follow-up): spot-verification showed the pile is dominated by
  Mids-internal relabeling (`aspect=Str`→Enhancement), content scope (incarnate/epic),
  the 290 resistibility-flips, and staleness — NOT defects. The operative mechanism is
  already the right one: `--baseline` **gates on new signatures only**; nobody triages
  the 6,107. The one genuinely-actionable residue — "Mids has a damage type we lack"
  (Mace Beam Blast etc.) — is isolable by filter (oracle-side, `effectType=Damage`,
  typed subType → 978 raw sigs / 616 powers; the *verified* ~160 subset needs the
  complete-type-set fold applied to strip granularity artifacts) and is the ONE
  DSH7-numeric candidate; the full numeric sweep is not (see DSH7). Local-only (`.mhd`
  gitignored); `.oracle_cache/` gitignored, the rules baseline committable. **This
  unblocked DSH6** (its `needs` DSH4+DSH5 were met).
  verify: file:tools/mids-oracle/diff_harness.py, file:tools/mids-oracle/emit_canonical.ts
  needs: DEDUCTIVE_SCHEMA_HARNESS#DSH1, DEDUCTIVE_SCHEMA_HARNESS#DSH4

## DSH6a — general per-slot collapse detector

  - [x] **DSH6a** — General per-slot collapse detector (the one DSH3 deferred here
    for want of the DSH4 attrib→slot map). **Shipped 2026-07-05** as
    [`scripts/dsh6-collapse-detector.cjs`](scripts/dsh6-collapse-detector.cjs) +
    committable worklist `scripts/dsh6-collapse-worklist.json`. Single-source: the
    input side reuses the DSH4 bridge (`ingestExportPower`) via `tsx/cjs` (never
    re-ported); the output side deep-walks the whole generated Power object
    (effects + damage + specialEffects + conditionalEffects), and it can run in CI
    (all inputs committed — unlike DSH5's gitignored `.mhd`). **FP-hardened** the
    hard way (2,017 raw flags → **33**, via 5 fixes each traced to a concrete power,
    verify-don't-assume): mez/movement sub-type normalization (`Run`↔`runSpeed`,
    `Confused`↔`confuse`), exclude `aspect=Str` (Power-Boost→specialBuff) and
    `aspect=Res` movement (→`debuffResistance`), and — the load-bearing insight —
    **sign follows the converter's rule** (`scale<0` OR table matches `/debuff/`),
    because a foe −Def/−Res debuff is stored as POSITIVE scale on a `*_Debuff_*`
    table (Low Kick's `Base_Defense +1` on `Melee_Debuff_Def`). **Finding that
    reshapes DSH6:** clean by-type sibling collapse (the most-cited "site B")
    **essentially does not occur in HC** — the by-type maps already prevent it.
    The 33 residual + 69 class-absent were all **target-directed** (ally/team buffs
    the caster-centric converter dropped — Speed Boost / Inertial Reduction +movement)
    or **conditional-pipeline / dual-representation** (Enforced Morale's
    `kMeter`/`isPVPMap`-gated mez-resist, kept only for `sleep` while all 6 mez show
    as applied-mez protection). NONE is a last-write-wins clobber. **DSH6b then
    emitted the ally movement buffs** (33→2 by-type; the 2 left are NPC display-name
    aggregation, class-absent = control/self-conditional edge cases). The historical
    collapse family (PvP-clobber, resistible-twin,
    duration) lives on the scalar/pvMode/resistible axes this v1 folds OUT — those
    are already covered by DSH5 (bridge↔Mids) + DSH3 (twin gate); a converter-output
    scalar-identity gate is DSH6b.
    verify: file:scripts/dsh6-collapse-detector.cjs, file:scripts/dsh6-collapse-worklist.json
