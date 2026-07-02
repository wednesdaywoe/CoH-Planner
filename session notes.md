# Session Notes

## 2026-07-01 — Bin Crawler parser: chain / max-targets expression fields

**Context:** User feedback said the export is missing two RPN expressions CoD surfaces:
`ChainTarget` (chain next-target selection) and `MaxTargetsExpr` (target cap). Both are
token lists like the requires/duration/magnitude expressions already exported.

### What got done (shipped, code only — NOT yet re-exported)

- Found the parser's chain region (`tools/bin-crawler/.../parser/_powers.py`, fields
  38/42/43) was reading several string-arrays and **discarding them under wrong labels**.
- **Field 42 = `ChainEff`** (per-jump continue-chance, e.g.
  `minmax(1.25 - 0.25 * @ChainJump, 0.5, 1)`) — **verified** against the local Veracity
  `.pigg` (`@ChainJump` resolves there). Now captured as `chain_eff_expression` (both
  Parse7 + Parse6) and exported **only for chain powers** (sparse, like `redirect`).
- Fixed two bogus labels: field 43's `chain_fork` (impossible — ChainFork is an int
  array) and field 38's invented `chain_effect_array`.
- Files touched: `parser/_powers.py`, `parser/_dataclasses.py`, `export_powers.py`,
  `parser_logs/BIN-PARSER-LOG.md` (finding logged), + new `probe_chain_fields.py`.
- Nothing committed (working-tree changes only).

### FOLLOW-UP — RESOLVED 2026-07-01 (code done + verified; committed re-export pending)

The blocker was wrong: the HC `.pigg` data is on **this Linux box**
(`/home/jiiwii/.wine/drive_c/Games/Homecoming/assets/live`, `bin_powers.pigg` 2026-06-18),
not "the PC/Laptop." Ran the probe here and finished the mapping:

- **MaxTargetsExpr = field 38** → `max_targets_expression` (verified: `GauntletTargetCap`,
  59 powers).
- **ChainTarget = field 43b** (NOT field 43!) → `chain_target_expression`. 43b was being
  read as a discarded `u4_array`; string_array vs u4_array are byte-identical in Parse7, so
  it read fine but threw away the strings. Circuits match the `.powers` oracle exactly
  (`Rejuvenating` HP / `Energizing` End / `Empowering` proximity), 55 powers.
- **ChainEff = field 42** → already shipped.

Code changes made (working tree, **uncommitted**): `parser/_dataclasses.py`,
`parser/_powers.py`, `export_powers.py`, `probe_chain_fields.py` (now a regression check),
`parser_logs/BIN-PARSER-LOG.md` (moved to RESOLVED with the full write-up). Scratch export
(§6 de-risk) is clean — circuit JSONs carry all three fields, ordinary attacks carry none.

**DONE (2026-07-01, follow-up session):** promoted + wired end-to-end.
- Focused promotion into committed `exported_powers/`: 122 JSONs, purely additive
  (+178/-0); the 6 files with incidental `duration/magnitude_expression` drift were
  reverted and re-injected with just the 3 keys.
- Planner wiring: `convert-powerset.cjs` carries both fields → regenerated the 51 affected
  player powersets (**83 `generated/` .ts, +99/-0**, zero drift). `src/types/power.ts` gains
  `chainTargetExpression`/`maxTargetsExpression`; Info panel shows humanized **Chain Target**
  / **Target Cap** rows (raw RPN on hover) via `src/utils/chain-expressions.ts`.
- Focused test `src/data/chain-target-expressions.test.ts` (7). `tsc` clean; full suite 655/655.

Everything is **uncommitted** working-tree — ready for review/commit. Not exercised: a live
app render of the new Info rows (low risk — same KvRow pattern, data + humanizer both tested).
Not covered: pets/redirects/inherent internals (other converters), if ever needed.

### Launcher can't open Bin Crawler — ROOT CAUSE FOUND + FIXED (launcher UX)

Symptom: Bin Crawler shows a **green light + "Open"** without being launched this session;
clicking Open does nothing (no terminal). Pigg Wrangler starts correctly (grey + Launch).

**Real cause (not the browser):** the launcher decided "running" from a bare TCP
`port_open(8090)` — so ANY process holding 8090 (a stale/wedged Bin Crawler that survives
closing the launcher, or a foreign app) made it show green + "Open", and it never spawned
the tool. The earlier HTTP/2-505 theory was a red herring — the socket-pool flush didn't
help because the browser was never the problem. (505 IS reproducible if a client leads with
an HTTP/2 preface, but that wasn't what was happening here.)

**Fix (implemented in `tools/sidekick-launcher/`):**

- `launcher.py`: replaced bare `port_open` with a real **HTTP health check** (`_http_ok`,
  HTTP/1.1 GET). New 3-state `tool_state()`: `stopped` / `running` (our tool answers HTTP) /
  `busy` (port held but not answering as our tool). Added `/api/kill` → `kill_port()`
  (cross-platform: Windows `netstat`+`taskkill /F /T`, POSIX `lsof`+SIGKILL) with
  `_pids_on_port` / `_proc_name`.
- `static/index.html`: amber "busy" dot + warning, **Stop** button (running) and **Kill**
  button (busy), `confirm()` before killing, state-based auto-open.
- Verified end-to-end on macOS: stopped / running / busy states + kill all correct.

So the user's fix now: relaunch the updated launcher → Bin Crawler will show an amber
"busy" state with a **Kill** button (stale process on 8090) → click **Kill**, then
**Launch**. No more PID hunting.

**Still open / optional:** if a browser genuinely does lead with HTTP/2 to the tool (the
separate 505 path), the durable server-side mitigations are a fresh port or an
`Alt-Svc: clear` header on Bin Crawler's responses — not implemented. (Boostset-export gap
was the failed build; user said that's fixed.)

## 2026-07-01 — Thunderspy IO sets: real extraction (wrong sets + Subaluwa)

**Context:** Two Thunderspy bugs — (1) HC-only sets showing that shouldn't (Sudden
Acceleration, Synapse's Shock, Power Transfer, Hypersonic); (2) Subaluwa (Universal Damage,
Slammed mechanic) missing. Root cause: `datasets/thunderspy/io-sets-raw.ts` was a placeholder
re-exporting Homecoming's WHOLE registry.

Also fixed same session: **5-pool bug** — `MAX_POWER_POOLS` was a shared const; added
`getMaxPowerPools(serverId)` (tspy→5) in homecoming/levels.ts, wired into buildStore
`addPool`/`canAddPool`; test in `levels.test.ts`.

### What got done (working tree, uncommitted; all verified)

- **Extractor** `scripts/extract-rebirth-io-sets-v2.py` gains `--dataset thunderspy`
  (env `COH_THUNDERSPY_ASSETS`, DATASET_CONFIG entry, `_apply_thunderspy_overrides`).
  Regenerated `thunderspy/io-sets-raw.ts` → **212 sets**, all shared sets reuse HC's curated
  entry. The 4 named + 13 other HC-only sets are gone (not in tspy's boostsets.bin).
- **tspy AttribMod format lacks the enum `aspect` field** (my "aspect offset" theory was
  wrong — the 2 candidate u4s are always 0). So the enum-based piece/bonus derivation yields
  garbage for tspy-only sets. Fix: **rebuild the 3 tspy-only sets from clientmessages display
  strings** — piece aspects from the boost `display_name` ("Subaluwa: Accuracy/Damage/…"),
  bonus stat from the Set_Bonus internal name + value from the readable binary scale. Helpers
  `_tspy_piece_from_boost` / `_tspy_bonus_effects`, maps `_TSPY_BONUS_STEMS`/`_TSPY_STAT_DESC`;
  ctx (sets/power_index/msgs) threaded through `apply_overrides`.
- **Subaluwa = DONE + slottable** (Universal Damage). Values cross-check vs HC's Overwhelming
  Force (its rework): +3% Damage, +2.5%/1.25% E/N/Ranged def — identical. Gotcha handled: the
  planner auto-pairs resLethal↔resSmashing & defEnergy↔defNegative, so emit only the
  alpha-first member or it double-counts.
- **Primalist ATO sets** (`primalists_nature` + superior) were also hidden by the re-export.
  Data now extracted; wired new `IOSetCategory` 'Primalist Archetype Sets' (types/common.ts +
  IO_SET_TYPE_TO_CATEGORY + ARCHETYPE_ATO_CATEGORY['primalist'] + enhancement-registry).
  `knockback_strength`/`endurance_drain_resistance` set to null in STAT_NAME_MAP (known,
  untracked).
- Bins: used the FRESH tspy install at
  `/home/jiiwii/Games/coh-sweettea/drive_c/users/jiiwii/AppData/Local/Thunderspy Gaming/Sweet Tea/tspy`
  (bin.pigg 2026-06-26; the removable-drive copy is stale May-7 and lacked Subaluwa).
- Verify: `tsc` clean; **588 tests pass**; new `src/data/thunderspy-io-set-roster.test.ts`.

### FOLLOW-UP THREAD — Primalist ATO slottability (NOT done)

The Primalist ATO **data** is correct, but the sets aren't slottable yet: no generated
Primalist power lists 'Primalist Archetype Sets' in `allowedSetCategories`. I added
`primalist → 'Primalist Archetype Sets'` to `DAMAGE_ATO_BY_AT` in `convert-powerset.cjs`, but
the **Primalist powersets must be REGENERATED** for the category to land in the power files.
Deferred because the tspy bins are newer than the committed powersets → a regen would be a
large unrelated diff and could disturb the Primalist form-variant/redirect work; wants to be
its own reviewed change. Subaluwa needs none of this. See memory
`thunderspy-io-set-extraction.md`.

## 2026-07-01 — Thunderspy Defense totals not calculating (parser fix)

**Context:** tspy defense toggles (Weave, Maneuvers, Hover + all armor sets) contributed 0 to
Defense totals; only proc IOs (Steadfast, Gladiator's) showed. Their POWER EFFECTS panels had
no Defense row — the defense magnitude was missing from the data entirely.

**Root cause — two tspy `powers.bin` parser bugs** (`tools/bin-crawler/.../parser/_powers.py`,
`_parse_effect_template_thunderspy`):
1. `_resolve_str` had a hard `off >= 200000` cap. tspy's string table is ~38 MB, so valid
   attrib strings at higher offsets (DefenseDebuff, ToHitBuff, EndMod, DefensiveAdaptation, …)
   were silently dropped — 8,738 templates lost their attribs. Fixed: bound by
   `len(strtab_data)`.
2. tspy's older AttribMod schema stores TWO attrib fields: a front string-offset array (the
   enhancement aspect — Damage/Ones/Buff_Def) and, right after the requires array, an INDEX
   array `[pad,pad,marker,someval,count,count×(attribIndex*4)]` = the AFFECTED attribs
   (Melee/Smashing/Lethal/… — what HC/the converter actually key on). Multi-type defense
   buffs leave the front empty OR carry a bogus `Buff_Def` meta, putting the positional/type
   defense list only in the index array. Parser never read it → defense toggles had no attribs
   → converter produced no `defenseBuff`. Fixed: read the index array (idx*4 → ATTRIB_NAME) as
   a fallback when front is empty, AND for `Buff_Def`-table templates prefer the index array
   over the bogus front. Gotcha: front vs index are DIFFERENT fields (front `Damage` ↔ index
   `Lethal_Dmg`), so only override for defense tables — a blanket swap would change damage/mez.

Validated: empty-attrib templates 8738→16; Focused Fighting now `['Melee']` (HC parity);
Maneuvers/Weave/Hover full positional lists; no damage/DoT regression (Gloom intact).

**Delivered:** re-exported tspy powers (3167 power JSONs changed — additive attrib/requires/
category recovery, 0 value drift) + regenerated pools (`convert-pool-powers --dataset thunderspy
--apply`) and all 305 powersets (`convert-all-powersets --dataset thunderspy --force`). Defense
coverage 19→**211** generated files (SR 16, Shield 12, Energy Aura 15, …). ~4828 working-tree
files, all uncommitted. `tsc` clean; 588 tests pass; new `src/data/thunderspy-defense-data.test.ts`
(4). NOTE: this is a big broad regen — beyond defense it also recovered attribs/requires/set-
categories on many other tspy powers (all correct/additive, but worth reviewing as one change).

## 2026-07-02 — Thunderspy epic pools wrongly gated (per-server prereq rule)

**Context (clarified by maintainer):** the report was the OPPOSITE of how it first read. Thunderspy
epic pools have **NO** tier prerequisites — flat availability is *intended* (e.g. taking Body
Mastery: Physical Perfection as your ONLY pick is legal on Tspy). HC/Rebirth gate deeper epic
powers (rank 3+) behind prior picks + level. Our planner enforced the HC rank tiers **uniformly**
for every server, wrongly BLOCKING those Thunderspy picks. Epic prereqs need to be per-server.

**Investigation confirmed:** `isEpicPowerAvailable` was applying HC's `EPIC_TIER_REQUIREMENTS`
rank gating to all datasets; tspy epic `available_level` is flat 34 (HC is tiered 34/34/37/40/43).

**Fix (working tree, uncommitted):** `src/data/epic-pools.ts` — new
`epicPoolsHaveTierPrereqs(datasetId)` (false for `thunderspy`). `isEpicPowerAvailable` now, after
the epic-unlock-level + `available>=0` checks, returns `true` when tier prereqs are off (reads
`getActiveDataset().id`, so both call sites — AvailablePoolPowers + PoolPickerModal — are covered
with no prop threading). HC/Rebirth path unchanged. Guard `src/data/thunderspy-epic-prereqs.test.ts`
(tspy: rank-5 selectable with 0 picks but still gated < unlock; HC: rank-5 needs 2 picks). tsc
clean; 447 data tests pass. Memory `planner-pool-gating-hardcoded.md` updated (was "EPIC DEFERRED").

Still open (noted, not fixed): HC/Rebirth epic still on the rank heuristic (not fully data-driven);
Rebirth patron-`Owned?` gates unmodeled; tspy epic export has 2 mis-ordered pools (harmless now).

## 2026-07-02 — Thunderspy powers couldn't accept ATO (Archetype) sets

**Context:** reported for Illusion Control (holds should take Controller ATOs). Actually affected
**ALL** Thunderspy powers — ZERO carried any "Archetype Sets" category.

**Root cause:** Thunderspy's boostsets.bin does NOT encode ATO categories in the per-power
allowed_powers lists (HC/Rebirth DO — their export's `allowed_set_categories` already carries e.g.
"Controller Archetype Sets"). `convertPower`'s preferred path trusts the export and only *filters*
ATOs — it never *adds* the AT's own ATO. So no tspy power got its ATO.

**Fix (`scripts/convert-powerset.cjs`, uncommitted):** added `BINS_OMIT_PER_POWER_ATOS =
(datasetId === 'thunderspy')`. In the preferred path, when that flag is set, infer the AT's own
ATO for qualifying powers exactly like the legacy path — damage ATO on `boosts.has('Damage')`
powers, control ATO on mez-boost powers (`MEZ_BOOSTS`). No-op for HC/Rebirth (flag off; their
generated files are byte-identical — verified 0 changed). Regenerated tspy powersets
(`convert-all-powersets --dataset thunderspy --force`, 305). tspy powers with an ATO category:
0 → **1458**. Illusion Blind/Deceive/Flash/Spectral Terror now take Controller ATOs; pets +
invisibility correctly don't. (tspy Spectral Wounds DOES get it — it has a `Sleep` boost HC's
lacks, so it's correct per tspy data.) tsc clean; guard `src/data/thunderspy-ato-categories.test.ts`.

**Also RESOLVES the earlier Primalist ATO slottability follow-up:** Primalist attack powers now
carry "Primalist Archetype Sets" (via this same inference + the `primalist` entry already in
`DAMAGE_ATO_BY_AT`), and the io-sets side (Primalist's Nature sets + category wiring) was done
2026-07-01 — so the Primalist ATOs are now fully slottable.

## 2026-07-02 — Psychokinetic Assault (and 148 other tspy powers) missing icons

**Context:** "Psychokinetic Assault set is missing all of its icons." It's a Thunderspy Dominator
secondary POWERSET (internally `Telekinetic_Assault`), not an IO set. Its powers reference
`awakened_*.png` icons; none existed in `public/img/powers/`.

**Root cause:** the `awakened_*` textures live in the SIBLING base piggs folder
(`Sweet Tea/piggs/stage1b.pigg` → `texture_library/gui/icons/powers/awakened_*.texture`), NOT the
`Sweet Tea/tspy` folder that `scripts/extract-thunderspy-icons.py` scans. Custom tspy powersets
reuse base icon packs whose textures ship only in the shared piggs. Scanning the tspy folder alone
silently missed **149** referenced power icons.

**Fix (working tree, uncommitted):**
- Ran the extractor against the base piggs → **149 icons extracted** to `public/img/powers/` (incl.
  the 9 Psychokinetic Assault `awakened_*` — valid 32×32 RGBA PNGs; also many other tspy powers that
  were missing icons). `getPowerIconPath` lowercases + resolves `/img/powers/<icon>` → they render.
- Patched `index_pigg_icons` in `extract-thunderspy-icons.py` to ALSO scan the sibling `piggs/`
  folder (durable — running against the tspy folder now catches base-pigg icons; index went
  4722→4855 textures, missing 189→40). The remaining 40 are Lore-pet/NPC/enh/archetype icons not in
  any local pigg.
- Asset-only + one script change; no code/typecheck impact. Fresh bins/piggs at the AppData path
  (see memory `hc-bins-linux-path` / `thunderspy-io-set-extraction`).
