/**
 * Fast Healing
 * Auto: Self +Regeneration
 *
 * Source: scrapper_defense/regeneration/fast_healing.json
 */

import type { Power } from '@/types';

export const FastHealing: Power = {
  "name": "Fast Healing",
  "internalName": "Fast_Healing",
  "available": 0,
  "description": "You heal Hit Points at a faster rate than normal. This power is always on.",
  "shortHelp": "Auto: Self +Regeneration",
  "icon": "regeneration_fasthealing.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "regenBuff": {
      "scale": 0.75,
      "table": "Melee_Ones"
    },
    "debuffResistance": {
      "regeneration": 0.2
    }
  }
};
