# Remediation Plan — Adversarial Analysis Follow-up

**Companion to:** [ADVERSARIAL_ANALYSIS.md](ADVERSARIAL_ANALYSIS.md)
**Status of this pass:** Plan + MSOT-4 audit report only. No app code edited yet.
**Decision posture (agreed):** Full autonomy on "which copy is the truth" calls during execution, each decision documented in a report you can audit.

The audit's own findings were re-verified against source and hold up. One material correction to the framing: **the damage calc already filters PvP-table entries** ([damage.ts:419](src/utils/calculations/damage.ts#L419)), so a chunk of what looked like dangerous override drift is redundant-with-the-calc, not a bug. This narrows the real MSOT-4 hazard considerably (see Phase 1A).

---

## Phase 0 — Guardrails (do before touching anything)

1. Capture a green baseline: full test suite (`pseudopet-redirect.test.ts`, `strength-buffs.test.ts` and the rest pin real behavior — they are the safety net for the data + calc work).
2. Stand up the regression harness for the two highest-risk workstreams *before* the change, not after:
   - **MSOT-4:** the override-diff auditor (`c:\tmp\override-audit.mjs`) is the harness — re-run after every data edit; it must stay at 0 new DEAD_PIN.
   - **MSOT-5:** capture current import output for a Rebirth Guardian build + a proc-heavy build through *all three* import paths as golden fixtures.
3. Decide the serialization strategy up front: MSOT-6, MSOT-7, `build.exemplarLevel`, `opportunityLevel` all touch the persisted Build/UI shape. **Batch every serialization change behind a single persist-version bump + one migration** rather than dribbling them out.

---

## Phase 1 — Correctness (highest yield; items are independent — parallelizable)

### 1A. MSOT-4 — override-layer rot  *(audit DONE → see [OVERRIDE_AUDIT_REPORT.md](OVERRIDE_AUDIT_REPORT.md))*

289 overrides carry numeric/structural pins. Stratified:

| Bucket | Count | Handling |
|---|---|---|
| DEAD_PIN | 119 | **Mechanical retire** — pin equals fresh generated. No judgment. |
| PVP_ONLY_REDUNDANT | 14 | **Mechanical retire** — differs only by PvP variants the calc filters. |
| AUGMENT_ONLY | 16 | **Keep** — adds planner-only fields generated never emits. |
| DIVERGENT | 140 | **Per-power decision**, triaged by stakes below. |

- **Step 1 (mechanical, low-risk):** strip the dead/redundant pins from the 133 DEAD_PIN+PVP files (delete the file when nothing legit remains; otherwise remove just the pinned fields). Re-run the auditor → expect those buckets to hit 0. Verify a sample of affected powers' displayed damage/stats is unchanged in-app.
- **Step 2 (triaged decisions):** the 140 DIVERGENT, by stakes (verify-don't-assume per [GAME-DATA-PRINCIPLES.md](GAME-DATA-PRINCIPLES.md)):
  - **DAMAGE (18)** — actual PvE damage-number conflicts. In-game/Brainstorm verify each; keep override only if it is the correct live value, else delete so fresh binary shows.
  - **STATS (≈19)** — `endurance`×17, `recharge`×8, `range`×7, **`arc`×4**. The `arc` cases are a **systematic representation bug**, not per-power: generated stores radians (π), overrides store degrees (120). Fix once at the converter or consumer; don't adjudicate them individually.
  - **EFFECTS (≈123)** — `durations`×76 dominates; likely a systematic converter gap (does generated emit durations correctly?). Investigate the high-frequency keys as batches (`durations`, then `summon`×12, `knockback`×10) before the long tail.
- **Step 3 (anti-regrowth):** add an audit gate (test or CI script) that fails when a new DEAD_PIN appears — closes the "no expiry/audit" gap the analysis flagged as the root cause.

### 1B. MSOT-5 — enhancement-UID dedup (importers already diverged)
- Extract `src/utils/enhancement-uid/` owning: `parseIOSetUid` (use the **superset** behavior — descriptive-suffix fallback + apostrophe strip), the HamiO/Titan/Hydra/D-Sync/Prestige special tables, SO/DO/origin parsing, and a **unioned** archetype `Class_X` map (must include Rebirth `Class_Guardian`).
- Repoint [mids-import/mappers.ts](src/utils/mids-import/mappers.ts), [game-importer/importer.ts](src/utils/game-importer/importer.ts), [mxd-import/abbreviations.ts](src/utils/mxd-import/abbreviations.ts).
- Verify against the Phase-0 golden fixtures: identical resolution on all paths; the Rebirth Guardian and proc-piece UIDs no longer drop on the `/buildexport` path. Add a regression test.

### 1C. MSOT-2 / MSOT-3 — one buff/debuff function, honest comments
- Collapse the two `calculateBuffDebuffValue` ([damage.ts:848](src/utils/calculations/damage.ts#L848), [powerDisplayUtils.ts:172](src/components/info/powerDisplayUtils.ts#L172)) into one shared function with **one documented unit**. Preserve the real rule the powerDisplayUtils copy carries: AT-modifier zeroed to 1.0 for Corruptor/Mastermind secondary support (`getEffectiveBuffDebuffModifier`). Centralize it; don't lose it.
- This only fires on the **table-less fallback** (AT-table branch wins first) — add a test for a table-less Corruptor-secondary buff rendering the same number on both display surfaces.
- **MSOT-3:** fix the false "VESTIGIAL / never read" comments in [homecoming/archetypes.ts:17](src/data/datasets/homecoming/archetypes.ts#L17) and [rebirth/archetypes.ts:33](src/data/datasets/rebirth/archetypes.ts#L33) — they *are* read by the fallback. Do alongside 1C.

### 1D. FLOW-1 — warn on AT-table damage miss
- In [damage.ts:570](src/utils/calculations/damage.ts#L570) / `:612`, when `calculateDamageWithATTable` returns null and it falls back to the generic table, emit `warnFallback` (mirror [at-effects.ts:117](src/utils/calculations/at-effects.ts#L117)). Reachable in practice once MSOT-4 `table` pins move. Trivial, low-risk.

---

## Phase 2 — Perf / state homes (after Phase 1 reviewed)

### 2A. MSOT-1 — stop double-running the engine
- Make [useCalculatedStats.ts:302](src/hooks/useCalculatedStats.ts#L302) consume `useCharacterCalculation()`'s result instead of recomputing `calculateCharacterTotals`. Align dep arrays (add `targetLevelOffset` to the consumer). Verify both dashboards render identical numbers and the engine runs once.

### 2B. MSOT-6 — one home for `globalIOLevel`  *(autonomy decision)*
- The UI-store copy is the only one wired to anything; the build-resident copy ([buildStore.ts:119](src/stores/buildStore.ts#L119) → `build.settings.globalIOLevel`) is read by no calc path yet is persisted/exported/shared.
- **Planned call:** keep the UI-store copy as the live one; **remove** the dead build-resident field + its setter + its serialization, with a migration that drops it on import (folded into the Phase-0 persist bump). Documented as a decision. (Alternative — wiring calc *to* the build field so it travels with the build — is the "more correct" long-term home but a larger, riskier change; flag as a follow-up, don't do it blind in this pass.)

### 2C. MSOT-8 — route components through canonical limit checks
- [PowerCard.tsx:38](src/components/PowerCard.tsx#L38) → use `canAddSlot` (also fixes its missing budget check). [AvailablePoolPowers.tsx:47](src/components/AvailablePoolPowers.tsx#L47) → use `canAddPool` / `MAX_POWER_POOLS` (kill the magic `4`).

### 2D. MSOT-7 — localStorage rehydrate re-sync  *(autonomy decision)*
- **Planned call:** have `onRehydrateStorage` re-sync power definitions (`syncBuildDefinitions`, ideally via `hydrateBuild`) so localStorage builds pick up fresh effects/icons like the export/share path already does. Verify a saved build reflects a data change after reload. Also bump [bulk-import-mids.ts:339](scripts/bulk-import-mids.ts#L339) `version: 3`→`4`.

---

## Phase 3 — Dead code & repo hygiene (last; let refactors settle first)

> Ordering matters: deletions go last because a Phase-1/2 refactor occasionally reveals the "dead" twin is the one to keep. **Before deleting [at-effects.ts](src/utils/calculations/at-effects.ts), extract the live keepers** (`normalizeTableName`, `normalizeArchetypeId`, and `warnFallback` for FLOW-1) into a surviving util.

- **Calc zombies:** `at-effects.ts` scaled-effect API (DEAD-1), `power-stats.ts` whole module (DEAD-2), dead surface of `stats.ts` (DEAD-3, keep `getBaselineHealth`), `calculateDotDamage` (DEAD-5), dead `calculateCommonIOValue` name-collision (DEAD-6). DEAD-4 inherents leaf calcs — **verify each unused individually** (siblings are live in `power-at-mechanics.ts`).
- **State zombies (serialization-touching → fold into the Phase-0 persist bump):** `opportunityLevel` triplet (DEAD-7), `build.exemplarLevel` (DEAD-8), dead store actions/selectors (DEAD-9), persisted-unread `darkMode`/`compactMode` (DEAD-10).
- **Orphan components:** `stats/StatsPanel`+`StatItem`, `EnhancementCard`, `IOSetList`, `IncarnatePanel`, `MediaDemo`, and the unconsumed barrels that keep them "exported."
- **Other dead:** ExportImportModal external-import branch (DEAD-11), `at-modifier-tables.json` 2.8 MB (DEAD-12).
- **Smaller flow fixes (correctness-adjacent):** FLOW-2 (route Header server-switch through a store action instead of hand-writing the persist envelope), FLOW-3 (undo/redo also restore calc-affecting `ui` state), FLOW-4 (persist `sentinelCritActive` consistently with the other crit toggles).
- **Repo hygiene:** `git rm --cached completed/ .playwright-mcp/`; remove root `attack-chain-builder.html`, `scrapper_dark_melee_chain.json`.

---

## Decision log (per autonomy agreement)

### Resolved
- **MSOT-4 Step 1 (mechanical retires)** — Retired 133 override pins (119 DEAD_PIN + 14 PVP_ONLY_REDUNDANT): stripped the dead fields, kept text overrides, left `{}` where nothing remained (the converter's own default → no regen-diff drift). Value-neutral by construction; the PvP-only drops are redundant with the calc's own PvP filter (damage.ts:419). Committed by user with MSOT-4 milestone.
- **MSOT-2 modifier divergence** — Single-sourced only the 10%/5%-per-scale *rule* and `getEffectiveBuffDebuffModifier` (now in calculations/buff-debuff.ts); kept each consumer's existing modifier input (damage.ts→raw AT modifier, powerDisplayUtils→effective). The raw-vs-effective divergence (Corruptor/Mastermind secondary, **table-less effects only**) was NOT silently reconciled — it would change displayed game values and needs in-game verification. Documented in place. Value-neutral. (commit 3eed4e70b)
- **MSOT-5 parseIOSetUid** — Reconciled to the **Mids superset**: the game (/buildexport) path now resolves descriptive-suffix proc/event UIDs (pieceNum 6) and strips apostrophes, instead of returning null. This is the bug fix (the game path was silently dropping pieces a .mbd resolved). Guarded by characterization tests committed first. (commits aabe3f57c → 6e1888db8)
- **MSOT-5 archetype maps** — Unioned to one `Class_X` map including Rebirth `Class_Guardian`; mxd `CLASS_TO_ARCHETYPE` now **derived** from it (so it gains Guardian too). The game importer previously rejected Guardian builds. (commit 6e1888db8)

- **MSOT-1 (double-calc)** — `useCalculatedStats` now consumes `useCharacterCalculation()` instead of re-running `calculateCharacterTotals`. Value-neutral (`targetLevelOffset` feeds only purple-patch hit-chance, not the self-stats the legacy view reads). (commit 79133ae1c)
- **MSOT-8 (limit checks)** — `PowerCard` and `AvailablePoolPowers` now call the canonical `canAddSlot`/`canAddPool`; PowerCard gains the build-wide slot-budget check it was missing. (commit 535a8260e)
- **MSOT-6 (globalIOLevel home)** — Verified `build.settings.globalIOLevel` is write-only (zero readers; `build.settings` is read only for `.origin`). **Deleted** the build-resident copy (type, factory default, dead `setGlobalIOLevel` action, serialization fallback, both importers); the live UI-store copy stays. Backward-compatible (old persisted builds' extra field is inert), so no persist-version bump needed.
- **MSOT-7 (localStorage re-sync)** — **Audit was stale.** `onRehydrateStorage` already calls `syncBuildDefinitions(state.build)` (buildStore.ts:2654, "Sync power definitions (effects, icons)… fixes stale data"), so the localStorage path is NOT carrying stale effects/icons — the core hazard does not exist. Only fixed the real remnant: `bulk-import-mids.ts` stamped `version: 3` on a current-shape slim build → bumped to 4.

- **Phase 3 dead-code sweep (mostly DONE)** — verified each item by tracing real consumers (several audit "dead" labels were name collisions, kept those). Commits:
  - Repo hygiene: `git rm --cached completed/ .playwright-mcp/`, removed root `attack-chain-builder.html`/`scrapper_dark_melee_chain.json`, deleted `at-modifier-tables.json` (DEAD-12, 2.8 MB). (c7b393683)
  - Orphan components: dead top barrel, `stats/`, `enhancements/{EnhancementCard,IOSetList,barrel}`, `help/`, `incarnate/IncarnatePanel`. (6ccf37b08)
  - Calc zombies (DEAD-1/2/3/5/6): deleted at-effects.ts (extracted normalizers to at-table-normalize.ts), power-stats.ts, trimmed stats.ts to its live surface, removed calculateDotDamage + the dead calc-layer calculateCommonIOValue. (5db21f015)
  - State zombies: DEAD-7 opportunityLevel + DEAD-10 darkMode/compactMode (b776cc44b); DEAD-8 build.exemplarLevel + DEAD-9 store actions (f5ef2a0dd); DEAD-9 dead selector hooks + useActivePowerBuffs (2b4667740).
  - All backward-compatible; no persist-version bump needed (removing unread fields needs no data transform — the audit's "one bump" assumption was over-cautious).

  - DEAD-11 ExportImportModal external-import branch: removed (render→game-as-final-else, footer, handlers, state, imports, 'external' type member). 1636→1478 lines. (9bee12c17)
  - **Dead-code sweep is COMPLETE — all DEAD-1 through DEAD-12 resolved.**

- **FLOW-2/3/4 (DONE)** — (15036557f): FLOW-2 removed the redundant server-switch persist hand-write (the canonical onRehydrate URL-param sync already does it correctly — the hand-write's pre-set was suppressing it and using a malformed partial archetype); FLOW-3 `_restoreBuild` now syncs `ui.selectedBranch` via `detectBranch` (kheldianForm lives on the build, already restored); FLOW-4 persist `stalkerCritActive`+`sentinelCritActive` for parity with the other AT toggles.

### Still pending (blocked / needs a dedicated pass)
- **MSOT-4 Step 2** DIVERGENT (140): needs in-game Brainstorm numbers or a converter regen pass.
- `arc` radians-vs-degrees: fix site (converter vs consumer) + rationale — part of the MSOT-4 Step 2 converter work.

**Everything else in this plan is complete.** Phase 1 (correctness), Phase 2 (perf/state), and Phase 3 (full dead-code sweep + FLOW fixes) are all done and committed on `audit-and-remediation`.

## What's explicitly NOT in scope
The audit's "Verified-clean" list (ED, caps, Build/Power types, identity/ownership, `build.sets`, the wire-format funnel) — don't re-investigate. Python companion tools were out of the original audit scope.
