# Heal/Absorb enhancement fix + remaining raw-data export gaps

_Session 2026-06-05. Pick-up notes for the PC (where the `.pigg`/raw bins live)._

---

## Part 1 — Heal/Absorb enhancement fix (DONE, committed-ready)

### What was wrong
Healing enhancement set pieces listed only `Heal` where they should list `Heal/Absorb`.
In CoH HC/Rebirth every Heal-boosting enhancement also boosts **Absorb**, and the
planner treats Heal and Absorb as **separate, value-diluting aspects** (confirmed by
user). `aspects` is a **calc input** — [`parseIOSetPieceValues`](src/utils/calculations/enhancement-values.ts)
divides the enhancement value by the aspect count via `getEffectiveAspectCount` /
`getMultiAspectModifier`. So a `Heal` piece treated as 1 aspect was over-valuing Heal;
adding Absorb makes it 2 aspects and (correctly) lowers per-aspect value to match game.

Only **Triage** (and the Amyloplast/Chloroplast HamiOs) had it right; everything else
was missing Absorb.

### What changed
Inserted `Absorb` immediately after `Heal` in both the `name` and the `aspects` array
on every **non-proc** Heal piece. Proc pieces and already-correct sets untouched.

| Type | Sets fixed |
|---|---|
| Healing | Panacea, Doctored Wounds, Harmonized Healing, Miracle, Numina's Convalescence, Preventive Medicine, Regenerative Tissue |
| Accurate Healing | Touch of the Nictus, Theft of Essence |
| HamiO | Golgi Exposure |

Files:
- `src/data/datasets/homecoming/io-sets-raw.ts` — 35 pieces
- `src/data/datasets/rebirth/io-sets-raw.ts` — 35 pieces
- `src/data/enhancements.ts` — Golgi Exposure (+`Absorb` aspect)

Verification: both io-sets files re-parse cleanly; diff is 100% Absorb/Heal lines
(no unintended sets); calc layer already supports `Absorb` (normalizes to `absorb`,
Schedule A, same as `heal`). **Full test suite: 98/98 pass.**

> Could NOT binary-verify per-piece on the laptop — `raw_data_homecoming*` and
> `exported_powers/` are absent here. Relied on in-repo precedent (Triage + HamiOs)
> + user confirmation. Worth a spot-check against the binary on the PC.

### ✅ Regen-safety — RESOLVED on the PC (2026-06-05)

The laptop fear ("a regen silently drops Absorb") turned out **not** to fire for the
9 hand-fixed healing sets, and the binary path is now fixed for everything else.
Verified against the live bins on the PC:

**Why the 9 healing sets are already safe**
- `scripts/convert-io-sets.js` (HC) reads `legacy/js/data/io-sets.js`, which **no longer
  exists** — the script can't run. HC's `io-sets-raw.ts` is effectively hand-maintained,
  so nothing regenerates over the hand-fix.
- `scripts/extract-rebirth-io-sets-v2.py` (Rebirth) **reuses HC's entry verbatim for any
  set that exists on both servers** (`_load_hc_sets` → `out_sets[set_id] = dict(hc_entry)`).
  All 9 healing sets are shared, so Rebirth copies HC's Absorb-correct data. Empirically:
  re-running the extractor left the Absorb count unchanged (**83 → 83**, no Absorb lines
  removed).

**Binary verification of how Absorb is encoded** — it's **option (a)**: every healing
piece carries a **distinct `Absorb` Strength attrib** alongside `HitPoints` (`Heal_Dmg`,
`Regeneration`, `HitPoints`, `Absorb`, …). Confirmed on Panacea/Numina/Miracle/Doctored
Wounds/Theft of Essence/etc. via the bin parser. The planner's two-aspect Heal/Absorb
model matches the binary exactly.

**Generator now future-proofed** (`extract-rebirth-io-sets-v2.py`):
1. `ATTRIB_TO_ASPECT`: `HitPoints → 'Heal'` (was `'Healing'`) **and** added `'Absorb' → 'Absorb'`.
2. `_ASPECT_CANONICAL_ORDER`: inserted `Heal`, `Absorb` between `Endurance` and `Recharge`
   (Heal precedes Absorb) so names match HC's hand data ("Endurance/Heal/Absorb",
   "Heal/Absorb/Recharge", "Accuracy/Endurance/Heal/Absorb").

With these, the binary path **reproduces HC's healing-piece names exactly** (Heal_Dmg /
Regeneration are intentionally unmapped, so the heal family collapses to a single `Heal`
plus the real `Absorb`). So if HC IO sets are ever binary-sourced (Part 2 #1) or a
healing set becomes Rebirth-only, the data stays correct automatically.

**Bonus fix:** the generator change added Absorb to two **Rebirth-only** event sets the
hand-fix never touched — `return_from_the_grave` / `superior_return_from_the_grave`
(multi-aspect: now `Damage/Heal/Absorb/…` with the `Healing`→`Heal` label normalized).
These carry the real `Absorb` attrib in the binary, so the addition is faithful.

**Guard in CI:** `src/data/io-sets-heal-absorb.test.ts` asserts the invariant across BOTH
datasets — every piece with `Heal` also has `Absorb`, immediately adjacent. Catches any
future regression from a hand-edit or a regen. Full suite **101/101**.

> One unrelated pre-existing drift surfaced during the regen: the Rebirth-only
> `inexhaustibility` event set's single proc piece now parses as `name:"Empty", proc:false`
> instead of the curated `name:"Inexhaustibility", proc:true`. Reverted that one piece to
> keep this change focused; the lost-proc-marker parse is a separate bin-parser to-do.

---

## Part 2 — What other raw data still isn't binary-sourced

_Re-audited on the PC against the live bins + `git ls-files`, 2026-06-05. The earlier
"only powers are exported" hunch was too pessimistic — **more is committed than it
looked** — but three real legacy hand-ports remain._

The distinction that matters is **"reproducible on a machine WITHOUT the bins?"** —
i.e. is the raw data committed to `exported_powers/` (the gitignored exception that IS
checked in), or does the converter read `*.bin` directly (PC-only) / a deleted
`legacy/js/data/*` file (un-reproducible)?

### ✅ Already binary-sourced AND committed (reproducible anywhere)

| Domain | Binary source | Committed export | Converter |
|---|---|---|---|
| Powers / powersets / categories | `powers.bin` | `exported_powers/<cat>/<ps>/` | `convert-powerset.cjs` etc. |
| **AT modifier tables** (Melee/Ranged/AoE/Pet dmg, Heal, hit_points…) | `classes.bin` | `exported_powers/tables/` (71 HC) + `rebirth/tables/` (59) — **committed** | `export_classes.py` → `extract-at-tables.cjs` |
| Pet entities | entities | `exported_powers/entities/` | `export_entities.py` → `convert-pet-entities.cjs` |
| Incarnate powers + effects | `powers.bin` | `exported_powers/incarnate/` | `convert-incarnate-effects.cjs` |

> So the AT **modifiers** ARE exported and committed; entities + incarnate too.

### ❌/⚠️ Still legacy hand-ports — the real gaps

| Domain | Why it's a gap | Binary source available? |
|---|---|---|
| **IO sets** (piece aspects + set bonuses) | HC `convert-io-sets.js` reads the **deleted** `legacy/js/data/io-sets.js` (dead). Rebirth `extract-rebirth-io-sets-v2.py` reads `boostsets.bin` **directly** (PC-only) and reuses HC's hand-data for shared sets. Nothing flows through a committed export. | **Yes — HC `boostsets.bin` present.** Generalizing the Rebirth extractor to HC is feasible now. |
| **Archetype definitions** (`archetypes.ts`: baseHP, damageModifier, caps, inherents) | Legacy hand-port ("Migrated from `legacy/js/data/archetypes.js`"). The raw `classes.bin` IS exported to `tables/`, but `archetypes.ts` doesn't consume it — values are hand-typed and can silently drift from the game. | **Yes — `classes.bin` already exported to `tables/`.** Derivation, not new extraction. |
| **Non-IO enhancements** (SO/DO/TO/Hamidon base schedules) | `enhancements.ts` legacy hand-port; **no exporter exists**. | Maybe — `origins.bin` present (candidate, unconfirmed). |
| Incarnate salvage / components / recipes | `incarnate-salvage.ts` ported from CoH-Incarnate-Calculator | Unknown bin; rarely changes |
| Guardian AT table (Rebirth-only AT) | `extract-at-tables.cjs` allow-list omits Guardian | `classes.bin` may carry it |

### Prioritized backlog (when we pick this back up)

1. **IO sets → binary, both servers (HIGH).** 🚧 **IN PROGRESS** — bin parser fixed + aspect
   convergence at 88%; see **[HC-IO-SETS-BINARY-SOURCING.md](HC-IO-SETS-BINARY-SOURCING.md)**
   for resume notes (uncommitted parser + extractor changes, remaining build-out).
   Same family as the Heal/Absorb bug — while
   `io-sets-raw.ts` is hand/legacy, these keep recurring. HC `boostsets.bin` is present, the
   Rebirth extractor already works (and now emits Heal/Absorb correctly per Part 1), and it
   already reuses HC entries for shared sets. Generalizing it to HC retires the dead
   `convert-io-sets.js` + the legacy hand-data and makes the whole IO-set dataset
   self-healing. **Biggest win.**
2. **Archetype defs → derive from committed `classes.bin`/`tables` (MED).** The planner's
   core stat math (HP, damage, caps) currently rides on a legacy hand-port that can drift.
   The raw data is already committed — this is wiring `archetypes.ts` to consume `tables/`
   rather than a new extraction.
3. **Non-IO enhancement base values (MED).** Investigate `origins.bin` for the
   SO/DO/TO/Hamidon schedules; add an exporter + converter to replace the legacy constants.
   Lower urgency — these are stable game constants.
4. **Guardian AT table (MED, Rebirth).** Add Guardian to the AT extraction allow-list if
   `classes.bin` carries it.
5. **Incarnate salvage/recipe costs (LOW).** Likely a crafting/recipe bin not yet explored;
   fine to keep hand-curated since costs rarely change.

See [BIN-PARSER-LOG.md](BIN-PARSER-LOG.md) for the running parser to-do log
(an entry pointing here has been added).
