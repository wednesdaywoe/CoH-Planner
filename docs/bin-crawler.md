---
project: coh-sidekick-beta
kind: reference
title: Bin Crawler — usage, accuracy, binary layout
---

# Bin Crawler

Reference material for the vendored binary parser. Split out of `.claude/CLAUDE.md` on
2026-08-13 — it is needed while working *on* the parser, not on every request.

`tools/bin-crawler/` is VENDORED from `coh-sidekick-1.0` and must not be edited here. See
`.claude/CLAUDE.md` for the vendoring rules and the re-export discipline.

## Assets-dir resolution

The exporter and HTTP server read directly from `.pigg` archives via `BinResolver`, which uses
Pigg Wrangler's `PiggArchive` under the hood.

**CLI export tools** (`export_powers`, `export_salvage`, `export_classes`, `export_entities`,
`dump_template_bytes`, `audit_stack_alignment`): point at an assets directory with
`--assets-dir`. Omit it and the shared resolver (`bin_crawler/assets_dir.py`) uses the
**remembered path**, else opens a **folder picker** (tkinter), saving the choice to
`~/.config/bin-crawler/config.json` (`%APPDATA%\bin-crawler\config.json` on Windows).

- `--pick` re-opens the picker; the flag always overrides, so scripts and CI stay deterministic.
- Headless falls back to a typed prompt.
- The diff tool selects an assets *root* under a separate `assets_root` key.
- `--source NAME=PATH` is the advanced multi-source mode (loads synchronously, no cogwheel).

**The web server (`-m bin_crawler`) does NOT block on a picker.** It binds its port immediately
and parses the remembered folder in a background thread, so the Sidekick Launcher's port-based
status detection sees it online at once. The folder is set or changed from the web UI's
**⚙ cogwheel** (`/api/set-assets-dir`, mirroring Pigg Wrangler).

## Export scope

- 5,277 player powers across 610 powersets in 34 categories (last verified 2026-03-28).
- Effect template parsing covers attribs, aspect, table, scale, duration, magnitude.
- 96 attrib indices mapped, verified by cross-referencing 7,687 powers against CoD2 data.

## Verification results (against 7,687 CoD2 reference powers)

| Template Field | Accuracy | Notes |
|---|---|---|
| aspect | **100%** | Encoded as value*8 in binary |
| table | **100%** | String table offset |
| target | **100%** | Fixed: Self, SelfAndPets, AnyAffected, AnyAffectedAndPets, etc. |
| magnitude | **100%** | Perfect match |
| scale | **99.99%** | 3 diffs from float32 precision |
| stack_limit | **98.86%** | Minor parsing issues in some templates |
| caster_stack | **97.63%** | Added Collective mapping |
| stack_key | **97.29%** | Some truncated string offsets |
| stack | **96.02%** | Added Extend, Overlap, Refresh, Continuous, etc. |
| attribs | **93.1%** | Remaining 7% are unmapped exotic indices |
| application_type | **79.31%** | CoD2 re-labels based on context (see below) |
| type | **78.85%** | CoD2 re-labels based on context (see below) |

**On type/application_type (79%):** the binary stores consistent enum values, but CoD2 applies
semantic re-labeling based on attrib context. Mez templates (Held, Stunned) use binary type=0
(Magnitude) where CoD2 relabels as "Duration". The underlying data is correct — a naming
convention difference, not a parsing error.

The 100% accuracy on aspect, table, and magnitude means the data the planner uses for stat
calculations is correct. The gaps below matter only when fully replacing the CoD2 archive.

## Known gaps

- **Unmapped `Unknown(N)` attrib indices (~7% of templates)** — exotic attribs like
  `Toxic_Elusivity`, `Revoke_Power`, `InterruptTime`. The planner handles the ~69 common attribs.
  Only surfaces if a specific power shows broken data.
- **Unmapped `type`/`application_type`/`target` enum values (82.9% match)** — ~17% of templates
  carry values beyond the common 0–1 range (Expression-based, AoE targets, pet targets). Some
  edge cases in damage/heal calculations could be affected.
- **Enum naming alignment** — cosmetic: "Caster" vs "Self", "Character" vs "SingleTarget".
- **`suppress_events` not folded in by the converter** — Hide's AoE-defense suppression. A
  converter-side task, tracked in `streams/HOMECOMING_PARSER.md`.
- **`fx`** (cosmetic visual effects) is genuinely unparsed and irrelevant to the planner.

Template tail fields are otherwise parsed natively as of 2026-07-05: `EffectTemplate`
(`tools/bin-crawler/bin_crawler/parser/_dataclasses.py`) carries `cancel_events`,
`suppress_events`, `required_events`, and `flags` (with `flags_raw`/`flags2_raw` —
`IgnoreResistance` 0x420, `IgnoreStrength` 0x430, and `CopyBoosts`/`PseudoPet` in the second
word). The converter honors `IgnoreStrength`/`IgnoreResistance` from this native parse, **no
longer from CoD2**.

## Binary layout notes

- Attrib indices are stored as `value * 4` (byte offsets into a 4-byte-per-entry table).
- Aspect is stored as `value * 8` (byte offset), not a simple enum index.
- After field 73 (boosts_allowed): field 74 is boostset_cats (string_array), fields 75–78 are
  mode arrays (u4_arrays), then 2 unknown u4s, then the effects struct_array.
- Effect group: 2 pre-fields + chance/ppm/delay/radii + requires + flags/eval_flags + templates
  struct_array.
- Template: attribs(u4_array) + aspect(u4*8) + type/app/target(u4s) + unknown(u4) + table(str) +
  scale/dur/mag(f4s) + …
