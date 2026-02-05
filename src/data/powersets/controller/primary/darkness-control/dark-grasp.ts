/**
 * Dark Grasp
 * Ranged, High DMG(Negative), Foe Hold, -To Hit
 *
 * Source: controller_control/darkness_control/dark_grasp.json
 */

import type { Power } from '@/types';

export const DarkGrasp: Power = {
  "name": "Dark Grasp",
  "internalName": "Dark_Grasp",
  "available": 0,
  "description": "You cause your target's shadow to wholly envelop them, leaving them held and rendered helpless while suffering from moderate negative energy damage. Even if the target is powerful enough to resist the power's hold effect they will have their chance to hit reduced.Damage: High.Recharge: Moderate.",
  "shortHelp": "Ranged, High DMG(Negative), Foe Hold, -To Hit",
  "icon": "darknesscontrol_darkgrasp.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Controller Archetype Sets",
    "Holds",
    "Ranged Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Negative",
      "scale": 1,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Immobilize"
    },
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
