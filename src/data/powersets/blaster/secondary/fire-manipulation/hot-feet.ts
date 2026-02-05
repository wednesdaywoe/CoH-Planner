/**
 * Hot Feet
 * Toggle: PBAoE, DoT (Fire), Foe -SPD
 *
 * Source: blaster_support/fire_manipulation/hot_feet.json
 */

import type { Power } from '@/types';

export const HotFeet: Power = {
  "name": "Hot Feet",
  "internalName": "Hot_Feet",
  "available": 29,
  "description": "While active, you heat the earth in a large area around yourself. Enemy movement is Slowed as they attempt to flee the immediate area. All foes in the affected area may also suffer some damage over time. You cannot fly and must be near the ground to use this power.Damage: Minor(DoT).Recharge: Slow.",
  "shortHelp": "Toggle: PBAoE, DoT (Fire), Foe -SPD",
  "icon": "firemanipulation_hotfeet.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 20,
    "recharge": 20,
    "endurance": 2.08,
    "castTime": 1.47,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Melee AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 0.25,
    "table": "Melee_Damage"
  },
  "effects": {
    "fear": {
      "mag": 3,
      "scale": 4,
      "table": "Melee_Ones"
    },
    "slow": {
      "fly": {
        "scale": 10,
        "table": "Melee_Ones"
      }
    },
    "movement": {
      "runSpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      }
    }
  }
};
