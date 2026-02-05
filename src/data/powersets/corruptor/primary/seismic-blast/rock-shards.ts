/**
 * Rock Shards
 * Ranged Cone, DMG(Smash/Lethal), -Defense, Special
 *
 * Source: corruptor_ranged/seismic_blast/rock_shards.json
 */

import type { Power } from '@/types';

export const RockShards: Power = {
  "name": "Rock Shards",
  "internalName": "Rock_Shards",
  "available": 1,
  "description": "You launch a volley of stone shards at your target in a sweeping cone. These shards stab into the target, causing lethal damage. They will also continue to suffer additional lethal damage over time.If affected by Seismic Shockwaves, this power will halt the shockwaves, the up front damage will be increased and damage over time accelerated, foes will be knocked down, range will be increased to 60ft and arc to 40 degrees.Rock Shards grants two stacks of Seismic Pressure.",
  "shortHelp": "Ranged Cone, DMG(Smash/Lethal), -Defense, Special",
  "icon": "seismicblast_rockshards.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "radius": 40,
    "arc": 0.5236,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.07,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Corruptor Archetype Sets",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
