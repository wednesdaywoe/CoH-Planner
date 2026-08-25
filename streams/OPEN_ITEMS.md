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

**Core bullets CLOSED 2026-07-07.** What each turned out to be:

- **`TimeToRoot`** — DONE at the parser: it is HC Parse7 **field 48b**, which the
  parser was reading and discarding as "HC extra field" (byte-verified against
  the oracle: Bayonet 1.67, Heavy_Burst 2.5, Assassin's Claw cast 3.0 / root
  0.367 — the Stalker AS quick-form class is where root ≠ cast matters).
  Captured as `time_to_root`, emitted when nonzero (Parse6 genuinely omits the
  field). Full 3-dataset re-export shipped: HC +6,230 files gained ONLY the new
  field (scratch-diff verified zero unrelated drift); Rebirth/tspy manifest-only.
- **`BuyRequires`** — was NEVER missing: bin field 26 `buy_requires` exports as
  `requires` (Frag_Grenade verbatim match). Pure audit name-map fix.
- **`StrengthsDisallowed`** — **NOT in the client bin at all** (proved by full
  byte-accounting of Parse7 records: zero unread bytes, all pads identical with/
  without the flag — it's server-side data). Sourced instead from the committed
  `raw defs/` oracle by the converters (powerset + pool + epic; HC only, ~703
  archetype powers + pools/epics): new `Power.strengthsDisallowed` /
  `globalStrengthsDisallowed`. **Calc now honors the RechargeTime lock**: perma
  (Rune of Protection / armor T9s / MM summons can't be Hasten-perma'd;
  Kuji-In Rin's global-only variant keeps slotting) and attack-chain
  (`fixedRecharge`). Guard: `src/data/strengths-disallowed.test.ts` (9 tests).
- **Attrib name-map for `audit.py`** — DONE and then some: ATTRIB_ALIASES
  (defense/speed*/elude→elusivity/aoe→area/knock→knockback/…), space-safe
  normalization (`Jump Pack`), walks `activation_effects` AND **follows
  `redirect` targets** (self-rez powers serialize 0 inline templates — their
  effects live behind Redirects.*), buckets entity-summon attribs (Burn-class:
  damage lives on the created entity) and SERVER_ONLY_FIELDS separately.
  Attrib gaps went ~2,700 power-hits → a handful, ALL verified as oracle
  staleness (HC slot-reuse renames: Stalker "Resurgence"→"Up to the Challenge",
  "Smoke_Flash"→"Bo Ryaku") + one kUnique3 singleton on a silent temp power.

Remaining (the audit's live worklist, now trustworthy). Re-ran audit.py
2026-07-07 with full paths (not just basenames) to vet each candidate before
committing effort — see [[power-level-fields-triage]] memory for the full
per-field evidence trail:

- **`GroupMembership`/`exclusion_groups`** — CAPTURED 2026-07-07, but turned
  out NOT to be the STANCE_GROUPS data source hoped for. The parser now
  retains field 75 (HC)/74 (Parse6) instead of discarding it (`_powers.py` +
  `PowerRecord.exclusion_groups`; 3-dataset re-export, manifest-only + one
  incidental live-data drift — Obscure Sustenance's recharge dropped
  180s→60s in the same HC patch, propagated via `npm run regen`, 866/866
  green). Empirically: Dual Pistols ammo and Bio Organic Armor/Staff Fighting
  carry NO `GroupMembership` in the compiled client bin at all (their real
  exclusivity runs through `modes_required`/`modes_disallowed`, already
  captured/exported, and `activeSubPower` respectively — see
  [[power-level-fields-triage]]). Across all 26,313 HC powers only **11**
  carry a non-empty value, in 4 small clusters (flight-speed-boost clicks,
  extra-jump temps, 2 self-rez temps, the 4 alt-signature-summon vet
  rewards) — real but narrow. Attempted resolving the group ids through the
  same mode-name table `modes_required` uses; that table is WRONG for this
  field (resolved names don't semantically fit — e.g. the 4-signature-pet
  group resolved to `"Disable_SteamJump"`). Correct name registry
  unlocated. Left as raw unresolved indices in the parser (harmless,
  unconsumed) — not wired into `export_powers.py`/the converter. Do not
  re-pursue as a STANCE_GROUPS replacement without finding the real table.
- **`OverCapTrigger`/`OverCapMultiplier`/`OverCapExponential`** [RESEARCHED
  2026-07-07, mechanism confirmed, CLOSED as capture-only — not a calc
  target] — a generic "per-target effect scaling past the Nth target hit"
  triple, used in 3 distinct real contexts (64 files total). Mechanism:
  targets 1..Trigger get full magnitude; targets beyond Trigger get magnitude
  × Multiplier (`OverCapExponential` absent/false → flat multiplier every
  extra target) or × Multiplier^(position−Trigger) (`OverCapExponential
  kTrue` → compounding per extra target). Confirmed via `raw defs`
  cross-reads:
  - **Tanker AoE cap increase** (56 files: 53 `Tanker_Melee` + 3
    `Tanker_Melee_Aux` — Foot_Stomp, Shatter, Eviscerate, Whirling_*, Frost,
    Combustion...). `OverCapTrigger` always equals the power's *original*
    target cap (5 for cone/narrower AoEs, 10 for sphere AoEs — verified
    against every Tanker_Melee hit, only 2 exceptions: Proton_Sweep and Taunt,
    both non-damage-relevant edge cases). Paired with `MaxTargetsExpr` (e.g.
    `16 kDisable_GauntletTargetCap Source.Mode? 6 * -`) that raises the
    compiled `MaxTargetsHit` by +5/+6 (5→10, 10→16) when a Mode gate is
    clear. `OverCapMultiplier` is uniformly **0.3333**, no exponential flag
    (flat). The **Brute** copy of the same power (e.g. Foot_Stomp) has
    neither the raised `MaxTargetsExpr` nor any OverCap fields — confirms
    Tanker-exclusive, matches Homecoming's known "Tanker AoEs hit more
    targets; extras beyond the old cap take 33% damage" QoL change. This is
    the high-impact one: it touches nearly all of a Tanker's AoE attack
    chain and isn't modeled in `src/` DPS/attack-chain calc at all
    (`max_targets_hit`/`max_targets_expression` are already exported per
    [[power-level-fields-triage]] but nothing consumes them for per-target
    damage scaling).
  - **Self-buff-from-foes-hit diminishing returns** (~9 files: Psionic
    Armor's Aura_of_Insanity + Radiation Armor's Radiation_Therapy, one copy
    per AT that has the set). `OverCapTrigger=1`, `OverCapMultiplier=0.9`,
    `OverCapExponential kTrue` — the self-heal/regen/recovery benefit from
    hitting extra foes decays exponentially (0.9^extra) past the first foe,
    capping the payoff in big spawns. Note: the `Tanker_Defense` copy of
    Radiation_Therapy is a `Redirect` stub carrying only
    `OverCapExponential kTrue` at the top level — the real Trigger/Multiplier
    presumably live on the redirect target, not yet traced.
  - **One-off**: Dominator Electric Control's `Stunning_Aura` (PBAoE toggle
    stun) — `OverCapTrigger=8`, `OverCapMultiplier=0.3`, flat (no exponential
    flag) — likely stun-magnitude/duration falloff for a big-radius toggle,
    a third independent use of the same 3-field mechanic.
  **Decision 2026-07-07: not worth consuming.** Sidekick is a static build
  planner, not a combat sim — it has no notion of "how many enemies this
  cast actually hits," and the honest value of that number swings from 1
  (isolated target) to the power's full cap (packed spawn), so any single
  DPS/attack-chain number the planner could show would be an arbitrary
  assumption dressed up as data, not a real improvement over today's
  single-target figures. Modeling it properly would require the planner to
  become a full encounter simulator (assumed spawn size, positioning,
  Gauntlet aggro), which is out of scope. Treat like [[powers-extraction-audit-close]]'s
  `time_to_root` closure: **capture only, no consumption planned.** If the
  3 fields get parsed later (e.g. as a side effect of some other parser
  work), leave them unconsumed rather than inventing an assumed-target-count
  UI for them.
- **`ProcMainTargetOnly`** [RULED OUT as "proc rolls once against main
  target only" — DISPROVEN by live combat log, 2026-07-07] — a structural
  cross-read (see prior revision of this entry, superseded) had built a
  plausible-looking theory: 54/92 files are `EffectArea kCharacter`
  (already ST, no-op) and the other ~38 all have a non-zero `radius` despite
  being single-relevant-target-feeling powers (Tesla_Cage `MaxTargetsHit=1`,
  Ground_Zero self-target, every AT's Placate, Touch_of_Fear/Lightning_Clap,
  Propel, Focused_Burst) — theorized the flag meant "ignore radius/arc for
  PPM purposes, proc rolls once against the main target." **User tested
  Touch of Fear in-game with an Eradication proc slotted** (live Homecoming
  combat log, 2026-07-07 21:57): a single Touch of Fear activation at
  21:57:48 produced **three separate Eradication: Chance for Energy Damage
  procs on three different targets** (P.E.A.C.E. Breacher 51.76,
  Patroller Engineer 79.63, P.E.A.C.E. Heavy 31.85) in the following second.
  That is exactly per-target independent rolling, indistinguishable from a
  normal AoE proc — flatly contradicts "rolls once, main target only."
  Whatever `ProcMainTargetOnly` actually gates, it is NOT limiting procs to
  a single roll. Same lesson as `ProcAllowed` below (plausible name +
  file-structure correlation ≠ confirmed semantics) — this is the *third*
  time in this project a structurally-plausible field theory died on
  contact with a live test (see [[dna-siphon-tooltip-conditional-heal]] and
  `ProcAllowed`). Do not re-attempt the "single roll"/"ignore AoE denom"
  theory without new evidence; true meaning unknown, deprioritized. (Side
  finding, not a contradiction: Touch of Fear's live DoT damage comes from
  its `ExecutePower` redirect target, not from any AttribMod on the
  top-level `.powers` file, which only carries the redirect — consistent
  with, not contrary to, the earlier read.)
- **`ProcAllowed`** (112) [RULED OUT as a proc-blocking flag, 2026-07-07] —
  hypothesized this blocked slotted IO procs entirely (seen on MM pet summons,
  Fault, Spring_Attack, etc.). **Disproven by live combat log**: Spring_Attack
  (`ProcAllowed kNone`) fires Scirocco's Dervish and Obliteration procs
  normally in-game. Whatever this field gates, it is NOT player-slotted proc
  eligibility. Genuinely unknown purpose — deprioritized, not actionable
  without further research (real meaning might be AI/NPC-only, or narrower
  than assumed). Don't re-attempt the "blocks procs" theory without new
  evidence.
- **`MaxBoosts`** [ruled out — non-issue] — the 243 `MaxBoosts 0` powers
  already export `boosts_allowed: []`, so slotting is already blocked by the
  existing field. No gap.
- **`TargetNearGround`/`NearGround`/`CastableAfterDeath`** [low value] —
  targeting/usability restrictions (AI/UX), not stat-calc inputs.
- **`ChainDelay`/`ChainIntoPower`/`ChainFork`/`StackingUsage`** — not yet
  triaged past the raw count; lower priority than the above.
  UI/AI-only rows (Show*, AIReport/AIGroups, Cancelable, Free, DoNotSave,
  DontSetStance, PreferenceMultiplier, Anim*) are expected-skips.
- ~~**Consume `time_to_root` in the planner**~~ — CLOSED as non-goal
  2026-07-07: captured at the parser, but doesn't map to a meaningful calc
  input — Mids itself doesn't model/consume this value, and the attack-chain/
  DPS view keying on cast time matches the reference behavior. No further
  action.
- **Phase 2 — converter completeness** — Diff `exported_powers` vs `generated`;
  largely delivered by the DSH6 collapse detector; the named remainder is
  folding in `suppress_events` (parsed into `EffectTemplate.suppress_events`
  but not consumed — Hide's AoE-defense suppression).
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
- ~~**Native Parse6 redirect parse**~~ [L] — **PARSER RE DONE 2026-07-07** (the
  `parse6-tail-modes-redirects` fix). `_parse_power_parse6` now parses the
  post-effects tail natively — [`_powers.py:2129`](../tools/bin-crawler/bin_crawler/parser/_powers.py#L2129)
  calls `_parse_redirects(r)` (Thunderspy snipes + Rebirth REB3) instead of
  `skip_to_end()`. The RE overturned this item's premise: Parse6 redirects are an
  **HC-shaped struct_array**, not the assumed flat RPN string-array, so the same
  `_parse_redirects` reader works. Residual (separate, converter-side): switch the
  Rebirth Kheldian form model off the hand-curated
  `datasets/rebirth/kheldian-redirects.ts` map onto the native parse — do only if
  the map drifts; the parser gap that blocked it is closed.
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
  the not-yet-RE'd **post-magnitude** tail, so Rebirth pets get no `copyBoosts`.
  (Rationale corrected 2026-07-07: the old "Parse6 decodes no `flags` at all" is
  stale — [`_powers.py:1844`](../tools/bin-crawler/bin_crawler/parser/_powers.py#L1844)
  now decodes the `Allow*`-derived flags: IgnoreStrength / IgnoreResistance /
  IgnoreCombatMods / NearGround / CancelOnMiss. Only CopyBoosts/PseudoPet remain,
  explicitly deferred at [`_powers.py:1843`](../tools/bin-crawler/bin_crawler/parser/_powers.py#L1843).)
  Do it if a Rebirth summon's pet DPS is reported wrong.
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
  `scripts/attic/extract-thunderspy-icons.py`. *(Also tracked in `streams/TODOs`.)*
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
- **TSPY6 — extract effect-template tail fields** — narrowed 2026-07-07 to
  **`suppress_events` only**. Stacking metadata is DONE (`stack_limit` in 8,473
  tspy export files); `cancel_events` is parsed but always-empty for Parse6 (0
  files surface it) — a non-gap. `suppress_events` is still in the un-RE'd Parse6
  post-magnitude tail (0 tspy / 0 rebirth files vs HC-only), same tail as the
  Rebirth CopyBoosts/PseudoPet item in §8 — so RE them together. Extra coverage;
  planner-needed math fields already extracted.
- **TSPY7 — add thunderspy to `regen-all.cjs` + CI regen-diff** — **CLOSED
  2026-07-07 (verified already shipped):** `regen-all.cjs` defaults to all
  three datasets and `regen-diff.yml` byte-gates the thunderspy `generated/`
  tree on `main`. *(See §2.)*
- **TSPY8 — code-split dataset bundles** [L, perf-only] — All 3 datasets ship in
  one ~14 MB chunk (drove the deploy heap bump to 6144 MB); a dynamic-import
  split would cut initial page weight. Explicitly not a scaling need.
- **TSPY11 — restore dropped Thunderspy player-power effect vocabulary** [M/L,
  **Res + ToHit RESOLVED 2026-07-09** (commit `2e0db2ddb0`, branch
  `tspy-resist-tohit-vocab`); rest still open] — **~1,000 tspy powers (~36%)
  shipped with NO effects.**

  **RESOLVED slice (Res_DMG + Buff_ToHit → 419 files, 952 effect blocks):** the
  root cause was **PARSER-side, not converter-side** — the original "converter-
  side only, no re-parse" theory below was WRONG. tspy stores resistance armor
  and ToHit buffs with only an enhancement-CATEGORY token as the front attrib
  (`Res_DMG`, `Buff_ToHit`); the real affected attribs (`Smashing_Dmg`…, `ToHit`)
  live in the post-`requires` INDEX array — the SAME shape the parser already
  surfaced for `Buff_Def` positional defense. Fix (`_parse_effect_template_
  thunderspy`): prefer the index array for these fronts and synthesize
  aspect='Resistance' for `*_Dmg`-on-`*_Res_DMG` rows (so they route to the
  converter's resistance branch, not the damage branch — the `_Dmg`-table trap).
  Verified: Mind Over Body is Smashing-ONLY in tspy's bin (Lethal/Psi absent vs
  HC's 3 templates — faithful, eff_count=1); High Pain Tolerance decodes all 8
  types; Absorption is byte-identical to HC's own. `convert-pet-entities.cjs`
  updated to recognize the surfaced `*_dmg`+Resistance shape (keeps Tar Patch /
  Sleet -Res). Guard: `thunderspy-resist-tohit-vocab.test.ts`. Lesson: the
  "converter-side only" framing missed that the parser already had a proven
  index-array-surfacing pattern to extend.

  **Mind Link / Link Minds melee-only defense — RESOLVED 2026-07-09** (commit
  `6530af4e10`). The earlier "bin genuinely contains only Melee" reading was WRONG:
  tspy stores a Buff_Def template's affected attribs as a count-prefixed index array,
  and the parser read it at a FIXED post-`requires` offset (`r._pos+16`). That offset
  is correct for simple defense toggles (Maneuvers, Cloak of Darkness — count>=2
  there), but powers with a requires/redirect block (Mind Link, Fade, Farsight,
  Invincibility, most armor passives) carry only a 1-type SHIM at that offset with the
  real multi-type array pushed ~140 bytes downstream — so ~165 tspy defense powers
  rendered SINGLE-type. Fix (`_parse_effect_template_thunderspy` + new
  `_tspy_scan_defense_arrays`): when the fixed read yields <=1 type, union the shim
  with the WIDEST count-prefixed defense array (idx 26-36) in the element. Scoped to
  Buff_Def; zero-regression (multi-type reads byte-identical). Validated vs HC oracle:
  226/241 exact-or-subset (residual = systematic tspy rebalances Ice Shield / Dodge /
  Focused Senses, never false types). Mind Link/Link Minds/Fade → 10 types,
  Farsight/Energy Cloak/Invincibility 1→6-9; 89 tspy files; HC/Rebirth byte-identical;
  regen + 908 tests + gates ×3 green; guards added. Lesson: a "faithful single-type"
  reading from a fixed-offset heuristic is suspect when the HC equivalent is multi-type
  — check for a displaced array before concluding rebalance.

  **Case B — Res mislabel: RESOLVED + SHIPPED 2026-07-09** (branch
  `tspy-resist-tohit-vocab`). Glacial Shield +Res(Cold), Corrosive Sap /
  Enervating Field -Res(all) rendered as *damage* — real `*_Dmg` fronts on a
  `*_Res_Dmg` table with empty aspect. Fix generalizes the resistance-aspect
  synthesis in `_parse_effect_template_thunderspy` to any `*_Dmg` (excluding the
  bare `Res_DMG` token) on a `*_Res_Dmg` table:
  `elif (table and table.lower().endswith('_res_dmg') and attribs and all(a.lower().endswith('_dmg') and a.lower() != 'res_dmg' for a in attribs)): aspect = "Resistance"`
  All three datasets re-exported (HC/Rebirth byte-identical, tspy 26 power files
  flipped), regen + 906 tests + gates ×3 green. The generalized rule also correctly
  fixed −Res *debuff components* riding a `_Res_Dmg` table on attacks (mass_driver
  −1.5, lash −1.25, placate −1.0 — verified these are debuff components, not the
  attacks' damage, which rides a `_Damage` table). Guards added to
  `thunderspy-resist-tohit-vocab.test.ts` (Glacial Shield → resistance.cold,
  Enervating Field → resistanceDebuff all-8). *(This was blocked on TSPY12, which
  turned out to be a phantom — see below.)* Residual (pre-existing, non-blocking):
  Glacial Shield's two same-type `Cold_Dmg` resistance groups (4.5 + 3.25) collapse
  to one in the resistance bag — the [[converter-bag-vs-array-rootcause]] limitation,
  not introduced here.

  **Case A — bare `Res_DMG` -Res debuffs still DROPPED** (296 templates, 224
  files): Sonic Attack / Venom Grenade / Piercing Beam -Res have a bare `Res_DMG`
  front with NO index array (implicit -Res(All)); needs an -Res(All) modeling
  decision (which types) before surfacing. Still open.

  --- *(original theory, partly superseded — kept for the attrib inventory)* ---
  ~1,000 tspy powers ship with NO effects because the powerset converter
  (`scripts/convert-powerset.cjs`) routes on HC-shaped attrib maps and tspy names
  its non-damage attribs differently. Mirror the tspy vocabulary already solved
  for pets in `convert-pet-entities.cjs` (`_TSPY_DEBUFF_NAMED`, the `*_Ones`
  marker guard, `Res_DMG` sign-discrimination). **Pre-existing / zero regression:**
  the DSH6 byte-identical rewrite dropped these identically before and after.
  *NB the "66% atoms Unmapped in the bridge" figure is the DSH4 bridge's
  `effectType` classification, NOT app drops — generic `Damage` renders fine
  (Aimed Shot shows Lethal 1.32); the bridge and the converter's raw-attrib
  routing are independent.*

  Ground-truth (actual `generated/` files): **Infrigidate** (-Def/-Dmg/-Slow) →
  empty; **Clear Mind** (mez protection) → empty; **Heal Other** / **Frostwork**
  → empty; **Aim / Build Up** (`Buff_ToHit`+`Buff_Dmg`) → empty; **Glacial
  Shield** (+Res Cold) → **MISLABELED as "Cold damage 4.5"** — `Res_DMG` on a
  `Ranged_Res_Dmg` (resistance) table routed to `damage` (the same `_Dmg`-table-
  suffix trap family as the HC KB/heal flattening bugs).

  Attrib inventory (top unmapped, atom count · powers):
  - **Real stats to restore:** `Res_DMG` (332·126, sign-discriminated: +self
    armor / −foe debuff — also the mislabel source), `Debuff_Def` (254·83),
    `Slow` (284·122), `Buff_ToHit` (196·50) + `Buff_Dmg` (188·46) [Aim/Build Up;
    scale 5.0 with EMPTY table → resolve table-vs-literal semantics],
    `DeBuff_ToHit` (151·51), `SpeedRunning`/`SpeedFlying`/`SpeedJumping`/`Leap`
    (~180 total, movement), `HealSelf` (110·47) + `Heal` (91·27), `Debuff_Dam`
    (69·21), `EndDrain` (8), named per-type dmg `ToxicDamage`/`ColdDamage`/
    `FireDamage`/`FireDamageDoT` (verify — generic `Damage` covers most),
    mez `Stun`/`Immobilize`/`Control` (verify — may already route via MEZ path).
    `Res_Boolean` (294·96, Clear Mind mez-protection) needs care — boolean, not a
    scalar.
  - **Markers — keep dropping:** `Ones` (1123, placeholder table), `InherentTaunt`
    (313), `FieryEmbrace` (446), `Contaminated`/`Contamination`, `PerfectionofBody/
    Mind/Soul` (35 ea), `Defiance`, `BossCrit`, `GlobalCrash`, `Friction`,
    `StealthOn`, `SummerIOTornado`, `LethalKB70`, `ShredRecharge`.

  Prereqs to do it right: DSH4 bridge mappings for these attribs (so the HC-only
  completeness gate can be extended to protect tspy), a guard test, and in-game
  spot-checks (table-vs-literal scale; markers-stay-dropped discrimination). My
  prior-session recommendation was to do this AFTER the output-identical DSH6
  refactors settled — which they now have (Phases 2R/3 + legacy deletion shipped
  on branch `converter-rewrite`). Not started; deferred per 2026-07-09 decision.

- **TSPY12 — "summon format broke": RESOLVED as a PHANTOM 2026-07-09.** It was NOT
  a format change — it was a **transient, mid-download `bin.pigg`.** The Sweet Tea
  launcher was patching `…/Sweet Tea/tspy/bin.pigg` in place; caught mid-write at
  08:04 (`powers.bin` = 38,651,552 B), the incomplete archive parsed 1442
  `Create_Entity` summon templates as bare `Level`/`Ones` shells with no
  `entity_def` — which the prior session mis-read as a permanent "restructured
  summon encoding." By 08:40 the download **completed** (`powers.bin` = 38,678,712 B)
  and summons parse correctly (`Create_Entity` + `entity_def`). **Proof:** a full
  re-export from the completed bin diffs BYTE-IDENTICAL to the committed oracle —
  8,532/8,532 powers, 0 effect/attrib/entity_def-count diffs (the only "extra"
  committed files are `entities/` + `tables/`, produced by separate exporters). The
  committed oracle itself was already built from this bin generation
  (`"Thunderspy"`-tagged, `Ranged_Ones`=1 — NOT the old `Ranged_Ones`=11,479
  archive; if it were, the summon tables wouldn't match). `piggs/bin.pigg` (62 MB,
  June, `Ranged_Ones`=11,479) is an unrelated stale leftover — parses Summon_Wolves
  to 0 effects — ignore it. **Consequences:** no summon-parser migration is needed;
  Case B was unblocked and shipped. **Gotcha for next time (new class):** after a
  launcher patch, confirm `bin.pigg` is DONE downloading (stable mtime + size)
  before parsing — a partial pigg parses to garbage that masquerades as a format
  change. See [[tspy-player-vocab-gap]].

## 10. Deductive Schema Harness residuals

- **DSH6 — converter atom-projection rewrite: COMPLETE** (branch `converter-rewrite`,
  2026-07-08/09, not yet merged to main). PotD's ally-+Range 2-month silent drop
  falsified the YAGNI deferral. `extractEffects` = `templatesToAtoms →
  projectAtomsToEffects → extractSummon` — one home for routing. Phase 2R retired
  `durationVariants` (RESOURCES slots = per-slot queues + `foldResourceSlot` pure
  fold); Phase 3 retired `unresistable` (twin handling derives from the atom's
  `resistible` via a `twinRole` map, no list mutation); `extractEffectsLegacy`
  (~1,030 lines) + the `DSH6_SHADOW_COMPARE`/`__DSH6_ATOM_SINK__` hooks + the
  `dsh6-shadow-project.cjs` comparator all deleted. All byte-identical, 901 tests,
  gates ×3. `selfPenalty` was done earlier. The remaining data-correctness item is
  the tspy vocabulary restoration (§9 TSPY11) — deliberately a separate slice, not
  part of the architecture rewrite.
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
- **Create_Entity flag bits 0x1/0x2** — `PseudoPet` emission and `CopyCreatorMods` consumption are
  both DONE: the converter wires `summon.isPseudoPet` to the flag (110 HC powers carry it), and
  `copyCreatorMods` flows from the entity `binary` (`boolean(read_u4 & 1)`) into
  `resolvedEntities[].copyCreatorMods` → `applyEnh` in `InfoPanel`/`PowerInfoTooltip` + 236 real
  HC pet entities through `shouldApplyEnhancements`. The open remainder is the two lowest
  Create_Entity flag bits (0x1/0x2) still undecoded in `_FLAG2_BITS_BY_ATTRIB` — parser
  territory, upstream in 1.0.

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

## 15. Engine vendor 2026-08-14 — parity display-twin residue

The TARGETS-2/3 + COND-8 vendor campaign (parser sync, atom-query/atomic-effect
port, converter port, regen, `build:engine`) closed the 16 known parity counts
(Fulcrum Shift N=1/N=5, Radiation Siphon and Chrono Shift healing, Temporal
Healing absorb). Four `powerProjectionParity` tests went red on two residue
classes the vendor exposed. Neither is TARGETS/COND drift, and in both the engine
is the side that's right. PAR1 is a display-twin gap and is still open. PAR2 was
filed as one and wasn't: it was a live beta defect the vendor happened to expose,
closed 2026-08-16.

- [ ] **PAR1** [H] **Pool fly rows (rebirth 15 deltas / thunderspy 12)** — the
  engine splits fly into per-row entries (MOVEMAP-1 axis split, `flyUnenhanced`
  rows, Group Fly and Fly Afterburner dropped as gated) while the display twin
  resolves one bag slot. Beta pool/epic data ships NO atoms
  (`convert-pool-powers.cjs` / `convert-epic-pools.cjs` are shortened pipelines,
  measured 2026-07-29 in the parity test header), so the twin cannot derive the
  split independently. Either extend the test's atoms-absent evidence class from
  perma to movement rows, or (the real close, upstream in 1.0) make the pool and
  epic converters emit atoms and retire the evidence class.
- [x] **PAR2** [H] **`mode: 'replace'` was unread on the damage array (HC 48
  deltas / tspy 24)** — CLOSED 2026-08-16. The first reading of this row (a
  suppressed HoT tail needing a converter flag in 1.0) was wrong, and naming
  another repo is what kept anyone from re-measuring. Both sides tick-fold the
  tail identically. What differed was the merge: `applyActiveConditionals`
  honoured `c.mode === 'replace'` on the effects branch and ignored it on the
  damage branch, where every active conditional's rows were concatenated onto
  base. Temporal Mending's two heal groups are mutex by construction, gated on
  `Temporal_Selection_Buff target.ownPower?` and on its negation, so the toggle
  showed 1.75 + 2.625 against the engine's 2.625.

  Never test-only, and never confined to healing. Crushing Uppercut displayed
  3.18 + 3.339 at Combo Level 1. `powerProjectionParity` saw two powers of it
  because it diffs granted magnitudes and execution tiers, not the damage array,
  and healing is the one damage row that also surfaces as a magnitude.

  A blanket swap would have been wrong. Psi Blade's Insight is tagged replace off
  a negated gate on its GrantPower atom while its own damage is a genuinely extra
  DoT, so replacing the array there deletes the base strike. The rows a
  conditional displaces are the ones whose own gate negates its predicate, which
  the export states and the generated `damage[]` was dropping. `extractDamage`
  now carries each row's negated predicates forward, `extractConditionalEffects`
  resolves them against the toggles it just built and writes `displacedBy`, and
  the merger drops those rows. 53 files across the three forks carry the join;
  the other 114 of the 167 are Psi Blade's shape and correctly carry nothing.

  Guarded by `conditionalDamageDisplacement.test.ts`, which grades the converter
  half against `power.atoms` (a different projection of the same templates, so
  the two agreeing says something) and the merger half against the merged array.
  Mutated three ways: drop the merger filter, blank the predicate scan, and stamp
  a wrong toggle id. Its two counters are the load-bearing part — one fork whose
  corpus displaced nothing, or one where every replace toggle displaced
  something, would pass the assertions by having nothing to disagree about.
