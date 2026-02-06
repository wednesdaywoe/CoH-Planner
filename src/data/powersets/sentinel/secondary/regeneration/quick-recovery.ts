/**
 * Quick Recovery
 * Auto: Self +Recovery
 *
 * Source: sentinel_defense/regeneration/quick_recovery.json
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
    "accuracy": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "recoveryBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    }
  }
};
