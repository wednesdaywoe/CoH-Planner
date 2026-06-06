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
- **`damageCap`, `buffDebuffModifier`, `damageModifier{melee,ranged,aoe}` are NOT
  in classes.bin** as the planner's scalar values — verified three ways:
  exact-single-float scan over the whole record (0 hits), flat-per-AT-array scan
  (no `[5,4,…,7]`-shaped damage-cap vector; the StrengthMax damage members are a
  uniform flat `5.0` for **every** AT), and a `Melee/Ranged_Damage` table-ratio
  test (no uniform table→scalar rule — some ATs fit a `/55.61` baseline, others
  don't). These are CoD2-curated **design constants** (an AT's damage scale
  defines the AT; near-zero patch-drift risk) and **stay hand-curated**.
  - Open question (needs CoD2 to resolve, not acted on): the per-AT damage
    **strength-max curve** at `~delta 82092` reads Blaster/Scrapper/Sentinel/
    Corruptor/Stalker = 5, Brute ≈ 7.75 — which *disagrees* with the hand-port's
    `damageCap` (Scrapper/etc = 4, Brute = 7). Either a real drift or that delta
    isn't the planner's cap concept. Left hand-curated pending an authoritative
    cross-check.
- `baseEndurance` (100) and `defenseCap` (0.45) are global constants (same for
  all ATs); `baseRecovery` (1.67) has **0 literal hits** (derived). No value in
  sourcing — kept hand-curated.

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
