# Archetype definitions → binary-sourced (campaign leg #2)

_Tee-up notes, scoped 2026-06-06. Pick up on the PC (where the `.pigg`/bins live)._

---

## ✅ STATUS — Phase 1 DONE, both servers (2026-06-06)

The classes.bin-resident per-AT data is now binary-sourced for **Homecoming AND
Rebirth**: HP curve (`hpTable`), HP-cap curve (`hpCapTable`), `baseHP`/`maxHP`
(level 50), and `resistanceCap`. Pipeline:

`classes.bin` → `_classes.py` `attribs` block → `export_classes.py` →
`exported_powers/tables/<at>.json` → `convert-archetypes.cjs` →
`generated/archetype-stats.generated.ts` → spread into `archetypes.ts` `stats`.

- Parser anchors on the hit_points curve and reads hp-cap / resistance-cap at
  fixed byte-deltas (verified against the hand-port for all 15 HC ATs).
- **Caught a real drift:** Brute HP was stale in the hand-port (L50 1499/1601 →
  binary **1606.3451**); HC had buffed Brute HP. Binary now authoritative.
- Guarded by `src/data/archetype-stats.test.ts` (runtime stats == committed
  export, 30 assertions) + wired into `regen-all.cjs` (`generated: true`).
- Full suite 154 passing; tsc clean.

### Rebirth (Parse6) — DONE (2026-06-06)

Mirrored the HC RE on `z_rebirth_bin.pigg`: same encoding, 50-entry level tables
(no incarnate extension), different byte-deltas — `hit_points` delta 0, `hp_cap`
delta **15472**, `resistance_cap` value delta **46420**. Parser refactored to a
format-parameterized `_extract_attribs` (`_ATTRIB_LAYOUT["parse7"|"parse6"]`).
Verified vs the Rebirth hand-port for all 15 ATs **including Guardian** (the
Rebirth-only AT, campaign leg #4 — folded in here; Rebirth has no Sentinel).
Confirmed Rebirth keeps the **older Brute HP curve** (L50 1499) where HC buffed
it to 1606 — per-server binary is authoritative. Guard test now covers both
datasets (60 assertions); full suite 184 passing.

> The re-export also refreshed two stale Rebirth named-tables (PB/WS gained a
> `Melee_SSHealSelf` table present in the current bin) — benign current-data
> drift, filtered out by `extract-at-tables.cjs`'s relevant-table allow-list.

---

## ✅ STATUS — Phase 2 RESOLVED, both servers (2026-06-06)

Phase 2 was originally deferred as *"scalars NOT in classes.bin."* That premise
was only **partly** true and is now **exhaustively verified** (don't trust the
optimistic-or-pessimistic backlog line — verify):

- **`baseThreat` IS in classes.bin** — a single float in the class **header**, at
  `hit_points_anchor − 4040` (Parse7/HC) / `− 4004` (Parse6/Rebirth). It's a
  negative delta (before the anchor), so it shifts if HC inserts a header field;
  guarded by a sane-range check + the CI test. Now **binary-sourced** for all 15
  ATs both servers (added to `_ATTRIB_LAYOUT["…"]["threat_delta"]`, flows through
  export → converter → `ARCHETYPE_BINARY_STATS` → spread, hand value removed).
  - **Caught a real drift:** Rebirth **Guardian** threat was hand-typed `1.0`;
    binary says **`2.0`** (header alignment confirmed identical to every other
    AT — not a misread). Binary now authoritative. (cf. the Phase-1 Brute HP
    catch.) HC + the other 14 Rebirth ATs matched the hand-port exactly.
- **`damageCap` IS in classes.bin** (resolved in Phase 3, below) — it's the L50
  of the first damage-type StrengthMax curve. My earlier "not in classes.bin"
  read was wrong: I searched for the *stale hand-port* vector `[5,4,…,7]`, which
  of course didn't match, and the flat-array scan found the cap stored as a
  *per-level curve* (rising 2.1→cap), not a flat array. See Phase 3.
- **`buffDebuffModifier`, `damageModifier{melee,ranged,aoe}` are NOT single
  binary quantities** — they're planner abstractions over the game's *many*
  per-category AT modifier tables; no exact float / flat array / uniform
  table-ratio reproduces them. **But the load-bearing per-AT modifier data IS
  binary-sourced and current** — the `named_tables` (→ `at-tables.ts`), which the
  calc already prefers (`damageModifier`/`buffDebuffModifier` are *fallbacks* for
  table-less effects only; e.g. `calculateBuffDebuffValue`). The hand scalars are
  stale in places (the 2020 patch set Tanker melee 0.8→0.95, ranged 0.5→0.8; the
  hand-port still has 0.8/0.5) — but the named tables already encode the current
  values (`|Ranged_Damage[L50]|/55.61 = 0.80`, `|Melee_Damage[L50]|/55.61 = 0.95`).
  - **Follow-up done (hygiene):** traced the calc — these scalars are
    **vestigial**. Every effect carries a `{scale, table}` pair → the binary path;
    the fallback that reads the scalars fires for *zero* current effects (damage
    included: 0 plain-number `damage` values, 1872 tabled). They can't be cleanly
    binary-sourced (each abstracts many per-category tables; `|table|/55.61` is
    clean for most ATs but anomalous for Blaster/Sentinel/Dominator/Corruptor,
    whose tables bake in damage inherents — Defiance/Domination/etc). Marked them
    vestigial in a code comment and corrected the one cleanly-confirmable stale
    value: **HC Tanker damageModifier melee 0.8→0.95, ranged 0.5→0.8** (Rebirth
    keeps 0.8/0.5 — its binary confirms the pre-2020 values, matching its 400%
    cap). The other "stale-looking" derivations are inherent-baked anomalies, left
    as-is.
- `baseEndurance` (100) and `defenseCap` (0.45) are global constants (same for
  all ATs); `baseRecovery` (1.67) has **0 literal hits** (derived). No value in
  sourcing — kept hand-curated.

---

## ✅ STATUS — Phase 3 (damageCap) DONE, both servers (2026-06-06)

`damageCap` is now **binary-sourced** — the L50 value of the first damage-type
StrengthMax curve in `classes.bin` (`_ATTRIB_LAYOUT["…"]["dmg_cap_delta"]`:
**74872** Parse7/HC, **30944** Parse6/Rebirth), flowed through export → converter
→ `ARCHETYPE_BINARY_STATS` → spread (hand values removed). It's load-bearing
([damage.ts](src/utils/calculations/damage.ts) caps damage strength at this value).

**Caught a real, confirmed drift** — the hand-port under-capped five ATs:

| AT | hand-port | HC binary | Rebirth binary |
|---|---|---|---|
| Scrapper / Sentinel(HC) / Corruptor / Stalker | 400% | **500%** | **500%** |
| Tanker | 400% | **500%** | 400% |
| Brute | 700% | 700% | **775%** |
| Guardian (Rebirth) | 500% | — | 500% |

Verified against the **HC 2020-01-23 Tanker/Brute patch notes** ("Tanker damage
buff cap increased from 400% to 500%"; "Brute … lowered from 775% to 700%") and
the live forum (Scrapper 500%). **Per-server binary is authoritative:** HC took
the 2020 rework (Tanker 500/Brute 700); Rebirth, an older snapshot, kept Tanker
400/Brute 775. There's a second, **stale** copy of the cap elsewhere in the HC
record (the pre-2020 values, ≈delta 82092) — the parser deliberately reads the
live block, not that one. Guarded by `archetype-stats.test.ts` (damageCap
assertion + sane-range invariant); full suite **184 passing**, tsc clean.

### Why the hand-curated modifier scalars are NOT a drift risk (verified)

`damageModifier` and `buffDebuffModifier` aren't single binary quantities at all
— they're planner **abstractions** that each collapse the game's *many*
per-category AT modifier tables (`Melee_Buff_Def`, `Ranged_Heal`,
`Melee_Debuff_ToHit`, `Ranged_Damage`, …) into one hand-picked number. So there
is nothing in the bin to "source" them from. **But that's fine — the calc barely
uses them.** Both are **fallbacks only**:

- **Damage:** `calculateActualDamage` consults `damageModifier` *only* when a
  power has no `table` field. The canonical path `calculateDamageWithATTable`
  uses the per-AT modifier table directly (`damage.ts` comment confirms).
- **Buff/debuff:** `effect-registry.ts` `calculateEffectValue` prefers the
  binary table (`getTableValue(at, value.table, 50) * value.scale`) whenever the
  effect carries a `{scale, table}` pair, and only falls back to
  `buffDebuffModifier` for table-less (legacy/utility) effects.

The load-bearing per-AT modifier data is the **`named_tables`** — which ARE
binary-sourced and **current** (re-exported from the live piggs; `at-tables.ts`
re-extracts with no diff). In the HC generated data **18,946** scaled effects
carry a `table` ref (support categories: `Melee_Buff_Def` 1489×, `Melee_Res_Dmg`
1221×, `Ranged_Heal` 128×, …). So support-AT buff/debuff magnitudes come from the
current binary tables and pick up HC's modifier patches on re-export — **CoD2
staleness is irrelevant to them.** The hand scalars only colour rare table-less
fallbacks; sourcing them would mean *routing those fallbacks through the
per-category tables too* (a calc change, not a data-sourcing one) — tracked as a
possible follow-up, low impact.

Guarded by `archetype-stats.test.ts` (baseThreat assertion + invariant added);
full suite **184 passing**, tsc clean.

**Remaining campaign backlog:** see bottom of file (legs #3–#5).

The original scope notes follow.

This is **leg #2** of the data binary-sourcing campaign. Leg #1 (IO sets) is
done + merged; see [HC-IO-SETS-BINARY-SOURCING.md](HC-IO-SETS-BINARY-SOURCING.md)
for the build-out log and [HEAL-ABSORB-AND-EXPORT-GAPS.md](HEAL-ABSORB-AND-EXPORT-GAPS.md)
§Part 2 for the full backlog. **Read [GAME-DATA-PRINCIPLES.md](GAME-DATA-PRINCIPLES.md)
before touching the parser/exporter/converter** (re-export de-risk workflow,
verify-don't-assume, strength meta-template traps).

---

## Goal

Replace the hand-typed archetype `stats` in `archetypes.ts` with values derived
from `classes.bin`, so the planner's **core stat math** (HP, damage, caps) stops
riding on a legacy hand-port ("Migrated from `legacy/js/data/archetypes.js`")
that can silently drift from the game on a patch.

Both datasets: `src/data/datasets/homecoming/archetypes.ts` and
`src/data/datasets/rebirth/archetypes.ts` (+ the shared `src/data/archetypes.ts`
registry wiring, and the `Archetype` type at `src/types/archetype.ts:88`).

---

## ⚠️ Scope correction (verified, don't trust the optimistic backlog line)

HEAL-ABSORB-AND-EXPORT-GAPS.md §Part 2 calls this *"derivation, not new
extraction — `classes.bin` already exported to `tables/`."* **That is only
half-true.** Verified 2026-06-06:

- The committed `exported_powers/tables/<at>.json` (and `rebirth/tables/`)
  contain **only `named_tables`** — the 110 power *modifier* tables
  (`Melee_Damage`, `Ranged_Heal`, `Melee_Buff_Def`, …). That's all the parser
  emits: `tools/bin-crawler/bin_crawler/parser/_classes.py` builds the class
  record from `named_tables` and nothing else (see `_parse_named_tables` /
  `_parse_inline_named_tables`; the dataclass carries `name`, `display_name`,
  categories, `named_tables`).
- The **AT-definition fields the hand-port needs are NOT in the export** — no
  per-level HP curve, no caps, no base endurance/recovery. They live in the
  `classes.bin` class struct's `attrib_base` / `attrib_max` / `attrib_strength`
  sub-tables, which the parser currently skips.

**So this leg = extend the parser + exporter to capture the class-struct attrib
tables, THEN derive `archetypes.ts` from the new export.** Not pure wiring.

---

## What needs sourcing (the `Archetype.stats` block)

Reference: Blaster object in `src/data/datasets/homecoming/archetypes.ts`.

| Field | Current (hand) | Binary source | In export today? |
|---|---|---|---|
| `hpTable` (per-level HP curve, 50/55 entries) | `HP_TABLE_MID` etc. | `attrib_max.hit_points` (the comment in archetypes.ts already says this) | ❌ needs parser ext |
| `baseHP` / `maxHP` | scalars | first / last of the HP curve (or `attrib_base`/`attrib_max` hit_points) | ❌ |
| `hpCapTable` (per-level HP cap) | `HP_CAP_BLASTER` etc. | `attrib_strength.hit_points` or a cap table in the struct | ❌ |
| `damageCap` / `defenseCap` / `resistanceCap` | 5.0 / 0.45 / 0.75 | `attrib_max` for damage / defense / res_dmg | ❌ |
| `baseEndurance` / `baseRecovery` / `baseThreat` | 100 / 1.67 / 1.0 | `attrib_base` endurance/recovery/threat | ❌ |
| `buffDebuffModifier` | 0.625 | class struct (the AT's buff/debuff strength scalar) | ❌ |
| `damageModifier` `{melee, ranged, aoe}` | 0.5 / 1.125 / 1.0 | **derive from exported `Melee_Damage`/`Ranged_Damage`** — but NOT a copy: blaster `Melee_Damage[0] = -10`, `Ranged_Damage[0] = -10.25`, which is *not* `{0.5, 1.125}`. The planner's scalars are a relative/derived form — confirm the relationship against the calc before trusting it. There is no `AoE_Damage` table (AoE rides Ranged in the binary). | ⚠️ partly (raw tables present, mapping TBD) |
| `inherent` `{name, description}` | hand | inherent *name* may be in the class struct; **descriptions stay hand/CoD2-curated** | keep hand |
| `name` / `side` / `description` / `primarySets` / `secondarySets` | hand | structural / cosmetic — **not** classes.bin; keep hand | keep hand |

---

## Suggested approach

1. **Parser** (`parser/_classes.py`): extend the class record to parse the
   `attrib_base` / `attrib_max` / `attrib_strength` sub-structs (per-level float
   arrays, same shape as `named_tables` entries — ~105 floats HC w/ Incarnate,
   ~50 Parse6/Rebirth). Mind the Parse6 (Rebirth, inline strings) vs Parse7 (HC,
   strtab-offset) split that `_classes.py` already branches on. Add the new
   fields to the dataclass.
2. **Exporter** (`export_classes.py`): write the new attrib tables + scalar caps
   into `exported_powers/tables/<at>.json` (and `rebirth/tables/`). Keep
   `named_tables` untouched so nothing downstream breaks.
3. **Converter**: either extend `extract-at-tables.cjs` or add a small
   `convert-archetypes.cjs` that reads the enriched `tables/*.json` and emits the
   `stats` blocks (HP curves as `const` arrays + the scalar fields) for
   `archetypes.ts`. Mirror how the IO-sets generator splits binary-derived data
   from hand-curated patches.
4. **Keep hand-curated**: descriptions, `side`, set lists, inherent descriptions.
   Use a small patch table (like IO-sets' `HC_PIECE_PATCHES`) for anything the
   binary genuinely can't express.

## Verification (verify-don't-assume — GAME-DATA-PRINCIPLES §2)

- Diff every derived value against the **current hand-port** — they should match
  the live game *today* (the hand-port was correct when written). Investigate any
  delta: it's either a real drift the hand-port missed, or a derivation bug.
- Cross-check a few ATs against **CoD2** (HP at 50, caps, damage mods).
- Do **both servers**; Rebirth has the extra **Guardian** AT (campaign leg #4 —
  `extract-at-tables.cjs` allow-list omits it; this leg may naturally pull it in).
- Add a **CI guard** (mirror `io-sets-bonus-keys.test.ts`): assert each AT has a
  non-empty HP curve of the right length + sane caps, so a future regen can't
  silently blank a field.

## Files in play

- Parser: `tools/bin-crawler/bin_crawler/parser/_classes.py` (+ dataclass)
- Exporter: `tools/bin-crawler/bin_crawler/export_classes.py`
- Existing converter: `scripts/extract-at-tables.cjs`
- Targets: `src/data/datasets/{homecoming,rebirth}/archetypes.ts`,
  `src/data/archetypes.ts`, `src/types/archetype.ts`
- Committed export: `exported_powers/tables/`, `exported_powers/rebirth/tables/`

---

## Remaining campaign backlog (after this leg)

3. **Non-IO enhancement base values (MED)** — SO/DO/TO/Hamidon schedules in
   `enhancements.ts`; investigate `origins.bin`; no exporter exists yet.
4. **Guardian AT table (MED, Rebirth)** — add Guardian to the AT extraction
   allow-list if `classes.bin` carries it (likely folded into this leg).
5. **Incarnate salvage/recipe costs (LOW)** — likely a crafting bin; fine to keep
   hand-curated, costs rarely change.

See [BIN-PARSER-LOG.md](BIN-PARSER-LOG.md) for the running parser to-do log.
