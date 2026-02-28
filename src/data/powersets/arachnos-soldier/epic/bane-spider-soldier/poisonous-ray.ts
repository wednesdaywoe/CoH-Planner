/**
 * Poisonous Ray
 * Ranged, Moderate DoT(Toxic), Foe -DEF
 */

import type { Power } from '@/types';

export const PoisonousRay: Power = {
  "name": "Poisonous Ray",
  "available": 11,
  "description": "You fire a poisonous ray from your Nullifier Mace causing toxic damage over time as well as reducing the target's Defense. Damage: Moderate",
  "shortHelp": "Ranged, Moderate DoT(Toxic), Foe -DEF",
  "icon": "banespider_poisonousray.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
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
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 10.192,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Toxic",
    "scale": 0.3,
    "table": "Ranged_Damage",
    "duration": 4.1,
    "tickRate": 1
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
