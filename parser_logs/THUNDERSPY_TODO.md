# Thunderspy — Remaining Follow-ups

Thunderspy is live and testable (all ATs incl. Primalist, correct levels, damage
element types, custom icons, server selector). These are the **non-blocking**
follow-ups, roughly in priority order. Full context lives in
[THUNDERSPY SUPPORT PROGRESS.md](../THUNDERSPY%20SUPPORT%20PROGRESS.md) and
[THUNDERSPY-PARSER-LOG.md](THUNDERSPY-PARSER-LOG.md).

> Scope note: HC + Rebirth + Thunderspy is the **final** dataset roster (smaller
> servers are too fragile to support). Don't build new dataset-extensibility
> abstractions for these — see the `dataset-scope-final` memory.

---

## 1. Enhancements / IO sets — replace the HC stand-in (HIGH value, MED effort)

**State:** `src/data/datasets/thunderspy/io-sets-raw.ts` currently **re-exports
Homecoming's** IO set registry. Enhancement slotting, set bonuses, and the
planner all *work*, but the data is HC's — any Thunderspy-specific sets,
renames, or tuned bonus values are wrong.

**Why it matters:** enhancements are central to build planning; this is the most
build-impacting gap.

**Fix:** port `scripts/extract-rebirth-io-sets-v2.py` to a Thunderspy mode. It's
hardcoded to HC/Rebirth asset paths (`REBIRTH_ASSETS = 'G:/…/rebirth'`, no
CLI/env override) — add an `--assets-dir` / env override and point it at
`…/Sweet Tea/tspy`. The bin parser already reads Thunderspy `boostsets.bin`
(212 IO sets parse cleanly), so the work is mostly wiring the extractor's paths
+ writing `io-sets-raw.ts`, then swapping the re-export.

**Cross-check source:** the Discord Mids-DB drop (`Thunderspy/` — gitignored;
`EnhDB.mhd`, `Recipe.mhd`, `Salvage.mhd`, `Images/Sets/`) is an authoritative
reference for set names/bonuses.

**Verify:** spot-check a few set bonuses vs in-game / Mids; confirm slotting +
set-bonus totals still compute; re-run the suite.

---

## 2. Pets / entities — fix the entity parser (MED value, HIGH effort)

**State:** `export_entities` (VillainDef.bin) crashes on Thunderspy's older i23
record schema, so `pet-entities.ts` is an **empty stub**.

**Impact:** Mastermind henchmen, Lore/incarnate pets, and pseudo-pet (rain/patch)
**detail panels are empty**. Player power math is unaffected.

**Fix:** add a Thunderspy entity-layout variant in
`tools/bin-crawler/bin_crawler/parser/_entities.py`. Current crash:
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
- **~189 missing icons.** Lore-pet / NPC-group (`banishedpantheon_*`, `tsoo_*`,
  …), enhancement (`e_icon_*`), and archetype (`archetypeicon_*`) icons aren't
  in the tspy GUI piggs → some broken images on redirect/Lore powers. Most are
  sourceable from the **HC** texture piggs — re-run
  `scripts/extract-thunderspy-icons.py --assets-dir <…/Homecoming/assets/live>`
  (archetype icons use a separate asset path).
- **Bundle code-split (perf only).** All 3 datasets bundle into one ~14 MB chunk
  shipped to every visitor (drove the deploy heap bump to 6144 MB). Splitting
  datasets via dynamic import would cut initial page-load weight. Optional — not
  a scaling need now that the roster is final.

---

## Done (for reference)

Parser: categories, custom powersets, class attribs (HP/caps/threat/dmg-cap),
per-power available **levels**, damage **element types**, conditional-gate
labels. App: Thunderspy selectable dataset, Primalist AT + form mechanics,
Tarantula Widow branch, custom icon backfill (83), server-switch fix, CI deploy
heap fix.
