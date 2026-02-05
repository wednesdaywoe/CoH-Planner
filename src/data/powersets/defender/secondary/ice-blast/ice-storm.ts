/**
 * Ice Storm
 * Ranged (Location AoE), DoT(Cold, Lethal), Foe -Recharge, -SPD
 *
 * Source: defender_ranged/ice_blast/freezing_rain.json
 */

import type { Power } from '@/types';

export const IceStorm: Power = {
  "name": "Ice Storm",
  "internalName": "Freezing_Rain",
  "available": 19,
  "description": "Shred your foes with this Ice Storm. This power deals a lot of damage in a large area and can Slow all affected targets movement and attack speed.",
  "shortHelp": "Ranged (Location AoE), DoT(Cold, Lethal), Foe -Recharge, -SPD",
  "icon": "iceblast_freezingrain.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 60,
    "endurance": 15.6,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_IceStorm_Defender",
      "duration": 15
    }
  }
};
