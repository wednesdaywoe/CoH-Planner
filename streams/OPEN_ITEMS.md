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

The largest cluster: the committed `exported_powers/` + `generated/` still
carry pre-fix labels from parser work that shipped without a full re-export.
These want a coordinated de-risk re-export pass, not piecemeal edits.

- **attrib-118 root-fix regen + workaround cleanup** — Committed data still
  carries pre-fix labels (Set_Mode 692 / Grant_Power 1316 / Create_Entity 1383
  files). Re-export, then delete the now-obviated downstream collision
  workarounds in `scripts/convert-pet-entities.cjs` ("Silent_Kill labeled
  Create_Entity"), `scripts/convert-incarnate-effects.cjs` ("index 123
  collapses Recharge/Vision/Ninja"), and `extract-proc-data.py` special-attrib
  exclusion lists. Verify `Grant_Power` converters don't swallow the newly-split
  `Revoke_Power`. Same batch as the `magnitude_expression` re-export below.
- **`magnitude_expression` staleness** — Committed HC data lacks snipe/foresight
  scaling expressions a fresh export now produces. Full re-export due (separate,
  user-reviewed change).
- **Broader `delay`-consumer re-conversion sweep** — The non-kExpression `delay`
  offset fix touched 227 templates; other `delay` consumers (proc PPM activation
  gating, delayed-debuff effects) may have silently read 0. Worth a broad
  re-conversion sweep.
- **Dead-pin audit for pool/epic overrides** [M] — Now that the pool/epic
  generated layer is current, `overrides/power-pools.ts` /
  `overrides/epic-pools.ts` entries pinning values the converter now produces
  natively are candidate dead pins (MSOT-4-style audit).
- **"Bring pool layers current" pass** — Deferred `epic-pools`/`power-pools`
  regen whose committed output predates the foe movement-`slow` extraction fix.
  May be partly closed by the later `regen-all --apply` fix — verify overlap.
- **Focused Accuracy / powerset accuracy powers** — Combat Training: Offensive,
  Eagle Eye, Terra Firma, etc. noted "Not done"; may overlap the later
  specialBuff-regen — verify.
- **Chain/max-targets fields in other converters** [L] — Regenerate
  `convert-pet-entities` / `reconvert-redirect-powersets` for
  `chain_target_expression`/`max_targets_expression` only if ever needed there.

## 2. Commit converter input for CI reproducibility (cross-dataset)

- **Commit `exported_powers/` so CI can regen + byte-diff** — The heavy half of
  the reproducibility fix. Decision (2026-06-03) was to commit the full ~233 MB
  / ~25k files for both datasets so a fresh clone / CI can run converters
  end-to-end and byte-diff `generated/`. Optional later shrink: drop ~10 unread
  template fields at export time. (The `_export_manifest.json` fingerprint guard
  shipped 2026-07-07 mitigates staleness but is not the same as committing the
  input.) *Related: TSPY7 below.*

## 3. Mode system (Set_Mode / modes_*) — cross-dataset

**Mostly RESOLVED 2026-07-07.** The Rebirth/Thunderspy work uncovered that the
Parse6 power-tail parse was mislabeled AND misaligned (see §5 — same fix):

- ~~Rebirth (Parse6) / Thunderspy mode name tables~~ — DONE. `parse_mode_table`
  gained a Parse6 variant (sub-array walk anchored on `ServerTrayOverride`);
  Thunderspy's Parse7-wrapped table parsed with the existing heuristic. All
  three servers resolve (HC 214 / Rebirth 139 / tspy 123 modes), and
  `modes_required/disallowed/suspended` + Set_Mode `mode_name` are now emitted
  in all three exports. Byte-verified against known powers (TW Follow_Through
  requires FastMode, White_Dwarf_Step requires Peacebringer_Tanker_Mode,
  Energy_Flight disallowed in the four form modes, DP ammo toggles).
  NOTE: Thunderspy's binary has NO ModesSuspended slot (its tail is
  GM/req/dis/AIGroups/Redirect); Rebirth has no redirect array before effects
  (REB3's post-effects tail stands).
- ~~Mode STAT-EFFECT extraction [X]~~ — CLOSED, confirmed pure flags: every
  mode record in `attrib_names.bin` is (name, display) only; all 139 Rebirth
  records carry an all-zero trailing word. No stat payload exists.
- **Converter consumption of `modes_*`** [re-scoped] — The original "match
  Bio/DP conditionals by mode name" is already covered by the requires-based
  classifier (`k<Name> Source.Mode?` → conditionalEffects) on all three
  servers, verified in Rebirth generated Bio Armor output. What the new fields
  would still enable, both product-level features rather than data gaps:
  (a) power availability gating by caster mode (`modes_required`:
  Domination/form/Momentum-gated powers — planner currently doesn't grey these
  out); (b) a "what's active" suppression matrix from `modes_suspended`
  (HC Stone Armor toggles under Granite; overlaps §8's Rebirth exclusivity
  item). Also possible: data-driven linking of the Set_Mode power to its
  dependent conditionals (replace the name-string heuristic).

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

## 5. Parser misalignment stragglers (Homecoming)

- **`Incarnate_I20.Airstrike.Main` empty** — Template-level parse failure
  (`eff_count=1`, single Judgement group's templates fail). Separate
  investigation from the systemic misalignment fix.
- ~~Rebirth Parse6 empty-effects powers~~ — **RESOLVED 2026-07-07** (fell out
  of the §3 mode work). Root cause: `_parse_power_parse6` read a phantom
  "RechargeGroup" array and misread AIGroups (an inline-pascal string_array on
  Rebirth, e.g. `kEarlyBattle` on pet powers) as a u4_array — any power with a
  non-empty AIGroups misaligned the reader and silently lost its whole effects
  array. Not just the 109 pets: **2,583 Rebirth powers** (12%) had 0 effects;
  now 0. Same fix gave Thunderspy its Redirect struct_array (identical element
  shape to HC's `_parse_redirects`) — 70 tspy powers (snipes, TW momentum
  attacks, assassin strikes, Water Jet, Nature Rebirth) now export
  `redirect` and their generated output resolves through it (tspy snipes
  finally have damage). All three datasets re-exported, regen + 836 tests +
  DSH gates green.

## 6. Knockback / Kheldian (Homecoming, deferred to the extraction audit)

- **Foe -KB protection not modeled** — Immobilize "can't be knocked" is excluded
  from offensive KB but not modeled as its own effect. Model after the audit.
- **`kheldian-form-variants.ts` left reverted** — Not regenerated; a regen
  carries unvetted converter deltas (a `tohitBuff` 0.5 removed, a
  `rechargeDebuff`/`Ranged_Slow` 0.2 added) needing source-verification first.
- **`homecoming/kheldian-form-variants.ts` is dead output** — `InfoPanel`
  imports the rebirth map unconditionally; make the lookup dataset-aware when
  modeling resumes.
- **DNA Siphon mode-gated heal bonus** — Defensive +0.375 heal (a
  heal-via-`damage` entry) doesn't surface in the Adaptation
  `conditionalEffects`; the heal-from-damage and mode-conditional paths don't
  meet. Base heal correct; only the mode bonus is under-shown.

## 7. Kheldian form-redirect model (Rebirth — REB3)

- **Replace auto-grant with PowerRedirector model** — Planner wrongly
  auto-grants form-variant powers as separate picks; correct model keeps slots on
  the base human power. Steps: add `KHELDIAN_REDIRECTS` table in
  `src/data/datasets/rebirth/`; replace auto-grant in
  `src/data/datasets/rebirth/granted-powers.ts` + form sub-power UI; add a
  "current form" selector to damage/info display; audit HC's extracted redirects
  for other mis-modeled powers (snipe quick/interruptible, Bio Armor
  adaptations).
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
  descriptions but the stat calc probably doesn't honor it (needs a runtime
  "what's active" suppression matrix).
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
  from tree: IO-set aspect/Absorb export gaps + the Guardian AT (Rebirth-only)
  missing from `extract-at-tables.cjs`'s `PLAYER_ARCHETYPES` allowlist (surfaced
  2026-06-05). Open-status uncertain since the doc is gone — flagged for
  awareness.

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
- **TSPY7 — add thunderspy to `regen-all.cjs` + CI regen-diff** — Currently
  `[homecoming, rebirth]`; tspy covered by the dedicated ci.yml audit step.
  Precondition: full generated tree committed byte-stable first. *(Related to §2.)*
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
