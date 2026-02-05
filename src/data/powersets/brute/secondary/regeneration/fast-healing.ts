/**
 * Fast Healing
 * Auto: Self +Regeneration
 *
 * Source: brute_defense/regeneration/fast_healing.json
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
      "scale": 0.2,
      "table": "Melee_Ones"
    }
  }
};
