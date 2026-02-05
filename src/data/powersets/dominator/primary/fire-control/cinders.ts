/**
 * Cinders
 * PBAoE, Foe Hold
 *
 * Source: dominator_control/fire_control/cinders.json
 */

import type { Power } from '@/types';

export const Cinders: Power = {
  "name": "Cinders",
  "internalName": "Cinders",
  "available": 17,
  "description": "Incapacitates foes around the caster by whirling Cinders around them. The targets are left helpless, choking on the soot.Notes: This power has adaptive recharge. It has a base recharge of 8 seconds and each affected foe will increase the recharge by 14.5 seconds for a maximum total of 240 seconds.",
  "shortHelp": "PBAoE, Foe Hold",
  "icon": "firetrap_cinders.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "radius": 30,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.07,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
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
