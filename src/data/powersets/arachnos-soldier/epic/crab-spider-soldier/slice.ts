/**
 * Slice
 * Melee, Heavy DMG(Lethal), Foe -DEF
 */

import type { Power } from '@/types';

export const Slice: Power = {
  "name": "Slice",
  "available": 0,
  "description": "Your Crab Spider backpack arms are capable of a devastating melee Slice. This attack deals heavy Lethal damage and can reduce the target's Defense. Damage: Heavy",
  "shortHelp": "Melee, Heavy DMG(Lethal), Foe -DEF",
  "icon": "crabspider_slice.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
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
    "recharge": 4,
    "endurance": 7,
    "castTime": 1
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Lethal",
    "scale": 1,
    "table": "Melee_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
