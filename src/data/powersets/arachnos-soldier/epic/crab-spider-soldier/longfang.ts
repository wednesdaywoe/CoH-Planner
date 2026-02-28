/**
 * Longfang
 * Ranged, Superior DMG(Lethal), Foe -DEF
 */

import type { Power } from '@/types';

export const Longfang: Power = {
  "name": "Longfang",
  "available": 1,
  "description": "Your Crab Spider backpack is equipped with a powerful Longfang cannon. This ranged attack deals superior Lethal damage and can reduce the target's Defense. Damage: Superior",
  "shortHelp": "Ranged, Superior DMG(Lethal), Foe -DEF",
  "icon": "crabspider_longfang.png",
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
    "recharge": 10,
    "endurance": 13.72,
    "castTime": 1.33
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Lethal",
    "scale": 2.76,
    "table": "Ranged_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
