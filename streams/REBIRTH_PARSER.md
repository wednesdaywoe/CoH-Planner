---
project: coh-sidekick
kind: plan
title: Rebirth Parser
id-prefix: REB
relates:
  - HOMECOMING_PARSER.md
  - THUNDERSPY_PARSER.md
---

# Rebirth Parser

The **front door / index for all Rebirth-specific data gaps.** Deep workstreams (§1–§3)
live here in full as reference prose; items whose detailed diagnosis lives in the
chronological parser log are *linked, not duplicated*. Affects the **Rebirth dataset only**
except items noted "both servers." Started 2026-05-04.

> **The recurring root cause.** Most Rebirth gaps trace to one thing: **Parse6 (Rebirth's
> binary format) drops a class of AttribMod tail/condition fields that Parse7 (HC) decodes.**
> When a Rebirth-only bug surfaces, suspect a Parse6 field gap first. Full diagnoses for the
> logged items are in [HOMECOMING_PARSER.md](HOMECOMING_PARSER.md); the map below is the index.

## Active

- [ ] **REB2** — extract the missing Rebirth-unique power pools (research + extraction). Detail: [§2 below](#2-missing-rebirth-unique-power-pools).
- [ ] **REB3** — Kheldian (Warshade / Peacebringer) form-redirect model (PowerRedirector); the planner currently auto-grants form-variant powers as separate picks, which is wrong (slots on the human power apply to whichever variant fires). Shipped as a hand-curated `KHELDIAN_REDIRECTS` map; native Parse6 parse deferred (below). Detail: [§3 below](#3-warshade--peacebringer-form-mechanic--wrong-model).
- [~] **`flags` partial** — the calc-relevant AttribMod flags (`IgnoreStrength` / `IgnoreResistance` / `IgnoreCombatMods` + NearGround / CancelOnMiss) are decoded (2026-06-12, fixing 81 player powers that over-enhanced +Recovery/+ToHit); `copyBoosts` / `PseudoPet` still live in the not-yet-decoded post-magnitude **tail** (real RE). Detail: HOMECOMING_PARSER *"Rebirth Parse6 AttribMod flags decoded"*.

## Resolved

- [x] **Stealth `stack_key` → kept additive** (decision 2026-06-12, user-chosen). Not a droppable field: Parse6's `stack_key` is a per-power integer that can't carry HC's global "NictusFX" string, so the suppression grouping is runtime engine behavior absent from Rebirth's binary. A cross-server-oracle re-application was built + validated, then reverted — additive's only failure mode is an inflated *display* stat, never slotting. Membership + mechanism preserved in HOMECOMING_PARSER / the stealth memory for re-application if in-client confirms max-wins. (Also corrected: Mask Presence is additive, not a NictusFX member.)
- [x] **`is_pvp` synthesis** — Phalanx Fighting ally-scaling mis-fire fixed (synthesized from the RPN `requires`; there is no explicit PvP flag). Detail: HOMECOMING_PARSER *"Rebirth is_pvp — Phalanx Fighting"* (2026-06-11).
- [x] **`regen-all` dry-runs pools/epics** — the `convert-pool-powers` / `convert-epic-pools` STEPS gained `--apply`; the orchestrator now regenerates Rebirth `power-pools.ts` / `epic-pools.ts` (previously they silently drifted). Detail: HOMECOMING_PARSER *"regen-all now refreshes pools/epics"* (2026-06-11).
- [x] **Committed `exported_powers/rebirth` staleness** — full re-export done (bundled with the `flags` decode); de-risked, the entire delta was only `{flags, tags}` across 7,823 files (zero game drift); 69 generated files regenerated. Entity files were already current. (2026-06-12)
- [x] **Return From The Grave** resurrection set was mislabeled "Brute Archetype Sets" (AT-prefix fallback off its first rez power) → new bespoke **"Resurrection"** category; 59 rez powers re-tagged. Same sweep verified Vampire's Bite / Imperial Might / Liberty's Belt are correctly ECMelee / ECKnockback / ECResist. (2026-06-12)
- [x] **Call Jounin "missing Accurate Defense Debuff"** — no fix needed. In-client confirmed (@Redlynne, live Rebirth) the slotting has **no** Accurate Defense Debuff, matching our parse exactly; the HC-oracle cross-fill was correctly parked. Rebirth's client data is authoritative — don't impose HC parity. (2026-06-12)
- [x] **Archetype defs** binary-sourced — Guardian baseThreat 1.0→2.0, Brute HP, per-server damageCap (both servers). (2026-06-06)
- [x] **IO sets binary-sourced both servers** (~196 Rebirth-only bonus entries recovered). (2026-06-05)
- [x] **Blaster ToHit AT modifiers** were HC's 0.10, not Rebirth's rebalanced 0.075 / 0.07. (2026-06-03)
- [x] **`boosts_allowed` off-by-one** (BOOST_TYPE enum divergence — +1 insertions at positions 10 & 42). Detail: [§1 below](#1-boosts_allowed-extraction-bug--fixed-2026-05-04). (2026-05-04)
- [x] **Inexhaustibility** no-rarity `boostsets.bin` record variant (a `Set_Mode` piece-shape workaround remains — see HOMECOMING_PARSER *"Inexhaustibility piece"*). (2026-06-02)

## Deferred

- [ ] **Native Parse6 redirect parse** — extract Kheldian form-redirect data directly from `powers.bin` (the post-effects tail bytes) instead of maintaining the hand-curated `KHELDIAN_REDIRECTS` map. The tail format does not match HC's `_parse_redirects` `(target, condition_array)` shape (a flat RPN string-array); real RE. Detail: [§3 "Deferred: Parse6 redirect format"](#deferred-parse6-redirect-format).

> **See also** `HEAL-ABSORB-AND-EXPORT-GAPS.md` (currently absent from the tree) — IO-set
> aspect/Absorb export gaps + the Guardian AT (Rebirth-only) missing from
> `extract-at-tables.cjs`'s `PLAYER_ARCHETYPES` allow-list (surfaced 2026-06-05).

---

## 1. `boosts_allowed` Extraction Bug — **FIXED 2026-05-04**

**Root cause:** Rebirth's BOOST_TYPE enum diverges from HC's by two
inserted entries — one at position 10 (everything ≥10 shifts up by 1)
and one appended at position 42. The Parse6 parser was using HC's
BOOST_TYPE table, which produced consistently wrong (off-by-one)
labels on Rebirth pool/powerset powers.

Confirmed by element-wise comparison of `Arachnos_Soldier.Burst` (same
power in both servers): HC `[23,22,18,10,9,5]` vs Rebirth
`[24,23,19,11,9,5]` — every value ≥10 is +1 in Rebirth, every value
<10 is identical.

**Fix:**
- Added `BOOST_TYPE_REBIRTH` map in [tools/bin-crawler/bin_crawler/parser/_enums.py](tools/bin-crawler/bin_crawler/parser/_enums.py)
- [tools/bin-crawler/bin_crawler/parser/_powers.py](tools/bin-crawler/bin_crawler/parser/_powers.py) Parse6 path now uses the Rebirth map
- Re-exported Rebirth via `py -3 -m bin_crawler.export_powers --assets-dir ... --output-dir <project>/exported_powers/rebirth`
- Re-ran `convert-pool-powers.cjs --dataset rebirth --apply` and
  `convert-all-powersets.cjs --dataset rebirth --force --apply`

**Verification:** Hover, Fly, Hasten, Combat Jumping, Air Superiority,
Tough, and Aimed Shot now match HC's expected `allowedEnhancements`.
Positions 10 and 42 in Rebirth's enum are placeholders (`Rebirth_Boost_10`,
`Rebirth_Boost_42`) — they're only referenced by Rebirth-only Halloween
event pieces and a Rebirth-only Incarnate (Barrier_Rez), neither of
which affect player power enhancement filtering.

### Original details (kept for reference)

### Symptom

Rebirth power-pool (and likely powerset) powers show wrong values in their
`allowedEnhancements` arrays. The wrong types appear in the planner's
"common IO" picker — e.g. Flight powers offer Healing instead of Flight
Speed / Endurance Reduction.

### Confirmed Examples

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

### Where the bug is NOT

- The conversion script [scripts/convert-pool-powers.cjs](scripts/convert-pool-powers.cjs) (lines 149–152)
  reads `rawJson.boosts_allowed` and maps via `BOOST_TYPE_MAP` /
  `BIN_BOOST_MAP` in [scripts/convert-powerset.cjs](scripts/convert-powerset.cjs) (lines 82–162).
  These mapping tables are correct: `"Heal" → "Healing"`,
  `"SpeedFlying" → "Fly"`, `"EnduranceDiscount" → "EnduranceReduction"`,
  `"SpeedRunning" → "Run Speed"`, etc.
- `allowedSetCategories` is correct on Rebirth (Hover still gets Flight
  / Universal Travel sets), so set bonuses work — only the single-IO
  picker is wrong.

### Likely root cause

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

### Reproduction (for whoever picks this up on the PC)

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

### Workaround in production

None applied. A welcome-modal "known issue" note has been added so
users see it. We considered shipping per-power overrides in
[src/data/datasets/rebirth/overrides/power-pools.ts](src/data/datasets/rebirth/overrides/power-pools.ts)
but rejected that approach: the bug touches every pool and likely
every powerset, so an override file would balloon, rot, and mask the
parser fix.

When the parser fix lands, regenerate Rebirth via the standard pipeline
and verify a handful of pool powers (Hover, Fly, Hasten, Combat Jumping,
Super Jump) before declaring it fixed.

### Related

- [CLAUDE.md](../CLAUDE.md) — "Note on format changes" warning about
  binary layout drift between HC patches.

(The former `PARSER_TODO.md` and `MULTI_DATASET_PLAN.md` references were dropped —
neither doc remains in the tree.)

---

## 2. Missing Rebirth-Unique Power Pools

**Affects:** Rebirth dataset. Tracked as **REB2** (`## Active`).

Our generated [src/data/datasets/rebirth/generated/power-pools.ts](src/data/datasets/rebirth/generated/power-pools.ts)
currently exposes only the 13 standard pools shared with HC:

```
experimentation, fighting, fitness, flight, force_of_will,
invisibility, leadership, leaping, presence, medicine,
sorcery, speed, teleportation
```

Rebirth ships additional / reworked pools that aren't represented here.
Symptoms users will see: builds reference Rebirth-only pool powers that
won't resolve, the pool picker omits options that exist in-game, and
imports of Rebirth Mids builds may warn about unresolved
`Pool.<Name>.<Power>` paths.

### Reproduction / what to investigate

1. Compare the powercat list dumped by the bin-crawler against Rebirth's
   live `bin_powercategories.pigg` for any `Pool.*` entry not in the
   standard 13. (`tools/bin-crawler/bin_crawler/parser/_powercats.py`
   already enumerates them.)
2. Cross-reference against the Rebirth wiki's Power Pool index for any
   pool documented but not in our list.
3. Spot-check Rebirth Mids exports (`.mbd` files) for any
   `Pool.<X>.<Y>` paths the planner currently warns on.

### Fix path

Once the pool IDs are confirmed, the pool extraction script (the
counterpart to [scripts/convert-pool-powers.cjs](scripts/convert-pool-powers.cjs))
should pick them up automatically — the standard-13 filter list is the
likely gate. Update that filter and regenerate.

---

## 3. Warshade / Peacebringer Form Mechanic — Wrong Model

**Affects:** Rebirth Peacebringer / Warshade builds (and likely HC too — see notes). Tracked as **REB3** (`## Active`).

### The actual mechanic (confirmed against the binary, 2026-05-04)

Rebirth (and HC) implement Kheldian forms via a generic **PowerRedirector**
mechanism. This is the same mechanic the game uses for snipe powers
(quick vs interruptible based on to-hit) and for the build-up/sniper
"crit" decisions.

A human-form base power has multiple redirect targets, and which one
fires is decided **at activation time** based on the current form. From
Utpal (community member familiar with Rebirth internals):

> *"There's a base power, and depending on certain flags, when you
> activate the power, the actual power that's activated will change.
> ...In the case of the kheldian, you'll have a base power, and it can
> go in as many as 3 different directions based on the current form
> (human, nova, dwarf). All of the slots are on the base power, and
> there is only one set of slots, and one set of enhancements.
> Regardless of the form used, they'll always resolve to the base
> power slots."*

Concrete example for Peacebringer's Luminous Blast set
(targets confirmed by Utpal):

| Base power (slottable pick) | Human → | Nova → | Dwarf → |
|---|---|---|---|
| `Luminous_Blast.Gleaming_Bolt` | `Kheldian_Pets.Luminous_Blast.Gleaming_Bolt` | `Kheldian_Pets.Bright_Nova.Bright_Nova_Bolt` | `Kheldian_Pets.White_Dwarf.White_Dwarf_Bolt` |
| `Luminous_Blast.Glinting_Eye` | `…Glinting_Eye` | `…Bright_Nova_Glinting_Eye` | `…White_Dwarf_Glinting_Eye` |
| `Luminous_Blast.Gleaming_Blast` | `…Gleaming_Blast` | `…Bright_Nova_Blast` | *(falls through to Human)* |
| `Luminous_Blast.Radiant_Strike` | `…Radiant_Strike` | *(falls through to Human)* | `…White_Dwarf_Strike` |
| `Luminous_Blast.Proton_Scatter` | `…Proton_Scatter` | `…Bright_Nova_Scatter` | *(falls through to Human)* |
| `Luminous_Blast.Luminous_Detonation` | `…Luminous_Detonation` | `…Bright_Nova_Detonation` | *(falls through to Human)* |
| `Luminous_Blast.Incandescent_Strike` | `…Incandescent_Strike` | *(falls through to Human)* | `…White_Dwarf_Smite` |
| `Luminous_Blast.Solar_Flare` | `…Solar_Flare` | *(falls through to Human)* | `…White_Dwarf_Flare` |

Warshade's Umbral Blast follows the same pattern with the same
fall-through rules. Defensive sets have no form-based redirects
(Luminous Aura: none; Umbral Aura: only `Shadow_Recall` has a
target-based redirect for friend/enemy/NPC/PvP, not form-based).

### Why our current model is wrong

The planner currently auto-grants the form-variant powers (Bright Nova
Bolt, White Dwarf Strike, etc.) as separate slottable picks attached
to the form toggle. That's incorrect: **slots on the human power apply
to whichever variant fires**. The form variants aren't separate picks;
they're activation-time redirects of the base power.

Net effect of fixing this: fewer "powers" in the build (the form
variants disappear from pick lists), enhancement budgets free up, and
damage display needs to show variant numbers based on the user's
chosen "current form" view.

### Confirmed in the binary

- **HC Parse7 already extracts these redirects.** `_parse_redirects()`
  in [tools/bin-crawler/bin_crawler/parser/_powers.py](tools/bin-crawler/bin_crawler/parser/_powers.py)
  produces the right data. HC `Pool.Flight.Combat_Flight` → no redirects.
  HC `Peacebringer_Offensive.Luminous_Blast.Gleaming_Bolt` →
  `[Kheldian_Pets.Luminous_Blast.Gleaming_Bolt (¬Tanker_Mode), Kheldian_Pets.Luminous_Blast.Dwarf_Gleaming_Bolt (Tanker_Mode)]`.
  Note HC has only Human/Dwarf targets — Rebirth's three-way split (Human/Nova/Dwarf) appears to be a Rebirth refinement.

- **Rebirth Parse6 has the redirect data but the parser drops it.**
  ASCII scan of Gleaming_Bolt's post-effects tail bytes finds the
  target string `Peacebringer_Offensive.Luminous_Blast.Bright_Nova_Bolt`
  along with mode-flag conditions (`kPeacebringer_Blaster_Mode`,
  `kPeacebringer_Tanker_Mode`, `ownPower?`) interleaved with FX paths
  and animation hooks. The 2026-05-02 RE concluded "Parse6 omits
  Redirect" because most powers have no redirects, so empty data
  looked like absence.

- **The `requires='0'` (always-false) flag on form-variant powers**
  (e.g. `Bright_Nova_Bolt`, `White_Dwarf_Strike`) confirms they're
  not directly pickable — they only fire as redirect targets.

### Chosen approach: hand-curated mapping (Rebirth) + deferred parser work

After exploring the Parse6 binary format, we found the redirect data
**is** in the tail bytes after effects — but in a format that doesn't
match HC's clean `(target, condition_array)` struct. Decoding the
Gleaming_Bolt tail revealed a `u4=13` followed by 13 inline pascal
strings forming an RPN-encoded expression with target names interleaved
among condition tokens. Cracking the full format is real RE work:
need to handle "fall through to human" cases, multiple targets per
power, and disambiguate from FX paths / color tintable data also in
the tail.

We're proceeding with a **hand-curated `KHELDIAN_REDIRECTS` map** keyed
off Utpal's mapping table (above). This is small (~16 PB powers + ~9
WS powers, each with up to 3 form targets) and content-stable (form
mapping doesn't churn between patches). Trades "everything data-driven"
purity for shipping today.

**Parser work is deferred** — see "Deferred: Parse6 redirect format" below.

### Implementation steps (using the hand-curated approach)

1. **Add `KHELDIAN_REDIRECTS` table** in
   `src/data/datasets/rebirth/` keyed by base power full-name → list
   of `{ target, condition }` entries. Source data: Utpal's table above.
2. **Replace the auto-grant model** in
   [src/data/datasets/rebirth/granted-powers.ts](src/data/datasets/rebirth/granted-powers.ts)
   and the form sub-power UI logic. Form variants disappear from the
   power picker; only the human-form base powers are user-selectable.
3. **Add a "current form" selector** to the damage/info display that
   reads `KHELDIAN_REDIRECTS` to swap which variant's effect data is
   shown. Build state (slots, enhancements) doesn't change — only the
   displayed effect numbers.
4. **Audit HC's existing extracted redirects** for other powers that
   may be mis-modeled (sniper quick/interruptible, Bio Armor
   adaptations, etc.). HC Parse7 already extracts these correctly —
   the question is whether the planner consumes them or also auto-grants.

### Deferred: Parse6 redirect format

Future work — extract Rebirth's redirect data natively from `powers.bin`
instead of maintaining the hand-curated table.

What we know so far (saved in the `project_parse6_redirects` memory note):

- Redirect data lives in the post-effects tail bytes that
  `_parse_power_parse6` currently discards via `skip_to_end()`.
- For Gleaming_Bolt, the tail contains a `u4=13` count followed by
  13 inline pascal strings that include the redirect target name
  (`Peacebringer_Offensive.Luminous_Blast.Bright_Nova_Bolt`) interleaved
  with RPN condition tokens (`kPeacebringer_Blaster_Mode`, `mode?`,
  `||`, `ownPower?`, `!`, `&&`).
- After the 13-string block, more strings appear (`ownPower?`, `!`,
  `&&`) followed by a `u4=1011` and binary data — likely the FX path
  block. The redirect block is followed by other tail fields.
- Format does NOT match HC's `_parse_redirects` shape (no per-entry
  elem_len + sub-struct). Looks like a flat string-array encoding the
  whole expression.
- Only the Nova target appears in Gleaming_Bolt's data; the Dwarf target
  (per Utpal: `Kheldian_Pets.White_Dwarf.White_Dwarf_Bolt`) is not
  visible in this tail. Either (a) it's in a different field we haven't
  located, (b) "fall through to human" cases use a different mechanism,
  or (c) HC and Rebirth still genuinely disagree on the redirect set.
  Worth investigating Glinting_Eye next (Utpal lists 3 targets for it).

When picking this back up, start by dumping multiple Kheldian power
tails in parallel and looking for a structural pattern across them —
especially Glinting_Eye (3 targets per Utpal) vs Gleaming_Blast
(2 targets, fall-through to human for Dwarf) vs Solar_Flare
(2 targets, fall-through to human for Nova).

### Related but separate: Rebirth's exclusivity suppression rules

Rebirth (not HC) added suppression rules that disable certain travel/
defense powers while another is active:

> *"While Aerobatics is active, Acrobatics and Weave will suppress."*
> *"While Acrobatics or Aerobatics is active, Weave will suppress."*

This is **not** the same mechanism as the Kheldian PowerRedirector —
it's runtime effect-level suppression, not activation-time redirect.
Verified: HC `Combat_Jumping`, `Weave`, and `Group_Fly` all have zero
redirects (and Aerobatics doesn't exist on HC at all — Rebirth
repurposed `Pool.Flight.Group_Fly` from "Group Fly" to "Aerobatics").

The descriptions in our regenerated Rebirth pool data already mention
this suppression, so the data is captured. The question is whether
the planner's stat calculations honor it (currently: probably not,
since it'd require runtime "what's active" checks against the
suppression matrix).

### Other Kheldian areas still to verify

- **New powers / removed powers** in Rebirth's Luminous_Blast / Luminous_Aura /
  Umbral_Blast / Umbral_Aura. Diff the bin-crawler powercat dumps against our
  generated powerset files.
- **Inherent (Cosmic Balance / Dark Sustenance)** — has the formula or trigger
  changed?
- **The `kPeacebringer_Blaster_Mode` / `kPeacebringer_Tanker_Mode` flags**
  appear in Rebirth's Gleaming_Bolt requires gates. These look like a Rebirth
  role-mode system orthogonal to Nova/Dwarf forms — needs research.
