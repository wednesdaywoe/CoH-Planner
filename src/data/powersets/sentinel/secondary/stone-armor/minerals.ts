/**
 * Minerals
 * Toggle: Self +Recharge, +DEF(Psionic), Res(Confuse, Perception), +Perception
 *
 * Source: sentinel_defense/stone_armor/mineral_armor.json
 */

import type { Power } from '@/types';

export const Minerals: Power = {
  "name": "Minerals",
  "internalName": "Mineral_Armor",
  "available": 27,
  "description": "Activating this power summons several rare earth rock Minerals to orbit around you. These Minerals can disperse thought patterns and make Psionic attacks less likely to hit. They also bring clarity of the mind reducing the recharge time of your powers, increasing your Perception, and making you resistant to Confusion.Recharge: Fast.",
  "shortHelp": "Toggle: Self +Recharge, +DEF(Psionic), Res(Confuse, Perception), +Perception",
  "icon": "stonearmor_mineralcrust.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.104,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "psionic": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      }
    },
    "confuse": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Ones"
    },
    "effectDuration": 0.75,
    "rechargeBuff": {
      "scale": 0.15,
      "table": "Melee_Ones"
    },
    "perceptionBuff": {
      "scale": 0.6,
      "table": "Melee_Ones"
    }
  }
};
