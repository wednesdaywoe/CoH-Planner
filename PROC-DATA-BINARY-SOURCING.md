# Proc-data binary sourcing — ✅ COMPLETE (2026-06-07)

**CLOSE-OUT:** `parseProcEffect` (the fragile `mechanics`-string regex) is **deleted**.
Every `PROC_DATABASE` entry now carries structured `.effects` — binary-generated for all
derivable procs, hand-curated in [proc-residual-effects.ts](src/data/proc-residual-effects.ts)
for the genuinely underivable residual (Rebirth-only sets, `Create_Entity` pet summons,
PBAoE ally buffs, self-meter/conditional stacks). `getProcEffects` is now a pure read;
a coverage guard ([proc-effects-coverage.test.ts](src/data/proc-effects-coverage.test.ts))
enforces 100% `.effects`. Full suite 243/243, tsc clean.

_Root fix for [proc-data.ts](src/data/proc-data.ts): replace the hand-curated
`PROC_DATABASE` (~250 entries) with binary-derived proc/global data from
`boostsets.bin` + `powers.bin`, for both HC and Rebirth. Closes the proc leg of the
data binary-sourcing campaign (see [[data-binary-sourcing-campaign]]). Durable
mechanics belong in [GAME-DATA-PRINCIPLES.md](GAME-DATA-PRINCIPLES.md); the running
issue log is [BIN-PARSER-LOG.md](BIN-PARSER-LOG.md)._

**Precursors already shipped (committed):** the [proc-piece name mis-resolution](src/data/io-sets-proc-resolution.test.ts)
fixes (Steadfast/Stupefy) and the interim Rebirth proc-data entries (13 hand-curated,
binary-sourced effect descriptions). This doc is the ROOT fix that supersedes the
interim hand entries.

## ▶ NEXT SESSION — start here

Decisions locked (2026-06-07): **structured representation, full consumer refactor**
(retire `parseProcEffect` string parsing); **globals first**.

**Phase 1 — globals generator + validation: ✅ DONE (2026-06-07).** Results below.
`scripts/extract-proc-data.py` resolves + validates the always-on globals against the
hand oracle. Approach proven: binary reproduces the clean globals exactly (incl. the
Shield Wall 5% vindication) and surfaces hand-data drift.

**Phase 2 — structured type + always-on dashboard refactor: ✅ DONE (2026-06-07).**
Globals are binary-sourced into the player dashboard end-to-end. Results below.

**Phase 3 — damage/PPM procs + consumer migration. 🟡 IN PROGRESS.**

- **3a — damage proc data: ✅ DONE (2026-06-07).** Cracked the formula: proc damage =
  `scale × Melee_ProcDamage[level]` (the engine table in `classes.bin`, |L1|=10.0,
  |L50|=107.09); the displayed N-M range is the L1..L50 damage. Generator emits 35
  damage entries → `src/data/generated/proc-damage.generated.ts`, merged into
  `PROC_DATABASE` (inert until consumers read `.effects`). Guard:
  `proc-damage-parity.test.ts` (matches hand except 7 allowlisted corrections — ATO
  procs the hand entered as a flat L50 value instead of the scaling 1-50 range, and
  Ice Mistral's wrong min). `ppm` is already binary-correct in the hand data (Phase 1),
  so it's reused for now (generate it in P6).
- **3b — other non-global procs: ✅ DONE (2026-06-07).** `resolve_proc_payload` maps the
  chance/ppm effect group → structured effects: self-buff (Endurance/Heal/Recovery/Regen/
  Absorb), foe debuff (−Res/−ToHit/−Recharge → `Debuff`), mez (`Control` + magnitude +
  duration-in-scale), knock (`Control` Knockback/Knockdown), Build Up (`Grant_Power →
  Boost_Up` ⇒ +100% Dam/+15% ToHit, 10s), and Global_Bonus redirects (Force Feedback
  +Rech 100%/5s). 53 entries → `src/data/generated/proc-effects.generated.ts`, merged
  (inert until 3c). 42 unresolved (Rebirth → P5; bespoke ATO procs — Fury/Opportunity/
  Hide/PBAoE/Energy-Font; the mis-tagged generic "Chance for Stun") safely fall back to
  `parseProcEffect`. Foe-vs-self keys off the effect KIND, not the `AnyAffected` target
  (which means the caster for beneficial procs). Guard: `proc-other-parity.test.ts`
  (dashboard Endurance/Recovery/Regen values; allowlists the Performance Shifter
  +End **7.5% → 10%** correction). Build Up / Force Feedback verified.
- **3c — consumer migration. 🟡 IN PROGRESS.**
  - **3c-calc: ✅ DONE (2026-06-07).** Added `getProcEffects(procData)` — the unified
    accessor returning `.effects` when present, else flattening `parseProcEffect`
    (legacy 'BuildUp' → Damage+ToHit) into the same shape. Migrated the calc consumers:
    `applyProcBonuses`, `applyPPMProcBonuses`, `applyBuildUpProcBonuses` (character-totals)
    and `DamageBlock`. The dashboard + per-power damage now use binary effects — the
    corrections are LIVE (Performance Shifter +End 7.5→10% in recovery; the ATO damage
    ranges in DamageBlock). Build Up detected via a Damage effect with `duration` (foe
    damage procs carry `valueMax`, no duration); DamageBlock takes the Damage effect with
    a `value..valueMax` range. tsc clean, full suite 231/231. `parseProcEffect` is now
    unused in character-totals.ts and DamageBlock.tsx.
  - **3c-display: ✅ DONE (2026-06-07).** Added `procEffectSummary(procData)` — the
    display drop-in for `parseProcEffect` (maps `getProcEffects` to the legacy
    primary/secondary `ParsedProcEffect` shape). Migrated EnhancementInfoContent,
    EnhancementPicker (×2), enhancement-outline, EnhancementCard, and InfoPanel (a damage
    consumer). PowerInfoBlocks only shows proc *chance* (no effect parse) — untouched.
    Build Up renders via a tweaked Value condition (structured `Damage` with no
    `valueMax`). **The tooltip-vs-dashboard inconsistency is RESOLVED** — display and
    dashboard now read the same structured `.effects`. `parseProcEffect` is no longer
    called by any consumer; it survives only as the internal fallback inside
    `getProcEffects` (for entries without `.effects`) and in the parity guards. tsc clean,
    full suite 231/231.

## Phase 3 ✅ COMPLETE (2026-06-07)

Damage + all non-global proc effects are binary-sourced and live in both the dashboard
and tooltips. Remaining campaign work:
- **P4 — bespoke procs: ✅ DONE (2026-06-07).** A generator squeeze recovered +8 more
  binary procs first — SET_ALIASES for HC binary typos (Cacophony→Cacophany energy
  damage 7-72, Debilitative Action→Debiliative_Action stun, Ascendancy→Ascendency),
  an `infer_proc_category` fix (check 'knockdown' before 'knockback' → Kinetic Combat/
  Avalanche/Ragnarok Knockdown 0.67; map foe '-end' → Recovery debuff → Tempest -13%),
  and gating the -End debuff to aspect=Current. The Grant_Power redirect branch now
  skips Damage (a +Damage% stack via grant is bespoke). The irreducible residual (~41:
  Rebirth-only sets, Create_Entity pets, PBAoE ally buffs, self-meters/conditional
  stacks) is hand-curated in `proc-residual-effects.ts` — faithful structured
  transcriptions of the binary-sourced `mechanics`, with `target:'foe'` on display-only
  debuffs so no dashboard path applies them. **parseProcEffect deleted** (P6 cutover).
- **P5 — Rebirth: ✅ ASSESSED (2026-06-07) — no generator pass.** Shared sets reuse the
  HC effects (PROC_DATABASE is one cross-server table). The Rebirth-UNIQUE procs
  (Guardian's Gift, Imperial Might, The Haunting, Vampire's Bite, Return From The Grave,
  Inexhaustibility, Superior Winter's Gift, …) are bespoke — Create_Entity summons,
  Set_Mode globals, Fear+Damage combos — and are **already binary-sourced** in the
  curated proc-data.ts entries (values pulled from the Rebirth bins by hand during the
  interim fix). A trial generator pass against the Rebirth Parse6 bins resolved only 2
  of ~13 and incompletely (e.g. Endless Nightmare captured the Fear but dropped the
  Psionic damage), so it was reverted rather than ship incomplete data.
- **P6 — PPM binary-sourced: ✅ DONE (2026-06-07).** `parse_hand_ppm` + a PPM pass emit
  the per-proc proc-group PPM → `src/data/generated/proc-ppm.generated.ts` (111 entries),
  overlaid onto `PROC_DATABASE.ppm`. Guard: `proc-ppm-parity.test.ts`. **12 corrections**
  (binary authoritative, confirmed in-game): the **Superior ATO cluster** carrying the
  base PPM instead of the Superior value (Might of the Tanker 3→6, Defender's Bastion
  3→5, Brute's Fury 4→5, Stalker's Guile 3→5, Winter's Bite 3→5, Dominating Grasp 1→2,
  Avalanche/Frozen Blast 3→3.5), the base procs Blistering Cold / Kinetic Combat 3→2.5,
  and Sentinel's Ward 5/6→2 (its "~1/min" in-game text is the effective rate, not the
  PPM param — trust the data). PPM drives proc DPS + PPM recovery, so this was the
  highest-value remaining fix. Each proc set has one proc piece, so proc-group PPM is
  unambiguous. Full suite 233/233.
- **P6 — cutover: ✅ DONE (2026-06-07).** `parseProcEffect` + its `parseDuration` helper
  deleted (332 lines); `getProcEffects` is `procData.effects ?? []`; the
  `proc-globals-parity` oracle test became a self-contained canonical-value snapshot;
  new coverage guard enforces 100% `.effects`. The `mechanics` strings remain only as
  human-readable tooltip text (`procEffectSummary.description`), no longer parsed.
- **Genuinely-optional remainder (NOT done — diminishing returns):** generate
  `type`/`levelRange` (near-zero drift); unify the four generated files into one;
  a runtime==export guard (needs the .pigg bins in CI, not portable). Two HC binary-vs-
  hand display discrepancies surfaced during the squeeze and are transcribed to the hand
  value (flagged in `proc-residual-effects.ts`) pending a separate in-game check:
  Winter's Bite proc reads −Speed in the binary (hand says −Recharge); Superior Avalanche
  reads a knockdown-magnitude (hand says Knockback Mag 6).

## Campaign status — core COMPLETE

Proc **effects** and **PPM** are binary-sourced and live in both the dashboard and
tooltips, for both servers (shared sets via HC; Rebirth-unique via the curated entries).
All consumers read structured `.effects` / overlaid `.ppm`. Remaining work (P4 bespoke
HC procs, P6 type/levelRange + hand-`mechanics` retirement) is diminishing-returns polish.

NB transitional inconsistency: DISPLAY consumers still read `mechanics` strings, so the
Phase 2 corrected globals (Impervium 6%, etc.) and the 7 damage corrections show the old
value in tooltips until 3c migrates display.

### Phase 2 results

- **Generator v2** (`scripts/extract-proc-data.py`) emits structured `ProcEffect[]` per
  global piece → `src/data/generated/proc-globals.generated.ts` (keyed by PROC_DATABASE
  key). Handles: per-piece tag-aware Global_Bonus attribution (Steadfast Def vs KB),
  multi-effect groups (Winter's Gift Slow + RechargeResist), own-template + Global_Bonus
  combination (Impervious Skin Regen + MezResist), `target`/`chance` marking, scaling
  overrides (Reactive Defenses floor).
- **`target` / `chance` exclusion (key parity fix):** pet auras are `target='AnyAffected'`
  (→ `target:"pets"`) and Essence Transfer is `chance=0.12`; the player-dashboard path
  skips both — matching the old behaviour (parseProcEffect couldn't parse "...to pets" /
  flat-HP heals, so they were never applied). All real self-globals are `target='Self'`.
- **Type + wiring:** `ProcEffect` interface + `ProcData.effects?` added; generated
  effects merged into `PROC_DATABASE`; `applyProcBonuses` reads `.effects` (one gated
  loop replacing the primary/secondary blocks), falling back to `parseProcEffect` for
  any not-yet-migrated entry.
- **Parity guard** `src/data/proc-globals-parity.test.ts`: structured globals reproduce
  the legacy dashboard contributions except a 3-entry allowlist of confirmed
  corrections/completions:
  - Impervium Armor +Psi Res **5% → 6%** (confirmed in-game).
  - Impervious Skin **+ MezResist(All) 7.5%** (binary surfaces what the hand string omitted).
  - Thrust **+ RunSpeed 10%** (hand mechanics had no value; binary fills it).
  - (Winter's Gift differs only in an `effectType` label the calc ignores — no allowlist needed.)
- **Validation:** full suite 228/228 green; tsc clean.

### Phase 1 results (37/38 globals resolved; 1 missing = Superior Winter's Gift, Rebirth-only → P5)

### Phase 1 results (37/38 globals resolved; 1 missing = Superior Winter's Gift, Rebirth-only → P5)

**Exact matches vs hand (~20+):** Shield Wall Res 5% ✓ (the vindication — marker said
3%, `Global_Bonus.Shield_Wall_Res`=0.05=5%), LotG Rech 7.5%, Steadfast Def 3% + KB 4,
Gladiator Def 3%, GotA Run 7.5%, Synapse Run 15%, Unbreakable Guard MaxHP 7.5%, Winter's
Gift slow 20%, Aegis Psi5%+MezRes20%, Karma/BotZ KB4, Kismet ToHit 6%, Miracle Rec 15%,
Numina's Rec10%+Reg20%, Regen Tissue 25%, Edict Def 5%, Sovereign Res 10%.

**Binary CORRECTIONS — hand data was stale (verified faithful single-template reads,
is_pvp=EITHER, chance=1.0):**
- Impervium Armor +Psi Res: binary **6%** (`0.06`) vs hand 5%.
- Call to Arms +Def(pets): binary **5%** (`0.05`) vs hand 3% — now matches Edict (5%).
- Expedient Reinforcement +Res(pets): binary **10%** (`0.1`) vs hand 5% — now matches Sovereign (10%).
  → HC standardized the pet-aura IOs; the hand data kept pre-buff values. Take the binary.

**Generator refinements deferred to the emit phase (P2/P6):**
- **Per-piece global attribution.** Multi-global sets (Steadfast Def+KB, Shield Wall
  Res+Teleport) currently resolve at set level. Use the boost-piece Null-marker TAG
  (`Defense`→`_Def`, `Knock`→`_KB`, `Res`→`_Res`) to pick the right `Global_Bonus` per piece.
- **Scaling globals.** Reactive Defenses / Preventive Medicine carry `Null/Strength/1.0`
  (extracts as a bogus 100%); the real value is an HP-scaling expression (3%–12.9%).
  Special-case or thin override; confirm how the calc models scaling +Res.
- **Crit / special globals.** Critical Strikes, Scrapper's Strike (ATO crit-chance via
  `Global_Chance_Mod`), Preventive Medicine (a low-HP PROC, mis-typed Global in hand) —
  bespoke mechanics, special-case.
- **Stealth / Jump / Perception.** Stealth maps (PVE/PVP in separate groups → merge the
  pair); Jump/Perception have no `ProcEffectCategory` → `Special` (travel utility, not a
  dashboard stat). Binary stealth 30/300 ft vs hand 35/389 — cosmetic, low priority.
- **Set-name alias.** Binary misspells "Numinas_Convalesence" (one s) — aliased.

## Goal

`proc-data.ts` is the last major hand-port that silently drifts from the game (proven:
Shield Wall hand-says 5% but the entry is fragile; Unbreakable Guard hand-mislabels a
+MaxHP global as resistance). Replace the hand `PROC_DATABASE` with a generated,
binary-sourced database carrying **structured effect data**, validated against the
hand data as oracle (modulo known corrections). The calc engine
(`calculateProcChance`, `interpolateProcDamage`, `calculateProcDPS`, PPM area factor,
…) is correct logic and STAYS — only the data sourcing changes.

## Key findings (binary investigation, 2026-06-07)

1. **PPM is in the binary.** HC (Parse7): `EffectGroup.ppm` is populated directly
   (Apocalypse `4.5` ✓, Force Feedback `2.0` ✓, Panacea `3.0`), and group `tags` give
   the effect type (`Damage`, `rechargetime`, `Res`). Rebirth (Parse6): no `ppm`/`tags`
   — chance-based, attrib-derived (see [[rebirth-assets-and-parse6]]).

2. **Global values come from `Set_Bonus.Global_Bonus.*` powers, NOT boost markers.**
   66 such powers in HC `powers.bin`. The boost piece carries an unreliable
   `Null/Current/<scale>` marker (Steadfast 0.03=3% ✓ by luck; Shield Wall 0.03 but real
   `Shield_Wall_Res`=0.05=**5%**; Unbreakable Guard marker reads "res" but real
   `Unbreakable_Guard`=`HitPoints/Maximum/0.75`=+MaxHP). **Rule: read the Global_Bonus
   power's (attrib, aspect, scale).** Full detail: [[global-io-values-from-globalbonus-powers]].

3. **Linkage boost-piece → Global_Bonus power is mixed.** Explicit `Grant_Power`
   template (`params.power_names`, e.g. Force Feedback → `Global_Bonus.Force_Feedback`)
   OR naming convention (Shield Wall → `Shield_Wall_Res` + `Shield_Wall_Teleport`;
   multi-bonus sets have several). Rebirth (Parse6) populates `template.params`
   explicitly (entity_def / power_names); HC (Parse7) often leaves Null markers with
   params=None → match by name.

4. **Redirects fully resolvable.** `template.params` carries `power_names`
   (Grant_Power/Null → powers.bin) and `entity_def` (Create_Entity → `Pets.*` powers,
   already in powers.bin). This is how the interim Rebirth entries were sourced.

5. **Counts:** ~154 HC / ~160 Rebirth proc pieces. Rebirth reuses HC for shared sets,
   so only ~13 Rebirth-unique procs need the leaner Parse6 path.

6. **Consumer surface (12 files).** The calc functions are logic that stays. The ONE
   functional dependency on the `mechanics` STRING is
   `character-totals.ts:applyProcBonuses()`, which parses it via `parseProcEffect()` to
   apply always-on global effects (LotG +Rech, Steadfast +Def) to the dashboard. This is
   the fragile round-trip the structured refactor eliminates. Full map below.

## Architecture decision

- **Structured effects, full refactor.** Generated `ProcData` carries
  `effects: ProcEffect[]` (each `{category, value, valueMax?, effectType?, duration?,
  isBuff}`) — a LIST, since some procs have ≥3 effects (Inexhaustibility Heal+End+Regen;
  Guardian's Gift Absorb+mez). Consumers read `.effects[]` directly. `parseProcEffect`
  (and the `mechanics` string as a parse source) is RETIRED; a display string can be
  derived from structured effects for tooltips.
- **Globals first** — they feed `character-totals` (correctness-critical) and exercise
  the trickiest generation (Global_Bonus resolution, marker traps, scaling specials).
- **Generator is a new `scripts/extract-proc-data.py`** sharing `bin_crawler` infra and
  the io-sets piece-naming logic; emits a generated `proc-data.generated.ts` per server.
  Keep a thin hand-override layer (HC_PIECE_PATCHES-style) ONLY for the genuinely
  underivable (scaling-global expressions, PvP-note text).

## Phased plan

- **P1 — Globals generator + validation.** Resolve Global_Bonus powers (param + naming
  linkage); emit structured effects for all always-on globals; diff vs hand oracle;
  reconcile every diff (binary correction vs generation bug).
- **P2 — Structured type + always-on consumer refactor.** Add `ProcEffect[]`; cut over
  `collectAlwaysOnProcs` / `applyProcBonuses` / `isProcAlwaysOn` to structured. Globals
  now binary-sourced end-to-end. Guard: runtime totals unchanged except known corrections.
- **P3 — PPM / damage procs (~200).** Generate effects + `ppm`; reproduce
  `Damage(Type N-M)` level-scaled ranges via AT damage tables (see
  [[at-modifiers-are-binary-tables]]) for `interpolateProcDamage`. Refactor DamageBlock /
  incarnate-procs / EnhancementInfoContent.
- **P4 — Summon/grant/special procs.** Resolve Type-B/C redirects (Create_Entity pets,
  Grant_Power, Null→power, Set_Mode) to real effects. Retires interim Rebirth entries.
- **P5 — Rebirth.** Reuse HC entries for shared sets; Parse6 generation for the ~13
  RB-unique procs.
- **P6 — Cutover.** Replace `PROC_DATABASE`; delete `parseProcEffect` string parsing +
  hand data; add runtime==export guard tests (mirror `io-sets-*.test.ts`); keep the
  existing `io-sets-proc-resolution.test.ts` ambiguity guard.

## Validation strategy

Treat today's hand `PROC_DATABASE` as the oracle. Reconciliation script: for each
current entry, compare `parseProcEffect(oldMechanics)` to the generated structured
effects. Three outcomes per entry:
- **Match** → confidence.
- **Binary correction** (hand was wrong/stale: Shield Wall, Unbreakable Guard) → take
  the binary; log it.
- **Generation bug** → fix the generator.
Per GAME-DATA-PRINCIPLES "verify don't assume": spot-check a few globals' applied
dashboard values (LotG recharge, Steadfast def) in the app before/after cutover.

## Risks / open questions

- **Global_Bonus linkage heuristics** (Grant_Power param vs naming; multi-bonus sets
  like Shield Wall Res+Teleport) — needs a verified name-match map; a missed link = a
  dropped global. Highest-risk part of P1.
- **Scaling globals** (Reactive Defenses, Preventive Medicine: `Null/Strength/1.0`,
  value from an HP-scaling expression, not a scale) — confirm how the planner currently
  models scaling +Res 3–12.9% and whether the binary expression is reachable; likely a
  thin override.
- **Damage-range AT-table interpolation** (P3) — the most involved sub-task; the `N-M`
  range is the damage table at the IO's min/max level × scale.
- **`type` classification** (Proc / Proc120s / Global) derivation rules from
  chance/ppm/always-on + the granted-power shape.
- **PvP-only values** — filter by `EffectGroup.is_pvp`; PvP set globals (Shield Wall,
  Gladiator's) carry separate PvE/PvP values.
- **Rebirth Parse6 leanness** (no tags/ppm) — mitigated by HC reuse for shared sets.

## Consumer refactor map (from Explore inventory, 2026-06-07)

Read `procData` + `parseProcEffect(mechanics)` → migrate to `procData.effects[]`:
- `src/utils/calculations/character-totals.ts` — `collectAlwaysOnProcs` (1828),
  `applyProcBonuses` (2138), `applyPPMProcBonuses` (2232), `applyBuildUpProcBonuses` (2345).
  **The correctness-critical consumer (P2).**
- `src/utils/enhancement-outline.ts` (59) + `EnhancementCard.tsx` — proc category → color.
- `src/components/info/EnhancementInfoContent.tsx` (189) — full proc breakdown + damage interp.
- `src/components/info/PowerInfoBlocks.tsx` (199) — proc chance row.
- `src/components/info/DamageBlock.tsx` (478) — proc damage contribution (P3).
- `src/components/enhancements/EnhancementPicker.tsx` (1250, 1983) — picker proc labels.
- `src/data/incarnate-procs.ts` (225) — uses `calculateProcChance` only (logic, stays).
- Barrel: `src/data/index.ts` re-exports; tests: `proc-data.test.ts`,
  `io-sets-proc-resolution.test.ts`.

Calc functions that STAY unchanged (logic, not data): `findProcData`, `isProcAlwaysOn`,
`getPPMAreaFactor`, `arcToDegrees`, `calculateProcChance`, `calculateProcsPerMinute`,
`interpolateProcDamage`, `calculateProcDPS`, `calculateAutoToggle*`, `calculateProcStats`.
