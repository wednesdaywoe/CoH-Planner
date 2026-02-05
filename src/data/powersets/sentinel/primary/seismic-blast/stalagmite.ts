/**
 * Stalagmite
 * Ranged, DMG(Smash), Foe Disorient, Special
 *
 * Source: sentinel_ranged/seismic_blast/stalagmite.json
 */

import type { Power } from '@/types';

export const Stalagmite: Power = {
  "name": "Stalagmite",
  "internalName": "Stalagmite",
  "available": 21,
  "description": "You can cause a Stalagmite to erupt under an enemy dealing minimal Lethal damage, and Disorienting them for a good while. You must be on the ground to activate this power.If affected by Seismic Shockwaves, this power will halt the shockwaves and deal extreme damage.Stalagmite grants two stacks of Seismic Pressure.",
  "shortHelp": "Ranged, DMG(Smash), Foe Disorient, Special",
  "icon": "seismicblast_stalagmite.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 8,
    "endurance": 10.192,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
