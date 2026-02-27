/**
 * Earthquake
 * Ranged (Location AoE), Foe Knockback, -To Hit, -Def
 *
 * Source: controller_control/earth_control/earthquake.json
 */

import type { Power } from '@/types';

export const Earthquake: Power = {
  "name": "Earthquake",
  "internalName": "Earthquake",
  "available": 17,
  "description": "Generates a powerful, localized Earthquake. Most foes that pass through the location will fall down. The violent shaking also reduces their chance to hit and Defense.",
  "shortHelp": "Ranged (Location AoE), Foe Knockback, -To Hit, -Def",
  "icon": "earthgrasp_earthquake.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 90,
    "endurance": 10.4,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "ToHit Debuff",
    "Defense Debuff"
  ],
  "allowedSetCategories": [
    "Defense Debuff",
    "Knockback",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Earthquake",
      "duration": 30
    }
  }
};
