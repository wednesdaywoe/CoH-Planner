# Game-Data Rules

Rules for working with City of Heroes game data across every binary-sourced domain
(powers, archetypes, enhancements, IO sets, AT tables, pet entities, incarnates).

Issue log: [streams/HOMECOMING_PARSER.md](../streams/HOMECOMING_PARSER.md); DSH harness log:
[streams/DEDUCTIVE_SCHEMA_HARNESS.md](../streams/DEDUCTIVE_SCHEMA_HARNESS.md). Both tracked.
Structural model: [COH-DATA-MODEL.md](../COH-DATA-MODEL.md). Setup: CLAUDE.md.
Parser usage, accuracy, binary layout: [docs/bin-crawler.md](../docs/bin-crawler.md).

---

## Provenance

Nothing here is invented advice. Every rule below is a recorded failure, and several of them
shipped wrong numbers under green gates for months. Where a rule reads as paranoid — "a blank
where a number belongs is an INVALID run, not a green one" — that is scar tissue, not caution.

Weigh this against your priors accordingly: when this file contradicts what usually works in a
codebase, it is reporting what actually happened here.

The incidents themselves live in three places, and only two of them travel:

- [docs/ISSUE-REGISTER.md](../docs/ISSUE-REGISTER.md) — beta's own code: the JS display/calc
  layer, the vendoring seam, the converters that diverge from canonical on purpose. Forward-only
  from 2026-08-12; it does not backfill.
- `docs/DATA-GAP-REGISTER.md` **in canonical** — the parser and export lineage, which this repo
  vendors rather than owns. Most of what produced §§1–9 is recorded there.
- [streams/HOMECOMING_PARSER.md](../streams/HOMECOMING_PARSER.md) — the running log the source
  comments cite, now tracked. It is the only place most of §§1–14 can be traced to, and the rules
  here do not carry the incident id inline the way canonical's do, so getting from a rule to its
  cause still means searching the log by symptom.

**This file has itself been wrong**, which is the sharpest reason to check it against an oracle
rather than quote it. Its override guidance was *inverted* until 2026-06: it held that
`generated/` was a stale 2019 CoD2 snapshot and that the overrides layer carried the current
values. That shipped as authoritative; correcting it retired ~2,000 lines of stale pins
(DIVERGENT 140 → 9) — see [src/data/README.md](../src/data/README.md). A rule here outranks your
priors. It does not outrank an oracle diff.

## 0. Standing principal

- Prefer the option that makes the planner more data-driven.
- Prefer fixing root causes over quick fixes; prefer consolidating sources of truth over
  hand-curated entries and overrides.

## 1. Capture everything mechanical

- Capture and surface everything that affects *what a power does*: effects, attribs,
  tables, scales, magnitudes, durations, stacking, conditions/`Requires` gates, flags.
- Skip only asset/presentation references: `VisualFX`/`.PFX` paths, animation `include`s,
  combat-text message IDs, icon internals.
- Never classify data as "not relevant to a build planner" without proof.
- When you find a gap, identify its layer first:
  1. **Parser/export** — data absent from `exported_powers/` (requires re-extraction).
  2. **Converter/calc** — data present but not emitted or not honored (source-only fix).

## 2. Verify, don't assume

- Prove any claim of "moot," "already handled," or "irrelevant" against the data.
- A suspiciously high or low count means you are matching the wrong thing; inspect 3–5
  concrete examples before concluding.
- Trace one case end-to-end (source `.powers` → `exported_powers` → `generated` →
  calc/display) before generalizing a fix.
- Treat in-file claims that data is "vestigial," "never read," "safe to ignore," or
  "handled elsewhere" as hypotheses; grep to confirm. Fix the false comment in the same
  change.
- When reusing a helper in a new context, read its output diff by hand for that context.
  A green gate proves the helper's own invariant held, not that its buried assumptions
  apply where you now call it.

## 3. Effect discriminators

An effect is distinguished from its neighbours by a fixed set of discriminators (aspect,
sign, target, `pvMode`, `IgnoreStrength`, …). A match keyed on the wrong axis collapses
two different effects.

- **Exclude `aspect=Strength` with `scale=0`** — these are strength-definition meta-
  templates, not real effects.
- **Discriminate by aspect, not attrib name.** `aspect=Resistance` templates using
  `*_Dmg` / `Base_Defense` / `ToHit` attribs are -Resistance debuffs or debuff-resistance,
  not player buffs.
- **Exclude procs and pets** from "the player's enhanceable effect" analysis: chance-based
  (`chance < 1` or `ppm`) groups are procs; `pets`/`*_pet` category powers have their own
  modifiers.
- **Knockback:** positive-magnitude `aspect=Current` is offensive KB (emit as `knockback`);
  `aspect=Resistance` or negative scale is KB protection applied to the foe.
- **Mez tables:** prefer PvE over `*_PvPMez`. A small allowlist grandfathers genuinely
  PvP-only powers.
- **Conditional `group` ≠ `mode`.** `group` makes siblings mutually exclusive; `mode`
  controls replace-vs-add. They are orthogonal. Grouped conditionals default to
  **additive**; emit `replace` only when a base template negates the conditional's own
  predicate (`baseNegated`).
- **Compound gates:** run `_isUntoggleableGate` on `_stripIgnoredClauses(req)`, never the
  raw expression. Strip ignored clauses first, then classify what remains.
- **Decode absence as absence.** Never default a missing field to a plausible value —
  use a distinct `Unspecified`/`undefined`. Then verify no consumer reads that default as
  a wildcard.

**Validated discriminator for "the player's own enhanceable stat":**
`aspect ∈ {Current, Absolute, Magnitude}`, non-proc, non-pet, positive scale
(sign separates buff from debuff/protection).

## 4. `IgnoreStrength` / `IgnoreResistance` / `IgnoreCombatMods`

- Captured in `template.flags`. An effect carrying it must not be boosted by the matching
  enhancement or global buff.
- Only split effect types that the calc actually enhances. Verify per type: `recoveryBuff`
  and `tohitBuff` are enhanced → split to `…Unenhanced` keys. `rechargeBuff`, `absorb`,
  `enduranceGain` are not → no split.
- Split pattern: route to `XBuffUnenhanced` (mirror `regenBuffUnenhanced`), add to the
  global total without the enhancement multiplier, and add the key to `CASTER_BUFF_KEYS`.
- Open issue: non-regen `IgnoreStrength` templates in `activation_effects` are dropped;
  a genuine-vs-duplicate discriminator is still needed.

## 5. Verify against an oracle

- `raw defs/` (`.powers`) is ground truth for powers. Use `tools/extraction-audit/`
  (`parse_powers.py` + `audit.py`) to diff `.powers` vs `exported_powers` proactively.
  The attrib side needs a `.powers`↔export name-map (`kDefense` = `Base_Defense`,
  `kSpeedFlying` = `FlyingSpeed`, …) before its numbers are trustworthy.
- Every domain has an oracle. For derived or previously hand-ported data (archetypes,
  IO sets) there are two — the hand-port and the binary. Diff both.
- **A sibling code path is a free oracle.** The five power-shaped converters
  (`convert-powerset`, `convert-pool-powers`, `convert-epic-pools`,
  `convert-incarnate-effects`, `convert-pet-entities`) process the same data shape; when
  one is more complete, diff against it. Divergence between parallel paths hides bugs as
  readily as it reveals them — it is only an oracle once you diff.
- **A self-consistent pipeline proves nothing.** Only an independent oracle diff catches a
  silent drop.
- **Diff the whole export, not the reported power.** Keep a cheap effect-count parity sweep
  (CoD2 archive vs export) and run it after any parser change.
- **Count deep on both sides** (recurse `child_effects` + `activation_effects`) before
  believing a mismatch — nesting differences are false positives.
- **Fail loud.** No `try/except pass` around struct reads. Swallowed parse failures must
  log the power name and what was dropped.

## 6. Re-export workflow

- Export to a scratch dir first and diff against committed `exported_powers/` before
  committing.
- Homecoming assets: `G:\Homecoming\assets\live`
- Rebirth assets: `G:\Thunderspy Gaming\Sweet Tea\rebirth`
- Command: `py -3 -m bin_crawler.export_powers --assets-dir <dir> --output-dir <scratch>`
- A universal new field touches nearly every power JSON; confirm the only non-field changes
  are benign.
- A re-export also pulls unrelated game-data drift. For a focused commit, keep only the
  target files and `git checkout` the rest, or call out the incidental refresh explicitly.

## 7. Cross-server formats: HC Parse7 vs Rebirth/Thunderspy Parse6

- **Design converter features key-based, not structure-based.** Anything keyed off `Tag`s
  or the `EffectGroup` wrapper silently no-ops on Rebirth.
- **HC (Parse7):** nested `EffectGroup`s carrying group-level `Tag`, `chance`, `is_pvp`.
- **Rebirth/Thunderspy (Parse6):** flat AttribMods in synthetic single-template groups.
  No group-level `Tag`; `chance` derived from `tick_chance` (a `0 → 1.0` default hides
  HC's chance-0 gating); `is_pvp` synthesized from the `enttype` clause in per-template
  requires.
- Both formats land the same effect **keys** in base — attribute by key for cross-format
  features.
- **A relabel cannot reconstruct a dropped discriminator.** Thunderspy drops AttribMod
  `aspect` and per-template `target`; routing by sign alone mislabels resistance as buff
  and foe-effects as self-buffs. Structural/additive diffs pass while semantics are wrong.
- **Run an adversarial audit on any relabel or recovery**, not just a structural diff.
  Assign independent skeptics one lens each ("find a wrong buff," "find a dropped effect,"
  "find a leak").
- **shortHelp / `target_type` are legitimate as a VETO, never as a source.** Take value
  (scale/table/sign/duration) from the binary; use text only to reject false positives.
- **Consult `targets_affected`, not just `target_type`.** A pet-only `targets_affected`
  means no effect on that power is a caster buff — but it under-reports, so a
  Self-advertised stat in shortHelp survives.
- **Prove which attrib field is authoritative per effect kind.** Thunderspy's front attrib
  is an enhancement/duration category; the post-`requires` index array is the applied
  attribute. Never blanket-swap. Also cross-check magnitude: the real value may ride the
  post-table slot (k+12 float) while the header `magnitude` is a placeholder.
- **Mez sign rule, scoped:** skip negative-scale mez on non-`Res_Boolean` tables only.
  Protection rides `*_Res_Boolean` at any sign, and `isProtectionMez` re-reads it.

## 8. Determinism

`generated/` is committed and CI re-derives it.

- Sort `readdir` results (NTFS is alphabetical, ext4 is hash-order).
- No timestamps or run-varying content in codegen headers.
- Remove stale duplicate source files (e.g. `enervating__field.json`).

## 9. Guard rails in place

- **CI** (`.github/workflows/ci.yml`): `npm run lint` (`tsc --noEmit`) then `npm test`
  (`vitest run`).
- **When you fix a data/extraction bug, add a focused test** that loads the power from the
  dataset and asserts the fixed shape.
- **regen-diff CI** (`.github/workflows/regen-diff.yml`): rebuilds `generated/` from
  committed `exported_powers/` and asserts byte-equality. **Blind spot:** scoped to
  `generated/` only — `at-tables`, `pet-entities`, `kheldian`, and `index` outputs are not
  covered; diff those by hand.
- **converter-invariants test** (`src/data/converter-invariants.test.ts`): export-name ===
  internalName, no bare `specialBuff`, no `0xFFFFFFFF` sentinels, no new PvP-mez.
- **Committed `exported_powers/` + `raw defs/`** keep regen and oracle-verification
  available without the `.pigg`/Python pipeline.
- `npm run regen` rebuilds everything; `npm run regen:generated` rebuilds only what the
  guard checks.

## 10. Foe-facing effects are first-class

- Weight a gap by the completeness and correctness of the power's advertised behavior, not
  by whether it moves the player's own dashboard.
- A missing foe-debuff component is not low-priority.
- Prefer the root fix (capture the dropped field, §1) over a heuristic.

## 11. IO sets

Both servers' `io-sets-raw.ts` are generated by
`scripts/extract-rebirth-io-sets-v2.py --dataset <id>` from `boostsets.bin` + `powers.bin`.

- **Bonus value = `scale × per-attrib multiplier`:** damage buff ×250, max HP ×10, max
  endurance ×1, everything else ×100.
- **Bonus `stat` keys must be planner-canonical** or they are silently dropped. Emit
  `damage_resistance_(cold)`, `maximum_hitpoints`, `mez_resistance_(all)` — not
  `cold_resistance`, `maxhp`, or per-type mez resistance. Guarded by
  `io-sets-bonus-keys.test.ts`.
- **Paired stats: emit one member only.** PAIRED_STATS auto-applies to both halves of S/L,
  F/C, E/N, P/T resistance, S/L, F/C, E/N defense, and recharge-debuff↔slow. Keep the
  alpha-first member.
- **Derive effective aspect count from enhancement scale**, not list length or name
  segments: `scale = getMultiAspectModifier(count) × rarity(1.25 for purple/Superior)`.
  Invert to set `totalAspects`.
  - Heal/Absorb caveat: the binary treats them as one slot. List-length excess on healing
    pieces is cosmetic, not dilution. `getEffectiveAspectCount` collapses the pair at
    runtime; emit `totalAspects` only when derived > list length. Guard:
    `src/data/io-sets-heal-absorb.test.ts`.
- **Enhancement aspects are `aspect=Strength` with positive non-zero scale.** Negative-scale
  Strength templates are proc debuffs/conversions. Procs are detected by chance<1 / ppm>0.
- **Always-on global pieces must be flagged `proc: true`** or `collectAlwaysOnProcs` drops
  the global. Audit: every `type:"Global"` PROC_DATABASE entry's set must have at least one
  `proc:true` piece. Guard: `src/data/synapses-shock-proc.test.ts`.
- **Known unmodeled set globals (calc no-ops, not flag bugs):** ATO crit bonuses
  (Scrapper's Strike, Critical Strikes) resolve to `category:"Special"` with no value;
  Hypersonic "+Fly Magnitude" and Experienced Marksman "Range" have no PROC_DATABASE
  entries and unsupported categories. Modeling these is a feature, not a data fix.
  Supported proc categories: Recovery, Regeneration, Endurance, Heal, MaxHP, Defense,
  Resistance, ToHit, Recharge, RunSpeed, MezResist, SlowResistance, RechargeResistance,
  KnockbackProtection, Stealth.

## 12. Deriving structured non-power data (archetypes, classes, …)

- **Anchor on a known-value field, then read siblings at fixed byte-deltas** verified
  across every record. Don't fully decode the struct.
- **Use per-record variation as the fingerprint.** Distinctive values (resistanceCap 0.75
  vs 0.90) give unambiguous deltas; flat values match many positions — disambiguate via
  distinctive siblings or accept a constant.
- **Count-prefix vs value offset:** a count-prefixed array is `[u4 count][N floats]`; its
  last value is at `prefix + 4 + (N-1)*4`. Measure deltas prefix-to-prefix.
- **Parameterize byte-deltas per format** (`_ATTRIB_LAYOUT["parse7"|"parse6"]`). Never
  hardcode offsets.
- **Verify against both the hand-port and an independent reference.** A mismatch is a
  finding — determine whether it's an extraction bug or real game drift, then confirm
  against CoD2 or in-game.
- **Confirm which artifact a field lives in.** A fingerprint search that finds nothing is
  proof the data is elsewhere (AT scalars — damageModifier, buffDebuffModifier, baseThreat,
  damageCap boosts — are in AT damage tables / inherent powers, not `classes.bin`). Don't
  force a fragile delta onto absent data.
- **Guard derived data with a runtime==export test** (mirror `archetype-stats.test.ts`,
  `io-sets-*.test.ts`), since layered outputs aren't covered by regen-diff.

## 13. Overrides

`datasets/<server>/overrides/`, merged by `withOverrides`. An override written against a
stale source inverts once the source is fixed — it then freezes the old value on top of
correct data.

- **Test `generated == oracle`, not "is the override stale."** If generated matches the
  oracle, the override is a stale pin — drop it regardless of its value.
- **Scalar agreement is a cheap correctness proxy.** If accuracy/range/recharge/arc all
  match the oracle, that power's damage and effects are almost certainly faithful.
- Where the `.powers` snapshot lacks a category (Peacebringer, some EAT epics), use a fresh
  Bin Crawler parse of the live `.pigg` as substitute oracle — diff it against committed
  `exported_powers` to confirm currency first.
- **Normalize units and shape before declaring a divergence.** `.powers` stores cone `Arc`
  in degrees, binary/`generated` in radians (`arcToDegrees` has a `≤2π → radians`
  heuristic that misreads genuinely small degree values). The converter may also re-key an
  effect (per-group `durations` vs per-mez).
- **Keep genuine parser-gap enrichments.** Discriminate by which side matches the oracle:
  generated-matches-oracle ⇒ stale pin (drop); override-matches-oracle while generated is
  missing/wrong ⇒ real correction (keep, and log the parser gap in HOMECOMING_PARSER).
- **Chase "table not found → fallback" warnings to the source.** Silent fallbacks
  substitute a flat default that is wrong in both directions. A recurring warning is
  usually an allowlist/extraction gap on a real table. Route through the deduped
  `warnFallback` helper.
- **Update the prose in the same change.** When you change what data means — source
  swapped, pins retired, a field's authority moved — grep every comment, README, and
  override header describing the old meaning and fix it.

## 14. Verify the gate, not just the result

- **State what a gate cannot see before citing it green.** The question is not "could this
  gate observe a bug?" but "could it, given its sweep?" Write down which datasets,
  categories, and directions it excludes. Print per-partition coverage so a structural zero
  stays visible instead of hiding inside a corpus total.
- **Mutation testing cannot close a coverage hole.** It proves the gate's checks are live;
  it says nothing about its sweep. Both questions must be answered separately.
- **Mutation-test every gate you rely on:** break each reconstruction axis in turn and
  confirm the gate goes red.
  - **Print counts, and one mutant per axis.** Cross-check each mutant's kill count against
    an independent census of the population it should hit. A mismatch means the gate tests
    something other than what you think.
  - **Never `catch { continue }` around the gate body.** Require a literal count line; a
    blank where a number belongs is an INVALID run, not a green one.
  - **Check both directions.** Atom-derived values must reproduce the bag *and* the bag
    must contain no value the atom invents; a one-directional gate is blind to
    over-production.

---

*Add new gotchas and principles here, not just to commit messages. State them generally
across data domains; keep examples concrete but minimal.*