# Proc-data binary sourcing — 🟡 SCOPING (2026-06-07)

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

**Phase 1 — globals generator + validation.** Build `scripts/extract-proc-data.py`
(reuse `bin_crawler` parser infra, like `extract-rebirth-io-sets-v2.py`). For the
always-on globals, the authoritative value is the granted `Set_Bonus.Global_Bonus.<Set>[_Type]`
power (NOT the boost marker — see Finding 2 / [[global-io-values-from-globalbonus-powers]]).
Emit structured effects, then diff against today's hand-`PROC_DATABASE` as oracle.
Expect a handful of binary CORRECTIONS (Shield Wall 3→5% Res, Unbreakable Guard
res→+MaxHP) — investigate each diff; those are the win, not regressions.

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
