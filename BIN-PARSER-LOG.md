# Bin Parser Log

Running log of bugs and gaps in the binary parser → JSON conversion pipeline
(`tools/bin-crawler/` + `scripts/convert-powerset.cjs` + `scripts/convert-epic-pools.cjs`), with diagnoses and recommended fixes. Newest entries at top, in the "NEW ISSUES/UNRESOLVED" section. When completed, move the entry to the top of "RESOLVED" section with details of the fix or any other relevant information.

>Agent note: One small flag for your separate task: when you pick up the parser work, the verification tooling I built is at c:\tmp\ (oracle-verify.mjs, override-audit.mjs, etc.) — handy if you end up retiring the Discharge overrides after the parser fix, to confirm the audit goes 9 → 7.

> --- NEW ISSUES / UNRESOLVED ---

## ⬜ Rebirth `is_pvp` — PvE copies of per-target increments missing/mis-tagged (~165 powers, incl. Phalanx Fighting) — 2026-06-08

Surfaced fixing Homecoming Phalanx Fighting (resolved entry below). On **Rebirth**,
Phalanx's per-ally defense increment (`scale 0.3`, "Stack") is flagged
`is_pvp = "PVP_ONLY"`, while the always-on base (`scale 0.5`, "Replace") is `"EITHER"`.
Homecoming flags the *same* ally increment `"EITHER"`. convert-powerset correctly
drops PvP-only effects from the PvE planner, so Rebirth Phalanx generates flat 3.75%
with **no ally scaling** — contradicting its own description ("this bonus grows for
each ally near you"). The converter is correct; the source data is suspect.

Evidence it's a Rebirth export/format issue, not converter logic:

- **~165 Rebirth powers** have a `PVP_ONLY` self-`Stack` increment with no matching
  PvE (`EITHER`/`PVE_ONLY`) copy; HC has ~12.
- Rebirth's PvE/PvP-split density is ~13× HC's: `PVP_ONLY` 7055 + `PVE_ONLY` 6586
  across 8659 files, vs HC `544 + 523` across 10666. So `is_pvp` parsing isn't
  *globally* broken (PVE_ONLY is emitted in bulk), but the PvE copy of these
  per-target increments is absent.
- Rebirth effects carry `tags: None` where HC has `tags: []` — a parser/format-version
  tell (Rebirth is an i25/i26-era bin; PvE/PvP effect copies are likely encoded
  differently than the Parse7 HC layout the crawler is tuned for).

Counter-evidence (why it's not a blanket failure): Rebirth's *other* per-target powers —
Energy Absorption, **Against All Odds (same Shield Defense set)**, Soul Drain, Rise to
the Challenge — all carry correctly-tagged `EITHER` increments.

Needs the Rebirth `.pigg`/`.bin` source (not on the dev machine when filed) to confirm
whether the PvE increment copy is dropped on export or the `is_pvp` field is misread for
this effect shape. **Do not** band-aid per-power in convert-powerset. Interim option if a
Rebirth user confirms in-game ally scaling: a Rebirth override mirroring HC
(`defenseBuff.{melee,ranged,aoe} = { scale: 0.5, perTarget: 0.3, table: "Melee_Buff_Def" }`).
Homecoming users are unaffected.

## ⬜ Pseudo-pet `summon.powers` redirect chains not resolved (~32 powers) — 2026-06-06

Location/patch/storm powers whose `summon.entity` is a generic marker
(`PL_StaticObject`, …) deliver all damage/debuffs through a `summon.powers` list
of redirect powers that the planner never resolves — so they show no data.
**101 generated files / ~32 distinct powers** (Storm Cell, Category Five,
Bonfire, Burn, Freezing Rain, Rain of Fire, Sleet, Tar Patch, EMP/Disruption/
Poison Gas Arrow, Faraday Cage, Force Bubble, Ice Storm, Lightning Rod, Voltaic
Sentinel, Carrion Creepers, Trick-Arrow Glue Arrow, …). The redirect defs ARE
exported (`exported_powers/redirects/`), just not converted. Hard because the
effects form a graph (`Execute_Power` chains, `Create_Entity` sub-spawns,
`Set_Mode` storm-strength states, DoT over duration) — a flat sum produces wrong
numbers. Full findings, scope, and proposed approach (path C):
**[PSEUDO-PET-POWER-RESOLUTION.md](PSEUDO-PET-POWER-RESOLUTION.md)**. Deferred so
it doesn't derail the archetype-defs leg.

## ⬜ Pseudo-pet summon residuals (Phantom Army count, HC P-hash root cause) — 2026-06-06

Surfaced/left by the pseudo-pet entity-resolution fix (resolved entry below):
- **HC exporter leaves EntCreate `entity_def` as an opaque P-hash** (e.g. P4234428342)
  while Rebirth's export resolves it to the real pet name. convert-powerset now works
  around it via `priority_list`, but the cleaner root fix is to resolve the hash in the
  HC exporter (then convert-powerset wouldn't need the P-hash special-case). Needs the bin.
- **Multi-pet summons over/under-count from EntCreate-template counting.** Phantom Army has
  6 EntCreate templates for 3 Decoys → shows ~4 (the fix deliberately doesn't touch multi-
  entity summons to avoid making it worse). Gremlins (2) / Fire Imps (3) happen to be 1:1
  and correct. A real fix needs a template→pet-count model, not template counting.
- **~10 single-entity P-hash summons have no `priority_list`** to resolve to — genuinely
  unresolvable from current export data; they still show no pet effects.

## ⬜ Inexhaustibility piece — Set_Mode special-piece not recognised — 2026-06-05

Surfaced while binary-sourcing IO sets (resolved entry below). Low priority:
- **Inexhaustibility** (Rebirth challenge set): its single piece carries only a
  `Set_Mode`/Strength marker template — no real attribs, no chance/ppm group — so it
  extracts as `name:"Empty", proc:false`. Worked around with a curated field-patch
  (`REBIRTH_PIECE_PATCHES`) → `"Inexhaustibility"/proc:true`. A proper fix would recognise
  the `Set_Mode` special-piece shape in the extractor.

> ---RESOLVED ---

## ✅ Summon `copy_boosts` binary-sourced — second AttribMod flags word decoded; Discharge overrides retired (2026-06-11)

**Root cause.** AttribMod flags are stored across **two** consecutive u4 words.
`flags_raw` (the first) was decoded by `_FLAG_BITS`; the **second** word — holding
the copy/pet keywords (`CopyBoosts`, `PseudoPet`, `CopyCreatorMods`) — was
swallowed whole into the opaque Params tail (`_extract_params` heuristic scan).
So `template.flags` never contained `CopyBoosts`, `summon.copyBoosts` was always
`undefined`, and the converter's `template.flags.includes('CopyBoosts')` at
[convert-powerset.cjs:2682](scripts/convert-powerset.cjs) had nothing to read.
(The earlier guess that CopyBoosts was a missing `_FLAG_BITS` bit was wrong —
Omega_Maneuver's `flags_raw=0x70` decodes its three Ignore flags correctly and
has no CopyBoosts bit; the flag is in the *next* word.)

**Decode + validation (verify-don't-assume, §12).** Probes in `c:\tmp\copyboosts-probe*.py`
matched ~14.5k binary templates to their `.powers` `Flags` keyword sets via a
`(table, scale, magnitude)` signature, then ran per-bit precision/recall on the
second word. Clean bits (perfect recall, fn=0):
- **`0x4` CopyBoosts** (tp=408; also **415/415** on an independent entity_def-keyed
  cross-check; 688 EntCreate templates lack the bit, so it's a real discriminator)
- `0x20` PseudoPet (tp=68, fp=0, fn=0)
- `0x8` CopyCreatorMods (tp=33, fn=0)
The first word's decode reproduced `_FLAG_BITS` exactly (IgnoreStrength=0x10,
IgnoreResistance=0x20, IgnoreCombatMods=0x40, CancelOnMiss=0x4, NearGround=0x8;
fp=0) — confirming the field alignment is right.

**Fix (Parse7/HC).** [_powers.py](tools/bin-crawler/bin_crawler/parser/_powers.py):
read `flags2_raw = r.read_u4()` right after `flags_raw`, decode via new
`_FLAG2_BITS`/`_decode_flags2`, merge into `flags`; store the raw word on
`EffectTemplate.flags2_raw` (new dataclass field) so the rest of the word can be
decoded later without a re-export. Consuming the word causes **zero**
param-extraction drift (`c:\tmp\verify-tail-shift.py`: 0/2472 EntCreate templates
change entity_def/redirects/priority_list — the param scan never depended on it).
Only `CopyBoosts` is emitted for now: **`PseudoPet` is validated but deferred** —
emitting it flips `summon.isPseudoPet` on ~68 powers, changing Power-Info display
(`🐾 Summons` → `⚡ Creates`); that belongs with the pseudo-pet resolution work,
not this fix. `CopyCreatorMods` is unconsumed downstream. Both bits are documented
in `_FLAG2_BITS` (commented out) for a trivial future enable. Lower bits (0x1/0x2)
didn't map cleanly to any tested keyword; left undecoded.

**Materialized (HC).** Re-exported, applied the **CopyBoosts-only** delta to the
committed `exported_powers/` (1045 files; semantic diff verified copyBoosts-only,
0 other changes, 0 missing — no data drift). Regenerated HC **powersets**
(`convert-all-powersets --force`): 285 generated files, every diff is
`copyBoosts: true` (+ the trailing comma on the preceding line), nothing else.
**Deferred:** `epic-pools`/`power-pools` regen — their committed output predates
the foe movement-`slow` extraction fix, so regenerating them surfaces unrelated
stale-converter drift; left for a dedicated "bring pool layers current" pass (the
Discharge deliverable is in powersets, which was already current).

**Override retirement.** With `copyBoosts` now generated, the controller +
corruptor **Electrical Affinity Discharge** overrides went `DIVERGENT → DEAD_PIN`;
retired via the campaign's `override-retire.mjs` (dropped the dead `effects` pin,
kept the text fields). Audit tally moved **9 → 7 DIVERGENT** exactly as predicted
(the 2 Discharges are now TEXT_ONLY). See [[adversarial-remediation-campaign]].

**Parse6 (Rebirth) not done — and not needed.** The Parse6 template parser doesn't
decode `flags` at all (always `[]`), and no Rebirth override depends on
`copyBoosts`, so Rebirth pets still don't get the flag. Tracked here; do it if a
Rebirth summon's pet DPS is reported wrong.

**Guard:** [summon-copyboosts.test.ts](src/data/summon-copyboosts.test.ts).
tsc clean, 439/439 tests pass.

## ✅ Archetype defs binary-sourced from classes.bin — HP curves/caps + baseThreat + damageCap, both servers (2026-06-06)

Campaign leg #2, done in three phases. The `classes.bin` parser (`_classes.py`) now
reads the class struct's CharacterAttributes region (not just `named_tables`),
anchoring on the `hit_points` curve and reading siblings at fixed byte-deltas
per format (`_ATTRIB_LAYOUT["parse7"|"parse6"]`).

- **Phase 1:** per-level HP curve, HP-cap curve, baseHP/maxHP, resistanceCap.
  Caught a stale HC Brute HP table (1499 → binary 1606.3451; HC buffed it,
  Rebirth keeps 1499).
- **Phase 2:** `baseThreat` — a class-**header** float at `hit_points_anchor−4040`
  (Parse7) / `−4004` (Parse6). Caught the hand-port's wrong Rebirth **Guardian**
  threat (1.0 → binary 2.0; header alignment confirmed identical to every other
  AT, so not a misread).
- **Phase 3:** `damageCap` — L50 of the first damage-type **StrengthMax** curve
  (`dmg_cap_delta` 74872 Parse7 / 30944 Parse6). Caught the hand-port
  under-capping **Scrapper/Tanker/Sentinel/Corruptor/Stalker at 400% when HC has
  them at 500%** (and Rebirth Brute at 7.0 when it's 7.75). Verified vs the HC
  2020-01-23 Tanker/Brute patch notes (Tanker 400→500%, Brute 775→700%) + forum
  (Scrapper 500%). **Per-server authoritative:** HC Tanker 500/Brute 700, Rebirth
  Tanker 400/Brute 775. NB the cap has a *second, stale* pre-2020 copy in the HC
  record (≈delta 82092) — the parser reads the live block, not that one. The
  initial "damageCap not in classes.bin" read was a false negative (searched the
  stale hand vector; the cap is stored as a rising per-level curve, not a flat
  array).

The remaining scalars (`damageModifier`, `buffDebuffModifier`) aren't single
binary quantities — they're abstractions over the per-category `named_tables`,
which ARE binary-sourced and current and which the calc already prefers (these
scalars are table-less *fallbacks* only). See [[at-modifiers-are-binary-tables]].

Pipeline: parser `attribs` → `export_classes.py` → `convert-archetypes.cjs` →
`archetype-stats.generated.ts` → spread into each `archetypes.ts`. Guarded by
`src/data/archetype-stats.test.ts` (60 tests, both datasets, incl. baseThreat +
damageCap). `threat_delta` is a *negative* delta (header sits before the anchor),
so a future HC header-field insertion would shift it — the sane-range guards + CI
test catch a gross misread. Full write-up: **[ARCHETYPE-DEFS-BINARY-SOURCING.md](ARCHETYPE-DEFS-BINARY-SOURCING.md)**.

## ✅ `perception` / `knockback_strength` set bonuses modeled (2026-06-06)

`perception` set bonuses were emitted by the source but dropped by the calc (absent from
`STAT_NAME_MAP`). Now mapped (`perception → perceptionradius`), routed through
`character-totals.ts` to the `perceptionRadius` global, and given a Set-Bonus-popup group
(`set-bonus-groups.ts`, "General"). `knockback_strength` is explicitly mapped to `null`
(intentionally ignored — KB *magnitude* bonuses aren't a tracked player stat; KB
protection/resistance already are). Merged via `fix/io-set-bonus-followups`.

## ✅ Pseudo-pet summon entities resolve from priority_list (Glue Arrow et al.) (2026-06-06)

Location / rain / patch powers (Glue Arrow, Rain of Fire, Blizzard, Caltrops, Sleet,
Tornado, Lightning Storm, Ice Patch, Jack Frost, Phantasm, …) deal their damage + debuffs
through a summoned pseudo-pet. The HC binary stored the EntCreate `entity_def` as an opaque
P-hash, so `PET_ENTITIES[summon.entity]` never resolved and these powers showed no Damage
block / no debuffs (the Glue Arrow report — DoT(Toxic) / -spd / -rech / -fly / -jump flags
present but no effects). convert-powerset.cjs now resolves the P-hash to the `priority_list`
pet name (Pets_StickyArrow_Blaster, Pets_RainofFire, …), but ONLY for single-entity summons
(post-effect-loop) so multi-pet template-count summons are untouched (0 entityCount changes).
83 HC powers fixed; diff is purely the `summon.entity` line. Rebirth's export already
resolves entity_defs (no-op there). Guard: `pseudopet-summon-entity.test.ts`. Residual gaps
(HC exporter root cause, Phantom Army count) tracked in the unresolved section above.

## ✅ IO sets are binary-sourced for both servers; bonuses fixed (2026-06-05)

`io-sets-raw.ts` (HC + Rebirth) now generates from `boostsets.bin` + `powers.bin` via
`extract-rebirth-io-sets-v2.py --dataset <id>`; dead `convert-io-sets.js` +
`extract-rebirth-io-sets.cjs` retired. Subsumes the old "generators drop Absorb" gap —
the Heal/Absorb attribs flow from the binary correctly.

Verifying the data (GAME-DATA-PRINCIPLES §2) caught two bug classes the prior trial missed
(it compared only aspect *sets* + bonus tier *counts*):
- **Bonus stat keys / value scaling.** The binary's `cold_resistance` / `maxhp` /
  per-type-mez keys aren't in `normalizeStatName` → the calc silently dropped them (≈196
  entries on Rebirth-only sets). Rewrote to canonical keys + per-attrib value multiplier
  (damage ×250, max HP ×10, max end ×1, else ×100; flat ×100 was 10× off on max HP),
  paired-stat de-dup, family collapses.
- **Piece effective-aspect count.** Recovered from the enhancement scale
  (`= multiAspectModifier(count) × rarity`) instead of name/aspect-list counting — fixes
  LotG +Recharge (2 aspects) and ATO "#6" proc pieces (4). Proc detection via chance/ppm;
  negative-scale Strength templates excluded as proc debuffs (dropped spurious Slow/KB).

Validated tier-by-tier vs the trusted HC hand-data: only diffs are 20 damage display-
rounding fixes + 1 Aegis psi/tox de-dup, 0 aspect-count regressions. Durable mechanics in
[GAME-DATA-PRINCIPLES.md](GAME-DATA-PRINCIPLES.md) §11; guarded by `io-sets-bonus-keys.test.ts`
+ `io-sets-heal-absorb.test.ts`. tsc clean, 110/110 tests.

## ✅ Offensive knockback was dropped from ALL attacks (FIXED 2026-06-04)

Root cause of the kheldian "drops knockback" symptom: in `extractEffects`
([convert-powerset.cjs](scripts/convert-powerset.cjs)) the knockback handler had
`if (!isSelfTargeting) continue;` — which dropped **every foe-targeted knockback**,
i.e. the offensive KB that attacks apply (Energy Blast, Storm, Nova/Dwarf, all
knockdowns). The regen-diff guard stayed green because every powerset regenerated
*consistently* without it; the long-stale `kheldian-form-variants.ts` was the lone
canary that still carried the correct (old-converter) knockback.

Fix: in the foe-targeted branch, **emit offensive KB** (positive-magnitude `Current`)
and **skip only protection/reduction** — KB applied to *protect* the foe from being
knocked (immobilize -KB: Stone Cages / Freeze Ray, encoded as `aspect=Resistance` +100
paired with `aspect=Current` −100 on `*_Ones`). The discriminator is principled, not a
threshold: offensive KB is positive Current; protection is resistance-aspect **or**
negative scale. Restored **~1030 knockback/knockup/repel effects across 888 generated
files** (verified: power-burst 4, Wormhole 14, Tremor knockdown 1.34, Bright Nova Blast
1 == committed; zero mag-100 leaks; Stone Cages clean). Powers whose conditional effect
*was* knockback (Storm Blast In-Storm-Cell, etc.) also correctly materialize that
conditional and get descriptive labels. tsc clean, 84/84 tests.

**Remaining (deferred to the `.powers` extraction audit):**
- **Foe -KB protection** (immobilize "can't be knocked") is now correctly *excluded*
  from offensive KB but **not modeled** — there's no `PowerEffects` field for foe-applied
  KB protection, and the game folds it into "Immobilize". Per the completeness decision
  (2026-06-04) it should be modeled as its own effect; doing so after the audit.
- **`kheldian-form-variants.ts` itself** was left reverted (not regenerated): a regen
  carries additional *unvetted* accumulated converter deltas (a `tohitBuff` 0.5 removed,
  a `rechargeDebuff`/`Ranged_Slow` 0.2 added) from being long-stale. These need
  source-verification — exactly the audit's job — before the file is regenerated.
- `homecoming/kheldian-form-variants.ts` is dead output (`InfoPanel` imports the
  **rebirth** map unconditionally); make the lookup dataset-aware when modeling resumes.

## 🎯 GOAL (active) — `.powers` extraction-completeness audit

Decision (2026-06-04): stop omitting *mechanically-relevant* data for file size. The
naïve early choice to skip "build-irrelevant" fields keeps surprising us (knockback,
foe -KB, brute mods, Kheldian effects). New rule: **capture everything that affects what
a power does; skip only asset references** (`VisualFX`/`.PFX` paths, animation `include`s,
combat-text message IDs, icon internals).

Oracle: the HC dev's authoritative `.powers` source defs (`raw defs/`, 4,943 powers,
same category structure, gitignored). Confirmed OK to use (public game data, anon source).

**Framework built + one-time sweep done (2026-06-04):** `tools/extraction-audit/` —
`parse_powers.py` (parses the brace-nested `.powers` format) + `audit.py` (Phase-1
comparator: `.powers` vs `exported_powers`). Sweep covered 4,943 raw defs — **3,686
audited**, 1,257 skipped (no export; NPC/Temporary_Powers categories we don't extract).
Report snapshot: `tools/extraction-audit/gap-report.json`.

### Sweep findings — Phase 1 (parser/export gaps)

**Power-level fields genuinely absent from our export (clean signal — distinct names,
no normalization ambiguity). Several are mechanically relevant:**

| `.powers` field | # powers | relevance |
|---|---|---|
| `ModesDisallowed` | 3,475 | power disabled in certain modes (mez'd/phased/etc.) |
| `TimeToRoot` | 2,340 | animation root/lock time — affects DPS & rotation |
| `StrengthsDisallowed` | 951 | which enhancement aspects can't affect the power |
| `BuyRequires` | 631 | power prerequisites — build legality |
| `ToggleIgnoreHold/Sleep/Stun` | 524 | **toggle persists through mez** |
| `IgnoreStrength` | 438 | effect unaffected by enh strength — **currently sourced from CoD2**; capturing natively closes that dependency |
| `CastThroughHold/Sleep/Stun/Terrorize` | ~48+ | **power usable while mez'd** |

**Attrib comparison is NOT yet trustworthy** — its top entries are *normalization
artifacts*, not gaps. Verified: `.powers` `kDefense` = our `Base_Defense`,
`kSpeedFlying/Running/Jumping` = `FlyingSpeed`/`RunningSpeed`/`JumpingSpeed`,
`kEntCreate` = `Create_Entity`, the damage types = `*_Dmg`. `audit.py`'s `norm_attrib`
needs a real `.powers`↔export attrib name-map before its numbers mean anything. The
*real* attrib gaps underneath match the known unmapped-exotic class (CLAUDE.md ~7%):
`*_Elusivity` (`*elude`), `revoke_power`, `grant_power`/`grant_boosted_power`,
`silent_kill`, `cancel_mods`, `set_costume`, `jump_pack`, `xp_debt_protection`,
`null_bool`. (Note: Energy Torrent is faithful at the effect-group level — 5 vs 5,
not the earlier "6 vs 5", which was an `rg` false match on `EffectArea`.)

### Progress
- ✅ **`cast_through` (Blaster Defiance — "Cast While Mez'd")** surfaced
  (`418f3ec82`). Was already in the export, just unused — a Phase-2 captured-but-
  unused gap. Converter→model→display, 177 powers. No parser/re-export needed.
- ✅ **`toggle_ignore` ("Stays On While Mez'd")** captured (`542c9baea`). DID need
  parser work: `_parse_cast_flags` read `cast_through` then skipped the next 6
  bools — now reads the 3 `toggle_ignore_*` ones (alignment preserved). Re-exported
  both datasets (de-risked: `toggle_ignore`-only, no drift; sole incidental change
  was Rest gaining `allowed_set_categories ['Rest Buff']`). 784 powers. This proved
  the full parser→export→converter→model→display path and the re-export workflow.
- ⚠️ **`IgnoreStrength` — CONFIRMED CALC GAP (not "moot" — that earlier call was
  wrong).** The data is captured (`template.flags`), so nothing is lost; the gap is
  that the **converter only honors `IgnoreStrength` for regeneration** (the
  `resType === 'regeneration'` branch → `regenBuffUnenhanced`/`effects.n`). Every
  other real-stat effect that ignores strength is mishandled. After filtering the
  traps (the `aspect=Strength, scale=0` damage **meta-template**; `aspect=Resistance`
  -Res/debuff-resistance templates that merely use `*_Dmg`/`Base_Defense` attribs;
  procs; pets), **288 player-powerset effects** remain with a genuine
  `aspect=Current/Absolute` `IgnoreStrength`: Endurance 120, Recovery 90, ToHit 50,
  Base_Defense 10, RechargeTime 8, Heal 7, Absorb 3. Two failure modes:
  - **Over-enhance** (main `effects`): emitted as a normal enhanceable effect.
    *Confirmed:* Bio Armor **Environmental Adaptation**'s +ToHit (0.75, `IgnoreStrength`
    in game) → generated `tohitBuff: 0.75`, and `tohitBuff` has
    `enhancementAspect: 'tohit'`, so the calc boosts it with ToHit IOs / global +ToHit.
  - **Dropped entirely** (`activation_effects` toggles/autos): the converter drops
    non-regen `IgnoreStrength` templates there (`isDropForActivationEffects`) — the
    very "missing data" pattern we keep getting bitten by.
  **Fix:** generalize the unenhanceable handling beyond regen — route the effect to a
  `…Unenhanced` key and add it to its global total WITHOUT the enhancement multiplier.
  Calc-affecting; needs care (the meta-template / resistance traps above show how a
  naïve `flags.includes('IgnoreStrength')` over-fires). Scope with the
  `aspect ∈ {Current,Absolute,Magnitude}` + non-proc discriminator validated here.
  The discipline: the data was never the problem — our *use* of it was.

  **Status (2026-06-04):**
  - ✅ **Recovery + ToHit FIXED** (`940d89dbb`): `recoveryBuffUnenhanced` /
    `tohitBuffUnenhanced` keys; 65 powers reclassified; confirmed Env Adaptation +ToHit
    no longer enhanced. tsc + 84 tests.
  - 🔎 **Refinement** — the original "288" over-counted on two fronts:
    - `recharge`, `absorb`, `endurance` (`enduranceGain`) carry `IgnoreStrength` but
      are **not enhanced in the calc** (a +recharge buff isn't boosted by Recharge IOs,
      etc.) → **no over-enhance bug**; correctly left as-is.
    - ✅ **Defense is NOT a bug either** (verified by inspecting all 10): every
      `Base_Defense` `IgnoreStrength` case is a **debuff or self-penalty**, not a buff
      — Eye of the Storm is a foe `-Def` (`Melee_Debuff_Def` table); Rage (−0.2), Rest
      (−1000), Vulnerability (−0.1125) are negative-scale self-crashes already routed
      to `defenseDebuff`. No genuine defense **buff** carries `IgnoreStrength`. The
      earlier "Defense (10)" count was debuffs caught by a too-loose filter.
  - ✅ **Heal FIXED** (single-portion heals). Heal flows `extractDamage` → a
    `type:'Heal'` damage entry → re-extracted into a `healing` effect, which was
    duplicated in three places. Consolidated into one helper
    (`src/utils/calculations/healing.ts` `extractHealingFromDamage`, replacing the
    copies in `InfoPanel.tsx`, `PowerInfoTooltip.tsx`, `CompareSlottingModal.tsx`),
    then threaded `IgnoreStrength`: the converter tags `Heal` entries with
    `ignoreStrength`, the helper carries it, and `power-stats.ts` skips Healing enh /
    global +Heal for it. Fixed the genuine single-IgnoreStrength-heal powers —
    **Inner Will, Restore Essence (7.5), Energy Transfer** — no longer over-enhanced.
  - ✅ **Both-portions heal SUMMED** (`extractHealingFromDamage` now combines same-table
    `type:'Heal'` entries into `scale` + `unenhancedScale`; `power-stats` enhances only
    `scale − unenhancedScale`). This unified single-portion / fully-unenhanced /
    both-portions handling and **fixed Inner Will** (it actually pairs a 0.075
    IgnoreStrength heal with a 0.075 enhanceable one — the old "take first entry" logic
    showed only 0.075; now 0.15 with enh on half). Runtime-only (the entries were
    already in `generated`), tsc + 84 tests.
  - ✅ **FIXED — per-target HP-state leech effects (DNA Siphon etc.) were dropped.**
    Distinct from IgnoreStrength: leech powers gate effects on the *target's* HP state
    — `Cur.kHitPoints target> 0 >` (per **living** foe) / `... ==` (per **defeated**
    foe). The converter's conditional-gate filter treated these as positive-state
    gates and dropped the effects, so DNA Siphon showed **no heal/+End/+Regen/
    +Recovery**, Phoenix Awakening no Heal-over-Time, Glitz no damage, Soul Absorption
    no -ToHit. Per-case analysis showed they're the powers' **advertised base effects**
    (DNA Siphon's "Self +HP, +End, +Special"), NOT toggle conditions. Fix: add the
    `Cur.kHitPoints target> 0 (>|==)` clause to `_stripIgnoredClauses`, so pure HP-state
    gates fold into the base display (with `perTarget` preserving the per-foe scaling)
    while a trailing **mode** clause (`kDefensiveAdaptation Source.Mode?`) survives and
    keeps that portion an Adaptation conditional. Self-rez (`kHitPoints == 0`, no
    `target>`) untouched. 15 generated files (the ~9 leech/state powers × datasets);
    tsc + 84 tests. (The Warshade dead-enemy mechanic the user flagged — Stygian Circle
    — uses a *different* gate and isn't affected here.)
    - *Minor remaining:* DNA Siphon's mode-gated **heal** bonus (Defensive +0.375),
      being a heal-via-`damage` entry, doesn't surface in the Adaptation
      `conditionalEffects` (the heal-from-damage / mode-conditional paths don't meet).
      Base heal is correct; only the mode bonus is under-shown.
  - ✅ **`activation_effects` drop — verified harmless (no action).** Audited every
    non-regen `IgnoreStrength` self template the filter drops: **0** are real
    enhanceable buffs (aspect=Current/Absolute on recovery/tohit/heal/defense/etc.).
    The non-duplicate drops are all meta-templates (the all-damage-types strength row,
    `Set_Mode`, `Grant_Power`, `Create_Entity`, `Global_Chance_Mod` — correctly
    dropped / skipped by `extractEffects` anyway) or protection (mez/KB/debuff-
    resistance) that is **also captured from the power's main `effects`** (confirmed:
    Entropy Shield's `mezResistance` etc. are present). So the drop loses nothing real
    — the earlier "duplicate-vs-genuine" worry didn't survive verification.

### Next steps (priority order)
1. **`IgnoreStrength` DONE**; **per-target HP-state leech effects DONE** (DNA Siphon /
   Phoenix Awakening / Glitz / Soul Absorption now surface their advertised effects).
   Minor leftover: DNA Siphon's mode-gated *heal* bonus (heal-via-damage + mode) doesn't
   reach the Adaptation conditionalEffects — needs the heal/mode-conditional paths joined.
2. **Other clean power-field captures** (same pattern as the mez fields):
   `TimeToRoot` (2,340 — animation lock, affects DPS/rotation), `ModesDisallowed`
   (3,475), `StrengthsDisallowed` (951), `BuyRequires` (631). All genuinely absent,
   distinct names. Need parser reads + re-export (the toggle_ignore workflow).
3. **Add the `.powers`↔export attrib name-map** to `audit.py` → produce a clean
   attrib-gap list → then close the genuinely-dropped exotic attribs.
4. **Phase 2 — converter completeness**: diff `exported_powers` vs `generated` (the
   class the knockback bug belonged to — parser captured it, converter dropped it);
   ensure every mechanically-relevant template/field incl. `requires_expression`
   gating is emitted. Also fold in the un-parsed template tail (`suppress_events`,
   `flags`, `fx`).
5. **Later**: a `.powers ⊆ extraction` guard, once the sweep backlog is worked down.

## ✅ Rebirth Blaster ToHit-buff AT modifiers were stale (FIXED 2026-06-03)

`rebirth/at-tables.ts` carried Homecoming's Blaster ToHit-buff base modifiers (0.10)
instead of Rebirth's rebalanced `Melee_Buff_ToHit` 0.075 / `Ranged_Buff_ToHit` 0.07
(verified against `exported_powers/rebirth/tables/blaster.json`; HC source is 0.10, so
it's a genuine Rebirth divergence, not a parse bug). The planner was overstating Rebirth
Blaster ToHit buffs (Aim/Tactics/Build Up). Regenerated; no other AT table drifted.
Surfaced by the full `npm run regen` while validating the regen-diff guard.

## 🎯 GOAL (deferred) — commit the converter input so CI can regenerate + byte-diff

**Shipped now (the lightweight half):** [converter-invariants.test.ts](src/data/converter-invariants.test.ts)
— a structural invariant scan over the **committed `generated/`** data that runs in CI
with **zero raw data**. It locks in the converter-regression classes that have repeatedly
bitten us: export const === `PascalCase(internalName)` (the bio-armor naming saga), no
malformed bare `specialBuff` (the RechargeTime/Strength stacking regression), no unsigned
`0xFFFFFFFF` sentinels, and no NEW `*_PvPMez` tables (prefer-PvE mez fix; a 5-entry
allowlist grandfathers the genuinely-PvP-only powers — scramble-thoughts ×3, arctic-air,
and `Epic.Field_Mastery.Repulsion_Bomb`). Cheap, no repo-footprint cost, catches the
*known* failure shapes at PR time.

**The deferred end-state (the heavy half):** commit the **converter input** —
`exported_powers/` for both datasets (**~233 MB / ~25k files**, vs the 30 MB / 6,176-file
committed `generated/` output) — so CI can run the converters **end-to-end** and byte-diff
the regenerated `generated/` against what's committed. That catches **any** converter drift,
not just the four known classes, and closes two gaps the current setup has:

- **Reproducibility:** today a fresh clone / CI **cannot** rebuild `generated/` — the
  converter input is gitignored, so the strongest possible guard (regenerate-and-diff) is
  impossible. The invariant scan is a proxy for it.
- **Two-machine fragility:** the raw source lives only on the PC + laptop local copies
  (see CLAUDE.md "Source Data"); there is no canonical, versioned input.

**Why it's the full ~233 MB, not a prunable subset.** The exporter is **not** a blind dump
— [`export_powers.py`](tools/bin-crawler/bin_crawler/export_powers.py) already filters
204 → ~60 categories. The 34 player AT/pool/epic categories are the core; the other ~25 are
a *documented, genuinely-consumed dependency closure* the converters dereference:
`*_Aux` (leap/charge hit-data via `Execute_Power`), `Pets`/`Villain_Pets`/`Mastermind_Pets`/
`Kheldian_Pets` (snipe & redirect targets, henchman powers), and the **villain-group block**
(Rularuu, Council, Crey, Rikti, DevouringEarth, CircleOfThorns…) that **Lore incarnate pets
"mimic"**. That last block is why the export is full of enemy types — and it lands in the
committed `incarnate-effects.ts` (both datasets) via `convert-pet-entities.cjs` /
`convert-incarnate-effects.cjs`. So a CI regen needs the **whole closure**, not the 34 AT
categories. (The real over-export is *granularity within* those categories — a whole 302-file
`council/` is pulled for ~3-4 Lore-referenced attacks — but tightening that needs the full
transitive entity/redirect closure, fragile and not worth it.)

**Decision (2026-06-03): commit the full ~233 MB as-is.** Acceptable because GitHub allows
it — no single file approaches the 100 MB hard limit (every power JSON is KB-scale; biggest
is ~44 KB), the ~233 MB total is well under GitHub's ~1 GB soft recommendation and the 2 GB
per-push limit, and our files are tiny JSON, not large blobs. The cost is permanent git-history
weight + slower clones + a ~25k-file working tree — tolerable for the reproducibility win.
*Optional* later shrink, if history weight bites: drop the ~10 unread template fields
(`duration_expression`, `magnitude_expression`, `flags_raw`, `tick_*`…) at export time — the
only prune that preserves regen, but bounded by the "fully replace CoD2" goal that wants some
of them (`suppress_events`, `flags`). git LFS is **not** needed (no large individual files).

---

## ✅ Powerset/pool deep regen — converter `specialBuff` regression fixed, layers brought current (FIXED 2026-06-03)

Brought the stale `generated/powersets` + `generated/power-pools` layers current for
both datasets, materializing the accuracy + mez-PvE fixes and every other accumulated
converter improvement — after root-causing and fixing the converter regression that
blocked it.

**The blocker (now fixed):** a full regen emitted a **malformed bare `specialBuff`**
(`{ scale, table, perTarget }` instead of the keyed `{ <statKey>: … }`) for a handful
of powers (entropy-shield, beta-decay, Dual Blades combos, geode), breaking `tsc` and
threatening to drop those powers' buffs. Root cause: **`classifyTemplateForStacking`**
(stacking/perTarget patch keys) routed **`RechargeTime aspect=Strength`** to
`specialBuff`, but `extractEffects` keeps recharge on the flat `rechargeBuff` key — so
the perTarget patch was mis-keyed onto the `specialBuff` container and corrupted it
(and would have lost e.g. Entropy Shield's real +recharge-per-foe buff). Fix in
[convert-powerset.cjs](scripts/convert-powerset.cjs): (1) exclude `RechargeTime` from
the blanket `strength → specialBuff` in `classifyTemplateForStacking` (mirrors the
existing damage/accuracy exclusions, so it falls through to `rechargeBuff` and matches
`extractEffects`); (2) defensive guard in `mergeStackingPatches` — never apply a flat
patch to a keyed container (`specialBuff`/`specialDebuff`); the dropped `perTarget` is
calc-irrelevant there (`collectStrengthBuffs` uses `stacksLinear`/`maxStacks`, not
`perTarget` on specialBuff values). Plus the `accuracyDebuff` type gap (Geode's self
`-Accuracy`, raw `-999`) — added to `PowerEffects` + effect-registry.

**What shipped (verified):**
- **HC powersets:** 100 generated files — 54 `specialBuff` consolidation (strength
  buffs into the keyed container the calc consumes), 22 sentinel `4294967295 → -1`,
  5 `accuracyBuff` (Combat Training: Offensive, Eagle Eye, Terra Firma, Beryl Crystals,
  Targeting Drone…), the PvE-mez fixes, etc.
- **Rebirth powersets:** 52 files (sentinel + accuracy, mostly).
- **Pools:** Rebirth `power-pools` gained the accuracy fix; HC pools already current.
- **Safety checks:** `tsc` clean, **0** bare-`specialBuff`, **0** silently-lost buffs
  (scripted check: no buff key removed without a `specialBuff` replacement),
  entropy-shield & beta-decay restored to exact HEAD (recharge preserved), 79/79 tests.

**✅ Bio-armor root-fixed (the recurring naming problem) — module identifiers now
derive from the internal name.** The persistent bio-armor breakage was a symptom of a
latent fragility affecting ~1,234 powers whose internal name ≠ display name: the
generated **export const was derived from the mutable *display* name** (`power.name`),
while the file is named from the stable *internal* name. For bio-armor the two are
*crossed within the set* (internal "Adaptation" displays "Evolving Armor", and vice-
versa) **and** its display name keeps getting corrected (pigg/override history) — so
each correction flipped the export const, and `convert-powerset` scaffolded the
composed per-power files *only-if-missing*, leaving their imports stranded.

Fix ([convert-powerset.cjs](scripts/convert-powerset.cjs)): (1) derive the export const
**and** the index imports from `power.internalName` (= the file name) instead of the
display name — so file name === export name, stable forever, regardless of display-name
changes; (2) always-regenerate the composed per-power files (verified 100% mechanical,
0 hand-edits across 6,170 files — hand-edits live in the parallel override files), so a
rename can never strand them again. The display name now lives only in the power's
`name` data field, freely overridable without touching module structure.

This was a one-time re-derivation of export consts across the whole powerset layer
(~1,200 crossed powers × generated/composed/index, both datasets). **Audit:** zero
hand-written imports of power export consts exist (only the auto-regenerated
composed/index/kheldian layers consume them), so nothing external broke. **Verified:**
`tsc` clean, 79/79 tests, 0 bare-`specialBuff`, 0 lost buffs, non-crossed powers'
composed files byte-unchanged, bio-armor now `adaptation.ts → export const Adaptation`
(file = export) with "Evolving Armor" in `.name`. Bio-armor is included in this regen.

---

## ✅ Focused Accuracy missing its +Accuracy self-buff (FIXED 2026-06-03)

**✅ RESOLUTION (2026-06-03).** Root cause confirmed exactly as diagnosed: the raw
template `Accuracy / aspect=Strength / Melee_Ones / scale 0.2` (= +20%) was
dropped by the converter and unhandled by the calc. Key correction to the
original plan: Accuracy is inherently a **Strength-aspect stat** (all 40 in-game
Accuracy templates are aspect=Strength — there is no Current variant), so for
Accuracy `aspect=Strength` IS the normal +Accuracy buff, NOT a Power-Boost-style
amplifier. It therefore routes to `accuracyBuff` → `global.accuracy`, **not**
`specialBuff` (the plan's suggested strength→specialBuff routing would have been
wrong). Fix, three layers + override:
1. **Converter** ([convert-powerset.cjs](scripts/convert-powerset.cjs)) — added
   `'accuracy': 'accuracy'` to `COMBAT_MODIFIERS`, an `else if (modType ===
   'accuracy')` emit branch (resistance → `debuffResistance.accuracy`, neg →
   `accuracyDebuff`, else → `accuracyBuff`), and an accuracy carve-out in the
   stacking-metadata helper so it maps to `accuracyBuff` not the specialBuff
   strength container.
2. **Calc** ([character-totals.ts](src/utils/calculations/character-totals.ts)) —
   added an `effects.accuracyBuff` handler right after `tohitBuff` that adds the
   scaled value × 100 into `global.accuracy` (additive with set bonuses). **No**
   enhancement multiplier — accuracy enhancements boost attack-roll accuracy, not
   a buff power's own +Accuracy. Effect-type decls added to `power.ts`, `stats.ts`,
   and the `ActivePowerEffect` interface; display entry added to
   [effect-registry.ts](src/data/core/effect-registry.ts) (`+Accuracy`, no
   `enhancementAspect`).
3. **Data** — materialized via a **deliberate epic-pools regen of both datasets**
   (`node scripts/convert-epic-pools.cjs --dataset {homecoming,rebirth} --apply`).
   The full diff was classified per-power: HC = 22 changed (10 `accuracyBuff`
   additions + 12 PvE-mez fixes — see the ✅ mez note below), Rebirth = 12 (all
   `accuracyBuff`). No other categories changed, no regressions. The earlier
   stop-gap `accuracyBuff` overrides were **removed** — the generated layer now
   owns the data (covers Focused Accuracy, Targeting Drone, Personal Force Field).

**Verified:** [focused-accuracy.test.ts](src/utils/calculations/focused-accuracy.test.ts)
asserts FA toggled on adds exactly +20% to `globalBonuses.accuracy` (0 when off),
now resolved through the generated layer. tsc clean, 79/79 tests pass.
Alpha-incarnate accuracy path is unaffected (special-cased).

**Not done:** powerset/pool accuracy powers (Combat Training: Offensive, Eagle Eye,
Terra Firma, …) — see the ⚠️ entry at top.

## ✅ Epic-pools PvE-mez staleness (FIXED 2026-06-03, via the regen above)

The committed `epic-pools.ts` was built before the converter's "prefer the PvE mez
table over PvP" fix (`convert-powerset.cjs` ~line 2244: `*_PvPMez` tables have no
PvE AT-table entry, so a hold/sleep/stun whose duration is `scale × table` silently
showed **no duration** when the old "higher-magnitude-wins" tiebreaker picked the
PvP template). **Verified correct:** each affected power's raw carries *both* a PvE
template (e.g. `Ranged_Sleep`, scale 12) and a PvP one (`Ranged_PvPMez`, mag 4) —
`collectTemplatesDeep` finds both and the fix now keeps the PvE one. Materialized by
the regen above (12 HC powers: Flash Freeze→Sleep, Stalagmites→Stun, Netherworld
Grasp→Immobilize, etc.). Rebirth was already current (Parse6, 0 PvPMez powersets).

---

<details><summary>Original diagnosis (2026-06-03, pre-fix)</summary>

**Reported:** User in-game build showed Focused Accuracy granting +ToHit but
no +Accuracy (expected ~+20%). General/Offense tab Accuracy total only
reflected the Hecatomb 4pc set bonus (+15%).

**Symptom in data:** Every Focused Accuracy variant in
`src/data/datasets/<dataset>/generated/epic-pools.ts` has a `tohitBuff` effect
but no `accuracyBuff`. Affected powers (HC):

- `Epic.Body_Mastery.Focused_Accuracy` (Scrapper)
- `Epic.Body_Mastery_Stalker.Focused_Accuracy`
- `Epic.Brute_Mace_Mastery.Focused_Accuracy`
- `Epic.Corruptor_Mace_Mastery.Focused_Accuracy`
- `Epic.Energy_Mastery.Focused_Accuracy` (Tanker)
- `Epic.Energy_Mastery_Brute.Focused_Accuracy`
- (likely more — grep `"name": "Focused Accuracy"`)

Note: the `"accuracy": 1` field on each is the power's own to-hit multiplier
for its attack roll (neutral), not a self-buff — a different concept.

**Root cause — three layers:**

1. **Converter drops the attrib.** `scripts/convert-powerset.cjs:876-884`
   defines `COMBAT_MODIFIERS` (`tohit → toHit`, `range → range`, etc.) but has
   no entry for `accuracy`. When the bin parser emits a template with attrib
   `Accuracy` (HC index 84, Rebirth index 85 — see
   `tools/bin-crawler/bin_crawler/parser/_enums.py:242` and `:308`), the
   converter has no branch for it and silently discards the effect.

2. **Calc engine has no handler.** `src/utils/calculations/character-totals.ts:889`
   reads `effects.tohitBuff` and adds to `global.toHit`. There is no parallel
   `effects.accuracyBuff` branch feeding `global.accuracy`. Set bonuses
   already populate `global.accuracy` via `STAT_TO_GLOBAL` at line 327, which
   is why Hecatomb's +15% shows up but no power-driven contribution can.

3. **Data is regenerable but currently empty for this effect.** Even after
   fixing the converter, existing `generated/epic-pools.ts` files won't pick
   up the change until the user re-runs `node scripts/convert-epic-pools.cjs
   --apply` against the .pigg archives.

**Likely also affected:** Other powers that grant flat +Accuracy as a
self-buff (not +ToHit) — check Targeting Drone (`Pool.Devices.Targeting_Drone`
or similar), any incarnate Alpha slot that emits an `accuracy` attrib
template (Alpha is special-cased at `character-totals.ts:2463` — that path
works), and any boost-style accuracy buffs in Epic pools.

**Recommended path forward:**

1. **Converter fix** (`scripts/convert-powerset.cjs`):
   - Add `'accuracy': 'accuracy'` to the `COMBAT_MODIFIERS` map (line ~877).
   - Add an `else if (modType === 'accuracy')` branch in the combat-modifiers
     section (~line 2479) that emits `effects.accuracyBuff = makeEffect();
     recordDuration('accuracyBuff');`. Mirror the `tohitBuff` branch shape;
     handle `aspect === 'resistance'` → `debuffResistance.accuracy` and
     `aspect === 'strength'` → `specialBuff.accuracy` for parity.

2. **Calc engine fix** (`src/utils/calculations/character-totals.ts`):
   - Right after the `tohitBuff` block at line 889, add a parallel
     `effects.accuracyBuff` block that resolves the scaled value, multiplies
     by `100`, applies any relevant enhancement multiplier (the in-game
     allowedEnhancements on FA is `ToHit` only — accuracy enhancements don't
     slot the toggle's buff, so likely no enh multiplier; double-check
     against Mids' behavior before deciding), and adds to `global.accuracy`
     with a breakdown entry.
   - Also extend the effect type declaration in
     `src/utils/calculations/power-stats.ts` and any Power type that lists
     buff-effect keys.

3. **Data regen / override:**
   - Preferred: re-run `node scripts/convert-epic-pools.cjs --apply` against
     a current `.pigg` set to repopulate `generated/epic-pools.ts` for both
     `homecoming/` and `rebirth/` datasets. This picks up the converter fix
     for every affected power in one pass.
   - Fallback if raw data is unavailable on the current machine: add entries
     to `src/data/datasets/<dataset>/overrides/epic-pools.ts` keyed by
     `fullName` that merge in an `accuracyBuff` effect. Approximate values
     from the in-game tooltip: scale ~0.2 on `Melee_Buff_ToHit` (verify
     against CoD2 or in-game numbers; FA is roughly +20% Accuracy /
     +7% ToHit at base for Tanker/Scrapper). Verify duration / aspect match
     the existing `tohitBuff` shape.

4. **Verification checklist:**
   - Toggle FA on a Tanker / Scrapper / Brute / Corruptor build and confirm
     the Acc total in the Offense panel and General/totals tab gains the
     expected +20% (or AT-modulated value).
   - Confirm the Power Info popup for FA now lists both ToHit and Accuracy.
   - Spot-check Targeting Drone and any Alpha-incarnate accuracy contribution
     for regressions.
   - Add a regression test under `src/utils/calculations/__tests__/` (mirror
     existing tohit-buff tests) that asserts `accuracyBuff` flows into
     `globalBonuses.accuracy`.

**Files involved:**

- `scripts/convert-powerset.cjs:876` (COMBAT_MODIFIERS map)
- `scripts/convert-powerset.cjs:2450` (combat-modifier emit block)
- `src/utils/calculations/character-totals.ts:889` (tohitBuff handler — add
  accuracyBuff sibling)
- `src/utils/calculations/character-totals.ts:327` (STAT_TO_GLOBAL — already
  maps `accuracy`, no change needed)
- `src/data/datasets/homecoming/generated/epic-pools.ts` (regenerate)
- `src/data/datasets/rebirth/generated/epic-pools.ts` (regenerate)
- `tools/bin-crawler/bin_crawler/parser/_enums.py:242,308` (attrib mapping —
  already correct, FYI)

</details>

---


---OLD ISSUES---

## ✅ Rebirth Inexhaustibility — no-rarity `boostsets.bin` record variant (FIXED 2026-06-02)

**Symptom.** Inexhaustibility (Secret Master 5th Column TF/SF reward, single-piece special that slots only into the Rest inherent) shipped with empty `pieces: []` and `bonuses: []`, so it couldn't be slotted. The other three Rebirth Challenge Enhancements (Liberty's Belt, Imperial Might, Forced Indoctrination) all use the standard layout and extract cleanly.

**Root cause (decoded from the binary).** Record #152 (rec_len=316) is a **no-rarity variant**: it omits both the rarity AND category strings, so the `power_count` u4 sits directly in the rarity slot. The parser read those bytes as a bogus empty pascal string, desynced, then read the first power string as `power_count` (garbage > rec_len) and the `> rec_len` guard bailed → empty record. Decoded contents:
- allowed power: `Inherent.Inherent.Rest`
- piece: `Boosts.Attuned_Inexhaustibility_A.Attuned_Inexhaustibility_A` — a `Set_Mode`/aspect=Strength special with no enhancement stat
- bonus: min 1 / max 6 → auto-power `Set_Bonus.Challenge_Set_Bonus.Inexhaustibility`, gated by an embedded `PowerBoostsSlotted 1 >=` requires expression
- effect (`powers.bin`): a Rest-only proc — 3 effect groups @ 50% chance: Heal (2.0×Melee_Heal), +Endurance (Current 0.10), +Regeneration (Current 2.0 / 10.25s). Proc-like and tied to Rest; does **not** fit the planner's flat `bonuses[].effects[]` (stat+value) model.

**Fix (two parts).**
1. **Parser fidelity** — [_boostsets.py](tools/bin-crawler/bin_crawler/parser/_boostsets.py): added `_rarity_is_present()` (rarity tags are always alphabetic; the no-rarity variant has a u4 whose content byte is `0x00`). When absent, skip the rarity+category strings and read `power_count` from that slot. Generalizes to any future no-rarity record. Verified safe: of 233 Rebirth sets, exactly 1 (Inexhaustibility) is no-rarity; all 232 normal records parse identically (Jaunt still 28 powers / 3 boostlists / 2 bonuses). Inexhaustibility now extracts its allowed power + piece + bonus min/max. (The non-standard bonus-block tail still leaves `auto_powers` empty — acceptable, since the effect is proc-like and isn't modeled as a set bonus.)
2. **Data** — [io-sets-raw.ts](src/data/datasets/rebirth/io-sets-raw.ts): hand-added the single proc-special piece (`aspects: []`, `proc: true`, `unique: true`) so Inexhaustibility is **slottable into Rest**. Left `bonuses: []` — the Rest-buff is a power-effect proc, not a flat set bonus, so fabricating a stat+value bonus would mislead the SetBonusDisplay (which renders `{stat}: +{value}%`). Zero drift to other sets.

**Not done:** surfacing the Rest-proc effect numerically. The planner doesn't model "while resting" procs; the set is now functional (slottable) and labeled `Rest Buff`.

## ✅ Non-kExpression template `delay` field offset (FIXED 2026-05-21)

**Symptom.** Pet/pseudopet summon powers shipped with no `summon.duration` because the bin parser was reading `delay = 0` for every Silent_Kill template (the AttribMod that despawns the pet after a set time). Affected 11 player Click powers with EntCreate templates whose own Duration is 0 (Haunt, Hell on Earth, Dark Extraction, etc.). Without `summon.duration`, the perma tracker eligibility check skipped these powers, and Power Info couldn't show the pet's stay-alive time.

**Root cause.** `_parse_effect_template` in [tools/bin-crawler/bin_crawler/parser/_powers.py](tools/bin-crawler/bin_crawler/parser/_powers.py) had two parallel layouts for the post-magnitude field block:

- `kExpression` (typ_raw==3): `dur_expr_tokens (u4_array), mag_expr_tokens (u4_array), delay (f4)` — correct
- everything else: `delay (f4), dur_expr (string), mag_expr (string)` — **wrong**

Both branches actually use the kExpression layout in the binary. The non-kExpression branch happened to look right for templates with no Delay AND no expressions — the dur_expr/mag_expr token-array counts were 0, the parser read those 4 bytes as delay (got 0.0), then read the next two 4-byte slots as string offsets (got empty strings). The moment a template had a real Delay value (227 Silent_Kill templates across HC), the parser interpreted the dur_expr count (0) as the delay and the actual delay bytes as a stray string offset, silently dropping the value.

This is the same kind of bug the kExpression branch had originally; that one was fixed by reordering tokens-before-delay.

**Fix.** Merged both branches into one path that always reads tokens-then-delay. Verified against 227 Silent_Kill templates — all now match wiki-known pet lifespans (Pets_Shade 60s, Pets_Living_Hellfire 90s, Pets_Mastermind_Ghosts 300s, Pets_Warshade_Extraction 200s, etc.).

**Downstream wiring.**
- [scripts/convert-pet-entities.cjs](scripts/convert-pet-entities.cjs) extracts the Silent_Kill delay per pet entity by scanning its bundled `Self_Destruct` power (signature: target=Self, stack=Stack, table=Melee_Ones, no EntCreate params — needed because the binary's enum index 117 collision labels Silent_Kill as `Create_Entity`). Surfaces it on `PetEntity` as `lifespan?: number` and writes a CommonJS-friendly sidecar at `src/data/datasets/<id>/pet-lifespans.json` (33 HC entries).
- [scripts/convert-powerset.cjs](scripts/convert-powerset.cjs) loads the sidecar and falls back to `PET_LIFESPANS[entity_def]` when the summoning power's EntCreate AttribMod has `Duration=0`.

**Broader impact.** This bug affected every non-kExpression template that had a non-zero Delay. 227 templates fixed across HC. Worth a broader re-conversion sweep — anything that consumed `delay` (proc PPM activation gating, delayed-debuff effects, etc.) may have been silently reading 0 where it should have read a real value.

**Parse6 (Rebirth) is unaffected** — its template layout is `table, scale, app, type, delay, ...` (delay read directly after type, no expressions in between). Different parser path, never had this bug.

---

## ✅ Pseudopet lifespans (PL_StaticObject / Vines patches) (FIXED 2026-05-21)

**Symptom.** After the Silent_Kill fix above, four player Click powers still shipped without `summon.duration`:

| Power | entity_def | Lifespan |
|---|---|---|
| Gravity Distortion Field (Cont/Dom) | PL_StaticObject | 60s |
| Paralyzing Blast (Cont/Dom) | PL_StaticObject | 60s |
| Vines (Plant Control) | Vines pseudo-pet | 60s |
| Glue Arrow | P4234428342 (P-hash patch) | 30s |

**Why not solved by Silent_Kill fix.** These pseudopets aren't represented as pet entity files (`pets_*.json` / `mastermindpets_*.json`) — they're engine-side primitives that don't have their own bundled power list keyed on the entity record. So the entity-keyed lookup in `pet-lifespans.json` had no entry to consult.

**Root mechanism (turns out it's the same Silent_Kill data, just routed differently).** Each pseudopet's summoning AttribMod populates `params.redirects` with the redirect powers the pseudopet runs — and one of those redirects is a `*.Self_Destruct` power carrying the Silent_Kill delay. Examples:
- Gravity Distortion Field → `Redirects.Gravity_Control.Self_Destruct` (delay 60)
- Paralyzing Blast → `Redirects.Electric_Control.Self_Destruct` (delay 60)
- Vines → `Villain_Pets.Vines.Self_Destruct` (delay 60)
- Glue Arrow → no Self_Destruct in redirects, but `priority_list: "Pets_StickyArrow_Blaster"` names a real pet entity that's in the existing entity-keyed sidecar (delay 30)

**Fix.**
- [scripts/convert-pet-entities.cjs](scripts/convert-pet-entities.cjs) now also produces `src/data/datasets/<id>/self-destruct-delays.json` — a map of fully-qualified Self_Destruct power names to their Silent_Kill delay. Built by a recursive walk over the bin export for every `self_destruct.json`. 43 HC entries.
- [scripts/convert-powerset.cjs](scripts/convert-powerset.cjs) wraps the lookup in a three-stage `resolvePetLifespan` cascade: (1) entity_def in pet-lifespans, (2) any `*.Self_Destruct` in params.redirects → self-destruct-delays, (3) priority_list in pet-lifespans. First hit wins; returns 0 if nothing matches (matches pre-fix behavior).

**Verified live.** All four powers now ship with `summon.duration` set, and the perma-tracker eligibility check includes them.

## ✅ Dual Pistols Swap Ammo — per-ammo secondary effects (FIXED 2026-06-04)

**Symptom.** Every Dual Pistols attack showed all three ammo secondary effects at once, always-on in base `effects`: -Def (Standard), -Recharge (Cryo), -Damage (Chemical). In-game these are **mutually exclusive** — the loaded ammo selects exactly one (Standard -Def by default; Incendiary's is a fire DoT, already a damage entry).

**Root mechanism.** Unlike Bio Armor / Staff (`Source.Mode?` gates), Dual Pistols ammo uses **`Effect.Tag` + global-chance-mod**: each attack carries `Lethal`/`ColdDamage`/`ToxicDamage`/`FireDamage` tag groups (the non-Standard ones at `chance 0`), and the ammo toggle flips the tags' fire-chance. There is **no `requires_expression`** — so the conditional-gate path never saw them, and the base collector folded them all in.

**Blocker + parser fix.** The export **dropped the `Tag` field** (the parser read it only to advance the binary, then discarded it). Captured it in `_dataclasses.py` / `_powers.py` / `export_powers.py` and re-exported homecoming (purely additive: +41,222 lines, 0 deletions). Bonus: this activated the converter's dormant tag-aware stacking (`collectTemplatesWithMeta`), correctly separating the **Defiance** inherent (`aspect=Strength`, tagged `Defiance`) from 5 Blaster powers' per-target buffs (Soul Drain, etc.).

**Converter fix (key-based — works on BOTH binary formats).** `extractDualPistolsAmmo` is **key-based, not tag-based**: the ammo secondary lands in base as a fixed effect key per ammo (Standard -Def = `defenseDebuff`, Cryo -Recharge = `rechargeDebuff`, Chemical -Damage = `damageDebuff`), so it moves exactly those keys out of base into mutually-exclusive `swap-ammo` conditionals (`lethalammo` is `defaultActive`). Core effects keep their own keys and **stay in base** (knockback, the self +Def/+Dmg on Hail of Bullets, etc.). Driven by the build-scoped `Swap_Ammo.activeSubPower` via the stance-group system (with a new `defaultOptionId` so Standard applies when no ammo is loaded — even with no Swap Ammo power).

Why key-based and not tag-based: **HC/Parse7 tags the ammo groups, but Rebirth/Thunderspy uses Parse6** (`_parse_effects_parse6`), which has **no `EffectGroup` wrapper at all** — it stores flat AttribMods (each wrapped in a synthetic single-template group), so there's no group-level `Tag`. Both formats land the same effect KEYS in base, so attributing by key fixes **both servers** with no Rebirth re-export and no Parse6 parser work. (The HC `Tag` capture still earns its keep — the dormant tag-aware stacking + the Defiance fix above.)

**Follow-up — RESOLVED (2026-06-05): foe movement-slow now extracted.** The
converter's MOVEMENT block used to `continue` (drop) any non-self movement effect
("enemy slows like Time's Juncture"), so a Slow surfaced only its `-Recharge` half
(`rechargeDebuff`) and the `-Movement` half was lost. Now a foe movement mod on a
`*_Slow` table (or negative/debuff) is emitted as a foe `slow` (`MovementByType`,
**no `selfPenalty`** → the calc treats it as a foe debuff, not a self-slow; the
effect-registry already renders `slow` as "-Speed"). Broad fix — `slow` went from
94 → 1536 across ~676 powers (Ice/Cold/Time/Arachnos/Widow/…) plus Cryo ammo, which
now carries both halves of its slow in the `cryoammunition` conditional. Purely
additive (every other effect key net-preserved; self-penalty Granite-style slows
unchanged).

<!-- Summon `copy_boosts` (found + RESOLVED 2026-06-11) — see the ✅ entry at the
     top of the RESOLVED section. The second AttribMod flags word is now decoded;
     CopyBoosts is binary-sourced and the Discharge overrides are retired. -->
