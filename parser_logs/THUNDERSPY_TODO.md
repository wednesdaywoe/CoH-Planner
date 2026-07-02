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

**DONE — mez magnitudes & offensive knockback (2026-07-02).** The applied mez is
named ONLY in the index array; the front string is the enhancement/duration
CATEGORY, so front != applied mez (Blind/Fossilize front `Immobilize` → **Held**,
Freeze Ray front `Sleep` → **Held**, Cobra front `Stun` → `Stunned`). The parser
was reading the front, so every mez was **mislabelled at a flat Mag 1** (Blind
emitted `immobilize Mag 1`), not merely the `Ones`-front ones. Two binary facts
recovered `_parse_effect_template_thunderspy`:
- **Type from the index array.** Relabel `attribs` to the lone index mez attrib
  (`Held/Immobilized/Stunned/Sleep/Confused/Terrorized/Afraid`). Verified: index
  type == HC on **415/422** shared powers (the 7 are genuine tspy reworks, e.g.
  Future_Pain Fear→Stun). `*_Res_Boolean` tables are mez PROTECTION, not applied —
  excluded.
- **Magnitude from the post-table slot (k+12), not the flat header `magnitude`.**
  This is the HC Parse7 `table scale duration MAGNITUDE` slot the parser used to
  discard. Verified == HC's magnitude **exactly** where tspy didn't rebalance (338
  exact; the 80 "misses" are all the systematic HC Controller +1 Mag, `hc=4 tspy=3`).
- **Offensive KB/KU** relabeled from a `Ones` front only when INSTANT (duration 0)
  and positive — the AoE knockdowns/ups (Foot Stomp / Tremor / Dragon's Tail 0.67,
  Geyser / Tidal Wave). Durational / negative / huge-scale KB (anti-KB protection,
  held-target ground-lock, self KB-protection) stays `Ones`, excluded (GAME-DATA §3).
  Front-real `Knockback` (Power Push) already routed through the converter.

**The traps (an adversarial Workflow of 5 skeptics vetted the recovery):**
- **Target-trap** — a Self/ally-only self-buff whose index names a mez (Power Boost /
  Build Up / Aim = +mez-strength; the Incarnate `+mez-strength` defs) reads as an
  applied hold once the schema drops the per-template target. `guardThunderspyAppliedMez`
  ([convert-powerset.cjs](../scripts/convert-powerset.cjs)) drops the applied-mez/KB
  keys when the power's `targets_affected` names no foe — kept for PBAoE controls the
  caster casts on Self (Psychic Wail, EMP Pulse, Mud Pots) which still list `Foe` (§7).
  Audit: 891/891 recovered mez/KB powers are foe-facing, 0 leaks.
- **Sign-trap** — a negative-scale mez on a DURATION table is a debuff/duration
  artifact, not applied (Time Stop's scale -0.25 `Stun` on Ranged_Stun surfaced as a
  phantom Mag-1 stun on a pure Hold). The direct-mez branch now skips it (tspy-scoped;
  mez PROTECTION on `*_Res_Boolean` is kept at any sign).
- **Incarnate mez-mag bug (cross-dataset, fixed).** `convert-incarnate-effects.cjs`
  labelled `Held Mag ${scale}` (the DURATION slot) → every Judgement hold read "Mag 12"
  for a real Mag 4 on HC, Rebirth AND tspy; now reads `magnitude`.

Guard test: [thunderspy-mez-knockback.test.ts](../src/data/thunderspy-mez-knockback.test.ts).

**Residual (small, non-blocking):** Taunt/Placate/Untouchable/Intangible index mez are
relabeled-but-inert (the converter has no applied path for them); Spectral Wounds /
Poison Gas Arrow advertise Sleep but their tspy template is scale-0 / stripped (no
magnitude to surface); the **damage-type** combo TAG on `['Ones']` fronts stays excluded
(idx_count>1) so it can't inject phantom damage. HC/Rebirth encode some armor
mez-PROTECTION as negative-scale `*_Ones` (shown as phantom applied mez) — a **separate**
pre-existing question, deliberately NOT touched here (the sign-guard is tspy-scoped).

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
`recoverThunderspyOnesBuffs` retired, 2026-07-02), **applied mez type+magnitude &
offensive knockback** (index-array type + k+12 magnitude; target-trap + sign-trap
guards; incarnate mez-mag `scale`→`magnitude` cross-dataset fix, 2026-07-02). App:
Thunderspy selectable dataset,
Primalist AT + form mechanics, Tarantula Widow branch, **real IO-set extraction**
(212 sets — Subaluwa + Primalist ATOs, wrong HC-only sets removed, 2026-07-01),
**ATO-category slotting** (tspy bin omits per-power ATOs → inferred, 2026-07-02),
**per-server epic-pool prereqs** (tspy epic is flat, no tier gating, 2026-07-02),
custom icon backfill (**~232**: 83 + 149), server-switch fix, CI deploy heap fix.
