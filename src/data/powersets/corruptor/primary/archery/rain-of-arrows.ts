/**
 * Rain of Arrows
 * Ranged (Location AoE), DoT(Lethal)
 *
 * Source: corruptor_ranged/archery/rain_of_arrows.json
 */

import type { Power } from '@/types';

export const RainofArrows: Power = {
  "name": "Rain of Arrows",
  "internalName": "Rain_of_Arrows",
  "available": 25,
  "description": "You unleash a Rain of Arrows on a targeted location, damaging foes within a large area.",
  "shortHelp": "Ranged (Location AoE), DoT(Lethal)",
  "icon": "archery_rainofarrows.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 90,
    "recharge": 65,
    "endurance": 20.8,
    "castTime": 2
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
      "entity": "Pets_RainofArrows_Corruptor",
      "duration": 1
    }
  }
};
