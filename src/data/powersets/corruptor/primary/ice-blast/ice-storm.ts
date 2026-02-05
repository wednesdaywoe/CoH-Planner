/**
 * Ice Storm
 * Ranged (Location AoE), DoT(Cold, Lethal), Foe -Recharge, -SPD
 *
 * Source: corruptor_ranged/ice_blast/ice_storm.json
 */

import type { Power } from '@/types';

export const IceStorm: Power = {
  "name": "Ice Storm",
  "internalName": "Ice_Storm",
  "available": 11,
  "description": "Shred your foes with this Ice Storm. This power deals a lot of damage in a large area and can Slow all affected targets' movement and attack speed.",
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
    "Corruptor Archetype Sets",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Corruptor_IceStorm",
      "duration": 15
    }
  }
};
