/**
 * Flash
 * PBAoE, Foe Hold
 *
 * Source: controller_control/illusion_control/flash.json
 */

import type { Power } from '@/types';

export const Flash: Power = {
  "name": "Flash",
  "internalName": "Flash",
  "available": 5,
  "description": "Generates a brilliant flash of light around you that blinds nearby foes. Flashed foes are rendered helpless and unable to defend themselves.Notes: This power has adaptive recharge. It has a base recharge of 8 seconds and each affected foe will increase the recharge by 14.5 seconds for a maximum total of 240 seconds.",
  "shortHelp": "PBAoE, Foe Hold",
  "icon": "illusions_flash.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "radius": 30,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 3,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Holds"
  ],
  "maxSlots": 6,
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Immobilize"
    }
  }
};
