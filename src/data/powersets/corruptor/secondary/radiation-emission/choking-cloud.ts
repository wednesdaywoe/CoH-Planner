/**
 * Choking Cloud
 * Toggle: PBAoE, Foe Hold
 *
 * Source: corruptor_buff/radiation_emission/choking_cloud.json
 */

import type { Power } from '@/types';

export const ChokingCloud: Power = {
  "name": "Choking Cloud",
  "internalName": "Choking_Cloud",
  "available": 23,
  "description": "While active, you generate toxic radioactive gas around yourself. Any nearby foes may be overcome by the gas, leaving them choking and helpless.Recharge: Slow.",
  "shortHelp": "Toggle: PBAoE, Foe Hold",
  "icon": "radiationpoisoning_chokingcloud.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 20,
    "endurance": 1.3,
    "castTime": 1,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Holds"
  ],
  "maxSlots": 6,
  "effects": {
    "hold": {
      "mag": 2,
      "scale": 4,
      "table": "Ranged_Immobilize"
    }
  }
};
