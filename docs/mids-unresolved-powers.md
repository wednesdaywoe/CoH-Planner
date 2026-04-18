# Mids Unresolved Powers — Mapping Questionnaire

Please fill out the "Resolution" column for each entry below. After you're done,
I'll translate your answers into aliases / data additions for the Mids importer
so these builds no longer lose slots during bulk import.

For each entry:

- **`Action`** options:
  - `rename` — Mids name is outdated; map it to an existing power in our data.
  - `add` — power exists in HC but is missing from our app data (we need to add it).
  - `skip` — genuinely removed; leave as-is, builds will have empty slots.
  - `unknown` — not sure; note below and I'll investigate further.
- **`App internalName`** (for `rename`): the current internal name in our app data (e.g. `Assassins_Rockslide`).
- **`Notes`**: anything else (e.g. "this is now a T9", "moved to a different set").

---

## Primary / Secondary powerset renames

### 1. Pyrotechnic Control — `Multipurpose_Missiles`

- **Mids path**: `Controller_Control.Pyrotechnic_Control.Multipurpose_Missiles` (11 builds)
- **Mids path**: `Dominator_Control.Pyrotechnic_Control.Multipurpose_Missiles` (7 builds)
- **Our data** (Pyrotechnic Control): Catherine_Wheel, Dazzle, Explosive_Bouquet, Glittering_Column, Glitz, Hypnotizing_Lights, Incendiary_Aura, Sparkling_Cage, Sparkling_Field (if present)
- **Action**: `App internalName`
- **App internalName**: `Controller_Control.Pyrotechnic_Control.Glitz`
- **Notes**: `"display_fullname": "Controller Control.Pyrotechnic Control.Brilliant Barrage"`

### 2. Mastermind Beast Mastery — `Pack_Mentality`

- **Mids path**: `Mastermind_Summon.Beast_Mastery.Pack_Mentality` (5 builds)
- **Our data** (MM Beast Mastery): Call_Hawk, Call_Locusts, Call_Swarm, Fortify_Pack, Summon_Dire_Wolf, Summon_Lions, Summon_Wolves, Tame_Beasts, Train_Beasts
- **Action**: `add`
- **App internalName**: `*.Pack_Mentality_Granter*`
- **Notes**: `This is a automatic passive granted by taking Summon Wolves, Summon Lions, or Summon Dire Wolf. Increases Pet dmg by 2% when nearby, stacks up to 10 times `

### 3. Tanker Energy Aura — `Conserve_Power`

- **Mids path**: `Tanker_Defense.Energy_Aura.Conserve_Power` (5 builds)
- **Our data** (Tanker Energy Aura): Dampening_Field, Energize, Energy_Drain, Energy_Protection, Energy_Reserve (display: "Power Armor"), Entropy_Shield, Kinetic_Shield, Overload, Power_Shield
- **Note**: Brute's Energy Aura still has a `Conserve_Power` file; Tanker apparently doesn't.
- **Action**: `_____________`
- **App internalName**: `Tanker Defense.Energy Aura.Energize`
- **Notes**: `This is just an old name for Energize`

### 4. Mastermind Radiation Emission — `Radiation_Emission`

- **Mids path**: `Mastermind_Buff.Radiation_Emission.Radiation_Emission` (4 builds)
- **Our data** (MM Radiation Emission): Accelerate_Metabolism, Choking_Cloud, EM_Pulse, Enervating_Field, Fallout, Lingering_radiation, Mutation, Radiant_Aura, Radiation_Infection
- **Note**: The set name matches, but there's no power also called `Radiation_Emission`. Possibly a Mids serialization quirk.
- **Action**: `_____________`
- **App internalName**: `_____________`
- **Notes**: `Almost certainly a Mids quirk. Can we just strip the duplicate?`

### 5. Mastermind Kinetics — `Kinetic_Transfer`

- **Mids path**: `Mastermind_Buff.Kinetics.Kinetic_Transfer` (3 builds)
- **Our data** (MM Kinetics): Fulcrum_Shift, Increase_Density, Inertial_Reduction, Repel, Siphon_Power, Siphon_Speed, Speed_Boost, Transference, Transfusion
- **Note**: Controller's Kinetics has `Kinetic_Transfer`; Mastermind's version has `Fulcrum_Shift` as the T9 instead. Are the Mids builds trying to use Fulcrum_Shift?
- **Action**: `_____________`
- **App internalName**: `_____________`
- **Notes**: `Kinetic Transfer is Fulcrum Shift's redirect power. Maybe we just convert to Fulcrum Shift?`

---

## Incarnate

### 6. Hybrid — `Support_Genome_8`

- **Mids path**: `Incarnate.Hybrid.Support_Genome_8` (2 builds)
- **Our data**: Support_Genome, Support_Genome_2 … Support_Genome_7 (I can confirm the exact list on request)
- **Note**: Mids may have been authored when a planned 8th tier existed, or this is a Mids-only artifact.
- **Action**: `_____________`
- **App internalName**: `"Incarnate.Hybrid.Support_Genome_8"`
- **Notes**: `this is Incarnate.Hybrid.Support Core Embodiment`

---

## VEATs (Soldiers of Arachnos)

These three are the most suspicious — HC's pigg parser knows `BS_Bash` and `Fate_Sealed`
(without the `FRT_` prefix), so our app data is probably just incomplete.

### 7. Bane Spider Soldier — `BS_Bash`

- **Mids path**: `Arachnos_Soldiers.Bane_Spider_Soldier.BS_Bash` (1 build)
- **HC parser**: confirms this power exists at the exact Mids path.
- **Our data**: (I can list it on request — likely missing this entry.)
- **Action**: `_____________`
- **App internalName**: `Arachnos_Soldiers.Bane_Spider_Soldier.BS_Bash`
- **Notes**: `this is Arachnos Soldiers.Bane Spider Soldier.Bash`

### 8. Fortunata Teamwork — `FRT_Fate_Sealed`

- **Mids path**: `Teamwork.Fortunata_Teamwork.FRT_Fate_Sealed` (1 build)
- **HC parser**: has `Teamwork.Fortunata_Teamwork.Fate_Sealed` (no `FRT_` prefix).
- **Our data**: check for `Fate_Sealed` in Widow Fortunata Teamwork powerset.
- **Action**: `_____________`
- **App internalName**: `_____________`
- **Notes**: `We just need to strip the FRT`

### 9. Widow Teamwork — `NW_Pain_Tolerance`

- **Mids path**: `Teamwork.Widow_Teamwork.NW_Pain_Tolerance` (1 build)
- **HC parser**: no exact match found; closest in the parser data is `High_Pain_Tolerance` in Willpower sets.
- **Note**: `NW_` prefix = Night Widow branch. Might be a Night-Widow-specific version of Pain Tolerance.
- **Action**: `_____________`
- **App internalName**: `"Teamwork.Widow_Teamwork.Pain_Tolerance"`
- **Notes**: `Teamwork.Widow Teamwork.Pain Tolerance. We may be missing this power.`

---

## Summary

Total remaining warnings: **40 warning occurrences across 39 builds** (out of 1,036 dry-run builds).

Once this is filled out, I'll:

1. Add `rename` entries to `MIDS_NAME_TYPOS` in [mappers.ts](../src/utils/mids-import/mappers.ts).
2. For `add` entries, open the relevant powerset file in `src/data/powersets/…` and add the missing power.
3. Re-run the dry-run to confirm zero remaining warnings (or close to it).
