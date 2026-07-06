---
project: coh-sidekick
kind: plan
title: Deductive Effect Schema + Differential Harness
id-prefix: DSH
relates:
  - HOMECOMING_PARSER.md
  - THUNDERSPY_PARSER.md
  - REBIRTH_PARSER.md
  - GAME-DATA-PRINCIPLES.md
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
proven correct here). **DSH8/DSH9 (backlog) extend the same diagnosis to the two
sibling converters — [`convert-incarnate-effects.cjs`](scripts/convert-incarnate-effects.cjs)
and the enhancement extractors — which independently reinvented the same
bag-of-slots model** (audit 2026-07-05, user-confirmed the expansion).

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
  PASS, exit 0). **Result:** BY_DESIGN 1,157 / RELABEL 547 / **UNCLASSIFIED 6,245 = the DSH6
  worklist** — spot-verified genuine (Mids `aspect=Str`→Enhancement relabel, incarnate/epic
  scope, 289 resistibility-flips, ~160 scattered "Mids has a damage type we lack" e.g. Mace
  Beam Blast → bin-tiebreaker candidates for DSH7). Local-only (`.mhd` gitignored → CI is
  DSH7); `.oracle_cache/` gitignored, the rules baseline committable. Full suite still green
  (94 files / 801 tests), tsc clean. **This unblocks DSH6** (its `needs` DSH4+DSH5 are met).
  verify: file:tools/mids-oracle/diff_harness.py, file:tools/mids-oracle/emit_canonical.ts
  needs: DEDUCTIVE_SCHEMA_HARNESS#DSH1, DEDUCTIVE_SCHEMA_HARNESS#DSH4
- [~] **DSH6** — Converter repair: rework `extractEffects()` to build the DSH4
  internal effect list first (one record per template × attrib × pvMode ×
  resistibility, sign preserved), then project to `PowerEffects` at the end. The
  merge rules operate on matching identity keys only, dissolving collapse sites
  A–J at the source. Retire the bolt-ons (`unresistable`, `durationVariants`,
  `domination`, `selfPenalty`) **one harness-gated site at a time** — each site's
  diffs must go to zero before the next. Fold DSH2 table validation into the
  converter so it fails loudly at emit time.
  needs: DEDUCTIVE_SCHEMA_HARNESS#DSH4, DEDUCTIVE_SCHEMA_HARNESS#DSH5
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
  - [~] **DSH6b** — Scalar-identity gate + converter fixes. **Ally/foe-targeted buff
    *display* is IN SCOPE** (decision 2026-07-05, user-chosen) — so the 69 class-absent
    + target-directed by-type flags (Speed Boost / Inertial Reduction +movement,
    Enforced Morale ally mez-resist) are real gaps to fix, not by-design drops.
    - [x] **Scalar-identity gate** — the site-A *table*-variant collapse the by-type
      gate folds out, added to the same detector: two same-`(effectType,sign)` SCALAR
      templates on DIFFERENT tables where last-write-wins keeps one. Two FP-fixes
      (verify-don't-assume): fold `resistible` out (buffs have no twin; DSH3 gates
      debuff twins) cut 815→86, then mirror the converter's PvP `enttype target>
      player eq` drop cut 86→4. **The EndDrain "collapse" (Lightning Field) was a FP**
      — Mids confirmed `*_EndDrain` is the PvP (`player eq`) variant the converter
      *correctly* drops; my `addOrAccumulate` hypothesis was wrong. **Gate now at 0.**
      verify: file:scripts/dsh6-collapse-detector.cjs, tests:src>=801
    - [x] **Conditional-pipeline PvP-variant leak — FIXED 2026-07-05.** The real bug
      the scalar gate surfaced: `collectConditionalsGrouped` (and the redirect/special
      collectors) only dropped `is_pvp==='PVP_ONLY'`, NOT the `enttype target> player
      eq` PvP twin the base `collectTemplatesDeep` drops — so a conditional PvE/PvP
      pair kept the PvP value (Beam Rifle Disintegrate showed PvP -3/Ranged_Res_Boolean
      regen over PvE -0.75/Ranged_Ones; Mids-confirmed). Fix = single shared
      `isPvpEnttypeVariant()` predicate applied at all collectors
      ([convert-powerset.cjs](scripts/convert-powerset.cjs), the two inline copies
      de-duped). Regen: 65 HC files (94 PvP damage/mez entries dropped, 9 PvP→PvE
      debuff-table flips, no PvE content lost); rebirth/thunderspy unaffected. Lint +
      DSH3 gate + 801 tests + scalar gate all green.
      verify: fn:isPvpEnttypeVariant, tests:src>=801
    - [x] Emit ally/team-targeted **movement** buffs for Info-panel display (the
      in-scope decision). Converter movement branch now routes non-Self,
      aspect=Current, positive (non-slow) movement mods to `effects.movement`
      (previously dropped): Speed Boost / Accelerate Metabolism +run/fly, Inertial
      Reduction +jump, Group Fly / Group Energy Flight team fly, Toroidal Bubble
      +jump. The calc's `ALLY_ONLY_TARGET_TYPES` gate ([character-totals.ts:956](src/utils/calculations/character-totals.ts#L956))
      keeps ally-only powers off the caster's totals — same as this power's existing
      `rechargeBuff`/`recoveryBuff` — while Self-target team powers correctly buff the
      caster (Inertial Reduction now grants Kinetics its +jump). Regen: 37 HC+Rebirth
      files; leak audit clean (no active foe-toggle gains +speed); tspy unaffected.
      **Enforced Morale mez-resist was NOT a real gap** — its PvE mez PROTECTION
      (all 6) + sleep-resist already render; the confuse/fear/hold/immob/stun
      *resistance* is `isPVPMap?` PvP-map-only (correctly dropped). DSH6 detector
      by-type 33→2 (isPVPMap? filter added, mirroring the `player eq` PvP drop);
      residual 2 = NPC display-name aggregation, not player collapse.
      verify: file:src/data/datasets/homecoming/generated/powersets/defender/primary/kinetics/speed-boost.ts, tests:src>=801
    - [x] **CONDTAG** — Surface target-tag conditional effects as `vs <type>`
      Mechanic Adjusters. `_classifyConditionalGate` now matches an allowlisted
      `<Tag> target.HasTag?` (on the stripped, anchored expression) → a per-power
      (target-side) conditional; the base collector still drops them (they're gated)
      but `extractConditionalEffects` re-surfaces them with their damage + effects.
      **ESD Arrow** (`EMP_Arrow`) now shows its "vs Machines/Robots" bonus — +1.64
      Energy damage + Mag-2 Hold — matching the in-game description; base Stun +
      End-drain unchanged. Allowlist is a CLOSED semantic set (`SURFACEABLE_TARGET_TAGS`
      = `{Electronic: 'Machines/Robots'}`): the dominant `.HasTag?` gates — `Raid`
      (4,185×) / `IncarnateBoss` (367×) — are internal engine mechanics (chained with
      `@ToHitRoll`/`kRage`), never a player bonus, and stay untoggleable. Blast radius
      is exactly the EMP/electric family (ESD Arrow, EM Pulse, Short Circuit, EMP
      Arrow, EM Wave — HC+Rebirth+tspy); DSH6 by-type 2→1 (ESD Arrow Mez|hold flag
      cleared). Undead/Demon/Ghost/Human/Generator are candidate allowlist additions
      pending per-power verification. Lint + DSH3 + 801 tests green.
      verify: fn:_classifyConditionalGate, tests:src>=801
    - [x] **DOMINATION bolt-on retired** — the clearest *dual-representation*: HC's
      `Tag "Domination"` mez bonus was captured into a special-case `MezEffect.domination`
      sub-field (81 HC powers), while Rebirth/tspy encode the *same* Dominator-inherent
      bonus via the general `domination` conditionalEffect (their `kStealth source>` gate;
      134 powers). Empty intersection ⇒ two encodings of one mechanic. Converged HC onto
      the general pipeline: `collectConditionalsGrouped` now recognizes `Tag "Domination"`
      groups → routes them to the shared `{id:'domination', label:'Domination Active',
      side:'source'}` gate (base collector skips them like Containment; `extractEffects`
      no longer diverts to the sub-field). HC Char/Dominate now emit byte-identical shape
      to Rebirth (base `hold` + `domination` conditional). **UI kept rich for all 3 servers**
      (decision 2026-07-05, user chose "Converge, keep rich UI" over minimal-retire / reverse /
      defer): the `dominationActive` Header toggle already drives the `domination` conditional
      (via `AT_INHERENT_CONDITIONAL_IDS` + `selectActiveConditionals` `atInherentState`); the
      badge (`getPowerDominationSummary`) re-sourced from the conditional so it renders for
      Rebirth/tspy too (was HC-only); the inline "+mag, longer duration" mez boost re-sourced
      from the `domination` `extraInstances` collision (tagged with `conditionalId`) and its
      duplicate "+…(from…)" row suppressed on mez rows only (non-mez collisions e.g. Shadow
      Field's summon keep their row). `MezEffect.domination` type deleted; converter
      `_tagDomination`/`pendingDomination`/`_domination` all removed. Regen: 83 HC files
      (Rebirth/tspy 0 — their `kStealth` path untouched); DSH6 detector-neutral (by-type 1
      = Focused Fighting residual, scalar 0). Lint + DSH3 (3 ds) + 801 tests green.
      verify: fn:getPowerDominationSummary, file:src/data/domination-per-effect.test.ts, tests:src>=801
    - [x] **Retire `selfPenalty` → per-effect `toWho`.** **Shipped 2026-07-05.** The
      bag-level `selfPenalty` boolean is gone; each self-directed debuff value now carries
      the DSH4 `eToWho` projection `toWho:'Self'` ([`ScaledEffect.toWho`](src/types/power.ts)),
      read via `isSelfDirectedEffect` / `hasSelfDirectedPenalty`. **Verified an observable
      bug, not just a rename (verify-don't-assume):** a scan of all 36,129 export files
      (`route()` mimicking the converter's 6 selfPenalty branches) found 8 powers that set the
      old bag flag AND routed a NON-Self (`AnyAffected`) template into a calc-consumed slot —
      the calc's bag-wide `selfPenalty && effects.slow` gate then dragged the foe entry onto
      the caster, **in direct violation of the converter's own `L3949` "foe slows don't slow
      the player" comment.** Canonical case: Rebirth Granite/Rooted's `AnyAffected -JumpHeight`
      landed in `slow[jumpHeight]=500` and was self-applied as a nonsense ~−50000% caster jump;
      HC Reaction Time similarly self-applied a foe −70% jumpHeight. **HC is a VERIFIED no-op**
      (every HC self-penalty template is `target:'Self'` — Granite's whole slow map keeps the
      marker); only genuinely foe-classified entries stop leaking. Converter tags per-value
      (6 branches, `if (isSelfTargeting) x.toWho='Self'`); calc self-applies PER ENTRY
      ([character-totals.ts](src/utils/calculations/character-totals.ts) 3 sites, per-entry
      slow loop); 3 predicate sites (perma / attack-chain / power-row) use
      `hasSelfDirectedPenalty`. `rangeDebuff` self-branch confirmed dead (0 powers). Regen
      (49 files carry `toWho:'Self'`, 0 retain `selfPenalty`); lint clean, 805 tests
      (+4 guard [`self-penalty-towho.test.ts`](src/utils/calculations/self-penalty-towho.test.ts)),
      DSH6 detector-neutral, all 3 converter gates green.
      verify: file:src/utils/calculations/self-penalty-towho.test.ts, fn:hasSelfDirectedPenalty, tests:src>=805
    - [~] Retire the remaining bolt-ons. **Finding (verify-don't-assume):** `unresistable`
      and `durationVariants` are NOT independently retireable — each *is* the projection of
      multiple atomic records into one single-value `PowerEffects` slot (an unresistable-twin
      flag / a `[{scale,duration}]` mini-list), with no second representation to converge onto;
      "retiring" them requires the full `PowerEffects`-becomes-a-list rewrite, which fixes no
      observable bug (detector is green) — deferred until a new collapse site actually surfaces.
      `selfPenalty` is now DONE (above); the remaining two stay deferred.
    needs: DEDUCTIVE_SCHEMA_HARNESS#DSH6
- [ ] **DSH7** — Numeric resolution + full sweep + CI: resolve oracle numbers by
  joining each effect's `scale × modifierTable` against committed `AttribMod.json`
  at a pinned level/AT (enables value-level diffing as an advisory tier); run the
  harness across all 5,277 powers × relevant ATs; every real bug → fix + regression
  case, every legitimate divergence → typed rule; wire DSH2/DSH3 + the harness into
  CI so the next collapse or table-name regression breaks the build.
  needs: DEDUCTIVE_SCHEMA_HARNESS#DSH5
- [~] **DSH8** — Extend the harness to the **Incarnate** pipeline. The audit
  (2026-07-05, 2-agent) found [`convert-incarnate-effects.cjs`](scripts/convert-incarnate-effects.cjs)
  is a wholly separate 1,614-line converter that **independently reinvented** the
  bag-of-named-slots / last-write-wins model (it never imports `extractEffects()`),
  and is a *worse* blind spot than regular powers: it **never reads `pvMode` or
  `resistible`** (0 `is_pvp`/`IgnoreResistance` matches → PvE/PvP + resistible twins
  collapse silently), has silent allowlist drops (Destiny `:415`/`:420-423`, Hybrid
  `:588`/`:591`), keep-one-largest (Interface `:774`/`:782`, Judgement `:868`), and
  Alpha first-attrib-only + sum (`:269-278`). The bug family has **already shipped
  here repeatedly** — [`incarnate-effects-completeness.test.ts`](src/utils/calculations/incarnate-effects-completeness.test.ts)
  pins empty-`{}` Rebirth core, dropped Clarion mez, 300% debuffResistance, 8×
  Hybrid inflation.
  **Correction after verifying the audit's "cheap oracle win" (2026-07-05, verify-don't-assume):**
  the DSH5 oracle diff is the WRONG tool for the converter drops — both its sides
  (Mids oracle ↔ parser export) sit **upstream** of `convert-incarnate-effects.cjs`,
  so it structurally cannot see a converter drop. Confirmed empirically: incarnates
  are **already in the DSH5 sweep** (975 export incarnate powers matched by
  `full_name`), and their 533 UNCLASSIFIED residuals across 159 powers are
  **dominated by the known DSH4 `aspect=Str`→Enhancement relabel** (e.g. Alpha
  `accuracy_common`: export `Accuracy` vs oracle `Enhancement`) — parser-faithful,
  not drops. **The real drop-catcher is a DSH6a-style detector comparing the export
  atomic list to the converter output** — exactly the tool that is blind to incarnates.
  - [x] Diagnostic: confirm parser fidelity for incarnates via the existing DSH5
    sweep — done; the incarnate residuals are the `aspect=Str` relabel + scope, not
    converter drops, so DSH5 is NOT extended for DSH8 and the export JSON is a
    trustworthy "truth" side for the detector below.
  - [ ] **Build the incarnate collapse-detector view** — compare `ingestExportPower`
    ([`atomic-effect.ts`](src/data/core/atomic-effect.ts)) atoms for each
    `exported_powers/incarnate/*.json` against the converter output
    ([generated `incarnate-effects.ts`](src/data/datasets/homecoming/generated/incarnate-effects.ts)),
    flagging calc-relevant atoms the converter dropped. The generated file's shape
    (`Record<slug, Record<stat, number>>`, no `Source: *.json`/`.effects`) is unlike
    `PowerEffects`, so [`dsh6-collapse-detector.cjs`](scripts/dsh6-collapse-detector.cjs)
    can't consume it as-is — needs a per-slot-type adapter (Alpha/Destiny/Hybrid/
    Genesis calc-feeding; Judgement/Interface/Lore/Genesis-exemplar display-only by
    design).
  - [ ] Fix confirmed drops in the **calc-feeding** slots and add `pvMode`/`resistible`
    awareness; reuse the DSH4 bridge rather than the parallel `ATTRIB_MAP`.
  needs: DEDUCTIVE_SCHEMA_HARNESS#DSH4
- [ ] **DSH9** — Extend the harness to the **Enhancement** pipeline (IO sets / set
  bonuses / procs / raw magnitudes). The audit found this splits into three
  sub-pipelines with very different exposure — and, unlike incarnates, the *data* is
  already in good shape; the gaps are the **extractors** and a **total absence of a
  Mids oracle**. Set-bonus data is already an atomic list `{stat,value,desc}`
  ([`io-sets.ts`](src/data/io-sets.ts)) and the Rule-of-5 calc has no collapse; proc
  data is already `ProcEffect[]` ([`proc-data.ts`](src/data/proc-data.ts)). But
  [`read_i12.py`](tools/mids-oracle/read_i12.py) reads **only** the I12 Powers section
  (`BEGIN:POWERS`→`BEGIN:SUMMONS`) and never opens `EnhDB.mhd`, so set-bonus and proc
  *values* are diffed against **nothing** from Mids —
  [`io-sets-bonus-keys.test.ts`](src/data/io-sets-bonus-keys.test.ts) only proves the
  two allowlists agree with *each other*, not with the game.
  - [ ] New `EnhDB.mhd` reader beside `read_i12.py` → the missing set-bonus/proc
    oracle (`MidsReborn-master/MidsReborn/Databases/{Homecoming,Rebirth}/EnhDB.mhd`
    present).
  - [ ] Converge the divergent parallel bridges onto the DSH4 `bridgeAttrib`:
    `ATTRIB_TO_BONUS_STAT` ([extract-rebirth-io-sets-v2.py](scripts/extract-rebirth-io-sets-v2.py) `:724`)
    + `ATTRIB_ASPECT_TO_EFFECT` ([extract-proc-data.py](scripts/extract-proc-data.py) `:51`)
    are duplicates of it.
  - [ ] Replace the value-keyed family collapse (`_resolve_bonus_effects` `:875-894` —
    a float-rounding split can leak or mis-collapse a per-type family) with
    identity-keyed grouping; fix the single-type mez-resist drop (`:715-718`) and the
    double-allowlist lockstep risk vs
    [`STAT_NAME_MAP`](src/utils/calculations/set-bonuses.ts).
  - [ ] Close the proc allowlist gaps: `applySingleProcEffect` `default:` drop
    ([character-totals.ts](src/utils/calculations/character-totals.ts) `:2345`) +
    typed-`Defense`-only-when-`'all'` drop (`:2194`); the `proc:false` silent-drop
    class (the ATO passive-global 6th piece).
  - **Raw enhancement magnitudes** (schedules/ED/exemplar in
    [`enhancement-values.ts`](src/utils/calculations/enhancement-values.ts)) are **not**
    an atomic-effect target — they're table lookups. Any validation there needs a
    value/table oracle, tracked under Deferred.
  needs: DEDUCTIVE_SCHEMA_HARNESS#DSH4
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
- Enhancement **raw-magnitude** value oracle — validating the hand-transcribed
  schedule / ED / exemplar tables
  ([`enhancement-values.ts`](src/utils/calculations/enhancement-values.ts)) against a
  Mids value/table source (`Maths.mhd`/`NLevels.mhd`). Low collapse exposure (table
  lookups, not an effect model), so it is not part of DSH9's atomic treatment;
  surfaced here so the scope boundary isn't mistaken for forgotten work.
