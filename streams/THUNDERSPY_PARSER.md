---
project: coh-sidekick
kind: plan
title: Thunderspy Parser
relates:
  - THUNDERSPY_SUPPORT_PROGRESS.md
  - HOMECOMING_PARSER.md
  - REBIRTH_PARSER.md
---

# Thunderspy Parser

Running log of bugs and gaps specific to the **Thunderspy** dataset in the binary
parser → JSON conversion pipeline (`tools/bin-crawler/` + `scripts/convert-*.cjs`),
with diagnoses and recommended fixes. Newest entries at top. When an open issue is
fixed, move it to the top of the RESOLVED section with the fix details.

> **Remaining follow-ups** (enhancements/IO sets, pets/entities, minor icons) are
> tracked in the `## Deferred` section of [THUNDERSPY_SUPPORT_PROGRESS.md](THUNDERSPY_SUPPORT_PROGRESS.md).

> **Before you make any edits** read [GAME-DATA-PRINCIPLES.md](../GAME-DATA-PRINCIPLES.md).
> General (non-Thunderspy) findings live in [HOMECOMING_PARSER.md](HOMECOMING_PARSER.md);
> the broader Thunderspy support narrative is in
> [THUNDERSPY_SUPPORT_PROGRESS.md](THUNDERSPY_SUPPORT_PROGRESS.md).

> **Format orientation:** Thunderspy is **Parse7-framed** (CrypticS magic, string
> table, u4 string offsets — same framing as Homecoming) but uses a **Parse6-derived
> record schema** with **50-level modifier tables** (level cap 50, no Incarnate). It
> predates HC's schema additions and Rebirth's enum extensions, so it sits in its own
> corner of the format space. Source: `…/Thunderspy Gaming/Sweet Tea/tspy/bin.pigg`.

## Active

_No open Thunderspy parser issues in the powers pipeline._ Pet **ability** extraction
(TSPY9, generic-`Damage`) and pseudo-pet **debuff** extraction (TSPY10, the debuff
vocabulary) are both resolved in `convert-pet-entities` — see the resolved entries below.
The only remaining follow-up is `TSPY4` (pet lifespans / `self-destruct-delays.json`,
still 0 entries — despawn timing only, low priority).

**Correction to the old TSPY10 theory:** the earlier note claimed tspy pseudo-pets
"carry their damage in `Redirects.*`, not an entity record" (the HC `attachResolvedPseudoPets`
model). That is FALSE for Thunderspy — verified: tspy pseudo-pets (Caltrops, Sleet, Tar
Patch, Freezing Rain, Ice Slick, …) DO resolve to real `PET_ENTITIES` records
(`Pets_Caltrops`, `Pets_Sleet_Defender`, `Pets_TarPatch`, …), and the player power carries
only `Create_Entity`. tspy has **no `params.redirects`-style pseudo-pet chains**, so the HC
redirect path was never the right tool. The real gap was the debuff **vocabulary** — see
the TSPY10 resolved entry.

## Resolved

- [x] Thunderspy summon powers surfaced NO pet — `Create_Entity` / `EntCreate` params never extracted — 2026-07-04   verify: file:src/data/thunderspy-pet-summon.test.ts, fn:_extract_thunderspy_summons

**Symptom (user-reported).** Pet powers and pet-redirect powers showed nothing in the
info panel — **Umbra Beast** (a summon), **Shadow Field** (a location pseudo-pet), every
Mastermind henchman, every rain / chain-jump / teleport-strike pseudo-pet. The whole
converter→display summon path is gated on a template with `attribs:['Create_Entity']` +
`params:{type:'EntCreate', entity_def}` (→ `PET_ENTITIES[entity_def]`); Thunderspy's
export carried **zero** of these, so `effects.summon` was never built and the panel was
blank. This is the §1 layer-1 gap (data never extracted), not a converter bug — **no
converter/display change was needed.**

**Root cause (verified byte-level, not assumed).** HC/Rebirth carry Create_Entity as a
template *front* attrib (enum 469 / 116) with one AttribMod per pet. Thunderspy's
Parse6-derived schema instead packs the EntCreate list into a **nested struct-array**
inside a single effect element: each pet sub-entry LEADS with the byte-granular raw
marker **465** ( = index 116 << 2 | 1 — Rebirth's −1 Create_Entity index shift PLUS HC's
byte-granular +1 special-region sub-index) and carries its own `Ranged_Ones`/`Ranged_Level`
table + the EntityDef / PriorityList / redirect string offsets. The element's *front*
attrib is a bare `Ones`/`Level` summon shell. `_parse_effect_template_thunderspy` only
surfaced that shell — the nested list (and every entity_def) was dropped. The
affected-attrib INDEX array (`_idx_attribs`) never names Create_Entity for these — the
marker lives in the params block, not the index array — which is why the earlier
recharge/mez index-array recovery left summons untouched.

**Fix (`_powers.py`).** New `_extract_thunderspy_summons` splits the element at each 465
marker (one region per pet) and pulls each region's EntityDef (+ PriorityList + redirect
power-names, filtering FX asset paths), mirroring HC's `_extract_params` string-scan but
scoped per region. `_parse_effects_parse6` emits one `Create_Entity` template per pet
(params `{type:'EntCreate', entity_def, priority_list?, redirects?}`) — the exact HC
shape the converter counts (one template per pet → `entityCount`). The `Ones`/`Level`
summon shell is dropped for those fronts (HC emits no shell); a summon element with a
real-effect front (an attack that also summons — Beam's Disintegrate spread) keeps its
header AND gains the Create_Entity templates.

**Verification.** The **465-marker count == the pet count** exactly (Haunt 2 shades,
Summon Wolves 3, Rally the Militia 6, Hell on Earth 10); **809 player summon sub-entries,
0 missing EntityDef** (the only markerless edge cases are 2 NPC 5thColumn transforms with
a digit-leading entity_def, dropped by PLAYER_CATEGORIES). Re-export → the diff is
**purely additive**: +1474 `Create_Entity` templates, −1070 `Ones`/`Level`/`Levelminus*`
shells, **nothing else changed** (isolated from a pre-existing 4831-file `modes_required`
drift — the committed export predates `be736f4` — by diffing a fresh baseline, then
overlaying only the 880 summon files with the modes drift stripped). Regen → 299 generated
files, **every one a summon addition** (0 converter drift), deterministic. Marquee links
confirmed end-to-end: Umbra Beast → `Pets_Umbra_Beast`, Shadow Field → `Pets_Shadow_Field_Controller`
(auto-pulse Hold rides the entity), Haunt → `Pets_Shade` ×2. **241/687 distinct summon
entity_defs resolve to full ability data (35%); the rest surface the pet NAME** (vs nothing
before) pending the two entity-detail follow-ups above. `tsc` clean; full suite **767 pass**
(+5). Guard: [thunderspy-pet-summon.test.ts](../src/data/thunderspy-pet-summon.test.ts).

- [x] Thunderspy `Ones`-attrib buffs lose their modified attribute — ALL RESOLVED (recharge/recovery, mez, KB — see below) — 2026-07-01

> **UPDATE 2026-07-02: recharge / recovery / regeneration / endurance, AND applied
> mez type+magnitude AND offensive knockback are now all recovered data-driven from
> the index array — see the two RESOLVED entries below.** The historical byte-decode
> narrative below is kept for context.

**Symptom.** Thunderspy **Hasten** granted **no +recharge buff** and had **no
`buffDuration`**, so it contributed nothing to recharge totals *and* the perma-tracking
**"Track" button never appeared** (`isPermaEligible` needs a duration + a self-buff key).
User-reported as "Track button missing on T-spy." Broad: **24,938** Thunderspy templates
carry the attrib string `Ones`.

**Root cause (verified by byte-level decode, NOT assumed).** Thunderspy predates the
enum-coded AttribMod format and stores attribs as **generic string names**: `Damage`
(20,855×), `Ones` (24,938×), etc. `Ones` is the catch-all for any magnitude effect that
rides a `*_Ones` unit table — recharge buffs (Hasten), mez magnitudes, immobilize/KB, mez
protection. The **specific modified attribute is not stored in the effect template at all.**
Decoding Hasten's 308-byte template from `bin_powers.pigg`:
- header parses cleanly: attrib count 1 → `"Ones"` (a genuine interned string, offset 170),
  magnitude 1.0, then table `Melee_Ones` @ scale 0.7 / duration 120s;
- the two "unknown u4s" after magnitude (hypothesised in the parser comment as "Aspect +
  Target") are both **0** — aspect would resolve to `Current`, wrong for a Strength buff;
- a scan of the **entire element** finds **no `Recharge`/attribute string anywhere** —
  only `Ones`, `Melee_Ones`, and FX paths.

So `extractEffects` can't classify the `Ones` template (no `RechargeTime` attrib, blank
aspect/type) and drops it — losing both the buff magnitude and its duration. **`boosts_allowed`
is not a discriminator** (Tough & Weave, resist/def toggles, also list `Recharge` — that's the
*enhancement allowance*). **No bin-parser change can recover data that isn't in the binary.**

**Temporary workaround (converter, shortHelp-driven — shipped 2026-07-01).**
`recoverThunderspyOnesBuffs(power, powerJson)` in
[convert-powerset.cjs](../scripts/convert-powerset.cjs), called from `convertPower`'s
Thunderspy block **and** `convertPoolPower` ([convert-pool-powers.cjs](../scripts/convert-pool-powers.cjs)).
The only recoverable signal is the resolved **shortHelp** — the same fallback the damage
path already uses (`applyThunderspyDamageType`). Scoped tightly to the clear case:
- **Click**, **`targetType === 'Self'`**, shortHelp matches `/\+\s*Recharge\b/`;
- takes the first **positive-scale** `Ones` template **with a real duration** (skips
  Hasten's negative-scale, 0-duration End-crash template, and instant powers like Burnout);
- synthesises `rechargeBuff: {scale, table}` + `buffDuration`.

Recovers exactly 3 pool powers — **Hasten** (0.7/120s), **Adrenal Booster** (0.3/30s),
**Unleash Potential** (0.5/60s) — all Self, all with the recharge as their *only* `Ones`
template (ToHit/Damage/Def ride their own attribs). Guard `thunderspy-ones-recharge-buff.test.ts`.

**Known limitations (why this is a workaround, not a fix).**
- **Ally/team-targeted** `+Recharge` buffs (Speed Boost, Chrono Shift, Adrenalin Boost — ~31
  powerset powers) are intentionally **out of scope**: they're multi-buff and the single
  `Ones` template is ambiguous among +Recharge/+Recovery/+Regen, so recovering them risks
  mislabeling. Their recharge buff is still dropped.
- Even for the 3 recovered powers, a multi-buff case (Unleash Potential) *assumes* the lone
  `Ones` template is the recharge one; it's the best available guess given the shortHelp.
- Other `Ones` effect kinds (mez magnitudes, etc.) remain unrecovered.

**Proper fix.** Needs a Thunderspy attribute source that actually names the modified attribute
— either a separate Thunderspy bin/table that maps these, or confirmation from the Thunderspy
dev of where the runtime reads it. Until then the shortHelp workaround is the ceiling.

> **⚠️ CORRECTION (2026-07-02): the modified attribute IS in the binary.** The
> "no attribute string anywhere in the element" scan above looked for a *string*; the
> attribute is stored as an **enum index**, not a string. Right after the `requires` array,
> every Thunderspy template carries a second attrib list —
> `[pad, pad, marker, someval, count, count×(attribIndex*4)]` — where `attribIndex*4 →
> ATTRIB_NAME`. This is the **affected/modified** attribute (distinct from the front
> string-attrib, which is the *enhancement aspect*: front `Ones` ↔ index `Knockback` /
> `Endurance` / `Recovery` / `Regeneration` / `Stunned` / `Held` / damage types / …; front
> `Damage` ↔ index `Lethal_Dmg`). Decoded over all `['Ones']`-front templates, the index
> array names the real effect for ~19k of them (≈4k genuinely carry no index array). So the
> `Ones`/Hasten recharge loss is recoverable from the binary after all — the proper fix is to
> read this index array, NOT the shortHelp. This was found + exploited for the **defense**
> fix (see RESOLVED entry below); generalising it to recharge/mez/other `Ones` buffs is a
> larger, separate change (front vs index are different fields, so a blanket swap would
> change damage/mez representation — scope carefully per effect kind).

- [x] `export_entities` (VillainDef.bin) record-boundary overrun — RESOLVED 2026-07-02 (filed 2026-06-16)   verify: file:src/data/datasets/thunderspy/pet-entities.ts

**RESOLVED 2026-07-02.** A tolerant `_parse_level_sub` (peek count-vs-offset) handles
Thunderspy's `levels[].display_names` being a single bare-string offset vs HC/Rebirth's
length-prefixed `string_array` — the field that overran the record boundary. All **619**
Thunderspy pets now parse and `pet-entities.ts` is populated (Lore/MM/pseudo-pet ability
data). See the `VillainDef.bin` line in
[THUNDERSPY_SUPPORT_PROGRESS.md](THUNDERSPY_SUPPORT_PROGRESS.md) and memory
`thunderspy-villaindef-format`. Original diagnosis kept below.

**Symptom.** `python3 -m bin_crawler.export_entities --assets-dir <tspy>` crashes:
`ValueError: Read of 4 bytes at offset 465012 would exceed record boundary` in
`_parse_level_sub` → `read_string_array` (the per-level `display_names`), via
`_parse_entity_parse7` ([_entities.py:152](../tools/bin-crawler/bin_crawler/parser/_entities.py)).
Zero entity JSONs written.

**Likely cause.** Same family as the other Thunderspy gaps: `VillainDef.bin` uses the
older i23-era record schema, so the Parse7 entity layout reads one-or-more fields that
Thunderspy doesn't have (or in a different order), shifting the cursor until a
length-prefixed `read_string` runs off the end of the `levels` sub-record. Needs a
Thunderspy entity layout variant (probe field-by-field like the powers/classes work).

**Impact / workaround (deferred).** Entities feed `convert-pet-entities.cjs` →
`pet-entities.ts` (Lore/MM/pseudo-pet ability data). Rebirth shipped its dataset with an
**empty `PET_ENTITIES` placeholder** initially (see `datasets/rebirth/index.ts` history),
so Thunderspy can do the same: ship with `petEntities: {}` and fix the entity parser
later. Player power math is unaffected; only summoned-pet detail panels are.


- [x] Thunderspy applied mez type+magnitude & offensive knockback recovered from the index array — 2026-07-02

**Symptom.** Every Thunderspy control power was wrong. Blind / Fossilize / Block of Ice /
Tesla Cage emitted `immobilize Mag 1` when they are **Mag-3 Holds**; Cobra Strike kept its
Stun type but at **Mag 1** not Mag 3; every `Ones`-front mez (Tesla Cage's PvE hold) and
every AoE **knockdown** (Foot Stomp, Tremor, Dragon's Tail) was **dropped entirely**.

**Root cause (verified, not assumed).** This schema names the APPLIED mez only in the
post-`requires` INDEX array; the FRONT string is the enhancement/duration CATEGORY, so it
routinely disagrees with the applied mez (Blind front `Immobilize` → index `Held`; Freeze
Ray front `Sleep` → index `Held`). The parser read the front, so front-real mez was
**mislabelled** and `Ones`-front mez was unclassifiable. Worse, the real **Magnitude** rides
the post-table slot (`table scale duration MAGNITUDE` — the k+12 float the parser used to
discard), *not* the flat header `magnitude` (a 1.0/0.2 placeholder), so even correctly-typed
mez read Mag 1.

**Fix — `_parse_effect_template_thunderspy` ([_powers.py](../tools/bin-crawler/bin_crawler/parser/_powers.py)).**
Relabel `attribs` to the lone index mez attrib (`_TSPY_MEZ_INDEX` = Held/Immobilized/Stunned/
Sleep/Confused/Terrorized/Afraid) and adopt the k+12 magnitude; exclude `*_Res_Boolean` tables
(mez PROTECTION, not applied). Offensive KB/KU (`_TSPY_KB_OFFENSIVE`) is relabeled from a `Ones`
front only when INSTANT (duration 0) and positive — durational/negative/huge-scale KB is
anti-KB protection (§3), left excluded; front-real `Knockback` already routed through the
converter. Verification: index type == HC on **415/422** shared powers (7 = tspy reworks);
k+12 == HC magnitude on **338** exact, the 80 "misses" all the systematic HC Controller +1
Mag (`hc=4 tspy=3`); the whole export diff is purely `attribs`+`magnitude` (no scale/table/
duration drift).

**The traps (an adversarial Workflow of 5 skeptics vetted the recovery, per §7):**
- **Target-trap** — the schema drops the per-template target, so a Self/ally-only self-buff
  whose index names a mez (Power Boost / Build Up / Aim = `+mez-strength`; Incarnate defs) reads
  as an applied hold. `guardThunderspyAppliedMez` drops the applied-mez/KB keys when the power's
  `targets_affected` names no foe — kept for PBAoE controls cast on Self that still list `Foe`
  (Psychic Wail, EMP Pulse, Mud Pots). Audit: 891/891 recovered powers foe-facing, **0 leaks**.
- **Sign-trap** — a negative-scale mez on a DURATION table is a debuff/duration artifact, not
  applied (Time Stop's scale -0.25 `Stun` on Ranged_Stun → phantom Mag-1 stun on a pure Hold).
  The direct-mez branch now skips it (Thunderspy-scoped; mez PROTECTION on `*_Res_Boolean` kept
  at any sign — the dashboard's `isProtectionMez` re-reads it). HC/Rebirth encode some armor
  mez-protection as negative-scale `*_Ones` (a separate pre-existing question) — deliberately not
  touched, hence the tspy scope.
- **Incarnate mez-mag bug (cross-dataset, fixed).** `convert-incarnate-effects.cjs` labelled
  `Held Mag ${scale}` (the DURATION slot) → every Judgement hold read "Mag 12" for a real Mag 4
  on HC, Rebirth AND tspy; now reads `magnitude`.

Guard test: [thunderspy-mez-knockback.test.ts](../src/data/thunderspy-mez-knockback.test.ts).
Residual: Taunt/Placate/Untouchable/Intangible index mez relabel-but-inert (no converter path);
Spectral Wounds / Poison Gas Arrow advertise Sleep but their tspy template is scale-0/stripped;
the damage-type combo TAG on `['Ones']` fronts stays excluded (idx_count>1) — no phantom damage.

- [x] Thunderspy `Ones`-front recharge / recovery / regen / endurance buffs recovered from the index array — 2026-07-02

**Symptom.** Every Thunderspy `Ones`-front recharge buff (Hasten, Quickness, Accelerate
Metabolism, Speed Boost, the Alpha `Recharge_*` incarnates, …) and +/- recovery/regen/
endurance buff was silently dropped — `extractEffects` can't classify a bare `['Ones']`
attrib. A shortHelp workaround (`recoverThunderspyOnesBuffs`) reconstructed exactly 3
Self recharge powers and *mislabeled* Enforced Morale's ally +99% Knockback template as a
caster +99% recharge buff.

**Root cause (verified — the modified attrib IS in the binary, as an INDEX not a string).**
Right after the `requires` array each template carries an affected-attrib index array
(`idx*4 → attrib`). For `['Ones']`-front templates it names the real stat. TWO findings
by byte-level recon over all 56,467 tspy templates:
1. **Thunderspy stores `RechargeTime` at index 89** (HC/Rebirth: 90) — so it decoded as
   `Unknown(89)` and was dropped. Confirmed: 837 index entries hit 89 and EVERY carrying
   power is recharge-related (Hasten 0.7, Quickness 0.2, AM 0.3, Speed Boost 0.5, +the
   `Recharge_*` temps; -recharge on Siphon Speed / Cryonic / Liquefy).
2. The `['Ones']`-front index bucket is otherwise **heterogeneous and noisy** (damage
   types, mez, KB, `Set_Mode`/`Rage`/`Taunt`/`Create_Entity`, and combo-marker
   `Unknown(465–478)`), so a blanket front→index swap is unsafe.

**Fix.** `ATTRIB_NAME_THUNDERSPY = {**ATTRIB_NAME, 89: "RechargeTime"}`
([_enums.py](../tools/bin-crawler/bin_crawler/parser/_enums.py)); the tspy template parser
([_powers.py](../tools/bin-crawler/bin_crawler/parser/_powers.py)) decodes the index array
with it and relabels a lone `['Ones']` front to the index attrib **only when the index
names EXACTLY ONE stat in `{RechargeTime, Recovery, Regeneration, Endurance}`** (raw index
count == 1). Sign routes buff vs debuff. Damage/mez/KB/exotic/multi-attrib indices are left
as `['Ones']` (dropped, exactly as before → zero regression). The shortHelp hack + its two
call sites + module export were removed.

**The aspect/target trap (found by adversarial audit) + the converter guard.** The relabel is
honest at the ATTRIB level, but Thunderspy's schema **drops both the AttribMod `aspect` and the
per-template `target`** — precisely the fields HC uses to separate a buff from a resistance and a
self-effect from a foe-effect. So the relabel alone mis-emits two classes:
- **Aspect-trap.** A `Ones` "resistance to recharge slow" is byte-identical to a +recharge buff
  once aspect is gone (the two u4s after magnitude decode to `(0,0)` for BOTH). Casualties: Grant
  Cover (+RES(Recharge Debuff)), Kheldian **Absorption**/**Incandescence** passives, Cosmic/Dark
  Balance slow-resist, and stray placeholders (Boost Range, Temporal Manipulator scale 10,
  Interrupt_* incarnates) — all emitted a phantom +recharge buff.
- **Target-trap.** A positive `Recovery`/`Regeneration` template on a FOE attack (Disrupting
  Torrent, Touch of Fear) becomes a caster self-buff — the converter's RESOURCES branch keys on
  scale sign with no `isSelfTargeting` guard (unlike its KB/movement siblings), and tspy's
  `target=''` never trips it.

The only discriminators that survive into the export are the power's `target_type` and resolved
shortHelp. `guardThunderspyOnesBuffs`
([convert-powerset.cjs](../scripts/convert-powerset.cjs), run from both `convertPower` and
`convertPoolPower`) vetoes both: keep a recovered `rechargeBuff` **only if shortHelp advertises
`+Recharge`/`+Rech`** (every true positive does — Hasten "Self +Recharge", Quickness, Speed Boost,
AM, Clear Skies "+Rech"; no resistance/placeholder one does); drop `recoveryBuff`/`regenBuff` on
**Foe/Location** powers (`enduranceGain` exempt — a foe Electric attack's +End is a genuine
drain-to-self, confirmed against HC). Recharge DEBUFFS are untouched (sign/`*_Slow` table already
routes them). Guard removals: **24 phantom `rechargeBuff` + 6 phantom `regenBuff`**, nothing else.

**De-risk / verification.** Baseline export was byte-identical to committed
`exported_powers/thunderspy` (zero drift), so the change diff is isolated: **834 export
files, purely additive** — the only new template attribs are `RechargeTime` (87),
`Recovery` (346), `Regeneration` (299), `Endurance` (452); **zero non-attrib fields
changed**; no `Ones`→damage/mez/defense relabel. Generated layer (post-guard): only
`recharge/recovery/regen/endurance` buff+debuff keys added, minus the 30 guarded false
positives (`damage`/`defenseBuff`/`stun`/`immobilize` all net-zero). A 5-agent adversarial
workflow over the export surfaced the aspect/target traps; the guard was derived from a full
dump of every recharge/resource relabel (scale-sign × target × shortHelp) and re-verified over
the post-guard generated layer. Marquee values confirmed (Hasten +0.7/120s Track button intact
via the normal `durations`→`buffDuration` path; Speed Boost +0.5 recharge & +0.25 recovery;
Siphon Speed -0.2 → rechargeDebuff; Absorption/Grant Cover/Disrupting Torrent phantom buffs gone).
Retiring the hack also removed Enforced Morale's bogus +99% recharge. `tsc` clean (pre-existing
`html-to-image` env gap aside); full suite **682 pass**. Guard test:
[thunderspy-ones-recharge-buff.test.ts](../src/data/thunderspy-ones-recharge-buff.test.ts).
**Remaining (at the time of this entry):** mez magnitudes + knockback — the SAME aspect/target
limitation applies, so they'll need the same shortHelp/target discipline, not just a relabel.
Since resolved — see the applied-mez / knockback entry above.

**✅ Pet target-trap RESOLVED (2026-07-02, follow-up).** The earlier audit had *kept* the **15
Mastermind pet-upgrade powers'** identical `recoveryBuff` 0.15 / 240s "pending in-game check,"
hypothesising a real Thunderspy rebalance (it looked structurally like Black Dwarf's genuine +0.15
Recovery). That hypothesis was **wrong**, and the miss is instructive: the audit compared the
*template* (Self target, empty requires) but never consulted the *power-level* `targets_affected`,
which reads **`['MyPet']`** — the effect recipients are the henchmen, not the MM. The dev confirmed
the rework: these are auto-pulse 30' PBAoEs that upgrade pets every 5s; there is no MM Recovery
buff. So the +15% was a pet buff leaking to the caster because `target_type='Self'` (the MM casts
it on themselves) while the per-template target that would have said "pet" was dropped by the
format. Same leak hit the `MyPet`-*cast* buffs (Repair's `enduranceGain`, Fortify Pack's `regenBuff`
**and** `defenseBuff`) because `MyPet` has no targetType mapping, so the totals' ally filter can't
exclude them either.

Fix: extended `guardThunderspyOnesBuffs` with a **pet-only veto** — when every `targets_affected`
entry is a pet (`MyPet`), drop the caster-facing recovery/regen/endurance/defense. It is
shortHelp-aware for the same reason the foe veto is: `targets_affected` **under-reports**. Rally the
Militia is also `['MyPet']` yet advertises "**Self**, Pets +Defense, +Regeneration" — it genuinely
buffs the MM, so a stat named for Self survives (the guard's first pass wrongly stripped it; the
`\bself\b` + `+stat` gate restores it). Net: 18 generated files change (15 recovery + Repair
endurance + Fortify regen&defense), Rally untouched, deterministic re-run, full suite **682 pass**.
**Lesson (added to §7):** when the per-template target is dropped, the power-level `targets_affected`
is the authoritative recipient list — consult it, not just the Self-vs-Foe `target_type`.

Still minor (kept, ally-excluded from totals so display-only): Conduit of Pain labels an ally/pet
endurance restore as caster `enduranceGain` via the endurance exemption; and the guard intentionally
does not recurse into `conditionalEffects`, so Primalist form-gated buffs (Pack Frenzy huntermode
recharge, Rejuvenate prowlermode recovery) are unguarded — correct today (they're legit and the base
shortHelp doesn't describe form effects).

- [x] Thunderspy Defense toggles contributed 0 to Defense totals — two attrib bugs — 2026-07-02

**Symptom.** Every Thunderspy defense toggle (Weave, Maneuvers, Hover + all armor sets:
Super Reflexes, Shield, Energy Aura, Ninjitsu, …) added **nothing** to the character's Defense
totals; only proc IOs (Steadfast, Gladiator's) showed. The powers' POWER EFFECTS panels had
**no Defense row** — the magnitude was absent from the generated data (no `defenseBuff`),
because the parser lost the defense **attribs** (scale + table parsed fine).

**Root cause — two bugs in `_parse_effect_template_thunderspy`
([_powers.py](../tools/bin-crawler/bin_crawler/parser/_powers.py)):**

1. **`_resolve_str` offset cap.** It rejected any string offset `>= 200000`. Thunderspy's
   string table is ~38 MB, so valid attrib strings living past that (DefensiveAdaptation,
   DefenseDebuff, ToHitBuff, EndMod, …) were silently dropped — **8,738** templates lost their
   attribs. Fixed: bound by `len(strtab_data)` (abs-pos is re-checked against the buffer, so
   the cap was pure heuristic and wrong for tspy's large table). This alone recovered
   8,738→295 empty-attrib templates.

2. **The affected-attrib INDEX array was never read.** Thunderspy stores TWO attrib fields per
   template: the front string-offset array (the *enhancement aspect* — `Damage`/`Ones`/
   `Buff_Def`) and, right after `requires`, an INDEX array
   `[pad, pad, marker, someval, count, count×(attribIndex*4)]` = the **affected** attribs
   (`Melee`/`Smashing`/`Lethal`/… — what HC and the converter key on). Multi-type defense
   buffs leave the front EMPTY (Maneuvers, Danger Sense) or carry a bogus `Buff_Def` meta
   (Focused Fighting, Deflection), putting the positional/type list only in the index array.
   Fixed: decode the index array (`idx*4 → ATTRIB_NAME`) as a fallback when the front is empty,
   **and** for `Buff_Def`-table templates prefer it over the bogus `Buff_Def` front.

**Why scoped to defense.** The front and index arrays are DIFFERENT fields (front `Damage` ↔
index `Lethal_Dmg`; front `Ones` ↔ index `Knockback`/`Endurance`/…), so a blanket swap would
change damage/mez representation across the dataset. Only the empty-front fallback (safe — adds
attribs where there were none) and the `Buff_Def`-specific override are applied. The broader
`Ones` recovery (recharge/mez — see the corrected NEW-ISSUES entry) is left for a separate,
per-effect-kind change.

**Validated.** empty-attrib templates 8,738→**16**; Focused Fighting now `['Melee']` (HC
parity, HC scale 1.85 vs tspy 2.0); Maneuvers/Weave/Hover full positional lists; **no** damage/
DoT regression (Gloom intact). Re-exported (3,167 power JSONs, additive attrib/requires/category
recovery, **0** value drift) + regenerated pools & all 305 powersets. Defense coverage
19→**211** generated files. `tsc` clean; full suite 588 pass; guard
[thunderspy-defense-data.test.ts](../src/data/thunderspy-defense-data.test.ts).

- [x] Every Thunderspy DoT lost its `tickRate` — `application_period` was never read — 2026-06-18

**Symptom.** No DoT line / no DoT-aware damage totals for ANY Thunderspy DoT
(Gloom, Fire Breath, Tenebrous Tentacles, …). Across the export, ~372 damage
blocks carried a `duration` but **0** carried a `tickRate`. The calc
(`damage.ts`) only treats an entry as a DoT when **both** `duration > 0` AND
`tickRate > 0`, so every Thunderspy DoT silently fell through to direct damage.
HC + Rebirth were fine.

**Root cause.** `_parse_effect_template_thunderspy`
([_powers.py](../tools/bin-crawler/bin_crawler/parser/_powers.py)) scans the
template tail for the modifier-table string, then read only `scale` (table+4) and
`duration` (table+8) before bailing. It never read the period, so the
`EffectTemplate` fell back to the dataclass default `application_period = 0.0`,
and the converter's `dmg.tickRate = template.application_period` (only set when
`> 0`) was never populated.

**Reverse-engineering.** Hand-decoded Gloom's raw AttribMod bytes and surveyed
2,672 DoT damage templates: the post-table numeric block is **identical to HC's
Parse7 layout** — `table, scale(f4), duration(f4), magnitude(f4),
dur_expr(u4_array), mag_expr(u4_array), delay(f4), application_period(f4),
tick_chance(f4)`. The two expr arrays are empty (count 0), which is exactly why
slots table+16 / table+20 read 0 across the whole dataset; **delay lands at
table+24, the period at table+28, tick_chance at table+32.**

**Fix (2026-06-18).** After locating the table, read the period array-aware
(walk the two `u4_array` expr blocks rather than fixed offsets, so a future
non-empty expr list can't shift the period) and pass `application_period` (+
`delay`) into the `EffectTemplate`. Re-export + `convert-all-powersets.cjs
--dataset thunderspy --force`: **isolated diff** — only `application_period`
(1874 templates) and `delay` (2203) added to `exported_powers/thunderspy/`; the
generated layer gained **395 `tickRate`** fields, nothing else changed. Gloom →
`dur 1.5 / tickRate 0.2 → 8 ticks`; Fire Breath → 3-tick cone; Tenebrous
Tentacles → 8-tick. Guard: `src/data/thunderspy-dot-tickrate.test.ts`.

**Key gotcha — Thunderspy ≠ HC values; don't validate against HC.** The original
memo assumed Gloom should read HC's `3.6s / 0.5s`. It doesn't: Thunderspy
rebalanced the *player* Gloom to a tighter `1.5s / 0.2s` window (still 8 ticks),
while the NPC/critter Glooms keep the classic `3.6 / 0.5`. The duration was
**never wrong** — only the missing period was. Thunderspy rebalances player
powers freely, so the binary (not HC parity) is the oracle. Likewise Thunderspy
made Ring of Fire / Chilblain / Entangle / Stone Prison (9 immobilize-damage
powers) genuinely period-0 (vs HC's ticking DoTs) — their post-table `duration`
and `period` are both 0 in the binary; the `duration: 1` they export is the
header `duration_default` fallback, and having no tickRate is correct (they're
not multi-tick DoTs on Thunderspy).

- [x] Damage element type was generic `Special` (Thunderspy uses a single `Damage` attrib) — 2026-06-16

**Context.** Thunderspy effect templates store damage with one generic `Damage`
attrib + table + scale; the element (Fire/Smashing/…) is NOT in the attrib —
it's only in `display_short_help` (e.g. `Minor DMG(Fire)`, `DMG(Energy/Smash)`).
First pass mapped the generic attrib to type **`Special`** (correct magnitude,
wrong label).

**Fix (2026-06-16).** `applyThunderspyDamageType(damage, shortHelp)` in
[convert-powerset.cjs](../scripts/convert-powerset.cjs) parses the primary element
from the shortHelp `DMG(...)` and re-types `Special` damage entries; applied in
`convertPower` (gated `datasetId === 'thunderspy'`, covers base + conditional
damage) and `generate-primalist-variants.cjs`. Result: realistic distribution —
Lethal 457, Smashing 346, Energy 205, Fire 140, Psionic 110, Negative 87, Cold
73 (Special dropped from ~everything to 424). Fire Blast now reads **Fire**.
HC/Rebirth never use a bare `damage` attrib, so they're untouched.

**Known limits (left as Special by design):** multi-type powers collapse to the
**primary** element (`Energy/Toxic` → Energy — the binary carries no per-component
type, so secondary elements like Toxic don't surface); powers whose shortHelp has
no `DMG(...)` (e.g. Pale Wind = "Repel, Fester" — element only in prose) stay
Special; pet-summon powers have no direct damage entry (damage lives on the pet);
genuine `DMG(Special)`/`DMG(All)`. Damage magnitudes were always correct — this
only refines the element label.

- [x] Every Thunderspy power showed as level 1 (per-power `available` levels all 0) — 2026-06-16

**Symptom.** In the planner, every Thunderspy powerset had all its powers
selectable at level 1 — no level progression. The exported powerset
`available_level` arrays were all zeros (`[0,0,0,…]`); HC/Rebirth have real
curves like `[0,0,1,5,7,11,17,25,31]`.

**Root cause.** `_parse_parse6` ([_powersets.py](../tools/bin-crawler/bin_crawler/parser/_powersets.py))
hard-coded Rebirth's tail arrangement — `[empty vestigial available][real
available][…]` — reading the *first* u4_array as throwaway and the *second* as
the real levels. Thunderspy (Parse7 frame, Parse6 schema) has **no empty
vestigial prefix**: its *first* tail array IS the real available curve, and the
second is an all-zeros array. So the parser discarded the real levels and used
the zeros → every power available at level 1. Confirmed by dumping the raw
record: `array[0]=[0,0,1,5,7,11,17,25,31]` (real), `array[1]=[0,0,0,…]` (zeros).

**Fix (applied 2026-06-16).** Read the first tail array; if it's empty use the
next (Rebirth), otherwise the first array IS the real available (Thunderspy):
`first = read_u4_array(); available = read_u4_array() if len(first)==0 else first`.
Verified: Thunderspy Fire_Blast now `[0,0,1,5,7,11,17,25,31]` (matches Rebirth);
Rebirth unchanged (its empty-first path still taken); converted powers carry the
right `available` levels; tsc + 535 tests green. (Also improved the conditional-
gate label for Thunderspy's bare `<side>.ownPower?` self-reference gates —
"Target Already Affected" / "Already Affected" instead of opaque "Conditional"
— so Pale Blade's Fester/Plaguebearer conditional damage is findable in the
InfoPanel's Mechanic Adjusters.)

- [x] Class `attribs` (HP / caps / threat) did not parse for ANY Thunderspy class — 2026-06-16

**Symptom.** Every Thunderspy class (`parse_classes` on `classes.bin`) returned an
**empty `attribs` block** — no `hit_points` curve, `hp_cap` curve, `resistance_cap`,
`damage_cap`, or `base_threat`. The per-AT **named modifier tables parsed fine** (94
tables for Primalist incl. `Melee_Damage` etc.), so this was *only* the AT "frame" stats,
not power-scaling data.

**Root cause.** `_extract_attribs` was dispatched with `_ATTRIB_LAYOUT["parse7"]`
([_classes.py](../tools/bin-crawler/bin_crawler/parser/_classes.py)) for any Parse7-framed
file, and that layout assumes **105-entry** level curves (50 levels + combat/Incarnate
extension). Thunderspy uses **50-entry** curves. So `_find_hit_points_offset` anchored on
a `count == 105` array, never matched Thunderspy's 50-entry hit_points array → returned
`None` → `attribs = {}`. The `parse6` layout *does* use `count == 50`, but its byte-deltas
are calibrated for Parse6 **inline pascal strings**; Thunderspy uses Parse7 **string-table
offsets**, and its older/leaner i23-era CharacterAttributes member order differs again — so
neither existing layout fit.

**Fix (applied 2026-06-16).** Added a third layout `_ATTRIB_LAYOUT["thunderspy"]`
(`count` 50, `cap_delta` 15268, `res_value_delta` 45808, `threat_delta` −3968,
`dmg_cap_delta` 30536), derived empirically by anchoring on `Class_Blaster`'s hit_points
curve (rec-offset 4780) and measuring deltas to the hp_cap curve, resistance-cap float,
base-threat scalar, and first StrengthMax damage curve. `parse_classes` (Parse7 path) now
tries the HC layout first and **falls back** to the Thunderspy layout when it yields `{}`
— self-detecting, because HC's 105-entry anchor never matches Thunderspy's 50-entry curves
(and vice-versa), and Rebirth uses the separate Parse6 path so never reaches here.

**De-risk / verification.** All 15 Thunderspy classes now extract attribs; values match
canonical CoH stats, with the distinctive ones confirming the deltas are right:

| AT | baseHP (L50) | maxHP (L50) | resCap | threat | dmgCap |
|---|---|---|---|---|---|
| Blaster | 1204.8 | 1606.3 | 0.75 | 1 | 5.0 |
| Tanker | 1874.1 | 3534.0 | **0.90** | 4 | **4.0** |
| Brute | 1499.3 | 3212.7 | **0.90** | 4 | **7.75** |
| Peacebringer/Warshade | 1070.9 | 2409.5 | **0.85** | 2 | 4.45 |
| Mastermind | 803.2 | 1606.3 | 0.75 | 2 | 4.0 |
| **Primalist** | **1285.1** | **2248.9** | **0.75** | **1** | **4.0** |

(Brute 775% / Tanker 400% damage caps and Kheldian 85% resistance cap are server-specific
non-default values — matching them is strong evidence the deltas are correct.) **No
regression:** HC still resolves via the parse7 layout (HC Brute dmgCap 7.0 / Tanker 5.0 —
distinct from Thunderspy's older 7.75 / 4.0, proving the fallback does NOT trigger for HC);
`src/data/archetype-stats.test.ts` passes 60/60; Rebirth (Parse6 path) unchanged.
Verified the values survive into JSON via `export_classes` (Primalist's `tables` entry
carries the full block). **TODO when wiring the app dataset:** add a Thunderspy
archetype-stats test mirroring the HC one.

- [x] `Class_Primalist` parsed with empty primary/secondary/pool categories — 2026-06-16

**Symptom.** Thunderspy's custom **Primalist** archetype (`Class_Primalist`, the 15th
class in `classes.bin` = 14 standard + Primalist) parsed with **empty** `primary_category`
/ `secondary_category` / `pool_category`, while every other class (including the Kheldian
EATs) parsed fine. This silently hid Primalist from the planner — and the export's
`PLAYER_CATEGORIES` filter compounded it by dropping the orphaned `Feral_Might` /
`Primal_Gifts` categories (only `Primalist_Misc` leaked through, because it had been
parked in the Lore/NPC pet-category list).

**Root cause.** `_find_icon_offset` only matched icon strings ending in **`.tga`**.
Primalist's icon is **`archetypeicon_primalist.texture`** (ends in `.texture`). With no
`.tga` match the function returned `None`, so the entire category-detection block — which
correctly reads the three categories at `icon_off + 4 / +8 / +12` — was skipped. The
category data was present and correctly placed all along; only the icon *anchor* failed.
(Warshade works because its icon is `archetypeicon_Warshade.tga`.)

Raw Primalist record (Parse7, string-offset fields):
```
+76 'archetypeicon_primalist.texture'   <- icon (.texture, not .tga)
+80 'Feral_Might'                        <- primary
+84 'Primal_Gifts'                       <- secondary
+88 'Pool'                               <- pool
```

**Fix (applied 2026-06-16).** `_find_icon_offset`
([_classes.py](../tools/bin-crawler/bin_crawler/parser/_classes.py)) now accepts a
`.texture` extension in addition to `.tga`. Primalist now resolves
`Feral_Might` / `Primal_Gifts` / `Pool`. **De-risk:** re-parsed all three datasets —
15 Thunderspy + 15 Homecoming + 15 Rebirth classes still parse with **no** empty
categories (no regression; the change only adds a previously-unmatched extension).

**Export follow-through (applied 2026-06-16).** Added `Feral_Might` and `Primal_Gifts`
to `PLAYER_CATEGORIES` in
[export_powers.py](../tools/bin-crawler/bin_crawler/export_powers.py) (`Primalist_Misc`
already present). Full Thunderspy export verified: **8,532 player powers / 1,906
powersets / 58 categories** (was 8,506 / 56 — the +26 powers are exactly Feral_Might's 14
+ Primal_Gift's 12). Primalist is a Kheldian-style form-shifter (primary `Feral_Might`
with Hunter/Prowler form toggles; secondary `Primal_Gift`; form-attack variants + per-hit
lifesteal redirects in `Primalist_Misc`). The class `attribs` are still empty — that's a
separate, dataset-wide issue tracked in NEW ISSUES above.
