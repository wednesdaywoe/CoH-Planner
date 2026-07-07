---
project: coh-sidekick
kind: backlog
title: Open Items — consolidated backlog
created: 2026-07-07
supersedes:
  - docs/HOMECOMING_PARSER.md
  - docs/REBIRTH_PARSER.md
  - docs/THUNDERSPY_PARSER.md
  - docs/THUNDERSPY_SUPPORT_PROGRESS.md
  - docs/DEDUCTIVE_SCHEMA_HARNESS.md
  - docs/DEDUCTIVE_SCHEMA_HARNESS_ARCHIVE.md
  - docs/20240706_TASKS.md
  - docs/20240706_COMPLETED.md
  - docs/TODOs
  - GAME-DATA-PRINCIPLES.md
---

# Open Items

Consolidated from the retired `streams/*` running logs (2026-07-07). Every
open to-do, deferral, and known gap those docs still carried, deduped and
grouped by area. RESOLVED/SHIPPED work was dropped; only the follow-ups those
resolutions explicitly left open survive. Priorities are as the source docs
stated them (blank = unstated).

Legend: **[H]** high · **[M]** medium · **[L]** low · **[X]** exploratory /
uncertain-payoff · blank = unstated.

---

## 1. Re-export & regen hygiene (Homecoming)

**Cluster CLOSED 2026-07-07** — the staleness-guard catch-up re-export (same
day) had already refreshed `exported_powers/` (post-fix labels: `Silent_Kill`
207 / `Revoke_Power` 738 / `magnitude_expression` 10,530 HC files), and the
downstream cleanup pass finished the rest. `npm run regen` is byte-stable
against the committed `generated/`, closing the delay-sweep / pool-layer /
Focused-Accuracy "verify" bullets; all six `overrides/{power,epic}-pools.ts`
files (3 datasets) are already empty records, closing the dead-pin audit.
Workaround cleanup done: `convert-pet-entities.cjs` `extractLifespan` accepts
`Silent_Kill` (HC) + `Create_Entity` (Rebirth Parse6) — and its HC input was
repointed from the stale gitignored `tools/bin-crawler/exported_powers/live/`
tree to the committed manifest-guarded `exported_powers/` root (with a
sibling-dataset walk guard); `convert-incarnate-effects.cjs` index-123 comment
corrected (attrib detection covers Destiny/Lore silent grants only — Alpha's
shift lives on the boost, so filename inference stays); `extract-proc-data.py`
marker skips extended with the split labels (`Revoke_Power`, `Silent_Kill`,
`Set_Costume`, …) + missing `import json` fixed. Grant_Power consumers all
exact-match, so `Revoke_Power` can't be swallowed. 857/857 tests green.

Still open from this cluster:

- **Launch IO jump-buff bridge mislabel** — Re-running `extract-proc-data.py`
  (now possible on Linux via `COH_HC_ASSETS=…`) regenerates the Launch
  "Jump/+Jump Height" entry as `RunSpeed 200/1000` (bridge maps jump attribs
  to RunSpeed; its own validator says `want=Special`). Reverted — needs a
  verified jump-category mapping before adoption. All other proc outputs
  byte-stable.
- **Chain/max-targets fields in other converters** [L] — Regenerate
  `convert-pet-entities` / `reconvert-redirect-powersets` for
  `chain_target_expression`/`max_targets_expression` only if ever needed there.

## 2. Commit converter input for CI reproducibility (cross-dataset)

**CLOSED 2026-07-07 (verified already shipped).** `exported_powers/` is fully
committed — 36,130 files / ~313 MB, all three datasets, landed via
`9b17a20d4a` ("Implemented export guards") and merged to `main`. The payoff
loop exists end-to-end: `.github/workflows/regen-diff.yml` (on `main`,
path-filtered on `scripts/**` + `exported_powers/**` + `generated/**`) runs
`npm run regen:generated` and byte-diffs all THREE datasets' `generated/`
trees — so TSPY7's "add thunderspy to regen-all + CI regen-diff" is closed
too (`regen-all.cjs` defaults to `[homecoming, rebirth, thunderspy]`).
Verified this session: working-tree `generated/` clean after a full regen,
`export-staleness.test.ts` green. Residual:

- **Optional export shrink** [L] — drop ~10 unread template fields at export
  time to cut the committed tree's ~313 MB. Cosmetic/repo-size only; a shrink
  changes the exporter fingerprint, so it forces a full 3-dataset re-export
  by design.

## 3. Mode system (Set_Mode / modes_*) — cross-dataset

- **Data-driven linking of Set_Mode power to dependent conditionals**
  [lower value] — Replace the `STANCE_GROUPS` name-string heuristic with a
  data-driven link. The requires-based classifier already covers Bio/DP, so
  this is a refactor, not a gap.

## 4. `.powers` extraction-completeness audit (Homecoming)

- **Missing clean power-field captures** — Still absent, need parser reads +
  re-export: `TimeToRoot` (2,340 powers — animation lock, affects DPS/rotation),
  `StrengthsDisallowed` (951), `BuyRequires` (631).
- **Attrib name-map for `audit.py`** — Add `.powers`↔export attrib name-map to
  `tools/extraction-audit/audit.py`, then close genuinely-dropped exotic attribs
  (`*_Elusivity`, `revoke_power`, `grant_power`, `silent_kill`, `cancel_mods`,
  `set_costume`, `jump_pack`, `xp_debt_protection`, `null_bool`).
- **Phase 2 — converter completeness** — Diff `exported_powers` vs `generated`;
  ensure every mechanically-relevant template/field (incl. `requires_expression`
  gating) is emitted. Fold in `suppress_events` (parsed into
  `EffectTemplate.suppress_events` but not consumed). Only `fx` (cosmetic)
  remains genuinely unparsed.
- **`.powers ⊆ extraction` guard** [L] — Build once the sweep backlog is down.

> ## 5. Parser misalignment stragglers (Homecoming)

- **`Incarnate_I20.Airstrike.Main` empty** — Template-level parse failure
  (`eff_count=1`, single Judgement group's templates fail). Separate
  investigation from the systemic misalignment fix.

## 6. Knockback / Kheldian (Homecoming, deferred to the extraction audit)

- **Foe -KB protection not modeled** — Immobilize "can't be knocked" is excluded
  from offensive KB but not modeled as its own effect. Model after the audit.
- **`kheldian-form-variants.ts` left reverted** — Not regenerated; a regen
  carries unvetted converter deltas (a `tohitBuff` 0.5 removed, a
  `rechargeDebuff`/`Ranged_Slow` 0.2 added) needing source-verification first.
- **`homecoming/kheldian-form-variants.ts` is dead output** — checked
  2026-07-07: the file is an empty auto-generated `{}` (source
  `exported_powers/homecoming/kheldian_pets/{form}/*.json` never populated),
  and HC has no `kheldian-redirects.ts`-equivalent PowerRedirector table at
  all, so `InfoPanel`'s rebirth-only import has nothing to swap to on HC yet.
  Not a quick dataset-aware fix — genuinely blocked on HC Kheldian form
  modeling/extraction resuming first.

## 7. Kheldian form-redirect model (Rebirth — REB3)

- **"Current form" selector** — Add a selector to damage/info display driving
  which form's redirect target is shown (the underlying PowerRedirector model
  in `src/data/datasets/rebirth/kheldian-redirects.ts` is already shipped).
- **Audit HC's extracted redirects for other mis-modeled powers** — snipe
  quick/interruptible, Bio Armor adaptations.
- **Native Parse6 redirect parse** [L, deferred] — Extract form-redirect data
  natively from `powers.bin` post-effects tail (currently discarded by
  `_parse_power_parse6`'s `skip_to_end()`) instead of the hand-curated map.
  Format is a flat RPN string-array, not HC's `(target, condition_array)` shape —
  real RE. Notes in `project_parse6_redirects` memory. Restart hint: dump
  Glinting_Eye / Gleaming_Blast / Solar_Flare tails in parallel for a pattern.
- **Other Kheldian verification** — (1) diff powercat dumps vs generated
  powersets for new/removed powers in Rebirth's Luminous_Blast / Luminous_Aura /
  Umbral_Blast / Umbral_Aura; (2) check whether Cosmic Balance / Dark Sustenance
  inherent formula or trigger changed; (3) research the
  `kPeacebringer_Blaster_Mode` / `kPeacebringer_Tanker_Mode` role-mode flags
  (orthogonal to Nova/Dwarf).

## 8. Other Rebirth items

- **REB2 — Rebirth-unique power pools** — Extract Rebirth-only/reworked pools
  beyond the standard 13; `generated/power-pools.ts` exposes only the 13.
  Compare bin-crawler powercat dump vs live `bin_powercategories.pigg`
  (`parser/_powercats.py`), cross-ref wiki, spot-check `.mbd`; likely update the
  standard-13 filter gate in the counterpart to `scripts/convert-pool-powers.cjs`
  and regenerate.
- **Exclusivity suppression rules not honored by calc** — Rebirth's runtime
  suppression (e.g. Aerobatics suppresses Acrobatics/Weave) is captured in pool
  descriptions but the stat calc probably doesn't honor it. PARTIALLY ADDRESSED
  2026-07-07 (§3): the `modes_suspended`-driven suppression matrix
  (`src/utils/mode-suppression.ts`) now honors mode-based suppression where the
  data carries it (Granite → Stone toggles). Rebirth exports almost no
  `modes_suspended` (only 2 files), so Aerobatics-style pool suppression is NOT
  covered by this — it isn't encoded as a mode there. Would need the pool
  descriptions parsed into explicit suppression rules, or a Rebirth data source
  that carries the modes.
- **Parse6 CopyBoosts/PseudoPet tail decode** — `CopyBoosts`/`PseudoPet` live in
  the not-yet-decoded post-magnitude tail; Parse6 template parser decodes no
  `flags` at all, so Rebirth pets get no `copyBoosts`. Do it if a Rebirth
  summon's pet DPS is reported wrong.
- **Rebirth stealth suppression (conditional re-apply)** — `STEALTH_SUPPRESS_LEAVES`
  max-wins fix was built then reverted to additive; re-apply ONLY if live Rebirth
  is observed max-wins.
- **Rebirth "Accurate Defense Debuff" set** — Call Jounin's missing set proven a
  genuine Rebirth client `boostsets.bin` omission; parked pending live-client
  confirmation (REBIRTH_PARSER.md §1).
- **Inexhaustibility Rest-proc** — Rest-proc Heal/+End/+Regen not surfaced
  numerically (planner doesn't model "while resting" procs). Set is slottable,
  labeled `Rest Buff`.
- **HEAL-ABSORB-AND-EXPORT-GAPS.md (missing doc)** — Referenced note now absent
  from tree: IO-set aspect/Absorb export gaps still open.

## 9. Thunderspy

- **TSPY1 — refine damage element labels** [L] — Multi-type powers collapse to
  primary element (`DMG(Energy/Toxic)`→Energy); powers whose tooltip lacks
  `DMG(...)` (Pale Wind) stay `Special`. Magnitudes correct; label-only. A
  `display_help` prose-parse fallback is possible but fragile.
- **TSPY2 — backfill ~40 missing icons** — Lore-pet / NPC-group
  (`banishedpantheon_*`, `tsoo_*`), enhancement (`e_icon_*`), archetype
  (`archetypeicon_*`) icons absent from every local Sweet Tea pigg. Sourceable
  from HC texture piggs via `--assets-dir <…/Homecoming/assets/live>`. See
  `scripts/extract-thunderspy-icons.py`. *(Also tracked in `streams/TODOs`.)*
- **TSPY3 — 92 powerset records (1.4%) fail to parse** — Likely a fourth rare
  layout variant. "Not investigated."
- **TSPY4 — populate `pet-lifespans.json` / `self-destruct-delays.json`** [L] —
  Still 0 entries. Lifespan lives on each pet's bundled `Self_Destruct` power as
  a `Silent_Kill` delay; the tspy `Self_Destruct` powers either aren't reached or
  don't carry the delay in the shape `extractLifespan` expects. Affects only
  temp-pet despawn timing.
- **TSPY5 — Thunderspy archetype-stats test** — Mirror the HC one;
  `src/data/archetype-stats.test.ts` covers HC/Rebirth only. *(Same item noted
  as a TODO in THUNDERSPY_PARSER.md's `_classes.py` entry.)*
- **TSPY6 — extract effect-template tail fields** — `cancel_events`,
  `suppress_events`, stacking metadata. Variable tail layout; planner-needed
  math fields already extracted, so this is extra coverage.
- **TSPY7 — add thunderspy to `regen-all.cjs` + CI regen-diff** — **CLOSED
  2026-07-07 (verified already shipped):** `regen-all.cjs` defaults to all
  three datasets and `regen-diff.yml` byte-gates the thunderspy `generated/`
  tree on `main`. *(See §2.)*
- **TSPY8 — code-split dataset bundles** [L, perf-only] — All 3 datasets ship in
  one ~14 MB chunk (drove the deploy heap bump to 6144 MB); a dynamic-import
  split would cut initial page weight. Explicitly not a scaling need.

## 10. Deductive Schema Harness residuals

- **DSH6 — retire `unresistable` / `durationVariants` bolt-ons** [~, deferred] —
  Neither is independently retireable: each projects multiple atomic records into
  one single-value `PowerEffects` slot, so retiring them needs the full
  "`PowerEffects` becomes a list" rewrite (`extractEffects()` ~L3369 in
  `scripts/convert-powerset.cjs`). Fixes no observable bug (detector green);
  deferred until a new collapse site surfaces. `selfPenalty` already done.
- **DSH6 — CONDTAG allowlist extension** — `SURFACEABLE_TARGET_TAGS` in
  `_classifyConditionalGate` maps only `Electronic → Machines/Robots`;
  Undead/Demon/Ghost/Human/Generator are candidate additions pending per-power
  verification.
- **DSH7 — on-demand disputed-number adjudication only** [L, advisory] — Full
  numeric sweep + numeric CI intentionally descoped (Mids quantizes scale to 3
  decimals → permanent sub-1% noise). Remaining: resolve a *specific* disputed
  number (`scale × modifierTable` vs `AttribMod.json`) when a concrete case
  needs it. Not a sweep, not CI, not a standing worklist.
- **DSH8 — coverage-only residuals** [deferred, non-gating] — Class-absent
  incarnate slots not swept: Alpha/Genesis (single-aspect enhancement) and
  Interface/Judgement/Lore (proc/nuke/pet). Structurally collapse-free per the
  doc but not verified by a detector.
- **DSH9 — enhancement raw-magnitude oracle** [L] — Validate hand-transcribed
  schedule/ED/exemplar tables in `src/utils/calculations/enhancement-values.ts`
  against a Mids value/table source (`Maths.mhd`/`NLevels.mhd`). Table lookups,
  not atomic-effect targets, so excluded from DSH9's atomic treatment. Includes
  the P1:10 / P2:8 rows queued in `tools/mids-oracle/enh_oracle_mapping_gap_worklist.{json,md}`.
- **Surface PvP values in planner UI** — `pvMode` is in the schema/harness (so
  PvE can't be clobbered) but exposing a PvP view is a separate product
  decision.
- **Loud strict-mode for silent parse-failure swallow paths** [diagnostics only]
  — Make the two swallow paths in `tools/bin-crawler/bin_crawler/parser/_powers.py`
  (~L764, ~L878) loud under a strict flag so an unparseable PvP twin can't vanish
  before JSON. The only sanctioned parser change here; full rewrite is a non-goal.
- **Run Mids headless for a golden JSON DB (`SaveJsonDatabase`)** — Reserved for
  if a Windows/dotnet box appears; rejected as primary path (WinForms/dotnet
  unavailable on Linux). Not on critical path.

## 11. Pseudo-pets, procs, flags (Homecoming, non-blocking)

- **Granted-DoT per-attack DPS folding** — Bio Armor adaptation toxic proc +
  the +Damage-buff grants (Power Siphon, Reach for the Limit, Perfection of Body)
  stay on the Mechanic-Adjuster surface only; folding the granted DoT into
  per-attack DPS is a separate calc feature.
- **Smaller pseudo-pet gaps** [L] — Burn's Fiery-Embrace bonus patch toggle;
  Voltaic Sentinel's secondary bolt component under-count; base-aura face-value
  AoE fuzziness.
- **PseudoPet + CopyCreatorMods flag bits** — Emitting `PseudoPet` flips
  `summon.isPseudoPet` on ~68 powers (Power-Info display); belongs with the
  pseudo-pet resolution work. `CopyCreatorMods` decoded but unconsumed. Both
  documented (commented out) in `_FLAG2_BITS`. Lower bits 0x1/0x2 undecoded.

## 12. Epic pool gating (from `streams/TODOs`)

- **HC/Rebirth epic still on the rank heuristic** — Not fully data-driven.
- **Rebirth patron-`Owned?` gates unmodeled**.
- **tspy epic export has 2 mis-ordered pools** — Harmless now.

## 13. Spot-checks (low priority, in-game verification)

- **Gang War summon count** (9 / Rebirth 10) — Chance-weighted EV; in-game
  spot-check.
- **Remote Bomb / Traps damage** — Values from the generic `Remote_Bomb_Info` /
  "Temporal Bomb" display power; in-game spot-check.

## 14. Launcher (from `streams/TODOs`, optional)

- **HTTP/2-505 mitigation** [optional] — If a browser genuinely leads with an
  HTTP/2 preface, the durable fix (fresh port, or an `Alt-Svc: clear` header on
  Bin Crawler responses) is unimplemented.
