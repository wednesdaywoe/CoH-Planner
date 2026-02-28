/**
 * Suppression
 * Ranged(Cone), Moderate DoT(Energy), Foe -DEF
 */

import type { Power } from '@/types';

export const Suppression: Power = {
  "name": "Suppression",
  "available": 7,
  "description": "Your Crab Spider backpack unleashes a sustained barrage of energy in a wide cone in front of you, dealing moderate Energy damage over time to all foes hit. Can also reduce the targets' Defense. Damage: Moderate",
  "shortHelp": "Ranged(Cone), Moderate DoT(Energy), Foe -DEF",
  "icon": "crabspider_suppression.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 50,
    "recharge": 16,
    "endurance": 20.44,
    "castTime": 3,
    "arc": 60,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Energy",
    "scale": 0.19,
    "table": "Ranged_Damage",
    "duration": 3.1,
    "tickRate": 0.6
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
