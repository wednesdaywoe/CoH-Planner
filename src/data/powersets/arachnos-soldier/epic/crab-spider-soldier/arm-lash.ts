/**
 * Arm Lash
 * Melee(Cone), High DMG(Lethal), Foe -DEF
 */

import type { Power } from '@/types';

export const ArmLash: Power = {
  "name": "Arm Lash",
  "available": 11,
  "description": "Your Crab Spider backpack arms lash out in a wide arc, striking all foes in front of you for high Lethal damage. Can also reduce the targets' Defense. Damage: High",
  "shortHelp": "Melee(Cone), High DMG(Lethal), Foe -DEF",
  "icon": "crabspider_armlash.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 12,
    "endurance": 13,
    "castTime": 1.5,
    "arc": 90,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Lethal",
    "scale": 2.1,
    "table": "Melee_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
