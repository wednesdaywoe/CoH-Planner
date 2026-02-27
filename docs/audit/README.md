# Power Data Audit

Systematic comparison of processed TypeScript power data against raw Homecoming game data.

## Audit Dimensions

1. **allowedEnhancements** — `boosts_allowed` from raw → `BOOST_TYPE_MAP` → processed array
2. **allowedSetCategories** — `allowed_boostset_cats` from raw → `SET_CATEGORY_MAP` → processed array
3. **maxSlots** — `max_boosts` from raw → processed number
4. **Stats** — accuracy, range, recharge, endurance, castTime, radius, arc, maxTargets
5. **Effects** — damage, buffs, debuffs (via `extractEffects`/`extractDamage`)

## Running the Audit

```bash
# Audit one archetype
node scripts/audit-comprehensive.cjs --archetype blaster

# With JSON output
node scripts/audit-comprehensive.cjs --archetype blaster --json

# One powerset only
node scripts/audit-comprehensive.cjs --archetype blaster --powerset fire-blast

# Markdown report
node scripts/audit-comprehensive.cjs --archetype blaster --markdown

# Verbose (show PASS results)
node scripts/audit-comprehensive.cjs --archetype blaster --verbose

# Audit pool powers
node scripts/audit-pool-powers.cjs

# Audit one pool only
node scripts/audit-pool-powers.cjs --pool fighting

# Reconvert pool powers from raw JSON
node scripts/convert-pool-powers.cjs --apply

# Audit epic/patron pools
node scripts/audit-epic-pools.cjs

# Audit one epic pool or archetype
node scripts/audit-epic-pools.cjs --pool blaster_dark_mastery
node scripts/audit-epic-pools.cjs --archetype blaster

# Reconvert epic pools from raw JSON
node scripts/convert-epic-pools.cjs --apply

# Audit EAT/VEAT archetypes
node scripts/audit-comprehensive.cjs --archetype peacebringer
node scripts/audit-comprehensive.cjs --archetype warshade
node scripts/audit-comprehensive.cjs --archetype arachnos-soldier
node scripts/audit-comprehensive.cjs --archetype arachnos-widow

# Fix EAT/VEAT Source comments (needed before audit can match files)
node scripts/fix-eat-veat-sources.cjs --apply

# Fix stat mismatches (EAT/VEAT only — standard ATs have I28P2 manual patches)
# WARNING: Do NOT run fix-stats.cjs on standard ATs — it will revert I28P2 values
node scripts/fix-stats.cjs --archetype peacebringer --apply
node scripts/fix-stats.cjs --archetype warshade --apply
```

## Progress

| Archetype | Status | Powers | CRITICAL | WARNING | PASS | Notes |
|-----------|--------|--------|----------|---------|------|-------|
| Blaster | COMPLETE | 274 | 0 | 2 | 255 | I28P2: Cloudburst enhancements/sets, Storm Cell stats |
| Brute | COMPLETE | 343 | 0 | 21 | 301 | I28P2: BS, Elec, KM, Psi, Fire, Spines stats/effects; Regen conditional (5) |
| Controller | COMPLETE | 271 | 0 | 13 | 235 | I28P2: rez powers, Marine, Arsenal; Hypnotizing Lights sleep |
| Corruptor | COMPLETE | 292 | 0 | 14 | 256 | I28P2: rez powers, Marine, Dark Miasma, Storm Blast |
| Defender | COMPLETE | 292 | 0 | 14 | 256 | I28P2: rez powers, Marine, Dark Miasma, Storm Blast |
| Dominator | COMPLETE | 235 | 0 | 2 | 219 | I28P2: Tear Gas recharge; Hypnotizing Lights sleep |
| Mastermind | COMPLETE | 216 | 0 | 23 | 183 | I28P2: rez powers, Marine, MM ATOs (13 powers) |
| Scrapper | COMPLETE | 343 | 0 | 23 | 300 | I28P2: BS, Elec, KM, Psi, Fire, Spines, Rad stats/effects; Regen (5) |
| Sentinel | COMPLETE | 271 | 0 | 7 | 248 | I28P2: Cloudburst, Storm Cell; Regen conditional (5) |
| Stalker | COMPLETE | 313 | 0 | 18 | 285 | I28P2: BS, Elec, KM, Psi, Fire, Spines, Sonic stats/effects; Regen (5) |
| Tanker | COMPLETE | 342 | 0 | 24 | 297 | I28P2: BS, Elec, KM, Psi, Fire, Spines, Axe, Dark stats/effects; Regen (5) |
| Peacebringer | COMPLETE | 38 | 0 | 0 | 30 | All stats fixed, conditional flight effects added |
| Warshade | COMPLETE | 38 | 0 | 0 | 29 | All stats fixed |
| Arachnos Soldier | COMPLETE | 24 | 0 | 0 | 23 | All stats fixed |
| Arachnos Widow | COMPLETE | 44 | 0 | 0 | 38 | All stats fixed (swapped Lunge/Strike stats corrected) |
| Pool Powers | COMPLETE | 71 | 0 | 0 | 71 | Reconverted from raw JSON via convert-pool-powers.cjs |
| Epic Pools | COMPLETE | 405 | 0 | 0 | 405 | 81 pools reconverted from raw JSON via convert-epic-pools.cjs |

### Totals (all archetypes + pools + epic pools)
- **3,812 powers** audited across all 15 archetypes + pool powers + epic pools
- **0 CRITICAL** — all CRITICALs resolved
- **~161 WARNING** — all intentional (see [warnings-report.md](warnings-report.md)):
  - **I28P2 patch changes**: Stats, effects, and set categories updated per Issue 28 Panel 2 patch notes. Raw data predates I28P2 so audit flags these as mismatches.
  - **Regen conditional effects**: From `chance=0` child_effects in raw data, correctly included for planner calculations.
- **49 mechanic powers** correctly flagged with `mechanicType`

## Root Causes Found

### 1. BOOST_TYPE_MAP Gaps (Fixed in convert-powerset.cjs)
10 raw boost type names were unmapped, affecting ~2300 powers total:
- `Enhance Threat Duration` (494) → Taunt
- `Enhance KnockBack` (492) → Knockback
- `Enhance Endurance Modification` (364) → EnduranceModification
- `Enhance Damage Resistance` (321) → Resistance
- `Enhance Defense` (274) → Defense
- `Enhance ToHit Buffs` (197) → ToHit
- `Enhance Immobilization` (106) → Immobilize
- `Reduce Interrupt Time` (53) → Interrupt
- `Enhance Running Speed` (42) → Run Speed
- `Enhance Flying Speed` (22) → Fly

**Fix**: Added all 10 mappings. Run `node scripts/fix-allowed-enhancements.cjs --all` to apply.

### 2. Mechanic Power Detection (Added mechanicType field)
Powers with unique mechanic roles (non-pickable, unslottable) now have a `mechanicType` field:
- `childToggle`: Auto-granted child toggles (ammo types, stance forms, adaptations)
- `parentMechanic`: Pickable parent that grants child toggles (Swap Ammo, Staff Mastery)
- `hiddenPassive`: Hidden intrinsic passive (Seismic Shockwaves)
- `hiddenAuto`: Completely hidden auto-power (Phoenix Rising)

Detection uses raw fields: `auto_issue`, `show_in_manage`, `max_boosts`, `show_in_inventory`, `show_in_info`.
Run `node scripts/fix-mechanic-types.cjs --all` to apply.

### 3. child_effects Not Recursed (Fixed in convert-powerset.cjs)
126 player powers had effects nested inside `child_effects` in the raw JSON (not at the top-level `templates`). The conversion script only collected top-level templates, missing all nested ones.

Affected powersets: Sonic Melee (all 4 melee ATs), Regeneration (ailment resistance), Electric Armor, Psionic Armor, Staff Fighting, Brawling, Dark Armor, Radiation Manipulation, plus individual powers across Mastermind/Controller/Sentinel/Stalker.

**Fix**: Added `collectAllTemplates()` to recursively walk `child_effects`. Run `node scripts/fix-missing-effects.cjs --apply` to patch existing files.

### 4. Set Category Gaps (11 powers across 4 ATs — Fixed)
- Chain Induction: Had "Melee AoE Damage" instead of "Melee Damage"
- Greater Fire Sword: Missing "Accurate Defense Debuff" and "Defense Debuff"
- Aura of Insanity: Missing AT Archetype Sets

**Fix**: Manually patched all 11 files from raw `allowed_boostset_cats`.

### 5. Pool Powers Legacy Pipeline (Reconverted from raw JSON)
Pool powers were originally converted from a legacy JS pipeline (`legacy/js/data/pools/`), not from raw Homecoming JSON. This caused 64/71 CRITICALs — missing enhancements, set categories, and effects.

**Fix**: Created `scripts/convert-pool-powers.cjs` to reconvert all 13 pools (71 powers) from raw Homecoming JSON using the same `extractEffects`/`extractDamage`/`collectAllTemplates` pipeline as archetype powers. Updated `transformPoolPower()` in `power-pools.ts` to pass through all new effect fields.

Run: `node scripts/convert-pool-powers.cjs --apply`

### 6. Epic Pools Legacy Pipeline (Reconverted from raw JSON)
Epic/Patron pools (81 pools, 405 powers) were originally converted from a legacy JS pipeline, not from raw Homecoming JSON. This caused 326/405 CRITICALs — missing enhancements, set categories, effects, mez, and debuffs.

**Fix**: Created `scripts/convert-epic-pools.cjs` to reconvert all 81 pools from raw Homecoming JSON. Updated `transformEpicPower()` in `epic-pools.ts` to pass through all effect fields (removed legacy mez-splitting heuristic, now uses proper extracted effects).

Run: `node scripts/convert-epic-pools.cjs --apply`

### 7. EAT/VEAT Source Comments and Missing Data (Fixed)
EAT/VEAT archetypes (Peacebringer, Warshade, Arachnos Soldier, Arachnos Widow — 144 powers) had incomplete Source comments (`Source: archetype/powerset-name` instead of full raw JSON paths), preventing the audit from finding matching raw data. Additionally, the powers were missing enhancements, set categories, and effects.

**Fix**: Created `scripts/fix-eat-veat-sources.cjs` to update Source comments to full raw JSON paths. Then ran `fix-allowed-enhancements.cjs` and `fix-missing-effects.cjs` for all 4 archetypes. Manually patched 8 Arachnos Soldier set category files and Peacebringer Quantum Maneuvers conditional flight effects.

### 8. EAT/VEAT Stat Errors (arc, swapped stats — Fixed)
EAT/VEAT powers had missing `arc` values on cone powers and swapped stats (Arachnos Widow Lunge/Strike had each other's recharge/endurance/castTime).

**Fix**: Manually patched all EAT/VEAT stat errors. Created `scripts/fix-stats.cjs` for bulk stat fixes (note: only safe for EAT/VEATs where raw data matches live; see #9 for standard ATs).

### 9. I28P2 Patch Changes (Intentional — raw data is pre-patch)
The raw Homecoming JSON (December 2025 extract) predates Issue 28 Panel 2. The processed TypeScript files have been manually updated per the I28P2 patch notes (`docs/i28_panel2_patchnotes.txt`). The audit flags ~130 stat/effect/set category differences because raw data doesn't include these changes.

**Affected powersets**: Broad Sword, Electrical Melee, Kinetic Melee, Psionic Melee, Fiery Melee, Spines, Storm Blast, Marine Affinity, Dark Miasma, all ally rez powers, Mastermind ATOs, Arsenal Control, Pyrotechnic Control, Radiation Melee, Battle Axe, Dark Melee.

**Status**: Intentional. Will resolve when raw data is re-extracted post-I28P2.

### 10. Mastermind Set Categories (13 WARNINGs — I28P2)
I28P2 explicitly added Mastermind Archetype Sets to 13 specific secondary powers (Sleet, Howling Twilight, Force Bolt, Repulsion Bomb, etc.).

**Status**: Intentional I28P2 change. See `docs/i28_panel2_patchnotes.txt`.

### 11. Regeneration Conditional Effects (~25 WARNINGs)
Regeneration powers have extra effects from `chance=0` child_effects groups. The conversion pipeline filters these out but the audit doesn't. These are legitimate conditional effects (debuff resistance, mez protection, regen buffs).

**Status**: Intentional. Correctly included for planner calculations.
