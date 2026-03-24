/**
 * Quick Recovery
 * Auto: Self +Recovery
 *
 * Source: brute_defense/regeneration/quick_recovery.json
 */

import type { Power } from '@/types';

export const QuickRecovery: Power = {
  "name": "Quick Recovery",
  "internalName": "Quick_Recovery",
  "available": 3,
  "description": "You recover Endurance at a faster rate than normal. This power is always on.",
  "shortHelp": "Auto: Self +Recovery",
  "icon": "regeneration_quickrecovery.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "activatePeriod": 10
  },
  "allowedEnhancements": [
    "EnduranceModification"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "recoveryBuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    },
    "durations": {
      "recoveryBuff": 10.25,
      "debuffResistance": 10.25
    },
    "debuffResistance": {
      "recovery": {
        "scale": 0.2,
        "table": "Melee_Ones"
      }
    },
    "buffDuration": 10.25
  }
};
