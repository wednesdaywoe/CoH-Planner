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

- [ ] **DSH1** — Oracle-reader PoC: port the `I12.mhd` Power+Effect BinaryReader
  layout to `tools/mids-oracle/read_i12.py` (5 LE primitives + .NET 7-bit string
  prefix; seek `\x0cBEGIN:POWERS`; read `count+1` Powers, inline `Effects[n+1]`;
  map enums via `MidsReborn-master/MidsReborn/Core/Enums.cs`). Emit one JSON line
  per power at template granularity. **Exit gates (all three):** (1) parses clean
  to end-of-stream — proves the `+1`/`setTypeCount <=` layout is right, the one
  desync risk; (2) on `main`, ~50 known-answer powers (Trick Arrow, Arachnos
  epics, Build Up) show 0 structural diff vs oracle; (3) checked out at a pre-fix
  commit, the harness **reproduces** the exact collapse those commits fixed.
- [ ] **DSH2** — SC-1 self-check: `scripts/validate-converter-output.cjs` asserts
  every emitted `effect.table` resolves to a real AT table (after the same
  normalization cascade [`getTableValue`](src/data/datasets/homecoming/at-tables.ts)
  ~L8890 uses). A miss is a **hard fail** — no silent fall-through to
  `TABLE_BASE_VALUES['default']` (0.10) or `scale×1.0`. Converts every future
  `_dam`/`_dmg`-class typo from a believable wrong number into a CI break. No Mids
  dependency.
- [ ] **DSH3** — SC-2 self-check (collapse detector): in the same validator, count
  per power the distinct-identity input templates vs output slots; if N siblings
  collapse to <N at any A–J site, emit `COLLAPSE {power, attrib, lost_keys}` and
  fail. General detector for the entire family. No Mids dependency.
- [ ] SC-3 — every emitted damage/debuff effect carries an explicit `resistible`
  disposition (absence of `IgnoreResistance` ⇒ resistible); none silently agnostic.
- [ ] SC-4 — every kept PvE effect has its PvP sibling accounted for
  (dropped-by-design + logged), never silently clobbered.
- [ ] SC-5 — buff-named vs debuff-named slot routing matches the sign/target of
  the source template (catches foe-debuff dropped on a caster stat).

## Backlog

- [ ] **DSH4** — Closed effect schema: encode the Mids atomic model as a
  converter-internal effect record + TS type. Add the fields Sidekick lacks today:
  `pvMode` (Any|PvE|PvP), first-class `resistible`, per-type `damageType`/`mezType`
  (one record per type), `effectType`, `attribType`, `aspect`, `toWho`
  (replaces ad-hoc `selfPenalty`), validated `modifierTable`, `stacking`+`stackCap`,
  `effectId`, `buffable`/`ignoreED`/`ignoreScaling`, `specialCase`+`conditionals`;
  keep sign on `scale` internally (stop `Math.abs` at ingest). Define the canonical
  identity key `(effectType, damageType|mezType, pvMode, resistible, toWho,
  attribType, aspect, modifierTable, round(scale,4))` — shared by the harness and
  the collapse detector.
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
