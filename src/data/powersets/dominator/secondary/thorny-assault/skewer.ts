/**
 * Skewer
 * Melee, Moderate DMG(Lethal), DoT(Toxic) -DEF
 *
 * Source: dominator_assault/thorny_assault/skewer.json
 */

import type { Power } from '@/types';

export const Skewer: Power = {
  "name": "Skewer",
  "internalName": "Skewer",
  "available": 0,
  "description": "You lunge forward with this melee attack and Skewer your foe with the large Thorn on your arm. Deals high damage and poisons your foe. Poison from the Thorns deals additional Toxic damage and can reduce your foes Defense.Damage: Moderate.Recharge: Fast.",
  "shortHelp": "Melee, Moderate DMG(Lethal), DoT(Toxic) -DEF",
  "icon": "thornyassault_skewer.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 0.83
  },
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
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.32,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.0805,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Melee_Debuff_Def"
    }
  }
};
