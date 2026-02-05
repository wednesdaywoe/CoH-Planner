/**
 * Quick Recovery
 * Auto: Self +Recovery
 *
 * Source: scrapper_defense/willpower/quick_recovery.json
 */

import type { Power } from '@/types';

export const QuickRecovery: Power = {
  "name": "Quick Recovery",
  "internalName": "Quick_Recovery",
  "available": 19,
  "description": "You recover Endurance at a faster rate than normal. This power is always on.",
  "shortHelp": "Auto: Self +Recovery",
  "icon": "willpower_quickrecovery.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "recoveryBuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    }
  }
};
