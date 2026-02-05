/**
 * Rain of Arrows
 * Ranged (Location AoE), Extreme DoT(Lethal)
 *
 * Source: sentinel_ranged/archery/rain_of_arrows.json
 */

import type { Power } from '@/types';

export const RainofArrows: Power = {
  "name": "Rain of Arrows",
  "internalName": "Rain_of_Arrows",
  "available": 25,
  "description": "You unleash a Rain of Arrows on a targeted location, damaging foes within a large area.",
  "shortHelp": "Ranged (Location AoE), Extreme DoT(Lethal)",
  "icon": "archery_rainofarrows.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 90,
    "endurance": 15.6,
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
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_RainofArrows_Sentinel",
      "duration": 1
    }
  }
};
