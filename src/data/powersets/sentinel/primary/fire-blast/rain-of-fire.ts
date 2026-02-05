/**
 * Rain of Fire
 * Ranged (Location AoE), DoT(Fire), Foe -SPD
 *
 * Source: sentinel_ranged/fire_blast/rain_of_fire.json
 */

import type { Power } from '@/types';

export const RainofFire: Power = {
  "name": "Rain of Fire",
  "internalName": "Rain_of_Fire",
  "available": 21,
  "description": "Summons a Rain of Fire over a targeted location, burning foes and reducing their movement speed within a large area.Recharge: Long.",
  "shortHelp": "Ranged (Location AoE), DoT(Fire), Foe -SPD",
  "icon": "fireblast_rainoffire.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 2,
    "range": 40,
    "recharge": 60,
    "endurance": 26,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_RainofFire_Sentinel",
      "duration": 15
    }
  }
};
