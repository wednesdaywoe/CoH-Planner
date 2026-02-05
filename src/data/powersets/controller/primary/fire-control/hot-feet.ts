/**
 * Hot Feet
 * Toggle: PBAoE, Minor DoT(Fire), Foe -SPD
 *
 * Source: controller_control/fire_control/hot_feet.json
 */

import type { Power } from '@/types';

export const HotFeet: Power = {
  "name": "Hot Feet",
  "internalName": "Hot_Feet",
  "available": 7,
  "description": "While active, you heat the earth in a large area around yourself. Enemy movement is Slowed as they attempt to flee the immediate area. All foes in the affected area may also suffer some damage over time. You cannot fly and must be near the ground to use this power.",
  "shortHelp": "Toggle: PBAoE, Minor DoT(Fire), Foe -SPD",
  "icon": "firetrap_hotfeet.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 20,
    "recharge": 20,
    "endurance": 2.08,
    "castTime": 1.47,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.25,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.25,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "fear": {
      "mag": 3,
      "scale": 4,
      "table": "Ranged_Ones"
    },
    "slow": {
      "fly": {
        "scale": 10,
        "table": "Ranged_Ones"
      }
    },
    "movement": {
      "jumpHeight": {
        "scale": 0.7,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.7,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.7,
        "table": "Ranged_Slow"
      }
    }
  }
};
