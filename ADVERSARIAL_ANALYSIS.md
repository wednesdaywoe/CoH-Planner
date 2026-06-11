# Adversarial Analysis — CoH Sidekick

**Date:** 2026-06-10
**Method:** Red-team review of the planner web app (React 18 / TypeScript / Zustand). Five parallel adversarial audits across the calculation engine, data layer, state/store layer, import-export pipelines, and UI layer, followed by direct verification of the highest-impact claims against source. Posture: *assume the designer is confidently wrong; trust the code, not the comments.*

**Scope:** `src/` (~43k LOC). The Python companion tools (Pigg Wrangler, Bin Crawler, Sidekick Launcher) were out of scope.

---

## How to read this

Findings are grouped by the two requested lenses — **Multiple Sources of Truth** and **Dead Code** — followed by **Data-Flow Hazards** that are neither but bite the same way. Each finding carries a severity, concrete `file:line` evidence, the *drift/desync hazard* (why two-things-that-should-be-one is dangerous here specifically), and a confidence level. Items marked **✔ verified** were personally re-checked against source after the audit; others are agent-reported with the cited evidence.

The single most important structural observation: **the comments in this codebase actively lie about the data flow.** The clearest case (`buffDebuffModifier` documented as "the calc just never reads them" while `damage.ts:864` reads it) is emblematic — a maintainer trusting the comments will reason about a system that does not exist. Treat in-file claims about "vestigial," "never read," or "safe to ignore" as suspect until grepped.

---

## Part 1 — Multiple Sources of Truth

### MSOT-1 — The same calculation runs twice per render in the two heaviest views — **HIGH** ✔ verified
- `src/components/layout/StatsDashboard.tsx:137-138` and `src/components/modals/DetailedTotalsModal.tsx:438-439` each call **both** `useCalculatedStats()` and `useCharacterCalculation()`.
- `useCalculatedStats()` (`src/hooks/useCalculatedStats.ts:302`) calls `calculateCharacterTotals(...)` then `convertToLegacyStats(result, result)` (line 313). `useCharacterCalculation()` (`:245`) calls `calculateCharacterTotals(...)` **again** at `:265`. They are separate `useMemo`s with **different dependency arrays** (`useCharacterCalculation` includes `targetLevelOffset`; `useCalculatedStats` does not — `:277` vs `:314`).
- **Hazard:** The most expensive computation in the app executes twice on every render of its two biggest consumers, and because the two memos depend on different inputs they can transiently disagree (the legacy-stats view and the breakdown view briefly computed from different `targetLevelOffset`). `useCalculatedStats` is *definitionally* `convertToLegacyStats(useCharacterCalculation())` but refuses to reuse it.
- **Fix direction:** `useCalculatedStats` should consume `useCharacterCalculation()`'s result, not recompute. Align the dep arrays.

### MSOT-2 — Two live `calculateBuffDebuffValue` functions with different encodings and different modifiers — **HIGH** ✔ verified
- `src/utils/calculations/damage.ts:848` vs `src/components/info/powerDisplayUtils.ts:172`. Identical name, divergent contract:
  - damage.ts hardcodes `baseMultiplier = debuff ? 5 : 10`, looks up `archetype.stats.buffDebuffModifier` itself (`:864`), returns **percentage points**.
  - powerDisplayUtils uses named constants `BASE_BUFF = 0.10` / `BASE_DEBUFF = 0.05` (`:67-68`), takes a **pre-computed** `effectiveModifier`, returns a **fraction** (100× apart).
- Two different consumers each bind to a different copy: `src/data/core/effect-registry.ts:790` → damage.ts version; `src/components/info/SharedPowerComponents.tsx:689` → powerDisplayUtils version. The powerDisplayUtils path additionally **zeroes the AT modifier to 1.0** for Corruptor/Mastermind secondary support (`getEffectiveBuffDebuffModifier`, `powerDisplayUtils.ts:149`) — so the *same buff effect* computes a different number depending on which display surface renders it.
- **Hazard:** The canonical CoH "10%/5% per scale" rule now lives in two files with two encodings. Worse, the shared name invites a maintainer to "dedupe the import" and silently bind a surface to the wrong semantics. Divergence is currently masked because both are gated behind an AT-table-first branch and only fire for table-less buff/debuff effects — but that fallback path *does* fire.

### MSOT-3 — `archetypes.ts` documents the buff/debuff scalars as "never read"; the calc reads them — **MED** ✔ verified
- `src/data/datasets/homecoming/archetypes.ts:17-23`: *"damageModifier and buffDebuffModifier are effectively VESTIGIAL … the calc just never reads them."* Same claim in `src/data/datasets/rebirth/archetypes.ts:33-35`.
- Reality: `src/utils/calculations/damage.ts:864` reads `archetype.stats.buffDebuffModifier`; `damage.ts:278` reads `damageModifier`; four UI surfaces (`InfoPanel.tsx:928`, `PowerInfoTooltip.tsx:404`, `CompareSlottingModal.tsx:136`, `DetailedTotalsModal`) read the effective buff/debuff modifier. They are a **live table-less fallback**, not vestigial.
- **Hazard:** This is a documented invitation to let a live input rot. A table-less buff/debuff (or a legacy power with no `table` field) silently consumes a hand-curated scalar that the comment says nobody needs to maintain. The MEMORY note ("those are calc fallbacks") is correct; the *in-file comment* claiming they're never read is the dangerous artifact. **Fix the comment in both files.**

### MSOT-4 — Override layer can permanently pin stale 2019 values over fresh binary data — **HIGH**
- Three-layer power data: `generated/` (overwritten on regen) → `overrides/` (hand deltas) → composed `powersets/` (what the app reads), stitched by `withOverrides` (`src/data/_layer.ts:22`). ✔ verified: `withOverrides` is a **shallow top-level field replace** with deep-merge only for `effects`/`stats`; an override that sets `damage`/`scale`/`table` **completely shadows** the regenerated value.
- ✔ verified: **144** homecoming override files pin numeric/effect fields (`scale`/`damage`/`table`) out of 3,364 override files (the cross-dataset total the data audit reported was 239).
- The override headers self-document their origin as papering over the **stale April-2019 CoD2 archive** (e.g. `overrides/.../arachnos-soldier/.../bayonet.ts`: *"values the previously-committed composed file carried that the current CoD2-raw extraction does not"*). Per CLAUDE.md the source has since switched to **live `.pigg` archives**.
- **Hazard:** These overrides were created to compensate for a stale source that no longer exists. With a current source, an unknown subset of those 144 numeric pins now freeze *old 2019 values on top of correct fresh binary values* — the exact inversion of their purpose. There is **no expiry or audit** that detects when a pinned override has been caught up (or contradicted) by the generated layer. This is the highest-yield bug farm in the data layer.
- **Fix direction:** Diff each numeric-pinning override against its current `generated/` sibling; where equal, delete the dead pin; where different, decide per-field whether it's a legitimate planner correction or a frozen value masking live data.

### MSOT-5 — Enhancement-UID resolution duplicated across importers, already diverged — **HIGH**
The Mids importer and the game (`/buildexport`) importer maintain independent copies of the same .mxd format knowledge, and the copies have **already drifted in behavior** (not just hygiene):
- ✔ verified: `parseIOSetUid` exists in both `src/utils/mids-import/mappers.ts:1418` and `src/utils/game-importer/importer.ts:1023` (comment: *"Same logic as the Mids importer"*). The mids copy adds a descriptive-suffix fallback (`pieceNum = 6` for proc/event pieces) and strips apostrophes; the game copy returns `null` on a missing letter suffix. **A UID the `.mbd` path resolves, the `/buildexport` path silently drops.**
- The special-enhancement tables (HamiO / Titan / Hydra / D-Sync / Prestige suffix→registry maps) are duplicated byte-for-byte: `mids-import/mappers.ts:1610-1700` vs `game-importer/importer.ts:794-852` (comment admits *"same as Mids importer"*). Any new special piece must be edited in two files.
- Archetype `Class_X` maps are **triplicated**: `MIDS_ARCHETYPE_MAP` (`mappers.ts:34`, includes Rebirth `Class_Guardian`), `ARCHETYPE_MAP` (`game-importer/importer.ts:61`, omits it), `CLASS_TO_ARCHETYPE` (`mxd-import/abbreviations.ts:330`). Already inconsistent: a Rebirth Guardian build imports via `.mbd` but is rejected as "Unknown archetype" by the other two paths.
- **Fix direction:** Extract a shared `enhancement-uid` module (special tables, `parseIOSetUid`, SO/DO parsing, archetype/origin maps) consumed by all importers. Findings collapse into one root cause.

### MSOT-6 — `globalIOLevel` lives in two stores; the build-resident copy is honored by nothing — **HIGH**
- `uiStore.ts:156` (`globalIOLevel`) + setter `:918` — the **only** copy wired to the UI (sole caller `EnhancementPicker.tsx:682`).
- `buildStore.ts:119/2002` (`setGlobalIOLevel` → `build.settings.globalIOLevel`, typed at `build.ts:67`) — **zero readers in the calc path.** `calculateCharacterTotals` derives slot IO level from the slot's baked `level` and `effectiveLevel`, never from `build.settings.globalIOLevel`.
- **Hazard:** `build.settings.globalIOLevel` defaults to 50, is persisted, exported in the slim build, and re-imported — so every saved/shared build carries an IO level that nothing honors. The "more correct" home (it travels with the build) is the dead one; the live one (UI store) does *not* travel with a shared build. A future dev wiring calc to the build-resident field would silently read a stale 50.

### MSOT-7 — localStorage build shape diverges from the canonical export/share serialization — **MED**
- Two Build serializations: the canonical `slimBuild`/`hydrateBuild` (`build-serialization.ts`, wrapped `{version:4, build}`) used by export, share-link, `/import`, and URL-sync — and import re-syncs power effects/icons via `syncBuildDefinitions`. Versus the **localStorage persist path** (`buildStore.ts` `partialize:2467` / `onRehydrateStorage:2479`) which stores the **full** Build with **no version field** and rehydrates via ad-hoc inline migrations, never calling `hydrateBuild`/`syncBuildDefinitions`.
- **Hazard:** A build round-tripped through localStorage keeps **stale power `effects`/`icons` from save time**, while the same build through export/share gets re-synced from current data. Two serialization shapes must be kept in lockstep as the Build type evolves, and they already differ in freshness semantics. Compounded by `scripts/bulk-import-mids.ts:339` stamping `version: 3` while the app emits `version: 4` — benign only until someone adds version-gated migration logic.

### MSOT-8 — Limit/budget logic owned by the store, reimplemented inline (less correctly) in components — **MED**
- `canAddSlot` (buildStore) enforces the slot **budget**; `PowerCard.tsx:38` recomputes inline `power.slots.length < power.maxSlots` — missing the budget check, so the inline copy is *also wrong*.
- `canAddPool` (buildStore) vs `AvailablePoolPowers.tsx:47` inline `pools.length < 4` (magic number duplicating `MAX_POWER_POOLS`).
- **Hazard:** Canonical rules exist but components reinvent them with magic numbers; a rules change updates the store while the components keep the naive check.

### MSOT-9 — Recovery/regen per-second formula reimplemented 3–4× with a rounded constant nobody uses — **MED**
- `maxEnd/60 × (1 + recovery%)`: `character-totals.ts:3404` (canonical), `attack-chain-powers.ts:302`, `data/core/stat-definitions.ts:382`, and dead `stats.ts:565`. The exported constants meant to centralize this — `BASE_RECOVERY_RATE = 1.667`, `BASE_REGEN_RATE = 100/240` (`enhancement-values.ts:19,22`) — are **not used by any headline formula**; only by proc-conversion in character-totals. The proc-derived "recovery equivalent" divides by the rounded `1.667` while every display formula uses exact `/60` (1.6667) — a small but real drift between the headline recovery number and the proc contribution measured against it.

---

## Part 2 — Dead Code

### Calculation engine — three modules are abandoned parallel engines

- **DEAD-1 `at-effects.ts` scaled-effect API — HIGH.** Only `normalizeTableName`/`normalizeArchetypeId` are consumed externally. Dead (barrel-only): `calculateScaledEffect` (`:104`), `calculateMultipleEffects` (`:140`), `calculateScaledDamage` (`:198`), `calculatePowerDamageFromScaled` (`:241`), `sumDamageResults` (`:271`), `calculateScaledHeal` (`:291`), `getArchetypeTableNames`, `hasATTables`, `compareATModifiers`, `formatEffectValue`, plus types — ~10 functions / ~250 lines. An abandoned damage/effect engine superseded by `damage.ts` + `character-totals.ts`.
- **DEAD-2 `power-stats.ts` whole module — HIGH.** `calculatePowerStats` (`:77`), `formatStatForTooltip` (`:301`), `isStatEnhanced`, `hasGlobalBonuses`, `calculateImprovement` — none referenced outside the barrel. The entire 363-line "ThreeTierStat" power-stat system, superseded by per-power calc in InfoPanel/SharedPowerComponents.
- **DEAD-3 `stats.ts` large dead surface — HIGH.** External consumers use only `getBaselineHealth`. Dead: `STAT_CATEGORIES` (`:27`), `DEFAULT_ENABLED_STATS` (`:116`), `calculatePoolPowerBonuses` (`:359`), `calculateActivePowerBonuses` (`:416`), `formatStatValue` (`:523`), `STAT_TO_COMBINED`, `applyStatToCharacter`. Note `calculatePoolPowerBonuses`/`calculateActivePowerBonuses` are **stale duplicate logic** that `character-totals`' `applyActivePowerBonuses`/`applyFitnessPowerBonuses` replaced — not merely unused. `StatsConfigModal.tsx:223` defines its own local `STAT_CATEGORIES`, ignoring the exported one.
- **DEAD-4 `inherents.ts` leaf calculators — MED.** Exported-and-unused: `calculateDominationDuration`, `calculateScourgeChance`, `calculateFuryDamage`, `calculateSupremacyDamage`/`ToHit`, `calculateBodyguardDamage`, `calculateVigilanceDamage`, `calculateCriticalHitChance`, `calculateGauntletRadius`/`Arc`. (Several siblings *are* used by `power-at-mechanics.ts` — verify before removing each.)
- **DEAD-5 `damage.ts:905 calculateDotDamage`** — exported, never called (DoT handled inline). Name-collision footgun **DEAD-6**: two exported `calculateCommonIOValue` (`enhancement-values.ts:852` derives from ED schedule; `data/enhancements.ts:625` interpolates a hardcoded table) — only the data one is consumed; the calc one is dead but both are barrel-exported, inviting an ambiguous import.

### State layer — zombie fields and dead selectors

- **DEAD-7 `opportunityLevel` triplet — MED.** `uiStore.ts:301/584/1455`, barrel-exported, with a clamping setter and selector — **no UI calls the setter, no calc reads the value** (Sentinel damage uses the boolean `sentinelCritActive` + `getOpportunityCritBonus()`). Defaults inconsistent (init `50` `:804` vs reset `0` `:1639`), moot because unused.
- **DEAD-8 `build.exemplarLevel` zombie — MED.** Field `build.ts:136`, setter `buildStore.ts:1771` (no caller), serialized and import-defaulted. The live exemplar value the whole app reads is `ui.exemplarLevel`. The build-resident copy is written, serialized, and **never read** — a shared build carries an `exemplarLevel` that does nothing on import.
- **DEAD-9 dead store actions/selectors — MED/LOW.** `getActiveSetBonuses`, `canSelectEpicPool`, `isPrestigeSlotted`, `clearSlotOrder` (buildStore) — defined, exported, never invoked. Selector hooks with zero consumers: `useBuildSettings`, `useIncarnates`, `useDefenseStats`, `useResistanceStats`, `useHealthStats`, `useGlobalRecharge`, `useCharacterStats`, `usePowersPerLevel`, `useActivePowerBuffs` (whole hook). These advertise a "use the selector" pattern that the rest of the app ignores in favor of ad-hoc `build.x` reads — which is *why* MSOT-8 exists.
- **DEAD-10 persisted-but-unread `darkMode`/`compactMode` — LOW.** `uiStore.ts:253/256` ("for future use"), no reader, `toggleDarkMode`/`toggleCompactMode` uncalled, yet both written into the `coh-planner-ui` payload.

### UI layer — orphaned components (an old generation living beside the new)

All confirmed by the sweep as having zero non-barrel references. The barrels (`src/components/index.ts` and the `stats`/`help`/`enhancements` sub-barrels — themselves imported by no file) are the mechanism keeping this dead code "exported" so it evades unused checks.

| Component | Severity | Note |
|---|---|---|
| `src/components/stats/StatsPanel.tsx` + `StatItem.tsx` + barrel | **HIGH** | Superseded by `layout/StatsDashboard.tsx`. **Duplicate `StatItem`**: `StatsDashboard.tsx:848` has its own file-private `StatItem`; the `stats/` one is the dead twin. |
| `src/components/enhancements/EnhancementCard.tsx` | HIGH | Orphaned; live display goes through `EnhancementIcon`/`EnhancementPicker`. |
| `src/components/enhancements/IOSetList.tsx` (`IOSetList`, `CategoryFilter`) | MED | Dead via the unconsumed `enhancements/` barrel. |
| `src/components/incarnate/IncarnatePanel.tsx` | MED | Superseded by `IncarnateSlotGrid`. |
| `src/components/help/MediaDemo.tsx` + `help/index.ts` | LOW | Orphaned help-media placeholder. |
| `src/components/index.ts` (top barrel) | LOW | Imported by nothing; the app imports by direct path. |

### Import layer — unreachable UI branch + stranded blob

- **DEAD-11 ExportImportModal external-import branch — MED.** `ExportImportModal.tsx` carries full external-import state/handlers (`extResult`, `parseExternalContent`, `handleExtApply`, file-input JSX `:1140-1229`, footer branch `:1619-1624`), but the source toggle only renders local/mids/game — the external button is removed (`:941`, "hidden during Homecoming closed beta"). `loadSource` can never become `'external'`, so ~100 lines are unreachable. (The importer itself is still live via `ImportPage.tsx`; only the modal's copy is dead.)
- **DEAD-12 `src/data/at-modifier-tables.json` (2.8 MB) — LOW.** Referenced by nothing in the repo. The live AT-modifier data is `at-tables.ts`. A stranded earlier extraction — large, authoritative-looking, frozen. Stale-data trap if future code "discovers" it.

### Repo-root cruft (committed by accident or abandoned)

- **`attack-chain-builder.html`** (root, 597-line standalone prototype) — superseded by `AttackChainModal.tsx`, referenced by no `src/`. Likely the design mockup that preceded the React port. **MED.**
- **`scrapper_dark_melee_chain.json`** (root) — loose hand-authored sample, no references. **MED.**
- **`completed/`** (4 planning `.md` files) — **tracked despite being gitignored** (gitignore doesn't untrack already-committed files). Candidates for `git rm --cached`. **MED.**
- **`.playwright-mcp/`** (60 `page-*.yml` snapshots) — **tracked test artifacts**, same untrack gap. **MED.**
- The on-disk `nul` file is a Windows artifact (reserved device name from a stray redirect); gitignored and **not** tracked — disk junk, not a repo problem.
- **Cleared (intentional, not cruft):** `raw defs/` (audit oracle for `tools/extraction-audit/`), `exported_powers/` (committed converter input), `dist/`/`import-output/` (gitignored, 0 tracked).

---

## Part 3 — Data-Flow Hazards (silent failure surfaces)

### FLOW-1 — Silent AT-table fallback masks missing data — **MED**
`damage.ts:570-585` and `:612-628`: when `calculateDamageWithATTable(...)` returns `null`, the code silently falls back to `calculateActualDamage` (generic melee/ranged tables). The two paths can yield **different numbers for the same power**, with **no warning emitted** (unlike `at-effects.ts:117` which at least calls `warnFallback`). A power with a bad/missing `table` name displays plausible-but-wrong damage with zero signal. Given MSOT-4 (override pins on `table`), this fallback is reachable in practice. **Add a fallback warning here.**

### FLOW-2 — Header server-switch hand-writes the persist envelope — **MED**
`Header.tsx:572-581` reads, mutates, and rewrites raw `localStorage['coh-planner-build']` JSON (`parsed.state.build.*`), then reloads. It (a) couples a component to zustand-persist's internal `{state, version}` envelope, (b) writes a **partial archetype** `{ id: null }` missing `name/stats/inherent` (vs the canonical `{ id:null, name:'', stats:null, inherent:null }` used everywhere else), and (c) duplicates the serverId migration already in `buildStore.ts:2569-2594` `onRehydrateStorage`. Mitigated only by the immediate reload re-normalizing. Two places now own "switch server resets picks."

### FLOW-3 — Undo/redo restores `build` but not calc-affecting `ui` state — **LOW**
`historyStore` snapshots `Build[]` only; `useUndoRedoKeyboard.ts:31-39` restores only `build`. Operations that touch both stores in one user action (`importBuild` also sets `ui.selectedBranch`/`kheldianForm`) undo the build half and leave the ui half — a partial-undo UX inconsistency. No data corruption (history *is* a build clone), but visibly wrong to users.

### FLOW-4 — Inconsistent persistence of equivalent AT-mechanic toggles — **LOW (suspicion)**
`uiStore.ts` `partialize` (`:1661-1708`) persists `stalkerCritActive`/`scourgeActive`/`dominationActive` but **not** `sentinelCritActive`/`opportunityLevel` — so some crit toggles survive reload and equivalent ones silently reset. Reads as a bug to users ("why did my Sentinel crit toggle reset?"). Verify intent.

---

## Verified-clean (so these aren't re-investigated)

- **ED** is single-sourced in `applyED` (`enhancement-values.ts:359`); `combineWithAlphaED` is the one Alpha+ED combiner, used consistently.
- **Caps** (damage/defense/resistance/HP) read from `archetype.stats` everywhere; binary-generated except hand-curated `defenseCap` (no binary source — content-mode-dependent soft-cap). No duplicate cap constants in the calc engine.
- **Build/Power types** are single source of truth — one `Build` (`types/build.ts:117`), one `Power` (`types/power.ts:588`); `SharedBuild` is a distinct DB/wire shape, not a drift duplicate.
- **Identity/ownership** — owner tokens, favorites, quick-share cache, Supabase session, `build.vaultId` are distinct non-overlapping concerns; `logout` clears the quick-share cache.
- **`build.sets` set-tracking** (the one derived value stored in the build) is consistently recomputed on every mutation path that changes set membership.
- **io-sets / power-pools / epic-pools** top-level files are clean facades over per-dataset raw; **generated proc/salvage files** are all imported. The hand-vs-generated *incarnate* tension the architecture doc implies was already refactored away (`incarnate-effects-generated.ts` no longer exists).
- **external-import** delegates to `game-importer`; **bulk-import-mids** reuses `importMidsBuild` — those two are genuinely DRY. The wire format (share-link / `/import` / URL-sync) funnels through the single `slimBuild`/`hydrateBuild` path.

---

## Prioritized remediation

**Correctness (do first):**
1. **MSOT-4** — Diff the 144 numeric-pinning overrides against current `generated/`; retire dead pins, justify the rest. (Highest bug yield.)
2. **MSOT-5** — Extract a shared enhancement-UID module; the importer copies have *already diverged* (Rebirth Guardian, proc-piece UIDs drop on one path).
3. **MSOT-2 / MSOT-3** — Reconcile the two `calculateBuffDebuffValue` into one; fix the false "never read" comments in both `archetypes.ts`.
4. **FLOW-1** — Add a fallback warning when AT-table damage lookup misses.

**Correctness-adjacent / perf:**
5. **MSOT-1** — Make `useCalculatedStats` reuse `useCharacterCalculation`; stop double-running the engine.
6. **MSOT-6 / MSOT-8** — Pick one home for `globalIOLevel`; route `PowerCard`/`AvailablePoolPowers` through the canonical limit checks (also fixes PowerCard's missing budget check).
7. **MSOT-7** — Decide whether localStorage rehydration should re-sync power definitions like the export path does.

**Hygiene (low risk, high signal-to-noise gain):**
8. Delete DEAD-1/2/3 (calc), DEAD-7/8/9/10 (state zombies), the orphaned `stats/`+`incarnate/`+`enhancements/` components, `at-modifier-tables.json`, and the unreachable ExportImportModal branch.
9. `git rm --cached completed/ .playwright-mcp/`; remove root `attack-chain-builder.html` / `scrapper_dark_melee_chain.json` / `nul`.

The recurring theme across all three parts: **this codebase has an old generation living beside the new one** — a second damage engine (`at-effects.ts`), a second stats system (`power-stats.ts`, `stats/StatsPanel`), a second buff/debuff function, a second IO-level home, a second build serialization, three archetype maps. Each was meant to be replaced; each was instead left wired up just enough to be reachable. The cleanup is less about deleting lines than about *deciding, per pair, which one is the truth* — and then making the loser un-callable.
