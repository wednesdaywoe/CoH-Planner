/**
 * Conductive Aura
 * Toggle: PBAoE, Foe -End, Self +Rec, +Regen
 *
 * Source: dominator_control/electric_control/stunning_aura.json
 */

import type { Power } from '@/types';

export const ConductiveAura: Power = {
  "name": "Conductive Aura",
  "internalName": "Stunning_Aura",
  "available": 7,
  "description": "While this power is active, the air around you becomes charged with electricity, leaping out and shocking foes that get too close. Foes will lose some endurance, while you gain Recovery and Regeneration per target hit.",
  "shortHelp": "Toggle: PBAoE, Foe -End, Self +Rec, +Regen",
  "icon": "electriccontrol_stunningaura.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 20,
    "recharge": 15,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Recharge",
    "Healing",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Ranged_Ones"
    }
  }
};
