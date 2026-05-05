# Rebirth `boosts_allowed` Extraction Bug

**Status:** Open (deferred — needs PC with `raw_data_rebirth` to debug)
**Discovered:** 2026-05-04
**Affects:** Rebirth dataset only. Homecoming is correct.

## Symptom

Rebirth power-pool (and likely powerset) powers show wrong values in their
`allowedEnhancements` arrays. The wrong types appear in the planner's
"common IO" picker — e.g. Flight powers offer Healing instead of Flight
Speed / Endurance Reduction.

## Confirmed Examples

From [src/data/datasets/rebirth/generated/power-pools.ts](src/data/datasets/rebirth/generated/power-pools.ts):

| Power | Rebirth (wrong) | Expected (HC) |
|---|---|---|
| Hover | `["Defense", "Healing"]` | `["Defense", "EnduranceReduction", "Fly"]` |
| Fly | `["Healing"]` | `["EnduranceReduction", "Fly"]` |
| Air Superiority | `["Accuracy", "Damage", "Run Speed"]` | `["Accuracy", "Damage", "EnduranceReduction", "Recharge"]` |
| Combat Jumping | `["Defense", "Knockback"]` | `["Defense", "EnduranceReduction", "Jump"]` |
| Super Jump | `["Knockback"]` | `["EnduranceReduction", "Jump"]` |
| Hasten | `["Run Speed", "Sleep"]` | `["Recharge"]` |

Pattern: every pool checked has the wrong values, often missing entries
and substituting unrelated boost types. Not yet checked across primary /
secondary / epic powersets, but assume the same systemic issue.

## Where the bug is NOT

- The conversion script [scripts/convert-pool-powers.cjs](scripts/convert-pool-powers.cjs) (lines 149–152)
  reads `rawJson.boosts_allowed` and maps via `BOOST_TYPE_MAP` /
  `BIN_BOOST_MAP` in [scripts/convert-powerset.cjs](scripts/convert-powerset.cjs) (lines 82–162).
  These mapping tables are correct: `"Heal" → "Healing"`,
  `"SpeedFlying" → "Fly"`, `"EnduranceDiscount" → "EnduranceReduction"`,
  `"SpeedRunning" → "Run Speed"`, etc.
- `allowedSetCategories` is correct on Rebirth (Hover still gets Flight
  / Universal Travel sets), so set bonuses work — only the single-IO
  picker is wrong.

## Likely root cause

The Rebirth raw JSON's `boosts_allowed` array itself contains the wrong
boost-type strings. That output comes from the bin-crawler parser
reading `bin_powers.pigg` from the Rebirth assets directory.

The substitution pattern (Healing where EndRdx/Fly should be,
Knockback where Jump should be, Sleep where Recharge should be)
suggests the parser is reading shifted indices into the boost-type
string table — the same kind of binary-layout drift CLAUDE.md warns
about for post-2025 HC patches ("field 45b" between `box_size` and
`range`). Rebirth's `bin_powers.pigg` may have a different layout or
a new field the parser doesn't auto-detect, throwing off subsequent
field offsets.

## Reproduction (for whoever picks this up on the PC)

1. Make sure `raw_data_rebirth` is present and `bin_powers.pigg` is
   loadable by `tools/bin-crawler/`.
2. Run the bin-crawler exporter against Rebirth (`py -3 -m bin_crawler.export_powers --assets-dir <rebirth-assets>`)
   and inspect the JSON for `Pool.Flight.Combat_Flight` (Hover) — the
   `boosts_allowed` field should be `["Buff_Defense", "EnduranceDiscount", "SpeedFlying"]`
   but will likely contain `["Buff_Defense", "Heal"]` or similar.
3. Run the same exporter against HC and compare the two JSON files
   side-by-side for the same `full_name`. Diff the surrounding fields
   too — a layout shift that throws off `boosts_allowed` will usually
   leave footprints (off-by-one in nearby u4 / array fields).
4. Investigate in [tools/bin-crawler/bin_crawler/parser/_powers.py](tools/bin-crawler/bin_crawler/parser/_powers.py)
   and `_dataclasses.py` — the field that immediately precedes the
   boost-type array in the binary layout is the most likely culprit
   (size mismatch shifts every field after it).

## Workaround in production

None applied. A welcome-modal "known issue" note has been added so
users see it. We considered shipping per-power overrides in
[src/data/datasets/rebirth/overrides/power-pools.ts](src/data/datasets/rebirth/overrides/power-pools.ts)
but rejected that approach: the bug touches every pool and likely
every powerset, so an override file would balloon, rot, and mask the
parser fix.

When the parser fix lands, regenerate Rebirth via the standard pipeline
and verify a handful of pool powers (Hover, Fly, Hasten, Combat Jumping,
Super Jump) before declaring it fixed.

## Related

- [CLAUDE.md](CLAUDE.md) — "Note on format changes" warning about
  binary layout drift between HC patches.
- [PARSER_TODO.md](PARSER_TODO.md) — general parser TODO list.
- [MULTI_DATASET_PLAN.md](MULTI_DATASET_PLAN.md) — Rebirth integration
  plan; this is one more workstream item under verification.
