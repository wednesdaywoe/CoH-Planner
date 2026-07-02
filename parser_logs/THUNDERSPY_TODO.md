# Thunderspy — Remaining Follow-ups

Thunderspy is live and testable (all ATs incl. Primalist, correct levels, damage
element types, custom icons, server selector, real IO sets). These are the
**non-blocking** follow-ups, roughly in priority order. Full context lives in
[THUNDERSPY SUPPORT PROGRESS.md](../THUNDERSPY%20SUPPORT%20PROGRESS.md) and
[THUNDERSPY-PARSER-LOG.md](THUNDERSPY-PARSER-LOG.md).

> Last verified 2026-07-02.

---

## 1. `Ones`-attrib buffs lose their modified attribute — general recovery (HIGH value, MED effort) — PARSER

**State:** Thunderspy's older AttribMod schema stores TWO attrib fields per
effect template: the FRONT string-offset array (the *enhancement aspect* —
`Damage` / `Ones` / `Buff_Def`) and, right after the `requires` array, an INDEX
array `[pad, pad, marker, someval, count, count×(attribIndex*4)]` = the
**affected/modified** attribute (`attribIndex*4 → ATTRIB_NAME`; front `Ones` ↔
index `Knockback` / `Endurance` / `Recovery` / `Regeneration` / `Stunned` /
`Held` / damage types, front `Damage` ↔ index `Lethal_Dmg`). The parser
historically read only the front array, so `Ones`-based buffs (Hasten's
recharge, mez magnitudes, immob/KB, mez protection, …) lost their modified stat.

**Partly done (2026-07-02):** `_parse_effect_template_thunderspy`
([_powers.py](../tools/bin-crawler/bin_crawler/parser/_powers.py)) now reads the
index array (a) as a fallback when the front is empty and (b) for `Buff_Def`
tables — that fixed **defense** (see the RESOLVED entry in the parser log). Also
raised the `_resolve_str` 200000 offset cap to `len(strtab_data)` (tspy's string
table is ~38 MB), recovering 8,738 templates' attribs. A shortHelp-driven
converter workaround (`recoverThunderspyOnesBuffs`) recovers exactly 3 recharge
pool powers (Hasten, Adrenal Booster, Unleash Potential).

**Remaining:** generalise the index-array read to the other `Ones` effect kinds
(recharge on ally/team buffs like Speed Boost/Chrono Shift, mez magnitudes,
etc.). Front and index are DIFFERENT fields (front `Damage` ↔ index
`Lethal_Dmg`), so a blanket swap would change damage/mez representation across
the dataset — **scope per effect kind**. Decoded over all `['Ones']`-front
templates the index array names the real effect for ~19k of them (~4k genuinely
carry no index array). Once done, drop the shortHelp workaround.

## 2. Pets / entities — fix the entity parser (MED value, HIGH effort) — PARSER

**State (verified 2026-07-02 — still crashes):** `export_entities` (VillainDef.bin)
throws `ValueError: Read of 4 bytes at offset 465012 would exceed record
boundary` on Thunderspy's older i23 record schema, so `pet-entities.ts` is a
14-line **empty stub**.

**Impact:** Mastermind henchmen, Lore/incarnate pets, and pseudo-pet (rain/patch)
**detail panels are empty**. Player power math is unaffected.

**Fix:** add a Thunderspy entity-layout variant in
`tools/bin-crawler/bin_crawler/parser/_entities.py`. Crash path:
`_parse_entity_parse7` → `_parse_level_sub` → `read_string_array` overruns the
record boundary (the `levels` sub-record), i.e. a field count/order mismatch vs
HC's Parse7 entity layout. Probe field-by-field like the powers/classes work
(see the resolved entries in the parser log for the pattern). Then re-run
`export_entities` + `convert-pet-entities.cjs` and populate `pet-entities.ts`.

---

## 3. Smaller / cosmetic

- **Damage secondary element types.** Multi-type powers collapse to the primary
  element (`DMG(Energy/Toxic)` → Energy), and powers whose tooltip lacks
  `DMG(...)` (e.g. Pale Wind = "Repel, Fester", element only in prose) stay
  `Special`. Magnitudes are correct — this is label-only. A `display_help`
  prose-parse fallback could recover some, but it's fragile; treat as opt-in.
- **~40 missing icons (was ~189; 149 extracted 2026-07-02).** The remainder are
  Lore-pet / NPC-group (`banishedpantheon_*`, `tsoo_*`, …), enhancement
  (`e_icon_*`), and archetype (`archetypeicon_*`) icons that aren't in ANY local
  Sweet Tea pigg (tspy folder or sibling `piggs/`). `extract-thunderspy-icons.py`
  now scans the sibling base `piggs/` folder too (that's where the recovered 149,
  incl. the `awakened_*` Psychokinetic/Telekinetic Assault icons, lived —
  `piggs/stage1b.pigg` texture_library). The last 40 need HC/other texture piggs
  (`--assets-dir <…/Homecoming/assets/live>`) — verify they're actually there.
- **Bundle code-split (perf only).** All 3 datasets bundle into one ~14 MB chunk
  shipped to every visitor (drove the deploy heap bump to 6144 MB). Splitting
  datasets via dynamic import would cut initial page-load weight. Optional — not
  a scaling need now that the roster is final.

---

## Done (for reference)

Parser: categories, custom powersets, class attribs (HP/caps/threat/dmg-cap),
per-power available **levels**, damage **element types**, conditional-gate
labels, DoT `tickRate` (application_period), **defense magnitudes** (offset-cap +
post-`requires` index array, 2026-07-02). App: Thunderspy selectable dataset,
Primalist AT + form mechanics, Tarantula Widow branch, **real IO-set extraction**
(212 sets — Subaluwa + Primalist ATOs, wrong HC-only sets removed, 2026-07-01),
**ATO-category slotting** (tspy bin omits per-power ATOs → inferred, 2026-07-02),
**per-server epic-pool prereqs** (tspy epic is flat, no tier gating, 2026-07-02),
custom icon backfill (**~232**: 83 + 149), server-switch fix, CI deploy heap fix.
