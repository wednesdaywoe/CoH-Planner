# Thunderspy — Remaining Follow-ups

Thunderspy is live and testable (all ATs incl. Primalist, correct levels, damage
element types, custom icons, server selector, real IO sets). These are the
**non-blocking** follow-ups, roughly in priority order. Full context lives in
[THUNDERSPY SUPPORT PROGRESS.md](../THUNDERSPY%20SUPPORT%20PROGRESS.md) and
[THUNDERSPY-PARSER-LOG.md](THUNDERSPY-PARSER-LOG.md).

> Last verified 2026-07-02.

---

## 1. `Ones`-attrib buffs lose their modified attribute — recharge/recovery DONE, mez/KB remaining — PARSER

**State:** Thunderspy's older AttribMod schema stores TWO attrib fields per
effect template: the FRONT string-offset array (the *enhancement aspect* —
`Damage` / `Ones` / `Buff_Def`) and, right after the `requires` array, an INDEX
array `[pad, pad, marker, someval, count, count×(attribIndex*4)]` = the
**affected/modified** attribute. The parser historically read only the front
array, so `Ones`-based buffs (Hasten's recharge, mez magnitudes, immob/KB, …)
lost their modified stat.

**DONE — defense (2026-07-02):** index-array fallback for empty-front / `Buff_Def`
tables (see the defense RESOLVED entry in the parser log).

**DONE — recharge / recovery / regeneration / endurance (2026-07-02):**
`_parse_effect_template_thunderspy`
([_powers.py](../tools/bin-crawler/bin_crawler/parser/_powers.py)) relabels a lone
`['Ones']` front to the index-array attrib when the index names EXACTLY ONE stat in
`{RechargeTime, Recovery, Regeneration, Endurance}` (`ATTRIB_NAME_THUNDERSPY` adds the
verified **RechargeTime = index 89** divergence; HC/Rebirth use 90). Recovered the whole
recharge-buff/debuff class — Hasten, Quickness, Accelerate Metabolism, Speed Boost (incl.
its ally +recovery), Siphon Speed / Cryonic -recharge, the Alpha `Recharge_*` incarnates —
plus +/- recovery/regen/endurance. The shortHelp workaround `recoverThunderspyOnesBuffs`
is **retired** (it had mislabeled Enforced Morale's ally +99% Knockback template as a
caster +99% recharge — that bug is gone).

**The catch — Thunderspy drops BOTH the AttribMod `aspect` AND the per-template `target`.**
Those are exactly the fields HC uses to tell a buff from a resistance and a self-effect from
a foe-effect, so the relabel alone can't (an adversarial audit caught this): a `Ones`
"resistance to recharge slow" (Grant Cover's +RES(Recharge Debuff), the Kheldian
Absorption/Incandescence passives, Cosmic/Dark Balance slow-resist, stray placeholders like
Boost Range / Temporal Manipulator) is byte-identical to a real +recharge buff (**aspect-trap**),
and a positive Recovery/Regen template on a FOE attack (Disrupting Torrent, Touch of Fear)
reads as a caster self-buff (**target-trap**). The only signals that survive into the export
are the power's `target_type` and resolved shortHelp, so `guardThunderspyOnesBuffs`
([convert-powerset.cjs](../scripts/convert-powerset.cjs)) vetoes both classes: keep a
recovered `rechargeBuff` only if shortHelp advertises `+Recharge`/`+Rech`; drop
`recoveryBuff`/`regenBuff` on Foe/Location powers (`enduranceGain` exempt — a foe Electric
attack's +End is a genuine drain-to-self). Guard test:
[thunderspy-ones-recharge-buff.test.ts](../src/data/thunderspy-ones-recharge-buff.test.ts).
See the RESOLVED entry in the parser log for the diff / verification detail.

**Also RESOLVED — pet target-trap (the flagged "verify in-game" residual).** The 15 MM
pet-upgrade powers' identical +15% `recoveryBuff` (plus Repair's `enduranceGain` and Fortify
Pack's `regenBuff`/`defenseBuff`) were pet buffs leaking to the caster: the power's
`target_type='Self'` (the MM casts the auto-pulse PBAoE on itself) but `targets_affected=['MyPet']`
— the effects land on the henchmen. `guardThunderspyOnesBuffs` now drops caster-facing
recovery/regen/endurance/defense when `targets_affected` is pet-only, shortHelp-aware so Rally the
Militia ("Self, Pets +Defense, +Regeneration") keeps its genuine Self buff. 18 generated files,
deterministic, full suite 682 pass.

**Remaining — mez magnitudes & knockback (MED value, MED effort).** The index
array ALSO names ~1,300 player `['Ones']`-front **mez** templates (Blind→Held,
Freeze Ray→Held, Tesla Cage→Held, Terrify→Terrorized, …) and ~1,650 **knockback**
templates. Both are deliberately still excluded:
- **Mez** needs a magnitude the `Ones` template doesn't carry — its `magnitude`
  is a flat 1.0 and the real Mag rides `scale × table`; the converter's
  `makeMezEffect` reads `template.magnitude`, so a naive relabel would emit Mag-1
  holds. Recovering it means teaching the converter the tspy `*_Ones` mez
  scale→magnitude convention (validate against in-game Mags, not HC — tspy
  rebalances).
- **Knockback** needs sign-vs-protection care (offensive KB vs -KB immob
  protection — GAME-DATA-PRINCIPLES §3).
- **Damage-type** index on a `['Ones']` front is an AttackType/combo TAG template
  (appears on Aim/Assault/Build Up — powers with no direct damage) and must STAY
  excluded, or it injects phantom damage.
Scope per effect kind; never a blanket front→index swap (front `Damage` ↔ index
`Lethal_Dmg` etc.).

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
post-`requires` index array, 2026-07-02), **`Ones`-front recharge/recovery/regen/
endurance recovery** (index-array relabel + `RechargeTime`=idx 89; shortHelp
`recoverThunderspyOnesBuffs` retired, 2026-07-02). App: Thunderspy selectable dataset,
Primalist AT + form mechanics, Tarantula Widow branch, **real IO-set extraction**
(212 sets — Subaluwa + Primalist ATOs, wrong HC-only sets removed, 2026-07-01),
**ATO-category slotting** (tspy bin omits per-power ATOs → inferred, 2026-07-02),
**per-server epic-pool prereqs** (tspy epic is flat, no tier gating, 2026-07-02),
custom icon backfill (**~232**: 83 + 149), server-switch fix, CI deploy heap fix.
