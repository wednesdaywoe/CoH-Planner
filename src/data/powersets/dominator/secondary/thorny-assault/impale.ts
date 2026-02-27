/**
 * Impale
 * Ranged, High DMG(Lethal), DoT(Toxic), Immobilize, -DEF, -SPD, -Fly, -Jump
 *
 * Source: dominator_assault/thorny_assault/impale.json
 */

import type { Power } from '@/types';

export const Impale: Power = {
  "name": "Impale",
  "internalName": "Impale",
  "available": 9,
  "description": "You can throw a small cluster of large Thorns at a targeted foe. These Thorns carry a large amount of the toxin. In addition to dealing Toxic damage, a successful attack can slow a target, preventing Running, Jumping or Flying. Most foes will likely be completely Immobilized, unable to run.Damage: High.Recharge: Moderate.",
  "shortHelp": "Ranged, High DMG(Lethal), DoT(Toxic), Immobilize, -DEF, -SPD, -Fly, -Jump",
  "icon": "thornyassault_impale.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.433
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Dominator Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.96,
      "table": "Ranged_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1195,
      "table": "Ranged_Damage",
      "duration": 6.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    },
    "movement": {
      "runSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      }
    },
    "defenseDebuff": {
      "scale": 3,
      "table": "Ranged_Debuff_Def"
    }
  }
};
