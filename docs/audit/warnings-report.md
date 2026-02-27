# Audit Warnings Report

Generated: 2026-02-27 (updated)

All WARNING-level audit issues across 15 archetypes + pool powers + epic pools (3,812 powers).
**0 CRITICALs** — all resolved.

## Root Cause Summary

All warnings fall into two categories — both are **intentional**:

### 1. I28P2 Patch Changes (raw data is pre-I28P2)

The raw Homecoming JSON data (December 2025 extract) predates Issue 28 Panel 2.
The processed TypeScript files have been manually updated to reflect I28P2 patch notes.
The audit flags these as mismatches because the raw data doesn't include these changes yet.

**Affected powersets:**
- **Broad Sword**: Slash, Slice, Whirling Sword, Disembowel, Head Splitter — cast time, recharge, radius, arc, maxTargets changes; Slice adds -Resistance debuff
- **Electrical Melee**: Jacob's Ladder, Lightning Clap — recharge, endurance, accuracy, set category changes
- **Kinetic Melee**: Burst, Concentrated Strike, Power Siphon, Repulsing Torrent — cast time, recharge, range changes; Repulsing Torrent adds -Damage debuff
- **Psionic Melee**: Boggle — cast time halved
- **Fiery Melee**: Breath of Fire — arc increased from 30 to 120 degrees, cast time reduced
- **Spines**: Lunge, Impale, Spine Burst — recharge, endurance, cast time changes; Impale adds -Regen debuff
- **Storm Blast**: Storm Cell — recharge, cast time, radius changes; Cloudburst adds Slow/ToHit Debuff enhancements and set categories
- **Marine Affinity**: Brine, Shoal Rush, Whitecap — cast time, recharge, endurance changes
- **Dark Miasma**: Black Hole — radius increased; Howling Twilight — endurance, cast time, radius changes
- **Ally Rez Powers** (all support ATs): Resurrect, Defibrillate, Rebirth, Conduit of Pain, Elixir of Life, Mutation, Power of the Phoenix — reduced endurance/recharge/cast time, increased range
- **Mastermind ATOs**: 13 specific powers now accept Mastermind Archetype Sets (Sleet, Howling Twilight, Force Bolt, Repulsion Bomb, Shifting Tides, Whitecap, Poison Trap, Fallout, Acid Mortar, Caltrops, Seeker Drones, Trip Mine, Acid Arrow)
- **Arsenal Control**: Tear Gas — recharge reduced from 240s to 180s
- **Pyrotechnic Control**: Hypnotizing Lights — confuse/damage sub-power sleep effect
- **Radiation Melee**: Atom Smasher, Proton Sweep — maxTargets changes
- **Battle Axe**: Pendulum (Tanker) — maxTargets change
- **Dark Melee**: Dark Consumption, Soul Drain (Tanker) — radius increased

### 2. Conditional Effects from chance=0 child_effects

The conversion pipeline's `collectAllTemplates()` filters out effect groups with `chance: 0`.
The audit's version does NOT filter these (it only filters PVP_ONLY).
These are legitimate conditional effects that trigger under specific gameplay conditions.

**Affected powersets:**
- **Regeneration** (Brute, Scrapper, Sentinel, Stalker, Tanker):
  - Ailment Resistance, Fast Healing, Reactive Regeneration: extra `debuffResistance`
  - Integration: extra mez protections (knockup, knockback, hold, immobilize, stun, sleep), regenBuff, regenBuffUnenhanced
  - Second Wind: extra `maxHPBuff`

## Conclusion

**All warnings are intentional.** No action needed. When updated raw data (post-I28P2) becomes available, the I28P2 warnings will automatically disappear. The Regeneration conditional effects are correctly present in the processed data for planner calculations.
