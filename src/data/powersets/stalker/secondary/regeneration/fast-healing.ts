/**
 * Fast Healing
 * Auto: Self +Regeneration, +Recovery
 *
 * Source: stalker_defense/regeneration/fast_healing.json
 */

import type { Power } from '@/types';

export const FastHealing: Power = {
  "name": "Fast Healing",
  "internalName": "Fast_Healing",
  "available": 3,
  "description": "You heal Hit Points and recovery Endurance at a faster rate than normal. This power is always on.",
  "shortHelp": "Auto: Self +Regeneration, +Recovery",
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
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "regenBuff": {
      "scale": 0.75,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.15,
      "table": "Melee_Ones"
    },
    "debuffResistance": {
      "regeneration": 0.2,
      "recovery": 0.2
    }
  }
};
