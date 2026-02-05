/**
 * Fast Healing
 * Auto: Self +Regeneration
 *
 * Source: sentinel_defense/willpower/fast_healing.json
 */

import type { Power } from '@/types';

export const FastHealing: Power = {
  "name": "Fast Healing",
  "internalName": "Fast_Healing",
  "available": 3,
  "description": "You heal Hit Points at a faster rate than normal. This power is always on.",
  "shortHelp": "Auto: Self +Regeneration",
  "icon": "willpower_fasthealing.png",
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
      "table": "Melee_Res_Boolean"
    }
  }
};
