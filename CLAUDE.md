# CoH-Planner Development Notes

## Development Philosophy

Prefer fixing root problems properly over quick fixes. The planner handles complex game mechanics with many interacting systems (AT tables, enhancement calculations, power effects, set bonuses). Band-aid fixes create compounding issues that are harder to debug later. When a bug surfaces, investigate whether it's a symptom of a deeper systemic issue before patching the surface behavior. This is essential for making the app reliable and maintainable.

## Source Data Divergence

The raw source data (`raw_data_homecoming-*`) is gitignored due to the enormous number of files. This project exists on two machines (PC and Laptop), each with their own local copy of the source data.

**Current divergence (as of 2026-03-28):**

On Laptop, the source data was manually edited to reflect Homecoming's recent brute modifier changes. HC updated brute AT modifiers but did NOT update the power definition files in the `.bin` archives — we infer HC is modifying these values at runtime (server-side overrides). This is the same pattern seen with recent Sentinel changes.

PC source data does **not** reflect these brute modifier edits.

There is currently no reliable automated way to extract these runtime-modified values from HC. Any future AT modifier discrepancies should be investigated with this in mind — the `.bin` files may not be the source of truth for all values.

## Bin Parser Export

Goal: Generate CoD2-compatible structured JSON from the binary parser, filtered to only the 34 player-relevant categories (out of 204 total). This replaces the dependency on the external City of Data 2.0 raw data archive (thousands of NPC/critter files we don't need).

### Current State (2026-03-28)

The export is functional and verified. Run with: `py -3 power_stats/export_powers.py`

- **5,277 player powers** exported across 610 powersets in 34 categories
- Effect template parsing implemented with core fields: attribs, aspect, table, scale, duration, magnitude
- 96 attrib indices mapped and verified by cross-referencing 7,687 powers against CoD2 data
- Key files: `_dataclasses.py` (EffectGroup/EffectTemplate), `_enums.py` (ATTRIB_NAME, aspect/type/stack enums), `_powers.py` (effect parser), `export_powers.py` (export script)

### Verification Results (against 5,228 CoD2 reference powers)

| Template Field | Accuracy | Notes |
|---|---|---|
| aspect | **100%** | Encoded as value*8 in binary |
| table | **100%** | String table offset |
| magnitude | **99.96%** | 6 diffs from float32 precision |
| attribs | **93.1%** | Remaining 7% are unmapped exotic indices |
| duration | **92.4%** | Some formatting differences |

### Remaining Tasks (low priority — not blocking current use)

**Fill remaining `Unknown(N)` attrib indices (~7% of templates)**
Mostly exotic attribs like `Toxic_Elusivity`, `Revoke_Power`, `InterruptTime`. The planner handles the ~69 common attribs already. Only matters if a specific power shows broken data.

**Map remaining `type`/`application_type`/`target` enum values (82.9% match)**
~17% of templates have values beyond the common 0-1 range — unusual effect types (Expression-based, AoE targets, pet targets). Medium priority; some edge cases in damage/heal calculations could be affected.

**Parse template tail fields (cancel_events, suppress_events, flags, fx)**
`suppress_events` controls things like Hide's AoE defense suppression. `flags` contains `IgnoreStrength`, `CombatModMagnitude`, etc. The planner's conversion script currently gets this from CoD2. **Only becomes important when we fully replace the CoD2 dependency.**

**Enum naming alignment**
Cosmetic — "Caster" vs "Self", "Character" vs "SingleTarget". No functional impact.

**None of these block using the export today.** The 100% accuracy on aspect, table, and magnitude means the data the planner uses for stat calculations is correct. Remaining work only matters when fully replacing the CoD2 archive, and can be done incrementally.

### Binary Layout Notes

- Attrib indices are stored as `value * 4` (byte offsets into a 4-byte-per-entry table)
- Aspect is stored as `value * 8` (byte offset), not a simple enum index
- After field 73 (boosts_allowed): field 74 is boostset_cats (string_array), fields 75-78 are mode arrays (u4_arrays), then 2 unknown u4s, then the effects struct_array
- Effect group: 2 pre-fields + chance/ppm/delay/radii + requires + flags/eval_flags + templates struct_array
- Template: attribs(u4_array) + aspect(u4*8) + type/app/target(u4s) + unknown(u4) + table(str) + scale/dur/mag(f4s) + ...

### Player-Relevant Categories (34 of 204)
Blaster_Ranged, Blaster_Support, Brute_Defense, Brute_Melee, Controller_Buff, Controller_Control, Corruptor_Buff, Corruptor_Ranged, Defender_Buff, Defender_Ranged, Dominator_Assault, Dominator_Control, Mastermind_Buff, Mastermind_Summon, Scrapper_Defense, Scrapper_Melee, Sentinel_Defense, Sentinel_Ranged, Stalker_Defense, Stalker_Melee, Tanker_Defense, Tanker_Melee, Peacebringer_Defensive, Peacebringer_Offensive, Warshade_Defensive, Warshade_Offensive, Arachnos_Soldiers, Widow_Training, Teamwork, Pool, Epic, Inherent, Incarnate, Redirects
