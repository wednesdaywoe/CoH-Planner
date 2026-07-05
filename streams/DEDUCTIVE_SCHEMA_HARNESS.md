---
project: coh-sidekick
kind: plan
title: Deductive Effect Schema + Differential Harness
id-prefix: DSH
relates:
  - HOMECOMING_PARSER.md
  - THUNDERSPY_PARSER.md
  - REBIRTH_PARSER.md
---

# Deductive Effect Schema + Differential Harness

Source of truth for the effort to stop rediscovering effect-schema bugs
bin-by-bin. The recurring "collapse" bug family (PvP-clobber, resistable/
unresistable pair-collapse, multi-damage-type merge, duration-variant loss,
`_dam`/`_dmg` table miss) is not a list of independent bugs — it is one
architectural mismatch. This doc plans (1) a **deductive closed effect schema**
derived once from an authoritative source (Mids Reborn) instead of induced
bin-by-bin, and (2) a **differential harness** that diffs every power's effect
*structure* against a Mids-derived oracle so the whole class is caught by a
one-time sweep + CI, not by noticing a wrong number.

Scope is the powerset conversion pipeline
([`convert-powerset.cjs`](scripts/convert-powerset.cjs) → generated TS) and a new
validation/oracle layer beside it. It does **not** cover the Python bin parser's
correctness for this class (see "Where the data is lost" — the parser is already
proven correct here).

> Grounded in a 2026-07-05 investigation (6-agent audit: Mids effect model, Mids
> DB feasibility, converter collapse map, parser information-loss proof, design,
> oracle red-team). Full findings archived in the session scratchpad; the durable
> conclusions are captured below and in agent memory
> (`converter-bag-vs-array-rootcause`, `mids-oracle-stale-structural`).

## Root cause (the reframe)

The game runtime, our Python parser's export JSON, **and** Mids all model a power
as a **flat array of atomic, single-attrib effect records** — a compound effect =
N sibling records distinguished by `damageType` / `PvMode` / `Resistible` /
`mezType`. [`convert-powerset.cjs`](scripts/convert-powerset.cjs) `extractEffects()`
(~L3369) does the opposite: it models a power as `PowerEffects`, a **bag of ~90
named single-value slots**, routing each game effect into one named key with
**last-write-wins**. The audit enumerated **10 collapse sites (A–J)** — scalar
overwrite, by-type map overwrite, mez same-type higher-mag tiebreaker (~L3807),
`addOrAccumulate` sum-collapse (~L3980), `recordDuration` single-duration-per-key,
EntCreate summon merge, `resolveSummonRedirects` one-per-type pseudo-pet dedup —
and they are all the same shape. Every shipped fix (`unresistable`,
`durationVariants`, `domination`, `selfPenalty`) is a narrowly-gated patch onto
single-slot keys, which is exactly why new collapse sites keep surfacing in the
same shape. **The fix direction that dissolves the family:** give the converter an
internal *list of effect instances* keyed by a canonical identity, and make
`PowerEffects` a **projection computed at the end**, not the working model.

## Where the data is lost (converter-only)

The Python parser already preserves all three compound dimensions in the export
JSON — verified with line cites:
[`is_pvp`](tools/bin-crawler/bin_crawler/parser/_powers.py) per group
(EITHER/PVE_ONLY/PVP_ONLY), template `flags`/`flags_raw` carrying
`IgnoreResistance` (the resistible bit), and the full multi-`attribs` list.
`export_powers.py` dumps every group and every template 1:1 with no merge/select.
**Therefore this is a converter-only fix; the parser is not touched to recover
this data.** (The CLAUDE.md note that the template tail "is NOT yet parsed" is
**stale** — the tail is fully decoded now. That correction should land in
[HOMECOMING_PARSER.md](HOMECOMING_PARSER.md)/CLAUDE.md separately.)

## Ground truth & trust boundary (Mids = structural oracle only)

Mids ships a committed HC DB (`MidsReborn-master/MidsReborn/Databases/Homecoming/I12.mhd`,
build `2026.1.1242`, **Issue 28, dated 2026-05-28** — ~5 weeks old, not multi-year
stale). It stores effects at **template granularity** (scale + `ModifierTable`
name + attribType/aspect) — the *same abstraction level as our bin parser* — so it
is a clean parser-to-parser structural diff, no Mids calc engine required.

Trust boundary (decision 2026-07-05, user-confirmed): **Mids for topology, bins
for names and numbers.** Mids is old and has changed hands, so its numbers drift
(~5-week rebalance) and its identifier strings carry typos. So:
- **TRUST (structural, version- & handoff-stable):** sub-effect count/identity,
  `PvMode` presence, `Resistible` flag, `ModifierTable` *selection*, `EffectType`/
  `Aspect`/`AttribType` classification, conditional-gate identity.
- **DISTRUST:** exact `Scale`/`nMagnitude`/`nDuration` (skew), any computed
  `Mag`/`MagPercent` (Mids display convention), `Compare.json` (cosmetic), Mids
  zeros (may be silent table-miss). When Sidekick and Mids disagree, the raw
  `.pigg` bin is the tiebreaker, not Mids.

Two non-negotiable guardrails for the harness (else it is noise): **(1)** never
raw-shape diff — canonicalize *both* sides to a multiset of
`(effectType, subType, pvMode, resistible, modifierTable)` tuples first; **(2)**
tier findings — structural divergence = defect (fail CI), numeric divergence on a
structurally-identical effect = skew advisory (never fails). Filter the oracle to
**HC + PvE/Any**; for Thunderspy/Rebirth/Veracity/incarnate-pet content Mids has
no answer, so **SKIP with explicit coverage tracking**, never flag.

## Active

Fastest-signal, dependency-free work. The self-checks (DSH2/DSH3) need no Mids
data and catch both historical bug classes on their own; the oracle PoC (DSH1)
validates the whole differential approach before any converter rewrite.

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
- [ ] SC-3 — every emitted damage/debuff effect carries an explicit `resistible`
  disposition (absence of `IgnoreResistance` ⇒ resistible); none silently agnostic.
- [ ] SC-4 — every kept PvE effect has its PvP sibling accounted for
  (dropped-by-design + logged), never silently clobbered.
- [ ] SC-5 — buff-named vs debuff-named slot routing matches the sign/target of
  the source template (catches foe-debuff dropped on a caster stat).

## Backlog

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
- [ ] **DSH5** — Oracle-backed differential harness `tools/mids-oracle/diff_harness.py`:
  key powers by `full_name`, effects by the DSH4 identity key; check the structural
  invariants (set/count equality, multi-damage-type completeness, PvE/PvP twin
  integrity, resistibility present+correct, table resolves + table-name matches
  oracle, attribType/aspect agreement). Tiered classifier writing typed suppression
  rules to `oracle_divergence_rules.json` (STRUCTURAL=defect · NUMERIC_DRIFT=skew ·
  BY_DESIGN PvP-drop · relabel · cosmetic · UNCLASSIFIED=triage-blocks). Filter
  oracle to HC+PvE/Any; SKIP non-HC with a coverage manifest.
  needs: DEDUCTIVE_SCHEMA_HARNESS#DSH1, DEDUCTIVE_SCHEMA_HARNESS#DSH4
- [ ] **DSH6** — Converter repair: rework `extractEffects()` to build the DSH4
  internal effect list first (one record per template × attrib × pvMode ×
  resistibility, sign preserved), then project to `PowerEffects` at the end. The
  merge rules operate on matching identity keys only, dissolving collapse sites
  A–J at the source. Retire the bolt-ons (`unresistable`, `durationVariants`,
  `domination`, `selfPenalty`) **one harness-gated site at a time** — each site's
  diffs must go to zero before the next. Fold DSH2 table validation into the
  converter so it fails loudly at emit time.
  needs: DEDUCTIVE_SCHEMA_HARNESS#DSH4, DEDUCTIVE_SCHEMA_HARNESS#DSH5
- [ ] **DSH7** — Numeric resolution + full sweep + CI: resolve oracle numbers by
  joining each effect's `scale × modifierTable` against committed `AttribMod.json`
  at a pinned level/AT (enables value-level diffing as an advisory tier); run the
  harness across all 5,277 powers × relevant ATs; every real bug → fix + regression
  case, every legitimate divergence → typed rule; wire DSH2/DSH3 + the harness into
  CI so the next collapse or table-name regression breaks the build.
  needs: DEDUCTIVE_SCHEMA_HARNESS#DSH5
- [ ] Replace the AT-table extractor's hand-maintained 45-name allowlist
  ([`extract-at-tables.cjs`](scripts/extract-at-tables.cjs)) with a principled
  filter (extract every player-referenced table, or all 110 binary tables with a
  documented skip-list). The allowlist is the **same inductive-schema anti-pattern**
  as the converter's bag-of-slots — it silently omits real tables until a power
  references one on a fatal slot. DSH2 found `Melee_Debuff_Dam` + `*_EndDrain` this
  way; there are ~62 more unextracted tables that only escape notice because no
  fatal-slot power references them yet.

## Deferred

- Surfacing PvP values in the planner UI — `pvMode` enters the schema/harness so
  PvE can't be clobbered by PvP; exposing a PvP view is a separate product
  decision, not part of this correctness effort.
- Full numeric parity with Mids' calc engine — structural correctness is the
  mission; numeric equality is inherently skew-limited against a stale oracle
  (DSH7 does resolved-number diffing only as a low-severity advisory tier).
- Running Mids headless to export a golden JSON DB (`SaveJsonDatabase`) — reserved
  for if a Windows/dotnet box appears; not on the critical path (the `.mhd` reader
  in DSH1 is fully self-contained on Linux). Rejected as primary path: WinForms/
  dotnet unavailable here.
- Parser rewrite to recover compound data — **non-goal**; the parser already
  preserves it. Only candidate parser change: make the two silent parse-failure
  swallow paths ([`_powers.py`](tools/bin-crawler/bin_crawler/parser/_powers.py)
  ~L764, ~L878) loud under a strict flag so an unparseable PvP twin can't vanish
  before JSON. Diagnostics only.
