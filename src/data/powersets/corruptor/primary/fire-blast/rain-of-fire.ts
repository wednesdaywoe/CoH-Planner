/**
 * Rain of Fire
 * Ranged (Location AoE), DoT(Fire), -SPD
 *
 * Source: corruptor_ranged/fire_blast/rain_of_fire.json
 */

import type { Power } from '@/types';

export const RainofFire: Power = {
  "name": "Rain of Fire",
  "internalName": "Rain_of_Fire",
  "available": 5,
  "description": "Summons a Rain of Fire over a targeted location, burning foes and reducing their movement speed within a large area.",
  "shortHelp": "Ranged (Location AoE), DoT(Fire), -SPD",
  "icon": "fireblast_rainoffire.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
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
    "Corruptor Archetype Sets",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Corruptor_RainofFire",
      "duration": 15
    }
  }
};
